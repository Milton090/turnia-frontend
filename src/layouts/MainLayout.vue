<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="background-color: #f4faf9">
      <q-toolbar class="header q-mt-md">
        <q-btn
          flat
          dense
          round
          color="primary"
          @click="toggleLeftDrawer()"
          icon="menu"
          aria-label="Menú"
        />
        <q-toolbar-title>
          <img
            src="../assets/img/turnia-logo.svg"
            alt="Turnia"
            width="110"
            style="margin-top: 11px"
          />
        </q-toolbar-title>
        <ModalAssignCounter />
        <TicketActions
          :ticket="{
            statusCallTicket: ticket.statusCallTicket,
            unAttendedTicketsPerCounter: ticket.unAttendedTicketsPerCounter,
          }"
          :counter="queue.counter"
          @callNextTicket="callNextTicket"
          @startNextTicket="startNextTicket"
          @completeTicket="completeTicket"
          @showNoShowModal="modal_noshow = true"
        />

        <modal-no-show
          :modal="modal_noshow"
          @close="closeModalNoShow"
          @create="callNoShowTicket"
        ></modal-no-show>

        <modal-error
          :modal="modal_error"
          :text="textError"
          @close="closeModalError"
        ></modal-error>

        <q-space />
        <p style="font-size: 18px; margin: 0px" class="text-primary">
          {{ queue.userProfile.firstName }}
        </p>
        <q-btn class="q-ml-sm" color="primary" icon="mdi-account" flat round>
          <q-menu
            transition-show="flip-right"
            transition-hide="flip-left"
            style="width: 320px"
          >
            <q-list style="min-width: 300px" class="q-pa-md">
              <q-item>
                <q-item-section>
                  <div class="text-caption text-weight-bold q-mb-xs">
                    Seleccionar counter
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

                  <q-btn
                    :label="queue.assign ? 'DESASIGNAR' : 'ASIGNAR'"
                    :color="queue.assign ? 'negative' : 'positive'"
                    class="full-width"
                    @click="assignCounter()"
                    v-if="queue.counter"
                  >
                    <q-tooltip
                      v-if="
                        !(
                          ticket.statusCallTicket === 'init' ||
                          ticket.statusCallTicket === 'counter'
                        )
                      "
                    >
                      No puede asignar ni desasignar mientras atiende un ticket
                    </q-tooltip>
                  </q-btn>

                  <div v-else class="text-caption text-grey q-mt-sm">
                    Primero seleccione un counter
                  </div>
                </q-item-section>
              </q-item>

              <q-separator class="q-my-md" />

              <q-item clickable>
                <q-item-section>
                  <q-btn
                    flat
                    label="Cambiar contraseña"
                    color="primary"
                    @click="modalChange = true"
                  />
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section>
                  <q-btn
                    flat
                    label="Cerrar sesión"
                    color="negative"
                    icon-right="mdi-logout"
                    class="full-width"
                    @click="login.setLogout()"
                  ></q-btn>
                </q-item-section>
              </q-item>

            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <div class="row q-mt-sm">
        <div class="col-12 text-center">
          <img src="../assets/img/turnia-logo-white.svg" alt="Turnia" width="120" />
        </div>
      </div>
      <q-list>
        <q-item
          to="/queuescreen"
          active-class="q-item-no-link-highlighting"
          v-if="rolUser"
        >
          <q-item-section avatar>
            <q-icon name="mdi-room-service-outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Llamar</q-item-label>
          </q-item-section>
        </q-item>
        <q-expansion-item icon="mdi-cog" label="Configuración" v-if="rolAdmin">
          <q-list class="q-pl-lg">
            <q-item
              to="/configuration/queueviewerscreen"
              active-class="q-item-no-link-highlighting"
              v-if="rolAdmin"
            >
              <q-item-section avatar>
                <q-icon name="mdi-television" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Pantalla (TV)</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              to="/configuration/services"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="mdi-account-cog" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Servicios</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              to="/configuration/counters"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="mdi-face-agent" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Counters</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              to="/configuration/users"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="mdi-account" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Usuarios</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <q-dialog v-model="modal_confirm">
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section class="bg-primary text-white flex justify-between">
          <div class="text-h6">CONFIRMAR</div>
          <q-btn
            flat
            round
            icon="mdi-close"
            color="white"
            @click="cancelAssignUnnasign()"
          />
        </q-card-section>

        <q-separator />

        <q-card-section
          style="max-height: 80vh"
          class="scroll bg-white text-black"
        >
          <div class="row">
            <div class="col-12">
              <h5 style="margin: 0px; text-align: center">
                {{ title }} <br />
                <span class="text-primary" style="font-weight: bold"> </span>
              </h5>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-white q-px-md q-py-md">
          <q-btn
            flat
            label="No"
            color="negative"
            @click="cancelAssignUnnasign()"
          />
          <q-btn
            class="q-ml-md"
            label="SÍ"
            @click="unnasingDataCounter()"
            color="positive"
            icon-right="mdi-check"
            v-if="queue.assign"
          ></q-btn>
          <q-btn
            class="q-ml-md"
            label="SÍ"
            @click="asingDataCounter()"
            color="positive"
            icon-right="mdi-check"
            v-else
          ></q-btn>
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
  </q-layout>

  <ModalChangePassword
    :changeModal="modalChange"
    @success="closeModalChange()"
    @close="closeModalChange"
  ></ModalChangePassword>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useLoginStore } from "src/stores/login";
import { useQueueStore } from "src/stores/queue-store";
import { useTicketsStore } from "src/stores/tickets-store";
import { useNotificationStore } from "src/stores/notification";
import { api } from "src/boot/axios";

import TicketActions from "../components/queueScreen/ModalTicketActions.vue";
import modalNoShow from "../components/queueScreen/ModalNoShow.vue";
import modalError from "../components/queueScreen/ModalError.vue";
import ModalAssignCounter from "src/components/queueScreen/ModalAssignCounter.vue";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import ModalChangePassword from '../components/users/ModalChangePassword.vue';

const leftDrawerOpen = ref(false);
const login = useLoginStore();
const queue = useQueueStore();

const ticket = useTicketsStore();
const notification = useNotificationStore();

let roles = ref([]);
const rolUser = ref(false);
const rolAdmin = ref(false);

const modal_noshow = ref(false);
const modal_error = ref(false);
const textError = ref("");

const modal_confirm = ref(false);
const modal_success = ref(false);
const textSuccess = ref("");
const title = ref("");

const connectionTt = ref(null);
const modalChange = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

onMounted(async () => {
  await getRoles();
  await queue.getUserProfile();

  ticket.getTodaysTickets();
  queue.getCountersActive();

  signalRSetup();
});


const closeModalChange = () => {
  modalChange.value = false;
};

const getRoles = async () => {
  try {
    const response = await api.get(
      `/api/Authentication/getauthenticateduserroles`
    );
    if (response.status == 200) {
      roles.value = response.data;
      let rolU = roles.value.filter((rol) => rol === "Trabajador");
      let rolA = roles.value.filter((rol) => rol === "Administrador");

      rolUser.value = rolU.length > 0 ? true : false;
      rolAdmin.value = rolA.length > 0 ? true : false;

      if (rolAdmin.value) login.isAdmin = true;
      else login.isAdmin = false;
    }
  } catch (e) {
    console.log(e);
  }
};

function signalRSetup() {
  connectionTt.value = new HubConnectionBuilder()
    .withUrl(`${process.env.API_URL}/signalr/turnia`, {
      withCredentials: false,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        return Math.random() * 10000;
      },
    })
    .configureLogging(LogLevel.Debug)
    .build();
  connectionTt.value
    .start()
    .then(() => {
      console.log("signalr connected ticket");
    })
    .catch((e) => console.log("error", e));

  callNext();
  startTicket();
  stopAttendingTicket();
  noShowTicket();
  ticketCreated();
}

async function callNext() {
  connectionTt.value.on("CallingTicket", async (id, ticketNumber) => {

    await ticket.getTodaysTickets();
    await queue.getUserProfile();
  });
}

async function startTicket() {
  connectionTt.value.on(
    "StopCallingTicket",
    async (id, ticketNumber) => {

      await ticket.getTodaysTickets();
      await queue.getUserProfile();
    }
  );
}

async function stopAttendingTicket() {
  connectionTt.value.on(
    "StopAttendingTicket",
    async (id, ticketNumber) => {
      await queue.getUserProfile();
    }
  );
}

async function noShowTicket() {
  connectionTt.value.on("NoShowTicket", async () => {
    await queue.getUserProfile();
  });
}


function ticketCreated() {
  connectionTt.value.on(
    "TicketCreated",
    () => {
      console.log("Ticket Event Triggered");
      ticket.getTodaysTickets();
    }
  );
}

async function callNextTicket() {
  let callNextBtn = document.getElementById("callNextTicketBtn");
  callNextBtn.disabled = true;

  if (ticket.unattendedTickets.length > 0) {
    try {
      await api.post("queue/tickets/callnext", {});
    } catch (error) {
      console.error("Error calling next ticket from the API:", error);

      if (error.response.data == "No hay tickets pendientes por llamar") {
        notification.setActivateNotification(
          "info",
          "Error",
          "No hay tickets pendientes por llamar"
        );
      } else {
        notification.setActivateNotification(
          "error",
          "Error",
          typeof error.response?.data === "string" && error.response.data
            ? error.response.data
            : "Ocurrió un error. Intente de nuevo."
        );
      }
    }
  } else {
    textError.value = "No hay tickets en espera, por favor espere";
    modal_error.value = true;
  }

  callNextBtn.disabled = false;
}

async function startNextTicket() {
  let startBtn = document.getElementById("startTicketBtn");
  startBtn.disabled = true;

  try {
    await api.post("queue/tickets/startnext", {});
  } catch (error) {
    console.error("Error starting next ticket from the API:", error);
    notification.setActivateNotification(
      "error",
      "Error",
      "Ocurrió un error. Intente de nuevo."
    );
  }

  startBtn.disabled = false;
}

async function completeTicket() {
  let completeBtn = document.getElementById("completeTicketBtn");
  completeBtn.disabled = true;

  try {
    await api.post(
      "queue/tickets/completeticket",
      {},
      { timeout: 1000 }
    );
  } catch (error) {
    console.error("Error completing next ticket from the API:", error);
    notification.setActivateNotification(
      "error",
      "Error",
      "Ocurrió un error. Intente de nuevo."
    );
  }

  completeBtn.disabled = false;
}

const assignCounter = () => {
  const result = queue.assignCounter();

  if (result) {
    title.value = queue.assign
      ? "¿Está seguro de desasignar este counter?"
      : "¿Está seguro de asignar este counter?";
    modal_confirm.value = true;
  } else {
    textError.value =
      "No puede realizar esta acción mientras tenga un ticket en proceso, intente más tarde";
    modal_error.value = true;
  }
};

const asingDataCounter = async () => {
  try {
    const response = await queue.asingDataCounter();
    if (response) {
      closeModal();
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

const unnasingDataCounter = async () => {
  try {
    const response = await api.post(`/queue/counters/unassign`);
    if (response.status == 200) {
      closeModal();
      queue.getUserProfile();
      queue.getCountersActive();
      textSuccess.value = response.data;
      modal_success.value = true;
      setTimeout(() => {
        modal_success.value = false;
        textSuccess.value = "";
      }, 3000);
      ticket.getTodaysTickets();
    }
  } catch (e) {
    console.log(e);
  }
};

const callNoShowTicket = async () => {
  let noShowBtn = document.getElementById("noShowBtn");
  let confirmNoShowBtn = document.getElementById("confirmNoShowBtn");
  noShowBtn.disabled = true;
  confirmNoShowBtn.disabled = true;
  try {
    const response = await api.post(
      "/queue/tickets/noshow",
      {},
      { timeout: 5000 }
    );
    if (response.status == 200 || response.status == 201) {
      modal_noshow.value = false;
    }
  } catch (e) {
    console.log(e);

    notification.setActivateNotification(
      "error",
      "Error",
      "Ocurrió un error. Intente de nuevo."
    );
  }

  noShowBtn.disabled = false;
  confirmNoShowBtn.disabled = false;
};

const closeModal = () => {
  queue.counter = null;
  queue.assign = false;
  modal_confirm.value = false;
};

const cancelAssignUnnasign = () => {
  modal_confirm.value = false;
};

const setModelCounter = (counterId) => {
  queue.assign = counterId === queue.userProfile.counterId ? true : false;
};

const closeModalNoShow = () => (modal_noshow.value = false);
const closeModalError = () => {
  textError.value = "";
  modal_error.value = false;
};
</script>

<style>
.header {
  margin-bottom: 17px;
}
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.25);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1);
  }
  55% {
    transform: scale(1.25);
  }
  70% {
    transform: scale(1);
  }
}
</style>
