import { Controller, Get } from '@nestjs/common';
import { CurrentUserId } from '../../auth/core/decorators/current-user-id.decorator';
import { UserReadService } from '../read/user-read.service';
import { UserSerialized } from './entities/user.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSerializer } from './entities/user.serializer';
import { UserWriteService } from '../write/user-write.service';
import { CustomJwtService } from '../../auth/custom-jwt/custom-jwt.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserCoreController {
  constructor(private readonly userReadService: UserReadService) {}

  @Get('me')
  @ApiResponse({ type: UserSerialized })
  public async readCurrentUser(@CurrentUserId() userId): Promise<UserSerialized> {
    const user = await this.userReadService.readByIdOrThrow(userId);

    return UserSerializer.serialize(user);
  }
}
