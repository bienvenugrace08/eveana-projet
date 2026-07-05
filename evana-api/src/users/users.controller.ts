import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

// JwtAuthGuard + RolesGuard sont appliqués globalement (voir AppModule).
// Toutes les routes ci-dessous nécessitent donc déjà d'être authentifié.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Liste complète des utilisateurs -> admin uniquement
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // Un admin peut consulter n'importe quel profil, un utilisateur ne peut consulter que le sien
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthenticatedUser) {
    if (currentUser.role !== Role.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('Vous ne pouvez consulter que votre propre profil');
    }
    return this.usersService.findOne(id);
  }

  // Un admin peut modifier n'importe quel profil (y compris le rôle), un utilisateur seulement le sien
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    if (currentUser.role !== Role.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil');
    }
    if (currentUser.role !== Role.ADMIN && dto.role) {
      throw new ForbiddenException('Seul un administrateur peut changer un rôle');
    }
    return this.usersService.update(id, dto);
  }

  // Suppression -> admin uniquement
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
