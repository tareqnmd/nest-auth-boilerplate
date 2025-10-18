import { GithubField } from '../../../common/enum';

export interface IGithubUser {
  [GithubField.ID]: number;
  [GithubField.NAME]: string;
  [GithubField.EMAIL]: string;
  [GithubField.PICTURE]: string;
}
