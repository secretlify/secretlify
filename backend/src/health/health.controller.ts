import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/core/decorators/is-public';

@Public()
@Controller('health')
export class HealthController {
  @Get()
  public check(): { status: string } {
    return { status: 'ok' };
  }
}
