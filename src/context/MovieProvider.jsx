import React, { useState, useEffect } from "react";
import { MovieContext } from "./MovieContext";

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const addToFavorites = (movie) => {
    if (!favorites.find((fav) => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
      triggerToast("Added to favorites!");
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter((movie) => movie.id !== id));
    triggerToast("Removed from favorites.");
  };

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  return (
    <MovieContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toast }}
    >
      {children}
    </MovieContext.Provider>
  );
};
