<template>
  <q-dialog v-model="modal">
      <q-card style="width:750px; max-width: 90vw;border-radius:20px">
        <q-card-section>
          <div class="text-center"><h4 class="title-poup" :style="{'color':ui.checkinPrimaryColor}"> {{ now_atending }} </h4> </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col-12 text-center" >
              <h1 class="number-ticket" :style="{'color':ui.checkinPrimaryColor}">{{ data.ticketNumber }}</h1>
              <p style="margin:25px 0;font-size:35px !important;" :style="`color:${ui.checkinLabelTextColor}`">{{ please }} </p>
              <h2 class="number-counter " :style="{'color':ui.checkinPrimaryColor}">{{ data.counter?.name}}</h2>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script setup>
import { toRefs } from "vue"


const props = defineProps({
  modal:Boolean,
  data:Object,
  now_atending:String,
  please:String,
  ui:Object
 })

 const {modal,data,now_atending,please} = toRefs(props)

</script>
<style lang="scss">
  .title-poup{
     margin: 2px;
     font-weight: 600;
     letter-spacing: 5px;
  }
  .number-ticket{
    margin:0;
    margin-top: 25px;
    font-size: 165px;
    font-weight: 700;
    letter-spacing: 5px;
  }
  .number-counter{
    margin: 0;
    font-size: 90px;
    font-weight: 500;
    margin-bottom: 10px;
    line-height: 1.0; 
  }
</style>
