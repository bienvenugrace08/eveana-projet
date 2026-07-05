"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
let WeatherService = class WeatherService {
    async getCurrentWeather(city) {
        const location = await this.geocodeCity(city);
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`;
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw new common_1.BadGatewayException('Impossible de récupérer la météo actuellement');
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
    async geocodeCity(city) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new common_1.BadGatewayException('Service de géolocalisation indisponible');
        }
        const data = await response.json();
        const result = data.results?.[0];
        if (!result) {
            throw new common_1.NotFoundException(`Ville "${city}" introuvable`);
        }
        return result;
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)()
], WeatherService);
//# sourceMappingURL=weather.service.js.map