import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

// JwtAuthGuard est appliqué globalement (voir AppModule) : route accessible à tout utilisateur connecté.
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // Accessible à tout utilisateur connecté (user ou admin), pas besoin de rôle spécifique
  @Get('current')
  getCurrent(@Query('city') city: string) {
    if (!city) {
      throw new BadRequestException('Le paramètre "city" est requis');
    }
    return this.weatherService.getCurrentWeather(city);
  }
}
