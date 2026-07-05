import React from 'react';
import type { Artist } from '../types/event';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={artist.image} 
          alt={artist.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="text-center">
            <p className="text-white font-bold text-xl mb-2">{artist.name}</p>
            <p className="text-gray-200 text-sm">{artist.musicGenre.join(', ')}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{artist.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{artist.bio}</p>
          <div className="text-sm text-gray-700">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;