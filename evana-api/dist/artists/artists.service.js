"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const artist_entity_1 = require("./entities/artist.entity");
const artist_genre_entity_1 = require("./entities/artist-genre.entity");
let ArtistsService = class ArtistsService {
    constructor(artistsRepository, artistGenresRepository) {
        this.artistsRepository = artistsRepository;
        this.artistGenresRepository = artistGenresRepository;
    }
    async create(dto) {
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
    async findOne(id) {
        const artist = await this.findEntity(id);
        return this.toResponse(artist);
    }
    async update(id, dto) {
        const artist = await this.findEntity(id);
        if (dto.name)
            artist.name = dto.name;
        if (dto.bio)
            artist.bio = dto.bio;
        if (dto.image !== undefined)
            artist.image = dto.image;
        if (dto.musicGenre) {
            await this.artistGenresRepository.delete({ artist: { id } });
            artist.genres = dto.musicGenre.map((genre) => this.artistGenresRepository.create({ genre }));
        }
        const saved = await this.artistsRepository.save(artist);
        return this.toResponse(saved);
    }
    async remove(id) {
        const artist = await this.findEntity(id);
        await this.artistsRepository.remove(artist);
    }
    async findEntity(id) {
        const artist = await this.artistsRepository.findOne({ where: { id } });
        if (!artist) {
            throw new common_1.NotFoundException(`Artiste ${id} introuvable`);
        }
        return artist;
    }
    toResponse(artist) {
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
};
exports.ArtistsService = ArtistsService;
exports.ArtistsService = ArtistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(artist_entity_1.Artist)),
    __param(1, (0, typeorm_1.InjectRepository)(artist_genre_entity_1.ArtistGenre)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ArtistsService);
//# sourceMappingURL=artists.service.js.map