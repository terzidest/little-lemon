import { validateEmail } from './helpers';

type ValidationErrors = Record<string, string>;

interface LoginValues {
  email?: string;
  password?: string;
}

interface RegisterValues extends LoginValues {
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}

interface ProfileValues {
  firstName?: string;
  email?: string;
  phone?: string;
}

export { validateEmail };

export const validatePhoneNumber = (phone: string): boolean => {
  const re = /^[0-9\s\-()]+$/;
  return phone.length >= 10 && re.test(phone);
};

export const validateLogin = (values: LoginValues): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateRegistration = (values: RegisterValues): ValidationErrors => {
  const errors = validateLogin(values);

  if (!values.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateProfile = (values: ProfileValues): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!values.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (values.phone && !validatePhoneNumber(values.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return errors;
};
