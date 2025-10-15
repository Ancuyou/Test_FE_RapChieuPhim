import React, { useState, useEffect } from "react";
import movieService from "../../services/movieService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    nowShowing: 0,
    comingSoon: 0,
    ended: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await movieService.getMovieStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="card-title h4 text-primary fw-bold mb-0">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard Quản Lý
            </h2>
            <div>
              <button className="btn btn-sm btn-outline-primary">
                <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
              </button>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center py-4">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-film fs-1 text-primary"></i>
                  </div>
                  <h3 className="fw-bold mb-0">{stats.totalMovies}</h3>
                  <p className="text-muted mb-0">Tổng số phim</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center py-4">
                  <div
                    className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-play-circle fs-1 text-success"></i>
                  </div>
                  <h3 className="fw-bold mb-0">{stats.nowShowing}</h3>
                  <p className="text-muted mb-0">Đang chiếu</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center py-4">
                  <div
                    className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-clock fs-1 text-warning"></i>
                  </div>
                  <h3 className="fw-bold mb-0">{stats.comingSoon}</h3>
                  <p className="text-muted mb-0">Sắp chiếu</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center py-4">
                  <div
                    className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-stop-circle fs-1 text-secondary"></i>
                  </div>
                  <h3 className="fw-bold mb-0">{stats.ended}</h3>
                  <p className="text-muted mb-0">Đã chiếu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0">Thống kê phim theo tháng</h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5 text-muted">
                <i className="bi bi-bar-chart" style={{ fontSize: "2rem" }}></i>
                <p className="mt-3">Biểu đồ thống kê sẽ hiển thị tại đây</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0">Thông báo hệ thống</h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center border-start-0 border-end-0">
                  <div
                    className="bg-primary rounded-circle me-3"
                    style={{ width: "10px", height: "10px" }}
                  ></div>
                  <div>
                    <p className="mb-0">Phim "Fast X" sắp hết lịch chiếu</p>
                    <small className="text-muted">Hôm nay</small>
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-center border-start-0 border-end-0">
                  <div
                    className="bg-success rounded-circle me-3"
                    style={{ width: "10px", height: "10px" }}
                  ></div>
                  <div>
                    <p className="mb-0">
                      Phim mới "Avengers" đã được thêm vào hệ thống
                    </p>
                    <small className="text-muted">Hôm qua</small>
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-center border-start-0 border-end-0">
                  <div
                    className="bg-warning rounded-circle me-3"
                    style={{ width: "10px", height: "10px" }}
                  ></div>
                  <div>
                    <p className="mb-0">Có 3 suất chiếu mới được tạo</p>
                    <small className="text-muted">2 ngày trước</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
