import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/shared/types/role.enum';

export const REQUIRE_ROLE_KEY = 'requireRole';

export const RequireRole = (...roles: Role[]) => SetMetadata(REQUIRE_ROLE_KEY, roles);
