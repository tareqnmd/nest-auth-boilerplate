const validationMessage = {
  user: {
    firstNameMin: 'First name must be at least 2 characters long',
    firstNameMax: 'First name must not exceed 50 characters',
    lastNameMin: 'Last name must be at least 2 characters long',
    lastNameMax: 'Last name must not exceed 50 characters',
    imageUrl: 'Image must be a valid URL',
    passwordComplexity:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  },
  auth: {
    passwordComplexity:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  },
};

export default validationMessage;
