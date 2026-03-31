import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("Usuário não autenticado");
    }

    return Promise.reject(error);
  },
);
