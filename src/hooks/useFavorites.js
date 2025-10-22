import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage on mount
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite (add/remove)
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.imdbID === movie.imdbID);
      if (isFavorited) {
        return prev.filter((fav) => fav.imdbID !== movie.imdbID);
      } else {
        return [...prev, movie];
      }
    });
  };

  // Check if a movie is a favorite
  const isFavorite = (id) => favorites.some((fav) => fav.imdbID === id);

  return { favorites, toggleFavorite, isFavorite };
}
