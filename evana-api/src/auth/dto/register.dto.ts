import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
  username: string;

  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // Optionnel : par défaut 'user'. En production, seul un admin devrait pouvoir créer un autre admin,
  // mais on l'autorise ici pour rester fidèle au formulaire de démonstration du frontend.
  @IsOptional()
  @IsEnum(Role, { message: 'Le rôle doit être "admin" ou "user"' })
  role?: Role;
}
