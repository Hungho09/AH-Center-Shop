import { SetMetadata } from '@nestjs/common';
import { SystemRole, ROLES_KEY } from '../constants/roles.constant';

export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);
