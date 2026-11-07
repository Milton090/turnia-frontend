import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useNotificationStore } from "src/stores/notification";
import { api } from "src/boot/axios";

const router = useRouter();

export const useLoginStore = defineStore("login", {
  state: () => ({
    auth: false,
    user: "",
    rol: "",
    token: "",
    id_user: "",
    loading: false,
    showMainModal: false,
    isAdmin: false,
  }),

  persist: false,

  actions: {
    async setLogin(data) {
      const notification = useNotificationStore();
      this.loading = true;
      this.showMainModal = false;

      try {
        const response = await axios.post(
          `${process.env.API_URL}/api/Authentication/authenticate`,
          data
        );

        if (response.status == 200) {
          sessionStorage.setItem("autenticado", true);
          sessionStorage.setItem("token", response.data.access_token);
          sessionStorage.setItem("token_expires", response.data.expires);
          sessionStorage.setItem("refresh_token", response.data.refresh_token);
          this.loading = false;

          notification.setActivateNotification(
            "success",
            "¡Bienvenido!",
            "Inicio de sesión exitoso"
          );

          const roles = await api.get(`/api/Authentication/getauthenticateduserroles`);
          this.router.push(roles.data.includes("Administrador") ? "/configuration/users" : "/queuescreen");
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);

        let errorMessage = "Error al iniciar sesión";
        if (e.response && e.response.data && e.response.data.mensaje) {
          errorMessage = e.response.data.mensaje;
        } else if (e.message) {
          errorMessage = e.message;
        }

        notification.setActivateNotification(
          "error",
          "Error",
          "Verifique sus credenciales"
        );
      }
    },

    async setLogout() {
      const notification = useNotificationStore();
      sessionStorage.removeItem("autenticado");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("token_expires");
      sessionStorage.removeItem("refresh_token");
      this.id_user = "";
      this.user = "";
      this.rol = "";
      this.token = "";


      notification.setActivateNotification(
        "info",
        "Sesión cerrada",
        "Cerró sesión correctamente"
      );

      this.router.push("/");
    },
  },

  getters: {},
});
