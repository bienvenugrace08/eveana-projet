import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import {
  Ticket as TicketIcon,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  XCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import WeatherWidget from '../components/WeatherWidget';

const UserDashboard: React.FC = () => {
  const { username, token } = useAuth();
  const navigate = useNavigate();

  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [ticketsData, eventsData] = await Promise.all([
        api.tickets.findMyTickets(token),
        api.events.findAll(),
      ]);
      setMyTickets(ticketsData || []);
      setEvents(eventsData || []);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger votre espace personnel.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleCancelTicket = async (ticketId: string) => {
    if (!token) return;
    if (!window.confirm('Voulez-vous vraiment annuler ce billet ?')) return;
    try {
      await api.tickets.cancel(ticketId, token);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'annulation du billet.");
    }
  };

  const now = new Date();
  const isUpcoming = (t: any) => t.event && new Date(t.event.date) >= now && t.status !== 'cancelled';
  const isPastOrCancelled = (t: any) => !isUpcoming(t);

  const upcomingTickets = myTickets.filter(isUpcoming);
  const pastTickets = myTickets.filter(isPastOrCancelled);

  const totalUpcomingTickets = upcomingTickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const totalTickets = myTickets.reduce((sum, t) => sum + (t.quantity || 0), 0);

  // Événements à l'affiche = événements à venir sur lesquels l'utilisateur n'a pas déjà de billet
  const myEventIds = new Set(myTickets.map((t) => t.event?.id));
  const recommendedEvents = events
    .filter((e) => e.status === 'upcoming' && !myEventIds.has(e.id))
    .slice(0, 4);

  const pastEvents = [...myTickets]
    .filter((t) => t.event && new Date(t.event.date) < now)
    .map((t) => t.event)
    .filter((e, idx, arr) => e && arr.findIndex((x) => x?.id === e.id) === idx)
    .slice(0, 4);

  // Ville utilisée pour la météo : celle du prochain événement (billet à venir, sinon événement recommandé)
  const nextEventLocation =
    upcomingTickets[0]?.event?.location || recommendedEvents[0]?.location || 'Dakar';
  const weatherCity = nextEventLocation.split(',').pop()?.trim() || 'Dakar';

  return (
    <div className="py-12 md:py-16 container mx-auto px-4 lg:px-6 max-w-6xl space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            Espace Participant
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Bienvenue, <span className="font-semibold text-primary">{username}</span>. Retrouvez vos billets et planifiez vos sorties.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={() => navigate('/tickets')}
            leftIcon={<TicketIcon className="w-4 h-4" />}
          >
            Acheter un billet
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/')}
            leftIcon={<CalendarDays className="w-4 h-4" />}
          >
            Événements
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger-light text-danger-dark rounded-xl border border-danger/20 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Billets à venir', value: totalUpcomingTickets, sub: `${upcomingTickets.length} réservation(s)` },
          { label: 'Participations passées', value: pastTickets.length, sub: 'Historique des événements' },
          { label: 'Billets achetés', value: totalTickets, sub: 'Total cumulé' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-soft"
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{loading ? '—' : stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
        {token && <WeatherWidget city={weatherCity} token={token} />}
      </section>

      {/* Content Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mes Billets (Gauche) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-primary" />
            Mes billets officiels
          </h2>

          {!loading && myTickets.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Vous n'avez aucun billet pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myTickets.map((t) => {
                const upcoming = isUpcoming(t);
                return (
                  <div
                    key={t.id}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                          {t.event?.name ?? 'Événement supprimé'}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t.event ? new Date(t.event.date).toLocaleDateString('fr-FR') : ''}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'cancelled'
                            ? 'bg-danger-light text-danger-dark'
                            : upcoming
                            ? 'bg-success-light text-success-dark'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {t.status === 'cancelled' ? (
                          <XCircle className="w-3 h-3" />
                        ) : upcoming ? (
                          <Clock3 className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {t.status === 'cancelled' ? 'Annulé' : upcoming ? 'À venir' : 'Terminé'}
                      </span>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-200 dark:border-slate-700 pt-3 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Catégorie</div>
                        <div className="font-bold text-slate-700 dark:text-slate-200">
                          {t.ticketType === 'standard' ? 'VIP' : 'Standard'} (x{t.quantity})
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Montant</div>
                        <div className="font-bold text-primary">{Number(t.totalPrice).toLocaleString('fr-FR')} CFA</div>
                      </div>
                    </div>

                    {t.status === 'valid' && upcoming && (
                      <button
                        onClick={() => handleCancelTicket(t.id)}
                        className="text-[11px] font-semibold text-danger hover:underline self-start"
                      >
                        Annuler ce billet
                      </button>
                    )}

                    {/* Simulate a Barcode at the bottom for premium SaaS feel */}
                    <div className="pt-2 flex flex-col items-center border-t border-dashed border-slate-350 dark:border-slate-700">
                      <div className="h-6 bg-slate-300 dark:bg-slate-700 w-full rounded flex items-center justify-between px-3 text-[9px] text-slate-500 font-mono tracking-widest overflow-hidden">
                        ||| |||| || ||||| || ||| | |||| |||
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 mt-1">CODE-{t.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Événements Recommandés (Droite) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Événements à l'affiche
          </h2>
          <ul className="space-y-4">
            {recommendedEvents.length === 0 ? (
              <li className="text-sm text-slate-400">Aucun nouvel événement pour le moment.</li>
            ) : (
              recommendedEvents.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-3 last:border-0 last:pb-0"
                >
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt={ev.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{ev.name}</p>
                    <p className="text-xs text-slate-400 truncate">{ev.location}</p>
                  </div>
                  <button
                    onClick={() => navigate('/tickets', { state: { event: ev } })}
                    className="text-primary hover:text-primary-light text-xs font-bold shrink-0 flex items-center gap-0.5"
                  >
                    Réserver
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Événements passés */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-soft space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Retour en images (Événements passés)
        </h2>
        {pastEvents.length === 0 ? (
          <p className="text-sm text-slate-400">Vous n'avez pas encore participé à un événement passé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pastEvents.map((ev: any) => (
              <div
                key={ev.id}
                className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col"
              >
                {ev.image && (
                  <div className="h-32 overflow-hidden bg-slate-100">
                    <img
                      src={ev.image}
                      alt={ev.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{ev.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(ev.date).toLocaleDateString('fr-FR')} · {ev.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;