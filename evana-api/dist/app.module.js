"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const events_module_1 = require("./events/events.module");
const artists_module_1 = require("./artists/artists.module");
const tickets_module_1 = require("./tickets/tickets.module");
const weather_module_1 = require("./weather/weather.module");
const upload_module_1 = require("./upload/upload.module");
const currency_module_1 = require("./currency/currency.module");
const user_entity_1 = require("./users/entities/user.entity");
const event_entity_1 = require("./events/entities/event.entity");
const artist_entity_1 = require("./artists/entities/artist.entity");
const artist_genre_entity_1 = require("./artists/entities/artist-genre.entity");
const ticket_entity_1 = require("./tickets/entities/ticket.entity");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_DATABASE'),
                    entities: [user_entity_1.User, event_entity_1.Event, artist_entity_1.Artist, artist_genre_entity_1.ArtistGenre, ticket_entity_1.Ticket],
                    synchronize: config.get('DB_SYNCHRONIZE') === 'true',
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            events_module_1.EventsModule,
            artists_module_1.ArtistsModule,
            tickets_module_1.TicketsModule,
            weather_module_1.WeatherModule,
            upload_module_1.UploadModule,
            currency_module_1.CurrencyModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map