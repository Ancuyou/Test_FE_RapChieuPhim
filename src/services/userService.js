import apiClient from "./apiClient";

const handleApiResponse = (response) => ({
  success: true,
  data: response.data.data,
  message: response.data.message,
});
const handleError = (error) => ({
  success: false,
  message: error.response?.data?.message || "Lỗi kết nối server",
});

class UserService {
  // Lấy danh sách tất cả người dùng
  async getAllUsers() {
    try {
      const response = await apiClient.get("/users");
      return handleApiResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Lấy chi tiết người dùng theo ID
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Tạo người dùng mới
  async createUser(userData) {
    try {
      const response = await apiClient.post("/users", userData);
      return handleApiResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Cập nhật thông tin người dùng
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return handleApiResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Xóa người dùng
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
}

export default new UserService();
