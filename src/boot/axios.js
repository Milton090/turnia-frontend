import { boot } from "quasar/wrappers";
import axios from "axios";
import { useRouter } from "vue-router";
import { useNotificationStore } from "src/stores/notification";


const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },

  timeout: 1000000,
});


const notification = useNotificationStore();
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const router = useRouter();

api.interceptors.request.use(
  (config) => {
    if (config.url === `${process.env.API_URL}/login`) {

      return config;
    }

    const token = sessionStorage.getItem("token");
    const expires = sessionStorage.getItem("token_expires");
    const refresh = sessionStorage.getItem("refresh_token");

    if (token && expires && refresh) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  (error) => Promise.reject(error)

);


api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    const refreshToken = sessionStorage.getItem("refresh_token");
    const token = sessionStorage.getItem("token");
    if (error.response.status === 400 || error.response.status === 404) {
      notification.setActivateNotification(
        "error",
        "Error",
        "Ocurrió un error"
      );
    }


    if (
      error.response &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      if (!refreshToken) {
        await router.push({ name: "login" });
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.API_URL}/api/authentication/refreshtoken`,
          {
            access_token: token,
            refresh_token: refreshToken,
          }
        );

        const newToken = response.data.access_token;
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("token_expires", response.data.expires);
        sessionStorage.setItem("refresh_token", response.data.refresh_token);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await router.push({ name: "login" });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);

  }
)

export default boot(({ app }) => {

  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;
});

export { api };
