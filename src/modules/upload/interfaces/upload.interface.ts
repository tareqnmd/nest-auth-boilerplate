import {
  CloudinaryField,
  CommonField,
  MultiUploadResultField,
  UploadFailureField,
  UploadField,
} from '../../../common/enum';

export interface IUploadResult {
  [UploadField.PUBLIC_ID]: string;
  [UploadField.URL]: string;
  [UploadField.SECURE_URL]: string;
  [UploadField.FORMAT]: string;
  [UploadField.RESOURCE_TYPE]: string;
  [UploadField.WIDTH]?: number;
  [UploadField.HEIGHT]?: number;
  [UploadField.BYTES]: number;
  [CommonField.CREATED_AT]: string;
}

export interface ICloudinaryConfig {
  [CloudinaryField.CLOUD_NAME]: string;
  [CloudinaryField.API_KEY]: string;
  [CloudinaryField.API_SECRET]: string;
}

export interface IDeleteResult {
  [CommonField.RESULT]: string;
}

export interface IUploadFailure {
  [UploadFailureField.FILE_NAME]: string;
  [UploadFailureField.ERROR]: string;
}

export interface IMultiUploadResult {
  [MultiUploadResultField.SUCCESSFUL]: IUploadResult[];
  [MultiUploadResultField.FAILED]: IUploadFailure[];
  [MultiUploadResultField.TOTAL_FILES]: number;
  [MultiUploadResultField.SUCCESS_COUNT]: number;
  [MultiUploadResultField.FAILURE_COUNT]: number;
}
