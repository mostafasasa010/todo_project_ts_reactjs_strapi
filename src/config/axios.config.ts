import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://todo-strapi-new.onrender.com/api",
});

export default axiosInstance;
