import React, { useState } from 'react';
import { useMovies } from '../../context/MovieContext';
import { Movie } from '../../types';
import { Star, Edit, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import MovieForm from './MovieForm';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { updateMovie, deleteMovie } = useMovies();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleWatched = () => {
    updateMovie(movie.id, { watched: !movie.watched });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    deleteMovie(movie.id);
    setIsDeleting(false);
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  const closeEditForm = () => {
    setIsEditing(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating)
            ? 'text-amber-500 fill-amber-500'
            : i < rating
            ? 'text-amber-500 fill-amber-500 opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isEditing) {
    return <MovieForm movie={movie} onClose={closeEditForm} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative aspect-[2/3] bg-gray-200">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleToggleWatched}
            className={`p-1.5 rounded-full ${
              movie.watched
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-white bg-opacity-70'
            }`}
            title={movie.watched ? 'Watched' : 'Not watched'}
          >
            {movie.watched ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{movie.title}</h3>
        <div className="text-sm text-gray-600 mb-2">
          {movie.releaseYear && <span>{movie.releaseYear}</span>}
          {movie.director && (
            <span className="ml-1">
              {movie.releaseYear && '•'} {movie.director}
            </span>
          )}
        </div>

        {movie.genre && movie.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {movie.watched && (
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <div className="flex mr-1">{renderStars(movie.rating || 0)}</div>
              {movie.rating && <span className="text-sm text-gray-700">{movie.rating.toFixed(1)}</span>}
            </div>
            {movie.comment && (
              <p className="text-sm text-gray-600 italic">"{movie.comment}"</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Added: {new Date(movie.addedAt).toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isDeleting && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700 mb-2">Are you sure you want to delete?</p>
            <div className="flex space-x-2">
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center"
              >
                <Check size={14} className="mr-1" /> Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 flex items-center"
              >
                <X size={14} className="mr-1" /> No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;