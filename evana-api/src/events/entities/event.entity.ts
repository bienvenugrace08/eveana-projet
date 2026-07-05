import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventCategory, EventStatus } from '../enums/event.enums';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 150 })
  location: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @Column({ type: 'enum', enum: EventCategory, default: EventCategory.MUSIC })
  category: EventCategory;

  @Column({ name: 'tickets_available', type: 'int', default: 0 })
  ticketsAvailable: number;

  @Column({ name: 'tickets_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  ticketsPrice: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.UPCOMING })
  status: EventStatus;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
