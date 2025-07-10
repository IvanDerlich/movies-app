"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allMovies, setAllMovies] = useState([]); // Store all results
  const [movies, setMovies] = useState([]); // Store filtered results
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); // "everything", "all", "movie", "series"

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
        const allResults = data.Search || [];
        setAllMovies(allResults); // Store all results
      } else {
        setAllMovies([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies whenever filterType or allMovies changes
  useEffect(() => {
    console.log("Filtering with type:", filterType);
    console.log("All movies:", allMovies);
    
    const filteredResults = allMovies.filter((item: any) => {
      console.log("item", item);
      console.log("filterType", filterType);
      if (filterType === "all") return true; // Show everything
      if (filterType ==="movies+series") return item.Type === "movie" || item.Type === "series"; // Only movies and series
      return item.Type === filterType; // Specific type
    });
    
    console.log("filteredResults", filteredResults);
    setMovies(filteredResults);
  }, [filterType, allMovies]);



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
              console.log("Enter key pressed");
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
