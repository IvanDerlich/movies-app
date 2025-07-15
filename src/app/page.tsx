"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMovieContext } from "@/contexts/MovieContext";
import { 
  Container, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Alert,
  Stack,
  Chip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import type { MovieBasic } from "../contexts/MovieContext";

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
    const filteredResults = allMovies.filter((item: MovieBasic) => {
      if (filterType === "all") return true;
      if (filterType === "movies+series") return item.Type === "movie" || item.Type === "series";
      return item.Type === filterType;
    });
    setMovies(filteredResults);
  }, [filterType, allMovies, setMovies]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Movie Browser
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchMovies();
              }
            }}
            disabled={loading}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterType}
              label="Filter"
              onChange={(e) => setFilterType(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="movies+series">Movies + Series</MenuItem>
              <MenuItem value="movie">Movies only</MenuItem>
              <MenuItem value="series">Series only</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            onClick={searchMovies}
            disabled={loading}
            startIcon={<SearchIcon />}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {searched && !loading && !error && movies.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No movies found.
        </Alert>
      )}

      {movies.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {movies.map((movie: MovieBasic) => (
            <Box key={movie.imdbID} sx={{ width: { xs: '100%', sm: '48%', md: '31%', lg: '23%' }, mb: 3 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    <Link href={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {movie.Title}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {movie.Year}
                  </Typography>
                  <Chip 
                    label={movie.Type} 
                    size="small" 
                    color={movie.Type === 'movie' ? 'primary' : 'secondary'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
