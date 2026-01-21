import { useEffect, useRef, useState } from "react";
import MovieCard from "../components/MovieCard";
import "../App.css";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchMovies = async (query) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchPopularMovies();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") fetchPopularMovies();
      else fetchSearchMovies(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="home">
      <h1 className="home-title">MovieVerse 🎬</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="status-text">Loading movies...</p>}

      {!loading && movies.length === 0 && (
        <p className="status-text">No movies found 😕</p>
      )}

      {!loading && movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
