// src/page/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

// Sử dụng lại CSS của trang Login cho nhất quán
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    tenDangNhap: "",
    matKhau: "",
    hoTen: "",
    email: "",
    sdt: "",
    ngaySinh: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra các trường cơ bản
    for (const key in formData) {
      if (!formData[key]) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
      }
    }

    const result = await authService.register(formData);

    if (result.success) {
      setSuccess("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message || "Đã có lỗi xảy ra trong quá trình đăng ký.");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form-container p-4 p-sm-5">
        <h2 className="text-center mb-4">Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Thêm các ô input cho form đăng ký */}
          <div className="form-group mb-3">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="tenDangNhap"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="matKhau"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Họ và Tên</label>
            <input
              type="text"
              name="hoTen"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="sdt"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="ngaySinh"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Đăng Ký
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
