import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { ArtistGenre } from './entities/artist-genre.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,
    @InjectRepository(ArtistGenre)
    private readonly artistGenresRepository: Repository<ArtistGenre>,
  ) {}

  async create(dto: CreateArtistDto) {
    const artist = this.artistsRepository.create({
      name: dto.name,
      bio: dto.bio,
      image: dto.image ?? null,
      genres: dto.musicGenre.map((genre) => this.artistGenresRepository.create({ genre })),
    });
    const saved = await this.artistsRepository.save(artist);
    return this.toResponse(saved);
  }

  async findAll() {
    const artists = await this.artistsRepository.find();
    return artists.map((artist) => this.toResponse(artist));
  }

  async findOne(id: string) {
    const artist = await this.findEntity(id);
    return this.toResponse(artist);
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.findEntity(id);
    if (dto.name) artist.name = dto.name;
    if (dto.bio) artist.bio = dto.bio;
    if (dto.image !== undefined) artist.image = dto.image;
    if (dto.musicGenre) {
      // Remplace entièrement les genres existants par la nouvelle liste
      await this.artistGenresRepository.delete({ artist: { id } });
      artist.genres = dto.musicGenre.map((genre) => this.artistGenresRepository.create({ genre }));
    }
    const saved = await this.artistsRepository.save(artist);
    return this.toResponse(saved);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.findEntity(id);
    await this.artistsRepository.remove(artist);
  }

  private async findEntity(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artiste ${id} introuvable`);
    }
    return artist;
  }

  // Transforme la relation ArtistGenre[] en simple tableau de chaînes, comme attendu par le frontend
  private toResponse(artist: Artist) {
    return {
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
      image: artist.image,
      musicGenre: (artist.genres ?? []).map((g) => g.genre),
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt,
    };
  }
}
