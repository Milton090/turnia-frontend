<template>
  <q-page>
    <queu-message
      :connected="isConnected"
      :status="connectionState"
    ></queu-message>

    <audio id="audio" muted preload="auto">
      <source type="audio/mp3" src="../../assets/audio/Chime.mp3" />
    </audio>

    <poup-viewer-call-screen
      :modal="modal_viewer"
      :data="datos"
      :now_atending="titleNowAtending"
      :please="titlePlease"
      :ui="customizationCss"
    ></poup-viewer-call-screen>

    <div class="contenedor">
      <div class="row justify-center">
        <div :class="viewNormal">
          <div
            class="attending"
            :style="`background-color:${customizationCss.checkinScreenBackgroundColor} !important`"
          >
            <div class="title bg-white flex center">
              <img
                v-if="urlImage"
                class="flex items-center"
                :src="urlImage"
                alt="Turnia"
                width="250"
                height="120"
              />
            </div>

            <div class="atendiendo" :style="{ '--num-columns': columna }">
              <template v-if="columna === 1">
                <div
                  class="ticket-counter"
                  :class="{ 'ticket-full': viewFull }"
                  v-for="(allTicket, index) in visibleTickets"
                  :key="index"
                >
                  <div class="counter" :class="{ 'counter-full': viewFull }">
                    <span
                      :style="`color:${customizationCss.checkinLabelTextColor}`"
                    >
                      <b>{{ allTicket.counter?.name }}</b>
                    </span>
                  </div>
                  <div
                    class="ticket"
                    :class="{ 'ticketNumber-full': viewFull }"
                  >
                    <span
                      :style="{ color: customizationCss.checkinPrimaryColor }"
                    >
                      <b>{{ allTicket.ticketNumber }}</b>
                    </span>
                  </div>
                </div>
              </template>

              <template v-else>
                <div
                  class="ticket-card"
                  v-for="(allTicket, index) in visibleTickets"
                  :key="index"
                >
                  <div class="ticket-card-counter">
                    <span
                      :style="`color:${customizationCss.checkinLabelTextColor}`"
                    >
                      <b>{{ allTicket.counter?.name }}</b>
                    </span>
                  </div>
                  <div class="ticket-card-number">
                    <span
                      :style="{ color: customizationCss.checkinPrimaryColor }"
                    >
                      <b>{{ allTicket.ticketNumber }}</b>
                    </span>
                  </div>
                </div>
              </template>
            </div>

            <div class="conectado_view" v-if="viewFull">
              <div
                :class="{ connected: isConnected, disconnected: !isConnected }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import {
  onMounted,
  ref,
  computed,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
import { useQueueStore } from "src/stores/queue-store";
import { storeToRefs } from "pinia";
import logo from "src/assets/img/turnia-logo.svg";

const q = useQueueStore();
const { customizationCss } = storeToRefs(q);

const router = useRouter();

import PoupViewerCallScreen from "../../components/Screens/PoupViewerCallScreen.vue";
import queuMessage from "../../components/queu-message.vue";

import { useSignalR } from "../../composables/useSignalR";

const columna = ref();

const PAGE_SIZE = 12;
const INTERVAL_SECONDS = 3;

const currentPage = ref(0);
let intervalId = null;

const visibleTickets = computed(() => {
  const start = currentPage.value * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return q.attendingTickets.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(q.attendingTickets.length / PAGE_SIZE)
);

function startAutoScroll() {
  if (totalPages.value <= 1) return;
  intervalId = setInterval(() => {
    currentPage.value = (currentPage.value + 1) % totalPages.value;
  }, INTERVAL_SECONDS * 1000);
}

const { isConnected, connection, connectionState } = useSignalR(
  `${process.env.API_URL}/signalr/viewerscreen`,
  localStorage.getItem("Turnia-ViewerScreenKey")
);

const viewNormal = ref("col-12");
const viewFull = ref(true);

onMounted(async () => {
  let viewerScreenKey = localStorage.getItem("Turnia-ViewerScreenKey");

  if (viewerScreenKey) {
    getViewScreenValidate();
    await q.getTicketsForScreen();
    setPopupViewer();

    localStorage.removeItem("reconnection");
    localStorage.removeItem("reconnectionAttempts");

    startAutoScroll();
  } else {
    router.push("/queueviewer/formRegisterKey");
  }
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

const audio = ref("");

let datos = ref({});

let secondsPoup = ref(5);

const modal_viewer = ref(false);

const titleNowAtending = ref("Ahora Asistiendo");
const titlePlease = ref("Por Favor Proceda A:");

const urlImage = ref(logo);

const getViewScreenValidate = async () => {
  try {
    const response = await api.get(
      `/devices/ViewerScreen/validate?ScreenKey=${localStorage.getItem(
        "Turnia-ViewerScreenKey"
      )}`
    );
    if (response.status == 200) {
      columna.value = response.data.columnNumber;
    }
  } catch (e) {
    console.log(e);
  }
};

const setPopupViewer = async () => {
  var audioContext = new AudioContext();
  let time = secondsPoup.value * 1000;
  let item = 0;
  console.log("audiocontext status" + audioContext.state);
  setInterval(() => {
    audio.value = document.getElementById("audio");
    audio.value.muted = false;

    if (q.lengthCallingTickets > 0) {
      let x = audio.value.play();
      if (x !== undefined) {
        x.then((_) => {}).catch((error) => {});
      }

      if (item < q.lengthCallingTickets) {
        datos.value = q.callingTickets[item];
        modal_viewer.value = true;
        item++;
      } else {
        item = 0;
        datos.value = q.callingTickets[item];
        modal_viewer.value = true;
      }
      setTimeout(() => {
        modal_viewer.value = false;
      }, 3000);
    }
  }, time);
};
</script>

<style lang="scss">
#audio {
  display: none;
}

.contenedor {
  width: 100%;
  margin: 0px;
  padding: 0px;

  .attending {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    height: 100vh;

    &::-webkit-scrollbar {
      display: none;
    }

    overflow-y: scroll;

    .title {
      width: 100%;
      height: 150px;
      padding: 0px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top-left-radius: 0px;
      color: #fff;

      h4 {
        font-size: 35px;
        margin: 0;
      }
    }
    .atendiendo {
      width: 98%;
      margin: 20px auto;

      .ticket-counter {
        width: 98%;
        height: 90px;
        padding: 5px;
        box-sizing: border-box;
        background-color: #fff;
        margin: 10px auto;
        border-radius: 5px;
        box-shadow: 0px 0px 3px 0px #595959;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .counter,
        .ticket {
          font-size: 24px;
          max-width: 80%;
        }

        .ticketNumber-full,
        .counter-full {
          font-size: 75px !important;
        }
      }

      .ticket-full {
        width: 48% !important;
        padding-left: 25px !important;
        height: 130px;
      }
    }
  }
}

.conectado_view {
  width: 100%;
  padding: 3px;
  box-sizing: border-box;
  margin-top: -35px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: fixed;
  bottom: 10px;
  right: 10px;

  .connected {
    width: 10px;
    height: 10px;
    background-color: #48cd27;
    border-radius: 50%;
    margin-left: 7px;
  }

  .disconnected {
    width: 10px;
    height: 10px;
    background-color: #991616;
    border-radius: 50%;
    margin-left: 7px;
  }
}

.atendiendo {
  display: grid;
  grid-template-columns: repeat(var(--num-columns, 1), 1fr);
  gap: 20px;
}

.ticket-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  padding: 15px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
