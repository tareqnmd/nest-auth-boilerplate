import { UserField } from '../../../common/enum';

export interface ISocialResponse {
  [UserField.FIRST_NAME]: string;
  [UserField.LAST_NAME]: string;
  [UserField.EMAIL]: string;
  [UserField.IMAGE]: string;
  [UserField.GOOGLE_ID]?: string;
  [UserField.GITHUB_ID]?: string;
}
