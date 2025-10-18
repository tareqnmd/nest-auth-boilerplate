import { MulterFileField } from '../../../common/enum';

export interface IMulterFile {
  [MulterFileField.BUFFER]: Buffer;
  [MulterFileField.ORIGINALNAME]: string;
  [MulterFileField.MIMETYPE]: string;
  [MulterFileField.SIZE]: number;
}
