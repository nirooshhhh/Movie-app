import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    fetchMovie();
    fetchTrailer();
  }, [id]);

  const fetchMovie = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setMovie(data);
  };

  const fetchTrailer = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    const trailer = data.results?.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    if (trailer) setTrailerKey(trailer.key);
  };

  if (!movie) return <p className="status-text">Loading...</p>;

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-content">
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="details-poster"
        />

        <div className="details-info">
          <h1>{movie.title}</h1>
          <p className="rating">⭐ {movie.vote_average}</p>
          <p className="overview">{movie.overview}</p>

          {trailerKey && (
            <button
              className="trailer-btn"
              onClick={() => setShowTrailer(true)}
            >
              ▶ Play Trailer
            </button>
          )}
        </div>
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
