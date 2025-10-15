import React from 'react';
import { useNavigate } from 'react-router-dom';

const Movie = ({ movie, onClick }) => {
  const navigate = useNavigate();

  const getRatingBadge = (rating) => {
    if (rating === '18+') {
      return { class: 'bg-danger', text: '18+' };
    }
    return { class: 'bg-primary', text: '13+' };
  };

  const handleBookTicket = (e) => {
    e.stopPropagation();
    // Navigate to booking page with movie ID
    navigate(`/booking/${movie.maPhim || movie.id}`);
  };

  const ratingInfo = getRatingBadge(movie.rating);

  return (
    <div className="col-12 col-sm-6 col-md-4 mb-4">
      <div className="card movie-card h-100 shadow-sm p-0" style={{ border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}>
        <div className="movie-img-wrapper position-relative" style={{ width: '100%', height: '340px', overflow: 'hidden', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', padding: 0 }}>
          <img
            src={movie.img || movie.hinhAnh}
            alt={movie.title || movie.tenPhim}
            className="movie-poster w-100 h-100"
            style={{ objectFit: 'cover', transition: 'transform 0.3s', display: 'block' }}
          />
          <div className="position-absolute top-0 start-0 m-2">
            <span className={`badge ${ratingInfo.class} fw-bold`}>
              {ratingInfo.text}
            </span>
          </div>
        </div>
        <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: 120, padding: '1rem' }}>
          <h5 className="card-title fw-bold mb-2 text-truncate" title={movie.title || movie.tenPhim} style={{ fontSize: '1.1rem' }}>
            {movie.title || movie.tenPhim}
          </h5>
          <div className="d-flex justify-content-between text-muted small mb-2">
            <div className="d-flex align-items-center">
              <i className="far fa-clock me-1"></i>
              <span>{movie.duration || `${movie.thoiLuong || 0} phút`}</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="far fa-calendar me-1"></i>
              <span>{movie.releaseDate || (movie.ngayKhoiChieu ? new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN') : '')}</span>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <button 
              className="btn btn-primary btn-sm w-50 me-2" 
              onClick={handleBookTicket}
            >
              <i className="bi bi-ticket-perforated me-1"></i>
              Đặt vé
            </button>
            <button 
              className="btn btn-outline-light btn-sm w-50" 
              onClick={e => { e.stopPropagation(); onClick(movie); }}
            >
              <i className="bi bi-info-circle me-1"></i>
              Chi tiết
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .movie-card {
          border-radius: 16px;
          background: #fff;
          padding: 0 !important;
        }
        .movie-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12) !important;
        }
        .movie-card:hover .movie-poster {
          transform: scale(1.05);
        }
        .movie-img-wrapper {
          background: #eee;
          padding: 0 !important;
        }
        .btn-primary {
          background: #ff4b2b;
          border: none;
        }
        .btn-primary:hover {
          background: #ff6f3c;
        }
        .btn-outline-light {
          border-color: #ff4b2b;
          color: #ff4b2b;
        }
        .btn-outline-light:hover {
          background: #ff4b2b;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Movie;