import React, { useState, useEffect, useCallback } from 'react';
import type { Event, EventCategory, EventStatus } from '../types/event';
import { Plus, Edit, Trash2, Search, Filter, Calendar, MapPin, Tag, CheckSquare, PlusCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const EventManagement: React.FC = () => {
  const { isAuthenticated, role, token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const loadEvents = useCallback(async () => {
    try {
      const data = await api.events.findAll();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      try {
        await api.events.remove(eventId, token || '');
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      } catch (err) {
        alert('Erreur lors de la suppression de l\'événement.');
      }
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="py-12 md:py-16 container mx-auto px-4 lg:px-6 max-w-6xl space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Gestion des événements</h1>
          <p className="text-xs text-slate-400">Planifiez, modifiez et suivez vos concerts ou festivals.</p>
        </div>
        <Button onClick={handleAddEvent} leftIcon={<Plus className="w-4 h-4" />}>
          Créer un événement
        </Button>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-primary/40 transition">
            <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher nom, lieu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
            <Filter className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as EventCategory | 'all')}
              className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="all">Toutes les catégories</option>
              <option value="music">Musique</option>
              <option value="concert">Concert</option>
              <option value="festival">Festival</option>
              <option value="workshop">Atelier</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
            <Filter className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as EventStatus | 'all')}
              className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="upcoming">À venir</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau Modernisé */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nom de l'événement</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Lieu</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Places / Prix</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    Aucun événement trouvé.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{event.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-350">
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-350">{event.location}</td>
                    <td className="px-6 py-4 capitalize">{event.category}</td>
                    <td className="px-6 py-4">
                      <Badge variant={event.status === 'upcoming' ? 'primary' : event.status === 'ongoing' ? 'success' : 'neutral'} size="sm" dot>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      {event.ticketsAvailable} places / {event.ticketsPrice.toLocaleString('fr-FR')} CFA
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditEvent(event)}
                          aria-label="Modifier l'événement"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-500 hover:text-primary transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          aria-label="Supprimer l'événement"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-500 hover:text-danger transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          token={token || ''}
          onClose={() => setShowModal(false)}
          onSave={() => {
            loadEvents();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EventManagement;

/* ── Modal d'Édition / Création ── */
interface EventModalProps {
  event: Event | null;
  token: string;
  onClose: () => void;
  onSave: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, token, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    name: event?.name || '',
    description: event?.description || '',
    date: event?.date || '',
    location: event?.location || '',
    image: event?.image || '',
    category: event?.category || 'music',
    ticketsAvailable: event?.ticketsAvailable || 0,
    ticketsPrice: event?.ticketsPrice || 0,
    status: event?.status || 'upcoming',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const result = await api.upload.image(file, token);
      setFormData((prev) => ({ ...prev, image: result.url }));
    } catch (err: any) {
      setUploadError(err.message || "Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
      // Permet de re-sélectionner le même fichier si besoin
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (event?.id) {
        await api.events.update(event.id, formData, token);
      } else {
        await api.events.create(formData, token);
      }
      onSave();
    } catch (err) {
      alert('Erreur lors de l\'enregistrement de l\'événement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 max-w-2xl w-full mx-auto shadow-modal space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {event ? 'Modifier l\'événement' : 'Nouvel Événement'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Titre de l'événement</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none resize-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Lieu</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Photo de couverture
            </label>

            <div className="flex items-center gap-4">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Aperçu"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-[10px] text-center shrink-0">
                  Aucune image
                </div>
              )}

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition">
                  {uploading ? 'Envoi en cours...' : 'Choisir un fichier'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {uploadError && <p className="text-xs text-danger">{uploadError}</p>}
              </div>
            </div>

            <div className="pt-1">
              <label className="text-[11px] text-slate-400">Ou coller une URL d'image directement</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-100 cursor-pointer"
              >
                <option value="music">Musique</option>
                <option value="concert">Concert</option>
                <option value="festival">Festival</option>
                <option value="workshop">Atelier</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-850 dark:text-slate-100 cursor-pointer"
              >
                <option value="upcoming">À venir</option>
                <option value="ongoing">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Places disponibles</label>
              <input
                type="number"
                value={formData.ticketsAvailable}
                onChange={(e) => setFormData({ ...formData, ticketsAvailable: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Prix du billet (CFA)</label>
              <input
                type="number"
                value={formData.ticketsPrice}
                onChange={(e) => setFormData({ ...formData, ticketsPrice: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-500 font-semibold rounded-xl text-sm transition"
            >
              Annuler
            </button>
            <Button type="submit" isLoading={saving} disabled={uploading}>
              {event ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};