import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { EventCategory, EventStatus } from '../enums/event.enums';

export class CreateEventDto {
  @IsString()
  @MinLength(2, { message: "Le nom de l'événement est requis" })
  name: string;

  @IsString()
  @MinLength(5, { message: 'La description doit contenir au moins 5 caractères' })
  description: string;

  @IsDateString({}, { message: 'La date doit être au format ISO (YYYY-MM-DD)' })
  date: string;

  @IsString()
  @MinLength(2)
  location: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsEnum(EventCategory, { message: 'Catégorie invalide' })
  category: EventCategory;

  @IsInt()
  @Min(0, { message: 'Le nombre de places ne peut pas être négatif' })
  ticketsAvailable: number;

  @IsInt()
  @Min(0, { message: 'Le prix ne peut pas être négatif' })
  ticketsPrice: number;

  @IsOptional()
  @IsEnum(EventStatus, { message: 'Statut invalide' })
  status?: EventStatus;
}
