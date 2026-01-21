import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <Link to={`/movie/${movie.id}`} className="movie-link">
      <div className="movie-card">
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title}
        />
        <h4>{movie.title}</h4>
      </div>
    </Link>
  );
}

export default MovieCard;
