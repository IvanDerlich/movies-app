"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MovieDetailed } from "@/contexts/MovieContext";

export default function MovieDetails() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<MovieDetailed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movie/${id}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
        <Link href="/">← Back to Search</Link>
      </main>
    );
  }

  if (!movie || (movie as any).Response === "False") {
    return (
      <main>
        <h1>Movie Not Found</h1>
        <p>Sorry, we couldn't find the movie with ID: {id}</p>
        <Link href="/">← Back to Search</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>{movie.Title}</h1>
      <div>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
      </div>
      <Link href="/">← Back to Search</Link>
    </main>
  );
} 