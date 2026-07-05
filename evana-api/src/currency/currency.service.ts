import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';

const SUPPORTED_TARGETS = ['EUR', 'USD', 'GBP'];
const BASE_CURRENCY = 'XOF'; // Franc CFA (Afrique de l'Ouest), devise utilisée pour les prix des billets

@Injectable()
export class CurrencyService {
  // Utilise open.er-api.com (gratuit, sans clé API, mis à jour quotidiennement)
  async convert(amount: number, to: string) {
    const target = to.toUpperCase();
    if (!SUPPORTED_TARGETS.includes(target)) {
      throw new NotFoundException(
        `Devise "${to}" non supportée. Devises disponibles : ${SUPPORTED_TARGETS.join(', ')}`,
      );
    }

    const url = `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new BadGatewayException('Service de taux de change indisponible actuellement');
    }
    const data = await response.json();

    const rate = data?.rates?.[target];
    if (!rate) {
      throw new BadGatewayException(`Taux de change introuvable pour ${target}`);
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
}