import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', 
  },
});

// REQUEST INTERCEPTOR (Can thiệp trước khi gửi request đi nếu cần)
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR (Can thiệp ngay khi nhận phản hồi từ Backend về)
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu có dữ liệu trả về từ server, bóc tách lấy thẳng phần data bên trong
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Bắt lỗi 401 Unauthorized toàn cục (Hết hạn phiên đăng nhập hoặc chưa đăng nhập)
    if (error.response && error.response.status === 401) {
      console.error("Phiên làm việc đã hết hạn hoặc bạn chưa đăng nhập.");
      
      // Kiểm tra nếu người dùng không phải đang ở sẵn trang login thì mới tự động chuyển hướng
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;