import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
};

const dotSizes = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-4 h-4 border-2',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Couleur déterministe à partir du nom
function getAvatarColor(name?: string): string {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-rose-400 to-pink-500',
    'from-cyan-400 to-sky-500',
  ];
  if (!name) return colors[0];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  online,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;
  const gradient = getAvatarColor(name);

  return (
    <div className={`relative inline-flex shrink-0 ${sizeClasses[size]} ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          onError={() => setImgError(true)}
          className="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
        />
      ) : (
        <div
          className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-800`}
          aria-label={alt ?? name ?? 'Avatar'}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-white dark:border-slate-800 ${dotSizes[size]} ${
            online ? 'bg-success' : 'bg-slate-400'
          }`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Avatar;
