import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://proud-captain-d5ba775f78.strapiapp.com/api",
  // baseURL: "https://mostafa-todo-project-ts-reactjs-strapi.onrender.com/api",
  timeout: 1000,
});

export default axiosInstance;
