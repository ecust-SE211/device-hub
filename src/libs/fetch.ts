import { commonResponse } from "./type";
import axios, { AxiosRequestConfig } from "axios";
const customAxios = axios.create({
  baseURL: "http://localhost:8088",
});

function isTokenExpired() {
  const expirationTime = localStorage.getItem("expirationTime");
  if (!expirationTime) {
    return true; // 如果没有设置过期时间，认为 token 已过期
  }
  const currentTime = new Date().getTime();
  return currentTime > parseInt(expirationTime, 10);
}

axios.interceptors.request.use(
  (config) => {
    if (isTokenExpired()) {
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

customAxios.interceptors.request.use(
  (config) => {
    if (isTokenExpired()) {
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<commonResponse<T>> {
  return customAxios.get(url, config);
}

export async function post<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<commonResponse<T>> {
  return customAxios.post(url, data, config);
}

export { customAxios };
