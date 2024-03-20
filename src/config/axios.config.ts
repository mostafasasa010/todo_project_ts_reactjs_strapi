import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  // baseURL: "https://mostafa-todo-project-ts-reactjs-strapi.onrender.com/api",
  timeout: 1000,
});

export default axiosInstance;
