import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://proud-captain-d5ba775f78.strapiapp.com/api",
  // baseURL: "http://localhost:1337/api",
  baseURL: "https://todo-strapi-new.onrender.com/api",
  timeout: 1000,
});

export default axiosInstance;
