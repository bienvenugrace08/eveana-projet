import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface TicketsPerMonth {
  month: string;   // ex: "Jan", "Fév", "Mar"
  tickets: number; // nombre de billets vendus ce mois
}

// plus tard tu remplaceras cette URL par celle de ton backend
const API_BASE_URL = 'http://localhost:5000';

const TicketsLineChart: React.FC = () => {
  const [data, setData] = useState<TicketsPerMonth[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Quand ton backend sera prêt, il devra renvoyer un tableau [{ month, tickets }, ...]
        const res = await fetch(`${API_BASE_URL}/api/admin/tickets-by-month`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const json: TicketsPerMonth[] = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        // Pour tester le graph sans backend, on met des données mock si l’appel échoue
        setData([
          { month: 'Jan', tickets: 120 },
          { month: 'Fév', tickets: 280 },
          { month: 'Mar', tickets: 320 },
          { month: 'Avr', tickets: 260 },
          { month: 'Mai', tickets: 410 },
          { month: 'Juin', tickets: 380 },
        ]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#6b4c9a"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketsLineChart;