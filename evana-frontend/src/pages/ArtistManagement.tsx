import React, { useState, useEffect, useCallback } from 'react';
import type { Artist } from '../types/event';
import { Plus, Edit, Trash2, Search, Music2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const ArtistManagement: React.FC = () => {
  const { isAuthenticated, role, token } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const loadArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.artists.findAll();
      setArtists(data || []);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les artistes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  const handleAddArtist = () => {
    setSelectedArtist(null);
    setShowModal(true);
  };

  const handleEditArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowModal(true);
  };

  const handleDeleteArtist = async (artistId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet artiste ?')) return;
    try {
      await api.artists.remove(artistId, token as string);
      setArtists((prev) => prev.filter((a) => a.id !== artistId));
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression de l'artiste.");
    }
  };

  const filteredArtists = artists.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.musicGenre.some((g) => g.toLowerCase().includes(term))
    );
  });

  return (
    <div className="py-10 md:py-14 container mx-auto px-4 lg:px-6 max-w-6xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            Gestion des Artistes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Ajoutez, modifiez ou retirez les artistes programmés sur EVANA.
          </p>
        </div>
        <Button onClick={handleAddArtist} leftIcon={<Plus className="w-4 h-4" />}>
          Nouvel artiste
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-danger-light text-danger-dark rounded-xl border border-danger/20 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par nom ou genre musical..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-sm text-slate-400">Chargement des artistes...</p>
      ) : filteredArtists.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Music2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          Aucun artiste trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-soft flex flex-col"
            >
              <div className="h-40 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                {artist.image ? (
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Music2 className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{artist.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{artist.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {artist.musicGenre.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleEditArtist(artist)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  >
                    <Edit className="w-3.5 h-3.5" /> Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteArtist(artist.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-danger-light text-danger-dark text-xs font-semibold hover:bg-danger/20 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ArtistModal
          artist={selectedArtist}
          token={token as string}
          onClose={() => setShowModal(false)}
          onSave={() => {
            loadArtists();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ArtistManagement;

/* ── Modal d'Édition / Création ── */
interface ArtistModalProps {
  artist: Artist | null;
  token: string;
  onClose: () => void;
  onSave: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, token, onClose, onSave }) => {
  const [name, setName] = useState(artist?.name || '');
  const [bio, setBio] = useState(artist?.bio || '');
  const [image, setImage] = useState(artist?.image || '');
  const [genresInput, setGenresInput] = useState((artist?.musicGenre || []).join(', '));
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
      setImage(result.url);
    } catch (err: any) {
      setUploadError(err.message || "Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const musicGenre = genresInput
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);

    if (musicGenre.length === 0) {
      alert('Renseignez au moins un genre musical.');
      return;
    }

    setSaving(true);
    try {
      const payload = { name, bio, image: image || undefined, musicGenre };
      if (artist?.id) {
        await api.artists.update(artist.id, payload, token);
      } else {
        await api.artists.create(payload, token);
      }
      onSave();
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'enregistrement de l'artiste.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 max-w-xl w-full mx-auto shadow-modal space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {artist ? "Modifier l'artiste" : 'Nouvel Artiste'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Nom de l'artiste
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Biographie
            </label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Genres musicaux (séparés par une virgule)
            </label>
            <input
              type="text"
              required
              placeholder="Afrobeat, Amapiano, World Music..."
              value={genresInput}
              onChange={(e) => setGenresInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Photo de l'artiste
            </label>

            <div className="flex items-center gap-4">
              {image ? (
                <img
                  src={image}
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
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" isLoading={saving} disabled={uploading}>
              {artist ? 'Enregistrer' : "Créer l'artiste"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};