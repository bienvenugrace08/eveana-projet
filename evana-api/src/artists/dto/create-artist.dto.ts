import { ArrayNotEmpty, IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @MinLength(2, { message: "Le nom de l'artiste est requis" })
  name: string;

  @IsString()
  @MinLength(5, { message: 'La biographie doit contenir au moins 5 caractères' })
  bio: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Renseignez au moins un genre musical' })
  @IsString({ each: true })
  musicGenre: string[];
}
