import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!email) {
      setError("Vui lòng nhập email của bạn.");
      return;
    }
    const result = await authService.forgotPassword(email);
    if (result.success) {
      setMessage("Yêu cầu thành công! Vui lòng kiểm tra email để nhận mã OTP.");
    } else {
      setError(result.message || "Email không tồn tại trong hệ thống.");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form-container p-4 p-sm-5">
        <h2 className="text-center mb-4">Quên Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email đã đăng ký"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Gửi yêu cầu
          </button>
          <div className="text-center">
            <Link to="/login">Quay lại Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
