import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then(setMovie)
      .catch(console.error);
  }, [id]);

  if (!movie) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 text-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placehold.co/400x600?text=No+Poster"
          }
          alt={movie.title}
          className="rounded-lg w-full md:w-1/3"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-4">{movie.release_date}</p>
          <p className="leading-relaxed">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
