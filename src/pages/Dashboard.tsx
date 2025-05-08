import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import MovieForm from '../components/movies/MovieForm';
import MovieList from '../components/movies/MovieList';
import { PlusCircle, ListChecks, BarChart3, Film, Clock, Star, PlayCircle } from 'lucide-react';
import FilterBar from '../components/FilterBar';

const Dashboard: React.FC = () => {
  const { state: moviesState } = useMovies();
  const { state: authState } = useAuth();
  const [showAddMovie, setShowAddMovie] = useState(false);

  const { movies } = moviesState;
  const watchedMovies = movies.filter(movie => movie.watched);
  const unwatchedMovies = movies.filter(movie => !movie.watched);
  
  // Calculate average rating
  const averageRating = watchedMovies.length > 0
    ? watchedMovies.reduce((sum, movie) => sum + (movie.rating || 0), 0) / watchedMovies.length
    : 0;

  const toggleAddMovie = () => {
    setShowAddMovie(!showAddMovie);
  };

  // Get recently added and recently watched movies
  const recentlyAdded = [...movies]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 4);
    
  const recentlyWatched = [...watchedMovies]
    .filter(movie => movie.watchedAt)
    .sort((a, b) => 
      new Date(b.watchedAt as Date).getTime() - new Date(a.watchedAt as Date).getTime()
    )
    .slice(0, 4);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {authState.user?.username}!
          </h1>
          <p className="text-gray-600">
            Track, rate, and discover your next favorite movie.
          </p>
        </div>
        <button
          onClick={toggleAddMovie}
          className="mt-4 md:mt-0 flex items-center bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" /> Add New Movie
        </button>
      </div>

      {showAddMovie && <MovieForm onClose={() => setShowAddMovie(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
              <Film size={20} />
            </div>
            <h3 className="font-medium">Total Movies</h3>
          </div>
          <p className="text-3xl font-bold">{movies.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
              <ListChecks size={20} />
            </div>
            <h3 className="font-medium">Watched</h3>
          </div>
          <p className="text-3xl font-bold">{watchedMovies.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
              <Clock size={20} />
            </div>
            <h3 className="font-medium">Watchlist</h3>
          </div>
          <p className="text-3xl font-bold">{unwatchedMovies.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
              <Star size={20} />
            </div>
            <h3 className="font-medium">Avg Rating</h3>
          </div>
          <p className="text-3xl font-bold">
            {averageRating > 0 ? averageRating.toFixed(1) : '-'}
          </p>
        </div>
      </div>

      <FilterBar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart3 size={20} className="text-gray-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Recently Added</h2>
          </div>
          
          {recentlyAdded.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No movies added yet.</p>
          ) : (
            <div className="space-y-3">
              {recentlyAdded.map(movie => (
                <div key={movie.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                  <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-300">
                        <Film size={16} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{movie.title}</h4>
                    <p className="text-xs text-gray-500">
                      Added {new Date(movie.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {movie.watched ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Watched
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        Watchlist
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <PlayCircle size={20} className="text-gray-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Recently Watched</h2>
          </div>
          
          {recentlyWatched.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No movies watched yet.</p>
          ) : (
            <div className="space-y-3">
              {recentlyWatched.map(movie => (
                <div key={movie.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                  <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-300">
                        <Film size={16} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{movie.title}</h4>
                    <div className="flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${
                              i < Math.floor(movie.rating || 0)
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">
                        {movie.rating?.toFixed(1) || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2 text-xs text-gray-500 flex-shrink-0">
                    {movie.watchedAt && new Date(movie.watchedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MovieList 
        title="Your Movie Collection" 
        emptyMessage="Add your first movie to get started!"
        hideFilters={true}
      />
    </div>
  );
};

export default Dashboard;