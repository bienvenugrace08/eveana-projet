import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Ticket {
  quantity: number;
  status: string;
  purchaseDate: string;
}

interface TicketsLineChartProps {
  tickets: Ticket[];
}

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

// Regroupe les billets (hors annulés) par mois, sur les 6 derniers mois glissants
function aggregateByMonth(tickets: Ticket[]) {
  const now = new Date();
  const months: { key: string; month: string; tickets: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTH_LABELS[d.getMonth()], tickets: 0 });
  }

  const monthMap = new Map(months.map((m) => [m.key, m]));

  tickets.forEach((t) => {
    if (t.status === 'cancelled') return;
    const d = new Date(t.purchaseDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const entry = monthMap.get(key);
    if (entry) entry.tickets += t.quantity || 0;
  });

  return months;
}

const TicketsLineChart: React.FC<TicketsLineChartProps> = ({ tickets }) => {
  const data = useMemo(() => aggregateByMonth(tickets), [tickets]);
  const hasSales = data.some((m) => m.tickets > 0);

  return (
    <div className="h-52 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip formatter={(value: any) => [`${value} billet(s)`, 'Ventes']} />
          <Line type="monotone" dataKey="tickets" stroke="#6b4c9a" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
      {!hasSales && (
        <p className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 pointer-events-none">
          Aucune vente enregistrée sur les 6 derniers mois.
        </p>
      )}
    </div>
  );
};

export default TicketsLineChart;