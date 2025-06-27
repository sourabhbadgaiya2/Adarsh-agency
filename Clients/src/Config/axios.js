import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  // baseURL: `${import.meta.env.VITE_API}/api`,
  withCredentials: "true",
});
export default axiosInstance;
