import axios from "axios";
import { API_CONFIG } from "./config";
import { refreshToken as refreshTokenService } from "./authService";
import { useAuth } from "../context/AuthContext";

// Tạo một instance của axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Interceptor 1: "Người gác cổng" - Tự động thêm token vào mỗi request gửi đi
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor 2: "Bác sĩ" - Xử lý khi có lỗi trả về, đặc biệt là lỗi 401
apiClient.interceptors.response.use(
  (response) => {
    // Trả về response nếu không có lỗi
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Chỉ xử lý lỗi 401 (Unauthenticated) và request này chưa được thử lại
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu là đã thử lại 1 lần để tránh lặp vô hạn

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // Nếu không có refresh token, không thể làm gì hơn -> logout
          // Chỗ này bạn có thể gọi hàm logout từ AuthContext nếu cần
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Gọi API để lấy cặp token mới
        const rs = await refreshTokenService({ token: refreshToken });

        if (rs.success) {
          const { accessToken, refreshToken: newRefreshToken } = rs.data;

          // Lưu lại token mới
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Cập nhật lại header cho apiClient và request gốc
          apiClient.defaults.headers.common["Authorization"] =
            "Bearer " + accessToken;
          originalRequest.headers["Authorization"] = "Bearer " + accessToken;

          // Gọi lại request ban đầu đã bị lỗi với token mới
          return apiClient(originalRequest);
        } else {
          // Nếu refresh token cũng thất bại (hết hạn, không hợp lệ) -> logout
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (_error) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(_error);
      }
    }

    // Với các lỗi khác (403, 500, ...) thì trả về lỗi đó
    return Promise.reject(error);
  }
);

export default apiClient;
