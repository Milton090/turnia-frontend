<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="fit no-shadow" bordered>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab
          name="unAttendedTicketsPerCounter"
          :class="tab == 'unAttendedTicketsPerCounter' ? 'text-blue' : ''"
          icon="assignment_ind"
          label="Mis tickets"
        >
          <q-badge id="unAttendedTicketsPerCounterBadge" color="red" floating>{{
            tickets.unAttendedTicketsPerCounter.length
          }}</q-badge>
        </q-tab>
        <q-tab
          name="unattendedtickets"
          :class="tab == 'unattendedtickets' ? 'text-blue' : ''"
          icon="print"
          label="En cola"
        >
          <q-badge id="unattendedTicketsBadge" color="red" floating>{{
            tickets.unattendedTickets.length
          }}</q-badge>
        </q-tab>
        <q-tab
          name="alltickets"
          :class="tab == 'alltickets' ? 'text-blue' : ''"
          icon="history"
          label="Tickets de hoy"
        >
          <q-badge color="green" floating>{{ tickets.allTickets.length }}</q-badge>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel
          name="unAttendedTicketsPerCounter"
          class="q-pa-sm"
          v-if="tickets.unAttendedTicketsPerCounter.length > 0"
        >
          <q-list class="rounded-borders" separator>
            <q-item
              v-for="(ticket, index) of tickets.unAttendedTicketsPerCounter"
              :key="index"
              v-ripple
              :class="{ 'selected-item': ticket.selected }"
              style="position: relative"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img src="../../assets/img/square-xxl.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ ticket.ticketNumber }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ ticket.service.name }}</span>
                </q-item-label>
                <div class="waiting" style="position: absolute; right: 2px">
                  <q-icon name="mdi-clock-time-eight-outline"></q-icon> Espera:
                  {{ timeMinutes(ticket.ticketDate) }} min
                </div>
              </q-item-section>

            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="unAttendedTicketsPerCounter" v-else>
          <q-item class="cursorito">
            <p class="text-primary">{{ currentMessage }}</p>
          </q-item>
        </q-tab-panel>

        <q-tab-panel name="unattendedtickets" class="q-pa-sm">
          <q-list class="rounded-borders" separator>
            <q-item
              v-for="(ticket, index) of tickets.unattendedTickets"
              :key="index"
              v-ripple
              style="position: relative"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img src="../../assets/img/square-xxl.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ ticket.ticketNumber }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ ticket.service.name }}</span>
                </q-item-label>
                <div class="waiting" style="position: absolute; right: 2px">
                  <q-icon name="mdi-clock-time-eight-outline"></q-icon> Espera:
                  {{ timeMinutes(ticket.ticketDate) }} min
                </div>
              </q-item-section>

            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel
          name="alltickets"
          class="q-pa-sm"
          v-if="tickets.allTickets.length > 0"
        >
          <q-item v-for="ticket in tickets.allTickets" :key="ticket.id" v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="../../assets/img/square-xxl.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ ticket.ticketNumber }}</q-item-label>
              <q-item-label caption lines="1">{{ ticket.service.name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              {{ ticket.ticketNumber }}
            </q-item-section>
          </q-item>
        </q-tab-panel>

        <q-tab-panel name="alltickets" class="q-pa-sm" v-else>
          <q-item>
            <p>Aún no hay tickets</p>
          </q-item>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, computed } from "vue";

import { useTicketsStore } from "src/stores/tickets-store";
import { timeMinutes } from "src/filters";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const tickets = useTicketsStore();

const tab = ref("unAttendedTicketsPerCounter");
const connectionTt = ref(null);

const props = defineProps({
  profile: Object,
});

const { profile } = toRefs(props);

const messages = [
  "Este counter aún no tiene tickets pendientes",
  "Todo listo: ¡no hay tickets en cola!",
  "Todo está tranquilo por ahora...",
  "No hay tickets pendientes, respire profundo 😌",
  "Esperando a que llegue el siguiente ticket...",
  "La cola está vacía, buen momento para un café ☕",
];

const currentMessage = computed(() => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
});

onMounted(() => {
  signalRSetup();
});

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

  signalRSetupMessages();

  signalRefreshAttendingList();
}

function signalRSetupMessages() {
  connectionTt.value.on("CallingTicket", (ticketId, ticketNumber) => {
    console.log("next");
    tickets.getTodaysTickets();
  });
}


function signalRefreshAttendingList() {
  connectionTt.value.on("RefreshAttendingList", (temporaryReason) => {
    console.log(`refresh ${temporaryReason}`);
    tickets.getTodaysTickets();
  });
}
</script>
<style>
.q-focus-helper {
  opacity: 0 !important;
  cursor: default !important;
}
.q-ripple {
  opacity: 0 !important;
  cursor: default !important;
}
.q-tab {
  cursor: pointer !important;
}
</style>
