import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import MovieSlider from "../components/home/MovieSlider";
import MovieScreen from "../components/home/MovieScreen";
import { useEffect, useState } from "react";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/phim")
      .then((res) => res.json())
      .then((result) => {
        setMovies(result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch movies:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex flex-column min-vh-100 home-container">
        {/* Hero Banner */}
        <div
          className="hero-banner position-relative"
          style={{
            height: "500px",
            background:
              "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container h-100 d-flex flex-column justify-content-center text-white">
            <div className="col-md-8 col-lg-6">
              <h1
                className="display-4 fw-bold"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
              >
                Trải nghiệm điện ảnh tuyệt vời
              </h1>
              <p
                className="lead my-4"
                style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
              >
                Đặt vé ngay hôm nay để thưởng thức những bộ phim mới nhất trên
                màn ảnh rộng.
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn px-4 py-2"
                  style={{
                    background: "#ff4b2b",
                    color: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(255, 75, 43, 0.3)",
                  }}
                >
                  <i className="fas fa-ticket-alt me-2"></i>
                  Mua vé ngay
                </button>
                <button
                  className="btn btn-outline-light px-4 py-2"
                  style={{ borderRadius: "8px" }}
                >
                  <i className="fas fa-info-circle me-2"></i>
                  Xem thêm
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-grow-1 py-5" style={{ background: "#181a20" }}>
          <div className="container">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <section className="mb-5">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h2 className="mb-0" style={{ color: "#ff4b2b" }}>
                      <i className="fas fa-fire-alt me-2"></i>
                      Phim đang chiếu
                    </h2>
                    <a
                      href="#"
                      className="btn btn-sm"
                      style={{ color: "#ff4b2b", borderColor: "#ff4b2b" }}
                    >
                      Xem tất cả <i className="fas fa-chevron-right ms-1"></i>
                    </a>
                  </div>
                  <MovieSlider movies={movies} onMovieClick={() => {}} />
                </section>

                <section className="mb-5">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h2 className="mb-0" style={{ color: "#ff4b2b" }}>
                      <i className="fas fa-calendar-alt me-2"></i>
                      Sắp ra mắt
                    </h2>
                    <a
                      href="#"
                      className="btn btn-sm"
                      style={{ color: "#ff4b2b", borderColor: "#ff4b2b" }}
                    >
                      Xem tất cả <i className="fas fa-chevron-right ms-1"></i>
                    </a>
                  </div>
                  <MovieScreen movies={movies} onMovieClick={() => {}} />
                </section>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Home;
