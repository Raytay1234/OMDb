import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";

const PLACEHOLDER = "https://via.placeholder.com/400x600?text=No+Poster";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();

    useEffect(() => {
        const fetchMovie = async () => {
            setError("");

            // ✅ Check cache first
            const cached = localStorage.getItem(`movie_${id}`);
            if (cached) {
                setMovie(JSON.parse(cached));
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
                const data = await res.json();

                if (data.Response === "True") {
                    setMovie(data);
                    // ✅ Save to localStorage cache
                    localStorage.setItem(`movie_${id}`, JSON.stringify(data));
                } else {
                    setError(data.Error || "Movie not found");
                }
            } catch {
                setError("Failed to load movie details");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (loading) return <div className="text-center mt-10 text-gray-400">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!movie) return null;

    const fav = isFavorite(movie.imdbID);
    const imdbRating = parseFloat(movie.imdbRating);
    const ratingOutOf5 = !isNaN(imdbRating) && imdbRating > 0 ? imdbRating / 2 : 0;

    const renderStars = () =>
        Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            const filled = ratingOutOf5 >= starValue;
            const half = ratingOutOf5 >= starValue - 0.5 && !filled;
            return (
                <svg
                    key={i}
                    className={`w-6 h-6 ${filled || half ? "text-yellow-400" : "text-gray-500"
                        }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    {half ? (
                        <defs>
                            <linearGradient id={`half-${i}`}>
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="gray" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                    ) : null}
                    <path
                        fill={half ? `url(#half-${i})` : "currentColor"}
                        d="M12 .587l3.668 7.568L24 9.75l-6 5.851L19.335 24 12 19.897 4.665 24 6 15.601 0 9.75l8.332-1.595z"
                    />
                </svg>
            );
        });

    return (
        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
            <img
                src={movie.Poster === "N/A" ? PLACEHOLDER : movie.Poster}
                alt={movie.Title}
                className="w-full rounded-xl shadow-lg object-cover"
            />

            <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold mb-3 text-gray-100 dark:text-gray-900">{movie.Title}</h1>
                <p className="text-gray-400 dark:text-gray-700 mb-4 italic">{movie.Genre}</p>

                <div className="flex items-center mb-3">
                    {renderStars()}
                    <span className="ml-2 text-yellow-300 text-lg">
                        {imdbRating ? `${imdbRating}/10` : "N/A"}
                    </span>
                </div>

                <p className="text-gray-300 dark:text-gray-800 mb-4">{movie.Plot}</p>
                <ul className="text-gray-400 dark:text-gray-700 space-y-1 mb-6">
                    <li><strong>Released:</strong> {movie.Released}</li>
                    <li><strong>Director:</strong> {movie.Director}</li>
                    <li><strong>Actors:</strong> {movie.Actors}</li>
                    <li><strong>Runtime:</strong> {movie.Runtime}</li>
                    <li><strong>Language:</strong> {movie.Language}</li>
                </ul>

                <div className="flex gap-4">
                    <button
                        onClick={() =>
                            fav ? removeFromFavorites(movie.imdbID) : addToFavorites(movie)
                        }
                        className={`px-5 py-2 rounded-lg font-semibold text-white transition ${fav ? "bg-red-600 hover:bg-red-500" : "bg-indigo-600 hover:bg-indigo-500"
                            } active:scale-95`}
                    >
                        {fav ? "Remove Favorite" : "Add to Favorites"}
                    </button>

                    <Link
                        to="/"
                        className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}
