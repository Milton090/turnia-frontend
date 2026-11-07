<template>
  <q-dialog
    v-model="login.showMainModal"
    persistent
    no-esc-dismiss
    no-backdrop-dismiss
  >
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="bg-primary text-white flex justify-between">
        <div class="text-h6">Seleccionar counter</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="bg-white text-black">
        <div class="text-caption text-weight-bold q-mb-xs">
          Seleccione su counter
        </div>
        <q-select
          outlined
          dense
          :options="queue.countersActives"
          option-value="id"
          option-label="name"
          v-model="queue.counter"
          emit-value
          map-options
          @update:model-value="setModelCounter(queue.counter)"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-account" color="primary" size="20px" />
          </template>
        </q-select>

        <q-btn v-if="queue.counter"
          label="ASIGNAR"
          color="positive"
          class="full-width q-mt-md"
          @click="assignCounter"
        />

        <q-btn v-if="login.isAdmin"
          label="Entrar sin counter"
          color="grey"
          class="full-width q-mt-md"
          @click="hideMainModal"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="modal_confirm"
    persistent
    no-esc-dismiss
    no-backdrop-dismiss
  >
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="bg-primary text-white flex justify-between">
        <div class="text-h6">Confirmar</div>
        <q-btn
          flat
          round
          icon="mdi-close"
          color="white"
          @click="cancelAssignUnnasign"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="bg-white text-black">
        <div class="text-center text-h6">
          ¿Está seguro de asignar este counter?
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-white q-px-md q-py-md">
        <q-btn 
          flat 
          label="No" 
          color="negative" 
          @click="cancelAssignUnnasign" 
        />
        <q-btn
          class="q-ml-md"
          label="Sí"
          color="positive"
          icon-right="mdi-check"
          @click="asingDataCounter"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>


  <q-dialog v-model="modal_success">
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section class="bg-primary text-white flex justify-between">
          <div class="text-h6">LISTO</div>
          <q-btn
            flat
            round
            icon="mdi-close"
            color="white"
            @click="modal_success = false"
          />
        </q-card-section>

        <q-separator />

        <q-card-section
          style="max-height: 80vh"
          class="scroll bg-white text-black"
        >
          <div class="row">
            <div class="col-12 text-center">
              <q-icon
                name="mdi-check-circle-outline"
                size="55px"
                color="positive"
              ></q-icon>
              <h5 style="margin: 0px; text-align: center">
                <span class="text-primary" style="font-weight: bold">
                  {{ textSuccess }}
                </span>
              </h5>
            </div>
          </div>
        </q-card-section>

        <q-separator />
      </q-card>
    </q-dialog>
</template>


<script setup>
import { onMounted, ref, nextTick } from "vue";
import { useQueueStore } from "src/stores/queue-store";
import { useLoginStore } from "src/stores/login";


const queue = useQueueStore();
const login = useLoginStore();

const modal_confirm = ref(false);
const textSuccess = ref("");
const modal_success = ref(false);


onMounted(() => {
  queue.getUserProfile();
});


const assignCounter = () => {
  queue.assignCounter();
  modal_confirm.value = true;
};


const hideMainModal = () => {
  login.showMainModal = false;
}


const asingDataCounter = async () => {
  try {
    const response = await queue.asingDataCounter();
    if (response) {
      closeModal();
      login.showMainModal = false;

      await nextTick();

      textSuccess.value = response;
      modal_success.value = true;
      setTimeout(() => {
        modal_success.value = false;
        textSuccess.value = "";
      }, 3000);
    }
  } catch (e) {
    console.log(e);
  }
};


const setModelCounter = (counterId) => {
  queue.assign = counterId === queue.userProfile.counterId ? true : false;
};


const closeModal = () => {
  queue.counter = null;
  queue.assign = false;
  modal_confirm.value = false;
};

const cancelAssignUnnasign = () => {
  modal_confirm.value = false;
};


</script>