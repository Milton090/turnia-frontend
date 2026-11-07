<template>
  <q-dialog v-model="modal">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="bg-primary text-white flex justify-between">
        <div class="text-h6">{{ title }}</div>
        <q-btn
          flat
          round
          icon="mdi-close"
          color="white"
          @click="closeModal()"
        />
      </q-card-section>

      <q-separator />

      <q-card-section
        style="max-height: 80vh"
        class="scroll bg-white text-black"
      >
        <div class="row">
          <div class="col-12 q-px-sm">
            <q-input
              class="q-mt-sm"
              outlined
              type="text"
              label="Nombre"
              v-model="datos.firstName"
            >
              <template v-slot:append>
                <q-icon name="mdi-account" color="primary" />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-px-sm">
            <q-input
              class="q-mt-sm"
              outlined
              type="text"
              label="Apellido"
              v-model="datos.lastName"
            >
              <template v-slot:append>
                <q-icon name="mdi-account" color="primary" />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-px-sm">
            <q-input
              class="q-mt-sm"
              outlined
              type="text"
              label="Usuario (correo)"
              v-model="datos.userName"
              v-if="acc === 'add'"
            >
              <template v-slot:append>
                <q-icon name="mdi-account-box-outline" color="primary" />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-px-sm">
            <q-input
              :type="isPwd ? 'password' : 'text'"
              v-model="datos.password"
              outlined
              label=""
              class="q-mt-lg"
              v-if="acc === 'add'"
            >
              <template v-slot:label>
                <q-icon name="mdi-lock" color="primary" size="24px" />
                Contraseña
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                  color="primary"
                  size="24px"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-px-sm" v-if="acc === 'add'">
            <q-select
              class="q-mt-lg"
              outlined
              :options="data"
              option-value="name"
              option-label="name"
              emit-value
              map-options
              label="Rol"
              v-model="datos.userRole"
            >
              <template v-slot:label>
                <q-icon name="mdi-account-switch" color="primary" size="24px" />
                Rol
              </template>
            </q-select>
          </div>
          <div class="col-12 q-px-sm">
            <q-select
              class="q-mt-lg"
              outlined
              clearable
              :options="counters"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Counter asignado"
              v-model="datos.assignedCounterId"
            >
              <template v-slot:label>
                <q-icon name="mdi-face-agent" color="primary" size="24px" />
                Counter asignado
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="bg-white q-px-md q-py-md flex justify-evenly">
        <q-btn flat label="Cancelar" color="negative" @click="closeModal()" />
        <q-btn
          label="GUARDAR"
          color="primary"
          icon-right="mdi-content-save"
          @click="emit('save')"
          v-if="acc === 'add'"
        />
        <q-btn
          label="Actualizar"
          color="warning"
          icon-right="mdi-autorenew"
          @click="emit('update')"
          v-else
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  modal: Boolean,
  datos: Object,
  title: String,
  acc: String,
  data: Array,
  counters: Array,
});
const { modal, datos, title, acc, data, counters } = toRefs(props);

const emit = defineEmits(["close", "save", "update"]);
const isPwd = ref(true);
const closeModal = () => {
  emit("close");
};
</script>

<style lang="scss"></style>
