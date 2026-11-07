<template>
  <q-dialog v-model="modal">
  <q-card style="width: 500px; max-width: 90vw;">
    <q-card-section class="bg-primary text-white">
      <div class="row">
        <div class="col-11">
          <div class="text-h6">Cambiar estado: {{ username }}</div>
        </div>
        <div class="col-1">
          <q-btn flat round icon="mdi-close" color="white" @click="closeModal()" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 80vh" class="scroll bg-white text-black">
      <div class="row">
        <div class="col-12" >
          <h5 style="margin:0px;text-align:center;">¿Está seguro de cambiar el estado? <br> <span class="text-primary" style="font-weight:bold"> </span> </h5>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="bg-white q-px-md q-py-md">
      <q-btn flat label="Cancelar" color="negative"  @click="emit('close')" />
      <q-btn class="q-ml-md" label="SÍ" @click="emit('update')" color="positive" icon-right="mdi-check"></q-btn>
    </q-card-actions>
  </q-card>
  </q-dialog>
  </template>

  <script setup>
  import { ref, toRefs } from "vue"


const props = defineProps({
  modal: Boolean,
  username:String
  })

const {modal, username } = toRefs(props)

const emit = defineEmits(['close','update'])


const closeModal = () =>  emit('close')

  </script>

  <style lang="scss">

  </style>