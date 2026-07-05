import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ArtistsModule } from './artists/artists.module';
import { TicketsModule } from './tickets/tickets.module';
import { WeatherModule } from './weather/weather.module';
import { UploadModule } from './upload/upload.module';
import { CurrencyModule } from './currency/currency.module';

import { User } from './users/entities/user.entity';
import { Event } from './events/entities/event.entity';
import { Artist } from './artists/entities/artist.entity';
import { ArtistGenre } from './artists/entities/artist-genre.entity';
import { Ticket } from './tickets/entities/ticket.entity';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [User, Event, Artist, ArtistGenre, Ticket],
        // false volontairement : la structure est gérée par sql/schema.sql (voir README)
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    ArtistsModule,
    TicketsModule,
    WeatherModule,
    UploadModule,
    CurrencyModule,
  ],
  providers: [
    // JwtAuthGuard s'applique par défaut à TOUTES les routes (sauf @Public())
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // RolesGuard vérifie ensuite les rôles déclarés avec @Roles(...)
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}