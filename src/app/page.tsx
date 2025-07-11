"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMovieContext } from "@/contexts/MovieContext";

export default function Home() {
  const {
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
  } = useMovieContext();

  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchMovies = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const encodedSearch = encodeURIComponent(searchTerm.trim());
      const response = await fetch(`/api/movies?q=${encodedSearch}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Server error. Please try again later.");
        setAllMovies([]);
        setLoading(false);
        return;
      }
      if (data.Response === "True") {
        setAllMovies(data.Search || []);
      } else {
        setAllMovies([]);
        setError(data.Error || data.error || "No movies found.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setAllMovies([]);
      setError("An error occurred while fetching movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter movies whenever filterType or allMovies changes
  useEffect(() => {
    const filteredResults = allMovies.filter((item: any) => {
      if (filterType === "all") return true;
      if (filterType === "movies+series") return item.Type === "movie" || item.Type === "series";
      return item.Type === filterType;
    });
    setMovies(filteredResults);
  }, [filterType, allMovies, setMovies]);

  return (
    <main>
      <h1>Movie Browser</h1>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              searchMovies();
            }
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="movies+series">Movies + Series</option>
          <option value="movie">Movies only</option>
          <option value="series">Series only</option>
        </select>
        <button 
          type="button"
          onClick={searchMovies}
          disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: 16 }}>{error}</div>
      )}

      {searched && !loading && !error && movies.length === 0 && (
        <div style={{ marginTop: 16 }}>No movies found.</div>
      )}

      {movies.length > 0 && (
        <div>
          {movies.map((movie: any) => (
            <div key={movie.imdbID}>
              <h3>
                <Link href={`/movie/${movie.imdbID}`}>
                  {movie.Title}
                </Link>
              </h3>
              <p>{movie.Year}</p>
              <p>{movie.Type}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
