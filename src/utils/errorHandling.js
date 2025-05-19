/**
 * Centralized error handling for Firebase Auth errors
 * 
 * @param {Error} error - Firebase auth error
 * @returns {string} User-friendly error message
 */
export const handleAuthError = (error) => {
  const errorCode = error.code || '';
  
  const errorMessages = {
    'auth/user-not-found': 'No account found with this email address',
    'auth/wrong-password': 'Invalid email or password',
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/requires-recent-login': 'Please login again to complete this action',
    'auth/popup-closed-by-user': 'Authentication was cancelled',
    'auth/cancelled-popup-request': 'Authentication was cancelled'
  };
  
  return errorMessages[errorCode] || error.message || 'An unexpected error occurred';
};

/**
 * Centralized error handling for Firestore errors
 * 
 * @param {Error} error - Firestore error
 * @returns {string} User-friendly error message
 */
export const handleFirestoreError = (error) => {
  const errorCode = error.code || '';
  
  const errorMessages = {
    'permission-denied': 'You do not have permission to perform this operation',
    'not-found': 'The requested document was not found',
    'already-exists': 'The document already exists',
    'resource-exhausted': 'Request quota exceeded. Try again later',
    'failed-precondition': 'Operation cannot be performed in current state',
    'aborted': 'Operation was aborted',
    'out-of-range': 'Operation was attempted past valid range',
    'unimplemented': 'This operation is not implemented or supported',
    'internal': 'Internal server error. Please try again later',
    'unavailable': 'Service is currently unavailable. Please try again later',
    'data-loss': 'Unrecoverable data loss or corruption',
    'unauthenticated': 'User is not authenticated. Please log in'
  };
  
  return errorMessages[errorCode] || error.message || 'An unexpected error occurred';
};
