import { GoogleField } from '../../../common/enum';

export interface IGoogleUser {
  [GoogleField.GIVEN_NAME]: string;
  [GoogleField.FAMILY_NAME]: string;
  [GoogleField.EMAIL]: string;
  [GoogleField.PICTURE]: string;
  [GoogleField.SUB]: string;
}
