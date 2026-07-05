export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: EventCategory;
  ticketsAvailable: number;
  ticketsPrice: number;
  status: EventStatus;
}

export type EventCategory = 'music' | 'concert' | 'festival' | 'workshop' | 'other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Ticket {
  id: string;
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  status: TicketStatus;
}

export type TicketStatus = 'valid' | 'used' | 'cancelled';

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  musicGenre: string[];
}