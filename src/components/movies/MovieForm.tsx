import React, { useState } from 'react';
import { useMovies } from '../../context/MovieContext';
import { Movie } from '../../types';
import { X, Plus, Star, Upload } from 'lucide-react';

interface MovieFormProps {
  movie?: Movie;
  onClose: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onClose }) => {
  const { addMovie, updateMovie } = useMovies();
  const [title, setTitle] = useState(movie?.title || '');
  const [posterUrl, setPosterUrl] = useState(movie?.posterUrl || '');
  const [releaseYear, setReleaseYear] = useState(movie?.releaseYear?.toString() || '');
  const [director, setDirector] = useState(movie?.director || '');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState<string[]>(movie?.genre || []);
  const [watched, setWatched] = useState(movie?.watched || false);
  const [rating, setRating] = useState(movie?.rating || 0);
  const [comment, setComment] = useState(movie?.comment || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (releaseYear && !/^\d{4}$/.test(releaseYear)) {
      newErrors.releaseYear = 'Please enter a valid year (YYYY)';
    }
    
    if (posterUrl && !posterUrl.startsWith('http')) {
      newErrors.posterUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const movieData = {
      title,
      posterUrl: posterUrl || undefined,
      releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
      director: director || undefined,
      genre: genres.length > 0 ? genres : undefined,
      watched,
      rating: watched && rating > 0 ? rating : undefined,
      comment: watched && comment ? comment : undefined,
    };
    
    if (movie) {
      updateMovie(movie.id, movieData);
    } else {
      addMovie(movieData);
    }
    
    onClose();
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };

  const handleGenreKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddGenre();
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {movie ? 'Edit Movie' : 'Add New Movie'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Release Year
            </label>
            <input
              type="text"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="YYYY"
              className={`w-full px-3 py-2 border ${
                errors.releaseYear ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.releaseYear && (
              <p className="mt-1 text-sm text-red-500">{errors.releaseYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Director
            </label>
            <input
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poster URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
                className={`w-full px-3 py-2 border ${
                  errors.posterUrl ? 'border-red-500' : 'border-gray-300'
                } rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              <button
                type="button"
                className="bg-gray-100 px-3 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                title="Upload image (not implemented)"
              >
                <Upload size={18} />
              </button>
            </div>
            {errors.posterUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.posterUrl}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genres
          </label>
          <div className="flex">
            <input
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyDown={handleGenreKeyDown}
              placeholder="Action, Drama, Comedy..."
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleAddGenre}
              className="bg-gray-100 px-3 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
            >
              <Plus size={18} />
            </button>
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="watched"
              checked={watched}
              onChange={(e) => setWatched(e.target.checked)}
              className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="watched" className="ml-2 text-sm text-gray-700">
              I've watched this movie
            </label>
          </div>
        </div>

        {watched && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 ? `${rating}/5` : 'No rating'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="What did you think about this movie?"
              ></textarea>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            {movie ? 'Update Movie' : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;