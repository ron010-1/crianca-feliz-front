import axios, { AxiosError, HttpStatusCode, type AxiosResponse } from "axios";
import { authConstants } from "../constants/auth.constants";

export const provider = axios.create({
  baseURL: authConstants.BASE_URL,
});

provider.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.status === HttpStatusCode.Unauthorized) {
      localStorage.removeItem(authConstants.NAME_TOKEN_IN_STORAGE);
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);
