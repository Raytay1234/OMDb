import { useContext } from "react";
import { MovieContext } from "../context/MovieContext";

export const useMovies = () => useContext(MovieContext);
