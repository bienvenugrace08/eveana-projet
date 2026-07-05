import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';
import { TicketStatus, TicketType } from '../enums/ticket.enums';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  // Nullable : un billet peut être créé par un visiteur non connecté (achat rapide)
  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'buyer_name', type: 'varchar', length: 150 })
  buyerName: string;

  @Column({ name: 'buyer_email', type: 'varchar', length: 150 })
  buyerEmail: string;

  @Column({ name: 'buyer_phone', type: 'varchar', length: 30, nullable: true })
  buyerPhone: string | null;

  @Column({ name: 'ticket_type', type: 'enum', enum: TicketType, default: TicketType.EARLY })
  ticketType: TicketType;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.VALID })
  status: TicketStatus;

  @CreateDateColumn({ name: 'purchase_date' })
  purchaseDate: Date;
}
