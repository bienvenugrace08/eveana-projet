import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface CurrencyConverterProps {
  amountCFA: number;
  className?: string;
}

const CURRENCIES: Array<'EUR' | 'USD' | 'GBP'> = ['EUR', 'USD', 'GBP'];

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ amountCFA, className }) => {
  const [target, setTarget] = useState<'EUR' | 'USD' | 'GBP'>('EUR');
  const [converted, setConverted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!amountCFA || amountCFA <= 0) {
        setConverted(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await api.currency.convert(amountCFA, target);
        if (!cancelled) setConverted(result.convertedAmount);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Conversion indisponible');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [amountCFA, target]);

  const SYMBOLS: Record<string, string> = { EUR: '€', USD: '$', GBP: '£' };

  return (
    <div className={`flex items-center gap-2 text-xs opacity-70 ${className ?? ''}`}>
      <span>≈</span>
      {loading ? (
        <span>...</span>
      ) : error ? (
        <span>conversion indisponible</span>
      ) : (
        <span className="font-semibold">
          {converted !== null ? `${converted.toLocaleString('fr-FR')} ${SYMBOLS[target]}` : '—'}
        </span>
      )}
      <select
        value={target}
        onChange={(e) => setTarget(e.target.value as 'EUR' | 'USD' | 'GBP')}
        className="bg-transparent border-none text-xs focus:outline-none cursor-pointer underline decoration-dotted"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c} className="text-slate-900">
            {c}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyConverter;