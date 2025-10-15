// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Khởi tạo user là null, và thêm state `loading` để tránh lỗi khi đang kiểm tra
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. useEffect này sẽ chạy MỘT LẦN DUY NHẤT khi app khởi động
  useEffect(() => {
    try {
      // Lấy token từ localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        // Nếu có token, giải mã nó
        const decodedUser = jwtDecode(accessToken);

        // Kiểm tra token có hết hạn không (iat: issued at, exp: expired at)
        // exp được tính bằng giây, Date.now() là mili giây
        if (decodedUser.exp * 1000 > Date.now()) {
          const roles = decodedUser.scope ? decodedUser.scope.split(" ") : [];
          setUser({ username: decodedUser.sub, roles });
        } else {
          // Nếu token hết hạn, xóa nó đi
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    } catch (error) {
      // Nếu token không hợp lệ, xóa nó đi
      console.error("Invalid token found in localStorage", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      // Dù kết quả thế nào, cũng phải dừng loading để ứng dụng tiếp tục
      setLoading(false);
    }
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy 1 lần

  // 3. Hàm loginAction: Thiết lập trạng thái và lưu token
  const loginAction = (data) => {
    const { accessToken, refreshToken } = data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const decodedUser = jwtDecode(accessToken);
    const roles = decodedUser.scope ? decodedUser.scope.split(" ") : [];
    setUser({ username: decodedUser.sub, roles });
  };

  // 4. Hàm logOut: Dọn dẹp SẠCH SẼ cả state và localStorage
  const logOut = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const value = {
    user,
    loading, // Cung cấp trạng thái loading ra ngoài
    loginAction,
    logOut,
  };

  // Chỉ render children khi đã kiểm tra xong, tránh các lỗi về race condition
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
