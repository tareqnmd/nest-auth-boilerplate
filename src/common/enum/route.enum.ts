export enum AuthRoute {
  ROOT = 'auth',
  SIGN_IN = 'signin',
  SIGN_UP = 'signup',
  SOCIAL = 'social',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  REFRESH_TOKEN = 'refresh-token',
  VERIFY_USER = 'verify-user',
  UNLOCK_ACCOUNT = 'unlock-account',
}

export enum UserRoute {
  ROOT = 'users',
  USERS = '',
  USER = ':id',
  CHANGE_PASSWORD = ':id/change-password',
  UPDATE_ROLE = ':id/update-role',
  UPDATE_STATUS = ':id/update-status',
  UPDATE_PROFILE_IMAGE = ':id/update-profile-image',
}

export enum CategoryRoute {
  ROOT = 'categories',
  CATEGORY = ':id',
  CATEGORY_BY_SLUG = ':slug',
}

export enum ConfigurationRoute {
  ROOT = 'configurations',
  CONFIGURATION = ':id',
}
