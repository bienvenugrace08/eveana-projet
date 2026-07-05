import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(dto);
    return this.eventsRepository.save(event);
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({ order: { date: 'ASC' } });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Événement ${id} introuvable`);
    }
    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, dto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }

  // Utilisé par le module Tickets pour décrémenter les places disponibles
  async decrementAvailableTickets(id: string, quantity: number): Promise<Event> {
    const event = await this.findOne(id);
    if (event.ticketsAvailable < quantity) {
      throw new BadRequestException('Plus assez de places disponibles pour cet événement');
    }
    event.ticketsAvailable -= quantity;
    return this.eventsRepository.save(event);
  }
}
