export enum CommonField {
  ID = 'id',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  CREATED_BY = 'createdBy',
  UPDATED_BY = 'updatedBy',
  DELETED_AT = 'deletedAt',
  DELETED_BY = 'deletedBy',
  TYPE = 'type',
  USER_ID = 'userId',
  PAYLOAD = 'payload',
  RESULT = 'result',
}

export enum QueryField {
  PAGE = 'page',
  LIMIT = 'limit',
  SORT_BY = 'sortBy',
  SORT_ORDER = 'sortOrder',
  SEARCH = 'search',
}

export enum AuthField {
  TOKEN = 'token',
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  ACCESS_TOKEN_EXPIRES_IN = 'accessTokenExpiresIn',
  REFRESH_TOKEN_EXPIRES_IN = 'refreshTokenExpiresIn',
  ID_TOKEN = 'id_token',
  SOCIAL_PROVIDER = 'socialProvider',
  PROVIDER = 'provider',
}

export enum GithubField {
  ID = 'id',
  NAME = 'name',
  EMAIL = 'email',
  PICTURE = 'picture',
}

export enum GoogleField {
  GIVEN_NAME = 'givenName',
  FAMILY_NAME = 'familyName',
  EMAIL = 'email',
  PICTURE = 'picture',
  SUB = 'sub',
}

export enum UserField {
  EMAIL = 'email',
  PASSWORD = 'password',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  ROLE = 'role',
  IS_USER_VERIFIED = 'isUserVerified',
  IS_ACTIVE = 'isActive',
  GOOGLE_ID = 'googleId',
  GITHUB_ID = 'githubId',
  IMAGE = 'image',
  FAILED_LOGIN_ATTEMPTS = 'failedLoginAttempts',
  ACCOUNT_LOCKED_UNTIL = 'accountLockedUntil',
  LAST_FAILED_LOGIN_AT = 'lastFailedLoginAt',
  NEW_PASSWORD = 'newPassword',
  OLD_PASSWORD = 'oldPassword',
}

export enum TokenField {
  TOKEN = 'token',
  TYPE = 'type',
  USER_ID = 'userId',
  EXPIRES_AT = 'expiresAt',
}

export enum ResponseField {
  DATA = 'data',
  MESSAGE = 'message',
  ERROR = 'error',
  ERRORS = 'errors',
  MESSAGES = 'messages',
  STATUS = 'status',
  STATUS_CODE = 'statusCode',
}

export enum ErrorField {
  MESSAGE = 'message',
  RESPONSE = 'response',
  STATUS = 'status',
  DATA = 'data',
  ERROR = 'error',
}

export enum FileField {
  FILE = 'file',
  STATUS = 'status',
  SIZE = 'size',
  ORIGIN_FILE_OBJ = 'originFileObj',
}

export enum UploadField {
  FILE = 'file',
  FOLDER = 'folder',
  RESOURCE_TYPE = 'resourceType',
  PUBLIC_ID = 'publicId',
  URL = 'url',
  SECURE_URL = 'secureUrl',
  FORMAT = 'format',
  WIDTH = 'width',
  HEIGHT = 'height',
  BYTES = 'bytes',
}

export enum CloudinaryField {
  CLOUD_NAME = 'cloudName',
  API_KEY = 'apiKey',
  API_SECRET = 'apiSecret',
}

export enum MulterFileField {
  BUFFER = 'buffer',
  ORIGINALNAME = 'originalname',
  MIMETYPE = 'mimetype',
  SIZE = 'size',
}

export enum UploadFailureField {
  FILE_NAME = 'fileName',
  ERROR = 'error',
}

export enum MultiUploadResultField {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  TOTAL_FILES = 'totalFiles',
  SUCCESS_COUNT = 'successCount',
  FAILURE_COUNT = 'failureCount',
}

export enum SessionField {
  USER = 'user',
  TOKEN = 'token',
}

export enum MailResponseField {
  SUCCESS = 'success',
  MESSAGE_ID = 'messageId',
  MESSAGE = 'message',
}

export enum SendMailDtoField {
  FROM = 'from',
  TO = 'to',
  SUBJECT = 'subject',
  TEXT = 'text',
  HTML = 'html',
}

export enum ConfigurationField {
  KEY = 'key',
  VALUE = 'value',
}
