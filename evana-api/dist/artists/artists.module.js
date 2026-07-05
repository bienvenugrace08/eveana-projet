"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const artist_entity_1 = require("./entities/artist.entity");
const artist_genre_entity_1 = require("./entities/artist-genre.entity");
const artists_service_1 = require("./artists.service");
const artists_controller_1 = require("./artists.controller");
let ArtistsModule = class ArtistsModule {
};
exports.ArtistsModule = ArtistsModule;
exports.ArtistsModule = ArtistsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([artist_entity_1.Artist, artist_genre_entity_1.ArtistGenre])],
        controllers: [artists_controller_1.ArtistsController],
        providers: [artists_service_1.ArtistsService],
        exports: [artists_service_1.ArtistsService],
    })
], ArtistsModule);
//# sourceMappingURL=artists.module.js.map