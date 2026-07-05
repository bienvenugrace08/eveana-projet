import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Utilisation : @Roles(Role.ADMIN)
 * Marque une route/contrôleur comme nécessitant un ou plusieurs rôles précis.
 * Doit toujours être combiné avec JwtAuthGuard + RolesGuard.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
