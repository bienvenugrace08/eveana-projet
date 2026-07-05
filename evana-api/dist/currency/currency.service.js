"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const SUPPORTED_TARGETS = ['EUR', 'USD', 'GBP'];
const BASE_CURRENCY = 'XOF';
let CurrencyService = class CurrencyService {
    async convert(amount, to) {
        const target = to.toUpperCase();
        if (!SUPPORTED_TARGETS.includes(target)) {
            throw new common_1.NotFoundException(`Devise "${to}" non supportée. Devises disponibles : ${SUPPORTED_TARGETS.join(', ')}`);
        }
        const url = `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new common_1.BadGatewayException('Service de taux de change indisponible actuellement');
        }
        const data = await response.json();
        const rate = data?.rates?.[target];
        if (!rate) {
            throw new common_1.BadGatewayException(`Taux de change introuvable pour ${target}`);
        }
        return {
            amount,
            from: BASE_CURRENCY,
            to: target,
            rate,
            convertedAmount: Math.round(amount * rate * 100) / 100,
            lastUpdated: data.time_last_update_utc,
        };
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)()
], CurrencyService);
//# sourceMappingURL=currency.service.js.map