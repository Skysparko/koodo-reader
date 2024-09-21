import axios from 'axios';
import { Cookies } from 'react-cookie';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const cookies = new Cookies()

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      // Remove the token
      cookies.remove("token");
      // Redirect to the home page
      window.location.href = "/"
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
