import axios from "axios";
import queryClient from "./queryClient";
import { UNAUTHORIZED } from "../constants/http.mts";
import { navigate } from "../lib/navigation";
import store from "../store/store";
import { clearUser } from "../store/features/userSlice";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const dispatchClearUser = () => {
  store.dispatch(clearUser());
};

// create a separate client for refreshing the access token
// to avoid infinite loops with the error interceptor
const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

// Add request interceptor to handle offline scenarios
API.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      return Promise.reject({ status: 'OFFLINE', message: 'No internet connection' });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Check if the error is due to being offline
    if (!navigator.onLine) {
      return Promise.reject({ status: 'OFFLINE', message: 'No internet connection' });
    }

    const { config, response } = error;
    const { status, data } = response || {};

    // try to refresh the access token behind the scenes
    if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccessToken") {
      try {
        // refresh the access token, then retry the original request
        await TokenRefreshClient.get("/auth/refresh");
        return TokenRefreshClient(config);
      } catch (error) {
        // handle refresh errors by clearing the query cache & redirecting to login
        queryClient.clear();
        dispatchClearUser();
        // @ts-ignore
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname,
          },
        });
      }
    }

    return Promise.reject({ status, ...data });
  }
);

export default API;