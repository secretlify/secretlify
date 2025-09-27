import { ApiProperty } from '@nestjs/swagger';

export interface GithubInstallationLiveData {
  id: number;
  owner: string;
  avatar: string;
}
