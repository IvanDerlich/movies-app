"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface MovieBasic {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
}

export interface MovieDetailed extends MovieBasic {
  Plot?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Poster?: string;
}

interface MovieContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  movies: MovieBasic[];
  setMovies: (movies: MovieBasic[]) => void;
  allMovies: MovieBasic[];
  setAllMovies: (movies: MovieBasic[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [movies, setMovies] = useState<MovieBasic[]>([]);
  const [allMovies, setAllMovies] = useState<MovieBasic[]>([]);
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