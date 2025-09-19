import axios from "axios";
import { getTokenFromLocalStorage } from "../utils/getUser";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // if (
  //   user &&
  //   config.method &&
  //   ["post", "put", "patch"].includes(config.method)
  // ) {
  //   if (typeof config.data === "object" && config.data !== null) {
  //     config.data = { ...config.data, user };
  //   }
  // }

  // if (user && config.method === "get") {
  //   config.params = { ...(config.params || {}), ...user };
  // }
  // console.log(user);
  return config;
});

export default api;
