import React from "react";
import { useMovies } from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites } = useMovies();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-6">
        Your Favorites
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorite movies yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
