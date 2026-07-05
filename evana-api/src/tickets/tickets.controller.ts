import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

// JwtAuthGuard + RolesGuard sont appliqués globalement (voir AppModule).
// -> Toutes les routes ci-dessous nécessitent déjà d'être authentifié.
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Achat de billet -> nécessite d'être connecté (user ou admin), aucun rôle unique requis
  @Post()
  create(@Body() dto: CreateTicketDto, @CurrentUser() user: AuthenticatedUser) {
    return this.ticketsService.create(dto, user.userId);
  }

  // Tous les billets -> admin uniquement (vue de gestion globale)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.ticketsService.findAll();
  }

  // Billets de l'utilisateur connecté -> "Mon espace / mes billets"
  @Get('my-tickets')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.ticketsService.findMine(user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const ticket = await this.ticketsService.findOne(id);
    this.assertOwnerOrAdmin(ticket.user?.id, user);
    return ticket;
  }

  // Annulation (soft) -> propriétaire du billet ou admin
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const ticket = await this.ticketsService.findOne(id);
    this.assertOwnerOrAdmin(ticket.user?.id, user);
    return this.ticketsService.cancel(id);
  }

  // Suppression définitive -> admin uniquement
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  private assertOwnerOrAdmin(ownerId: string | undefined, user: AuthenticatedUser) {
    if (user.role !== Role.ADMIN && ownerId !== user.userId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce billet");
    }
  }
}
