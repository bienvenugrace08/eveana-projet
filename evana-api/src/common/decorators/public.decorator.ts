import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Utilisation : @Public()
 * Rend une route accessible sans authentification (JwtAuthGuard laissera passer).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
