<template>
<q-dialog v-model="modal">
<q-card style="width: 700px; max-width: 90vw;">
  <q-card-section class="bg-primary text-white flex justify-between">
    <div class="text-h6"> {{ title }}</div>
    <q-btn flat round icon="mdi-close" color="white" @click="closeModal()" />
  </q-card-section>

  <q-separator />

  <q-card-section style="max-height: 80vh" class="scroll bg-white text-black">
    <div class="row">
      <div class="col-6 q-px-sm">
        <q-input class="q-mt-sm" outlined type="text" label="Nombre del servicio" v-model="datos.name"> </q-input>
      </div>
      <div class="col-6 q-px-sm">
        <q-input class="q-mt-sm" outlined type="text" label="Código del ticket" v-model="datos.ticketCode"> </q-input>
      </div>
      <div class="col-6 q-px-sm">
        
      </div>
      <div class="col-6 q-px-sm">
        
      </div>
      <div class="col-6 q-px-sm">
         
      </div>
      <div class="col-6 q-px-sm">
          
      </div>
      <div class="col-12 q-px-sm">
        <q-input class="q-mt-sm" outlined type="textarea" label="Descripción" v-model="datos.description"> </q-input>
      </div>
    </div>
  </q-card-section>

  <q-separator />

  <q-card-actions align="right" class="bg-white q-px-md q-py-md">
    <q-btn flat label="Cancelar" color="negative" @click="closeModal()" />
    <q-btn label="GUARDAR" color="primary" icon-right="mdi-content-save" @click="emit('save')" v-if="acc === 'add'" />
    <q-btn label="Actualizar" color="warning" icon-right="mdi-update" @click="emit('update')" v-else></q-btn>
  </q-card-actions>
</q-card>
</q-dialog>
</template>

<script setup>
import { ref, toRefs } from "vue"


const props = defineProps({
modal: Boolean,
datos:Array,
title:String,
acc:String
})

const {modal, datos, title, acc} = toRefs(props)

const emit = defineEmits(['close','save','update'])


const closeModal = () =>  emit('close')


</script>

<style lang="scss">

</style>
