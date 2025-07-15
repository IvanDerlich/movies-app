"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MovieDetailed } from "@/contexts/MovieContext";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Alert,
  CircularProgress,
  Divider
} from "@mui/material";

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!movie || (movie as any).Response === "False") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Sorry, we couldn't find the movie with ID: {id}
        </Alert>
        <Button 
          component={Link} 
          href="/" 
          variant="outlined"
        >
          ← Back to Search
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        component={Link} 
        href="/" 
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Back to Search
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {movie.Title}
          </Typography>
          {movie.Poster && movie.Poster !== "N/A" && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <img
                src={`/api/movie/${id}/poster`}
                alt={`Poster for ${movie.Title}`}
                style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
              />
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'grid', gap: 2 }}>
            {movie.Plot && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Plot
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {movie.Plot}
                </Typography>
              </Box>
            )}
            {movie.Genre && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Genre
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {movie.Genre}
                </Typography>
              </Box>
            )}
            {movie.Director && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Director
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {movie.Director}
                </Typography>
              </Box>
            )}
            {movie.Actors && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Actors
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {movie.Actors}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 