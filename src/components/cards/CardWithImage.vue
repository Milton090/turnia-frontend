<template>
  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
    <q-card class="my-card no-shadow" id="card-img" bordered>
      <q-img src="../../assets/img/card-background.png" basic>
        <div class="atencion">
          <div class="atendiendo" style="padding: 15px;" v-if="ticketAttending">

            <div class="bg-blue-grey-13">
              <p class="now-attending">ATENDIENDO</p>
              <p id="ticketCallingNumber">{{ ticketAttending.ticketNumber }}</p>
            </div>
          </div>

          <div class="atendiendo" style="padding: 15px;" v-if="calling">
            <div class="bg-blue-grey-13">
              <p class="now-calling">LLAMANDO</p>
              <p id="ticketCallingNumber">{{ ticketCalling }}</p>
            </div>
          </div>
        </div>
      </q-img>
    </q-card>
  </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  ticketAttending: Object,
  ticketCalling: String,
  calling: Boolean
});

const { ticketAttending, ticketCalling, calling } = toRefs(props);
</script>

<style lang="scss">
#card-img {
  display: flex !important;
  justify-content: center;

  .atencion {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background: transparent;
    align-items: center;

    .atendiendo {
      text-align: center;
      background-color: #ffffffdb !important;
      width: 400px;
      border-radius: 8px;

      .bg-blue-grey-13 {
        padding: 1px 20px;
        border-radius: 5px;
        margin-bottom: 10px;
        background: #c3b3e38a !important;
      }

      .now-attending,
      .now-calling {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
        color: $primary;
      }

      #ticketCallingNumber {
        font-size: 32px;
        font-weight: bold;
        margin: 2px 0;
        color: $primary;
      }

      q-separator {
        margin: 10px 0;
      }
    }
  }
}
</style>