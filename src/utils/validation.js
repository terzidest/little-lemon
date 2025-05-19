/**
 * Email validation with regex
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Phone number validation - simple format check
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export const validatePhoneNumber = (phone) => {
  // Simple check for numbers, spaces, dashes, parentheses
  const re = /^[0-9\s\-\(\)]+$/;
  return phone.length >= 10 && re.test(phone);
};

/**
 * Login form validation
 * 
 * @param {Object} values - Form values
 * @returns {Object} Error messages by field
 */
export const validateLogin = (values) => {
  const errors = {};
  
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

/**
 * Registration form validation
 * 
 * @param {Object} values - Form values
 * @returns {Object} Error messages by field
 */
export const validateRegistration = (values) => {
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

/**
 * Profile form validation
 * 
 * @param {Object} values - Form values
 * @returns {Object} Error messages by field
 */
export const validateProfile = (values) => {
  const errors = {};
  
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
