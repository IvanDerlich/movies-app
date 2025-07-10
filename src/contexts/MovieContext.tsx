"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
}

interface MovieContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  allMovies: Movie[];
  setAllMovies: (movies: Movie[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <MovieContext.Provider value={{
      searchTerm,
      setSearchTerm,
      filterType,
      setFilterType,
      movies,
      setMovies,
      allMovies,
      setAllMovies,
      loading,
      setLoading,
    }}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
} 