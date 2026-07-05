import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

@Injectable()
export class WeatherService {
  // Utilise Open-Meteo (gratuit, sans clé API) pour la météo en temps réel d'une ville
  async getCurrentWeather(city: string) {
    const location = await this.geocodeCity(city);

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`;
    const response = await fetch(forecastUrl);
    if (!response.ok) {
      throw new BadGatewayException('Impossible de récupérer la météo actuellement');
    }
    const data = await response.json();

    return {
      city: location.name,
      country: location.country,
      temperature: data.current_weather?.temperature,
      windSpeed: data.current_weather?.windspeed,
      weatherCode: data.current_weather?.weathercode,
      observedAt: data.current_weather?.time,
    };
  }

  private async geocodeCity(city: string): Promise<GeocodingResult> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new BadGatewayException('Service de géolocalisation indisponible');
    }
    const data = await response.json();
    const result = data.results?.[0];
    if (!result) {
      throw new NotFoundException(`Ville "${city}" introuvable`);
    }
    return result;
  }
}
