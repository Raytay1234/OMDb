import React from "react";
import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { Heart } from "lucide-react";

const PLACEHOLDER = "https://placehold.co/300x445?text=No+Poster";

export default function MovieCard({ movie }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : PLACEHOLDER
          }
          alt={movie.title}
          className="w-full h-[350px] object-cover"
        />
      </Link>

      <div className="p-3 flex justify-between items-center">
        <h3 className="text-gray-100 font-semibold text-sm truncate">
          {movie.title}
        </h3>
        <button
          onClick={handleFavoriteClick}
          className={`transition ${
            favorite ? "text-red-500" : "text-gray-400 hover:text-red-400"
          }`}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart fill={favorite ? "red" : "none"} size={18} />
        </button>
      </div>
    </div>
  );
}
