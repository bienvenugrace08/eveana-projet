import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketStatus, TicketType } from './enums/ticket.enums';
import { EventsService } from '../events/events.service';
import { User } from '../users/entities/user.entity';

// Multiplicateur appliqué au prix de base de l'événement selon la catégorie de billet.
// 'early' = Standard Pass (prix de base), 'standard' = VIP Experience (double tarif).
const TICKET_TYPE_MULTIPLIER: Record<TicketType, number> = {
  [TicketType.EARLY]: 1,
  [TicketType.STANDARD]: 2,
};

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateTicketDto, currentUserId?: string): Promise<Ticket> {
    const event = await this.eventsService.findOne(dto.eventId);
    const ticketType = dto.ticketType ?? TicketType.EARLY;

    // Le prix n'est JAMAIS calculé côté client : on le recalcule ici pour éviter toute manipulation.
    const unitPrice = Number(event.ticketsPrice) * TICKET_TYPE_MULTIPLIER[ticketType];
    const totalPrice = unitPrice * dto.quantity;

    // Décrémente les places disponibles (lève une erreur si stock insuffisant)
    await this.eventsService.decrementAvailableTickets(dto.eventId, dto.quantity);

    const ticket = this.ticketsRepository.create({
      event,
      user: currentUserId ? ({ id: currentUserId } as User) : null,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      buyerPhone: dto.buyerPhone ?? null,
      ticketType,
      quantity: dto.quantity,
      totalPrice,
      notes: dto.notes ?? null,
      status: TicketStatus.VALID,
    });

    return this.ticketsRepository.save(ticket);
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      relations: ['event', 'user'],
      order: { purchaseDate: 'DESC' },
    });
  }

  findMine(userId: string): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: { user: { id: userId } },
      relations: ['event'],
      order: { purchaseDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });
    if (!ticket) {
      throw new NotFoundException(`Billet ${id} introuvable`);
    }
    return ticket;
  }

  async cancel(id: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    ticket.status = TicketStatus.CANCELLED;
    return this.ticketsRepository.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketsRepository.remove(ticket);
  }
}
