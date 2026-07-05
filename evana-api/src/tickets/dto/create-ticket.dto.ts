import { IsEmail, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';
import { TicketType } from '../enums/ticket.enums';

export class CreateTicketDto {
  @IsUUID('4', { message: 'eventId doit être un identifiant valide' })
  eventId: string;

  @IsString()
  @MinLength(2, { message: 'Le nom complet est requis' })
  buyerName: string;

  @IsEmail({}, { message: 'Adresse email invalide' })
  buyerEmail: string;

  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @IsOptional()
  @IsEnum(TicketType, { message: 'Type de billet invalide (early ou standard)' })
  ticketType?: TicketType;

  @IsInt()
  @Min(1, { message: 'La quantité minimale est 1' })
  @Max(10, { message: 'La quantité maximale est 10 par commande' })
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
