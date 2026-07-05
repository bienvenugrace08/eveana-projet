import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  // Public : la conversion de prix doit être visible même par un visiteur non connecté
  @Public()
  @Get('convert')
  convert(@Query('amount') amount: string, @Query('to') to: string) {
    const parsedAmount = Number(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount < 0) {
      throw new BadRequestException('Le paramètre "amount" doit être un nombre positif');
    }
    if (!to) {
      throw new BadRequestException('Le paramètre "to" (devise cible) est requis, ex: EUR, USD, GBP');
    }
    return this.currencyService.convert(parsedAmount, to);
  }
}