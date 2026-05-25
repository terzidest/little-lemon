import { useState, useEffect } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>>;
type TouchedFields<T> = Partial<Record<keyof T, boolean>>;

const useForm = <T extends object>(
  initialValues: T,
  validate?: (values: T) => FormErrors<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof T>(name: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateForm = (): boolean => {
    if (!validate) return true;

    const allTouched = (Object.keys(initialValues) as Array<keyof T>).reduce<TouchedFields<T>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {}
    );

    setTouched(allTouched);
    setIsSubmitting(true);

    const newErrors = validate(values);
    setErrors(newErrors);

    const isFormValid = Object.keys(newErrors).length === 0;
    setIsValid(isFormValid);

    return isFormValid;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors: FormErrors<T> = validate ? validate(values) : {};

      if (!isSubmitting) {
        (Object.keys(newErrors) as Array<keyof T>).forEach(key => {
          if (!touched[key]) {
            delete newErrors[key];
          }
        });
      }

      setErrors(newErrors);
      setIsValid(Object.keys(newErrors).length === 0);
    }
  }, [values, touched, isSubmitting]);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    validateForm,
    setValues,
    setErrors,
    setTouched,
    reset: () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
  };
};

export default useForm;
