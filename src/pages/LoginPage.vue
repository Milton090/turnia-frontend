<template>
  <q-page>
    <div class="row container-login">
      <div class="card-form">
        <img
          src="~assets/img/turnia-logo.svg"
          alt=""
          width="170"
          class="q-mt-lg q-mb-md"
        />
        <div class="row q-mt-sm">
          <div class="col-12 q-mt-md">
            <q-input
              class="q-mb-sm"
              label="Usuario"
              v-model="modelUser.username"
              :rules="usernameRules"
              lazy-rules
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>
            <q-input
              ref="passwordInput"
              label="Contraseña"
              type="password"
              class="q-mt-sm"
              v-model="modelUser.password"
              :rules="passwordRules"
              lazy-rules
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
            </q-input>
            <q-btn
              @click="dataSubmit()"
              glossy
              color="primary"
              class="full-width q-mt-xl"
              :disable="login.loading || !formValid"
            >
              <span v-if="login.loading">ESPERE</span>
              <span v-else>INGRESAR</span>

              <q-circular-progress
                indeterminate
                rounded
                size="18px"
                color="white"
                v-if="login.loading"
                class="q-ml-md"
              />
              <q-icon name="mdi-login" class="q-ml-sm" v-else></q-icon>
            </q-btn>

          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useLoginStore } from "../stores/login";
import { useQuasar } from "quasar";

const $q = useQuasar();
const login = useLoginStore();


let modelUser = reactive({
  username: "",
  password: "",
});


const passwordInput = ref(null);

onMounted(() => {
  const username = sessionStorage.getItem("prefillUsername");

  if (username) {
    modelUser.username = username;
    sessionStorage.removeItem("prefillUsername");

    setTimeout(() => {
      passwordInput.value?.focus();
    }, 100);
  }
});

const usernameRules = [
  (val) => !!val || "El usuario es obligatorio",
  (val) => val.length > 5 || "El usuario debe tener más de 5 caracteres",
  (val) => val.includes("@") || "El usuario debe contener el símbolo @",
];

const passwordRules = [
  (val) => !!val || "La contraseña es obligatoria",
  (val) => val.length > 5 || "La contraseña debe tener más de 5 caracteres",
];

const formValid = computed(() => {
  return (
    modelUser.username &&
    modelUser.username.length > 5 &&
    modelUser.username.includes("@") &&
    modelUser.password &&
    modelUser.password.length > 5
  );
});

function dataSubmit() {
  if (!formValid.value) {
    $q.notify({
      type: "negative",
      message: "Corrija los errores antes de continuar",
    });
    return;
  }

  login.setLogin(modelUser);
}
</script>

<style lang="scss">
.container-login {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  .card-form {
    width: 380px;
    height: 420px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    box-shadow: inset 0px 0px 12px 0px #898989;
  }
}
</style>
