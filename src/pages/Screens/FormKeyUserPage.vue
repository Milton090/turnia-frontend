<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <div class="form-key">
          <h2>Ingrese la clave de la pantalla para activarla</h2>
          <q-input
            type="text"
            outlined
            label="Clave"
            v-model="viewerScreenKey"
          ></q-input>
          <div class="btn-submit q-mt-md d-flex justify-end">
            <q-btn
              :label="loading ? 'Espere' : 'ACTIVAR'"
              color="primary"
              style="width: 100%"
              :disable="loading"
              @click="sendViewerScreenKey()"
            >
              <q-spinner
                color="white"
                size="25px"
                :thickness="2"
                v-if="loading"
              />
              <q-icon class="q-ml-sm" name="mdi-send-outline" v-else></q-icon>
            </q-btn>

            <div class="alert-msj" v-if="errorAlert">
              <p>
                <q-icon name="mdi-alert-circle-outline" size="18px"></q-icon>
                La clave es incorrecta, intente de nuevo
              </p>
            </div>
            <div class="success-msj" v-if="successAlert">
              <p>
                <q-icon name="mdi-check-circle-outline" size="18px"></q-icon>
                Listo, la clave se guardó correctamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const viewerScreenKey = ref("");
const loading = ref(false);
const errorAlert = ref(false);
const successAlert = ref(false);

const sendViewerScreenKey = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      `/devices/ViewerScreen/validate?ScreenKey=${viewerScreenKey.value}`
    );
    if (response.status == 200) {
      successAlert.value = true;
      localStorage.setItem("Turnia-ViewerScreenKey", viewerScreenKey.value);
      setTimeout(() => {
        localStorage.setItem("Turnia-ViewerScreenKey", viewerScreenKey.value);
        router.push({ path: "/queueviewerscreen" });
        loading.value = false;
      }, 3000);
    }
  } catch (e) {
    if (e.response.status == 401) {
      console.log("error");
      errorAlert.value = true;
      loading.value = false;
      setTimeout(() => {
        errorAlert.value = false;
      }, 5000);
    }
  }
};
</script>

<style lang="scss">
.form-key {
  width: 700px;
  margin: auto;

  h2 {
    font-size: 28px;
  }

  .btn-submit {
    width: 100%;
  }

  .alert-msj,
  .success-msj {
    width: 100%;
    height: 50px;
    text-align: center;
    border-radius: 8px;
    margin-top: 10px;
    padding-top: 15px;
    color: white;
  }

  .alert-msj {
    background-color: rgb(237, 58, 58);
  }

  .success-msj {
    background-color: rgb(46, 176, 111);
  }
}
</style>
