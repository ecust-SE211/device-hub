import { commonResponse } from "./type";
import axios, { AxiosRequestConfig } from "axios";
const customAxios = axios.create({
  baseURL: "http://localhost:8088",
});
customAxios.defaults.headers["Content-Type"] = "application/json";

customAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
