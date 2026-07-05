import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CreditCard, Ticket } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import CurrencyConverter from '../components/CurrencyConverter';

const Tickets: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const locationState: any = state || null;
  const { username, token, isAuthenticated } = useAuth();

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [fullName, setFullName] = useState<string>(username || '');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [ticketType, setTicketType] = useState<'early' | 'standard' | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await api.events.findAll();
        setEvents(data || []);
        if (locationState?.event?.id) {
          setSelectedEventId(locationState.event.id);
        } else if (data && data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Impossible de charger les événements.');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [locationState?.event?.id]);

  const selectedEvent = events.find((evt) => evt.id === selectedEventId);

  // Le prix affiché est une estimation ; le montant définitif est recalculé et sécurisé côté serveur.
  const getPrice = () => {
    if (!selectedEvent) return 0;
    const basePrice = Number(selectedEvent.ticketsPrice) || 0;
    if (ticketType === 'early') return basePrice;
    if (ticketType === 'standard') return basePrice * 2;
    return 0;
  };

  const totalPrice = getPrice() * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      alert('Merci de vous connecter avant d\'acheter un billet.');
      navigate('/login', { state: { from: '/tickets' } });
      return;
    }
    if (!selectedEvent || !ticketType || quantity < 1) {
      alert('Merci de sélectionner un événement, un type de billet et une quantité.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.tickets.create(
        {
          eventId: selectedEventId,
          buyerName: fullName,
          buyerEmail: email,
          buyerPhone: phone || undefined,
          ticketType,
          quantity,
          notes: message || undefined,
        },
        token,
      );
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'achat');
    } finally {
      setLoading(false);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400">Chargement de la billetterie...</p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 container mx-auto px-4 lg:px-6 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Formulaire Achat (Gauche) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Billetterie Officielle</h2>
            <p className="text-xs text-slate-400">Réservez vos places de façon sécurisée en quelques clics.</p>
          </div>

          {error && (
            <div className="p-4 bg-danger-light text-danger-dark rounded-2xl border border-danger/20 text-sm">
              {error}
            </div>
          )}

          {!isAuthenticated && !success && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-2xl border border-amber-200 dark:border-amber-800 text-sm">
              Vous devez être connecté pour acheter un billet.{' '}
              <Link to="/login" className="font-semibold underline">Se connecter</Link>
            </div>
          )}

          {success ? (
            <div className="p-6 bg-success-light text-success-dark rounded-2xl border border-success/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto text-success text-2xl">✓</div>
              <h3 className="font-bold text-lg">Achat validé !</h3>
              <p className="text-sm">Votre réservation a bien été enregistrée. Retrouvez vos e-tickets dans votre Dashboard.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Événement */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Événement ciblé
                </label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none cursor-pointer text-slate-800 dark:text-slate-100"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  required
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({new Date(event.date).toLocaleDateString('fr-FR')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Infos Acheteur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Téléphone mobile
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none"
                />
              </div>

              {/* Type de billet */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Catégorie d'accès
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition ${
                    ticketType === 'early' ? 'border-primary bg-primary-50/20 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="ticketType"
                      value="early"
                      required
                      checked={ticketType === 'early'}
                      onChange={() => setTicketType('early')}
                      className="accent-primary"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Standard Pass</div>
                      <div className="text-xs text-slate-400">
                        {selectedEvent ? `${Number(selectedEvent.ticketsPrice).toLocaleString('fr-FR')} CFA` : '—'}
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition ${
                    ticketType === 'standard' ? 'border-primary bg-primary-50/20 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="ticketType"
                      value="standard"
                      checked={ticketType === 'standard'}
                      onChange={() => setTicketType('standard')}
                      className="accent-primary"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">VIP Experience</div>
                      <div className="text-xs text-slate-400">
                        {selectedEvent ? `${(Number(selectedEvent.ticketsPrice) * 2).toLocaleString('fr-FR')} CFA` : '—'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quantité & message */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none text-center font-bold"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Placement PMR, etc."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none"
                  />
                </div>
              </div>

              <Button type="submit" fullWidth leftIcon={<CreditCard className="w-4 h-4" />}>
                Confirmer l'achat
              </Button>
            </form>
          )}
        </div>

        {/* Récapitulatif Billet Virtuel (Droite) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedEvent ? (
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-6 shadow-glow relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/15 rounded-full blur-2xl" />

              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider">EVANA Pass Virtuel</span>
                <Ticket className="w-5 h-5 text-secondary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold leading-tight">{selectedEvent.name}</h3>
                <p className="text-xs text-white/70">{selectedEvent.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div>
                  <div className="text-[10px] text-white/50 uppercase">Date</div>
                  <div className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString('fr-FR')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase">Type</div>
                  <div className="font-semibold capitalize">{ticketType || 'Non choisi'}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-white/50 uppercase">Quantité x Tarif</div>
                  <div className="text-sm font-semibold">{quantity} x {getPrice().toLocaleString('fr-FR')} CFA</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/50 uppercase">Total à payer</div>
                  <div className="text-2xl font-black text-secondary">{totalPrice.toLocaleString('fr-FR')} CFA</div>
                  {totalPrice > 0 && <CurrencyConverter amountCFA={totalPrice} className="justify-end mt-1" />}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-6 text-center text-slate-400">
              Sélectionnez un événement pour afficher le récapitulatif.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tickets;