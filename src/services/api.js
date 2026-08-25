import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - clearing session");
      localStorage.removeItem("token");
    }

    console.error(
      "API ERROR:",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export const apiRequest = async (
  url,
  method = "GET",
  data = null
) => {
  const response = await API({
    url,
    method,
    data,
  });

  return response.data;
};

/* ========================= */
/* INVENTORY API */
/* ========================= */

export const getAssets = () => {
  return apiRequest("/inventory", "GET");
};

export const resetAssets = () => {
  return apiRequest("/inventory/reset", "POST");
};

export default API;