import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('api/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('profile')
  async getProfile() {
    const profile = await this.githubService.getProfile();

    if (!profile) {
      throw new InternalServerErrorException('Failed to fetch GitHub profile');
    }

    return profile;
  }
}
