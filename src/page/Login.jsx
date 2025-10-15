import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }
    const result = await authService.login({ username, password });
    if (result.success) {
      // Đăng nhập thành công, lưu token và cập nhật context
      loginAction(result.data);

      // Giải mã token để lấy thông tin vai trò
      const decodedToken = jwtDecode(result.data.accessToken);
      const roles = decodedToken.scope ? decodedToken.scope.split(" ") : [];

      // Kiểm tra vai trò và chuyển hướng
      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin"); // Chuyển đến trang admin
      } else {
        navigate("/"); // Chuyển về trang chủ cho user
      }
      // --- KẾT THÚC PHẦN CHỈNH SỬA ---
    } else {
      setError(
        result.message || "Tên đăng nhập hoặc mật khẩu không chính xác."
      );
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form-container p-4 p-sm-5">
        <h2 className="text-center mb-4">Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group mb-3">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Đăng Nhập
          </button>
          <div className="d-flex justify-content-between">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
            <Link to="/register">Đăng ký ngay</Link>
          </div>
          <hr className="my-4" />
          <button type="button" className="btn btn-danger w-100">
            <i className="bi bi-google me-2"></i> Đăng nhập với Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
