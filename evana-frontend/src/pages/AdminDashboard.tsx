import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import {
  Bell,
  Settings,
  BarChart3,
  Ticket,
  Music2,
  Users,
  CalendarDays,
} from 'lucide-react';
import TicketsLineChart from '../components/charts/TicketsLineChart';
import WeatherWidget from '../components/WeatherWidget';

const CATEGORY_COLORS: Record<string, string> = {
  music: 'bg-primary',
  concert: 'bg-secondary',
  festival: 'bg-success',
  workshop: 'bg-warning',
  other: 'bg-slate-400',
};

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, role, username, token } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [artistsCount, setArtistsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [eventsData, ticketsData, artistsData, usersData] = await Promise.all([
        api.events.findAll(),
        api.tickets.findAll(token),
        api.artists.findAll(),
        api.users.findAll(token),
      ]);
      setEvents(eventsData || []);
      setTickets(ticketsData || []);
      setArtistsCount((artistsData || []).length);
      setUsersCount((usersData || []).length);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les données du tableau de bord.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // --- KPIs calculés à partir des données réelles de l'API ---
  const activeTickets = tickets.filter((t) => t.status !== 'cancelled');
  const ticketsSold = activeTickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const revenue = activeTickets.reduce((sum, t) => sum + Number(t.totalPrice || 0), 0);
  const upcomingEventsCount = events.filter((e) => e.status === 'upcoming').length;

  const stats = {
    totalEvents: events.length,
    upcomingEvents: upcomingEventsCount,
    ticketsSold,
    revenue,
  };

  // Répartition des événements par catégorie
  const categoryCounts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});
  const trafficByEventType = Object.entries(categoryCounts).map(([label, value]) => ({
    label,
    value,
    color: CATEGORY_COLORS[label] || 'bg-slate-400',
  }));
  const maxCategoryValue = Math.max(1, ...trafficByEventType.map((c) => c.value));

  // Répartition des billets par type (Standard Pass vs VIP Experience)
  const ticketTypeCounts = activeTickets.reduce<Record<string, number>>((acc, t) => {
    acc[t.ticketType] = (acc[t.ticketType] || 0) + (t.quantity || 0);
    return acc;
  }, {});
  const totalTicketTypeCount = Object.values(ticketTypeCounts).reduce((a, b) => a + b, 0) || 1;
  const salesByTicketType = [
    { label: 'Standard Pass', key: 'early', color: 'bg-primary' },
    { label: 'VIP Experience', key: 'standard', color: 'bg-secondary' },
  ].map((item) => ({
    ...item,
    value: Math.round(((ticketTypeCounts[item.key] || 0) / totalTicketTypeCount) * 1000) / 10,
  }));

  // 3 prochains événements à venir, triés par date
  const upcomingEvents = events
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Ville utilisée pour la météo : celle du prochain événement à venir
  const weatherCity = upcomingEvents[0]?.city || 'Dakar';

  // Dernières ventes de billets (activité récente)
  const recentActivity = [...tickets]
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 3)
    .map((t) => `${t.quantity} billet(s) vendu(s) pour "${t.event?.name ?? 'un événement'}"`);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" /> EVANA Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 text-sm">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Tableau de bord
          </p>
          <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary font-semibold">
            <BarChart3 className="w-4 h-4" />
            <span>Vue générale</span>
          </button>

          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">
            Gestion EVANA
          </p>
          <button
            onClick={() => navigate('/admin/events')}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
          >
            <Ticket className="w-4 h-4" />
            <span>Événements & billets</span>
          </button>
          <button
            onClick={() => navigate('/admin/artists')}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
          >
            <Music2 className="w-4 h-4" />
            <span>Artistes programmés</span>
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
          >
            <Users className="w-4 h-4" />
            <span>Utilisateurs</span>
          </button>
        </nav>

        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
          Connecté en tant que{' '}
          <span className="font-semibold text-slate-750 dark:text-slate-350">
            {username || 'admin'}
          </span>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Administration Générale
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/admin/profile')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
              {username ? username.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {error && (
            <div className="p-4 bg-danger-light text-danger-dark rounded-xl border border-danger/20 text-sm">
              {error}
            </div>
          )}

          {/* Cards KPI */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {[
              { label: 'Événements créés', value: stats.totalEvents, sub: `${stats.upcomingEvents} à venir` },
              { label: 'Billets vendus', value: stats.ticketsSold, sub: 'Total, hors annulations' },
              { label: 'Revenus générés', value: `${stats.revenue.toLocaleString('fr-FR')} CFA`, sub: 'Ventes de pass' },
              { label: 'Artistes au lineup', value: artistsCount, sub: 'Confirmés' },
              { label: 'Utilisateurs inscrits', value: usersCount, sub: 'Comptes créés' },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">{kpi.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                    {loading ? '—' : kpi.value}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-2">{kpi.sub}</p>
              </div>
            ))}
            {token && <WeatherWidget city={weatherCity} token={token} />}
          </section>

          {/* Graphique + Liste */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-955 dark:text-white">Évolution mensuelle des ventes</p>
                  <p className="text-xs text-slate-400">Total cumulé des pass achetés par mois</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <TicketsLineChart tickets={tickets} />
              </div>
            </div>

            {/* Événements à venir */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-slate-950 dark:text-white">Événements en approche</p>
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <ul className="space-y-4 flex-1">
                {upcomingEvents.length === 0 ? (
                  <li className="text-sm text-slate-400">Aucun événement à venir.</li>
                ) : (
                  upcomingEvents.map((ev) => (
                    <li
                      key={ev.id}
                      className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{ev.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(ev.date).toLocaleDateString('fr-FR')} · {ev.ticketsAvailable} places restantes
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>

          {/* Type d'événement & type de billet */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Répartition par catégorie d'événement */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft">
              <p className="font-bold text-slate-950 dark:text-white mb-4">Répartition par type d'événement</p>
              {trafficByEventType.length === 0 ? (
                <p className="text-sm text-slate-400">Aucun événement pour le moment.</p>
              ) : (
                <div className="flex items-end space-x-4 h-40 pt-4">
                  {trafficByEventType.map((item) => (
                    <div key={item.label} className="flex-1 flex flex-col items-center">
                      <div
                        className={`${item.color} w-8 rounded-t-xl`}
                        style={{ height: `${(item.value / maxCategoryValue) * 140}px` }}
                      />
                      <p className="text-[10px] font-semibold text-slate-550 mt-2 capitalize">{item.label} ({item.value})</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Répartition par type de billet */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft">
              <p className="font-bold text-slate-950 dark:text-white mb-4">Répartition par type de billet</p>
              <ul className="space-y-3.5">
                {salesByTicketType.map((item) => (
                  <li key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-650 dark:text-slate-350">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Activités */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft">
            <p className="font-bold text-slate-950 dark:text-white mb-3">Ventes récentes</p>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {recentActivity.length === 0 ? (
                <li>Aucune vente enregistrée pour le moment.</li>
              ) : (
                recentActivity.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{item}</span>
                  </li>
                ))
              )}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;