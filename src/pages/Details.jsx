import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";

// ✅ Use your provided key directly (since you already have it)
const API_KEY = "8495c037";
const BASE_URL = "https://www.omdbapi.com/"; // use HTTPS always
const PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Poster";

export default function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();

  useEffect(() => {
    let canceled = false;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${BASE_URL}?i=${id}&plot=full&apikey=${API_KEY}`);
        const json = await res.json();

        if (!canceled) {
          if (json.Response === "True") {
            setMovie(json);
          } else {
            setError(json.Error || "Movie not found.");
          }
        }
      } catch (e) {
        console.error(e);
        if (!canceled) setError("Failed to load movie details.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    fetchDetails();
    return () => { canceled = true; };
  }, [id]);

  if (loading) return <p className="text-center py-12">Loading movie details…</p>;
  if (error) return <p className="text-center py-12 text-red-400">{error}</p>;
  if (!movie) return null;

  const fav = isFavorite(movie.imdbID);

  return (
    <div className="max-w-5xl mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <img
        src={movie.Poster === "N/A" ? PLACEHOLDER : movie.Poster}
        alt={`${movie.Title} poster`}
        className="w-full md:col-span-1 rounded-lg shadow"
      />
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold">
          {movie.Title}{" "}
          <span className="text-gray-400 text-xl">({movie.Year})</span>
        </h2>
        <p className="text-sm text-gray-400 my-2">
          {movie.Genre} • {movie.Runtime}
        </p>
        <p className="my-4">{movie.Plot}</p>

        <ul className="text-sm space-y-1">
          <li><strong>Director:</strong> {movie.Director}</li>
          <li><strong>Actors:</strong> {movie.Actors}</li>
          <li><strong>IMDb Rating:</strong> {movie.imdbRating}</li>
        </ul>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() =>
              fav
                ? removeFromFavorites(movie.imdbID)
                : addToFavorites({
                    imdbID: movie.imdbID,
                    Title: movie.Title,
                    Year: movie.Year,
                    Poster: movie.Poster,
                  })
            }
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"
          >
            {fav ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}
