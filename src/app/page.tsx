"use client";

import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      // URL encode the search term to handle spaces and special characters
      const encodedSearch = encodeURIComponent(searchTerm.trim());
      // Call our server-side API route instead of OMDB directly
      const response = await fetch(`/api/movies?q=${encodedSearch}`);
      const data = await response.json();
      
      if (data.Response === "True") {
        setMovies(data.Search || []);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies();
  };

  return (
    <main>
      <h1>Movie Browser</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {movies.length > 0 && (
        <div>
          {movies.map((movie: any) => (
            <div key={movie.imdbID}>
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
              <p>{movie.Type}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
