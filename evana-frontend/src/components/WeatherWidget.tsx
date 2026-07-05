import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, Wind } from 'lucide-react';
import { api } from '../services/api';

interface WeatherWidgetProps {
  city: string;
  token: string;
}

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  observedAt: string;
}

// Codes météo simplifiés (norme WMO utilisée par Open-Meteo)
function getWeatherVisual(code: number): { label: string; Icon: React.ElementType } {
  if (code === 0) return { label: 'Ciel dégagé', Icon: Sun };
  if ([1, 2, 3].includes(code)) return { label: 'Partiellement nuageux', Icon: Cloud };
  if ([45, 48].includes(code)) return { label: 'Brumeux', Icon: Cloud };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Pluvieux', Icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Neigeux', Icon: CloudSnow };
  if ([95, 96, 99].includes(code)) return { label: 'Orageux', Icon: CloudLightning };
  return { label: 'Variable', Icon: Cloud };
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city, token }) => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.weather.current(city, token);
        if (!cancelled) setData(result);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Météo indisponible');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (city && token) load();
    return () => {
      cancelled = true;
    };
  }, [city, token]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft animate-pulse">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft">
        <p className="text-xs font-semibold text-slate-400 uppercase">Météo</p>
        <p className="text-sm text-slate-400 mt-2">{error || 'Indisponible pour le moment'}</p>
      </div>
    );
  }

  const { label, Icon } = getWeatherVisual(data.weatherCode);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">
            Météo · {data.city}
          </p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {Math.round(data.temperature)}°C
          </p>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
        <Icon className="w-10 h-10 text-primary shrink-0" />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
        <Wind className="w-3.5 h-3.5" />
        Vent : {Math.round(data.windSpeed)} km/h
      </div>
    </div>
  );
};

export default WeatherWidget;