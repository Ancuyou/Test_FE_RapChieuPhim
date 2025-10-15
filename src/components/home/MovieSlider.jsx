import React, { useState, useEffect } from "react";
import Movie from "./Movie";

const MovieSlider = ({ movies, title, onMovieClick }) => {
  // Hiển thị 3 phim trên 1 hàng, không còn slider
  return (
    <div className="movie-slider-container py-4">
      {title && (
        <h3
          className="text-center mb-4"
          style={{ color: "#ff4b2b", fontWeight: 700 }}
        >
          {title}
        </h3>
      )}
      <div className="row justify-content-center" style={{ minHeight: 400 }}>
        {Array.isArray(movies) &&
          movies
            .slice(0, 3)
            .map((movie, idx) => (
              <Movie
                key={movie.id || idx}
                movie={movie}
                onClick={onMovieClick}
              />
            ))}
      </div>
    </div>
  );
};

export default MovieSlider;
