import React, { useState, useEffect } from "react";
import { MovieContext } from "./MovieContext";

const FAVORITES_KEY = "movie_app_favorites_v1";

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load favorites
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie) =>
    setFavorites((prev) =>
      prev.some((m) => m.imdbID === movie.imdbID) ? prev : [movie, ...prev]
    );

  const removeFromFavorites = (id) =>
    setFavorites((prev) => prev.filter((m) => m.imdbID !== id));

  const isFavorite = (id) => favorites.some((m) => m.imdbID === id);

  return (
    <MovieContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </MovieContext.Provider>
  );
}
