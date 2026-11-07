<template>
  <q-page class="q-pa-sm">
    <q-dialog v-model="modal_success">
      <q-card style="width: 500px; max-width: 90vw">
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


    <div class="row q-col-gutter-sm q-py-sm">
      <tab-ticket :profile="queue.userProfile" />

      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
        <div class="row ">
          <card-with-image
            :ticketAttending="ticket.ticketAttending"
            :ticketCalling="ticket.callingTicket"
            :calling="ticket.ticketCall"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTicketsStore } from "src/stores/tickets-store";
import { useNotificationStore } from "src/stores/notification";
import { useQueueStore } from "src/stores/queue-store";


import TabTicket from "../components/tabs/TabTicket.vue";
import CardWithImage from "../components/cards/CardWithImage.vue";


const ticket = useTicketsStore();
const notification = useNotificationStore();
const queue = useQueueStore();
const mode = ref("list");
const messages = ref([]);
const counter = ref("");

const userProfile = ref({});
const assign = ref(false);

const modal_confirm = ref(false);
const modal_success = ref(false);
const textSuccess = ref("");
const title = ref("");

const modal_noshow = ref(false);

const modal_error = ref(false);
const textError = ref("");

const callingTicket = ref("");
const ticketCall = ref(false);

onMounted(() => {
  ticket.getTodaysTickets();

});


</script>
<style lang="scss">
.container-button {
  width: 100%;
  height: 80px;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.actions-btns-disabled {
  background-color: gray !important;
  opacity: 1 !important;
  cursor: not-allowed;
  color: white !important;
}

.big-tooltip {
  font-size: 14px;
}
</style>
