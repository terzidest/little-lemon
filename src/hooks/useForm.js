import { useState, useEffect } from 'react';

/**
 * Custom hook for form state management and validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function that returns error object
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const validateForm = () => {
    if (!validate) return true;
    
    // Mark all fields as touched when form is submitted
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    setIsSubmitting(true);
    
    const newErrors = validate(values);
    setErrors(newErrors);
    
    const isFormValid = Object.keys(newErrors).length === 0;
    setIsValid(isFormValid);
    
    return isFormValid;
  };
  
  // Validate whenever values change and fields have been touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = validate ? validate(values) : {};
      
      // Only show errors for touched fields unless submitting
      if (!isSubmitting) {
        Object.keys(newErrors).forEach(key => {
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
    }
  };
};

export default useForm;
