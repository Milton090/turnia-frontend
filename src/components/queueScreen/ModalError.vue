<template>
  <q-dialog v-model="modal">
  <q-card style="width: 500px; max-width: 90vw;">
    <q-card-section class="bg-negative text-white flex justify-between">
      <div class="text-h6">¡UPS!</div>
      <q-btn flat round icon="mdi-close" color="white" @click="emit('close')" />
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 80vh" class="scroll bg-white text-black">
      <div class="row">
        <div class="col-12" align="center">
          <q-icon name="mdi-alert" size="35px" color="negative"></q-icon>
          <p class="text-negative" style="font-weight:700;font-size:18px">
            {{ text }}
          </p>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right" class="bg-white q-px-md q-py-md">
      <q-btn flat label="Cerrar" color="negative" @click="emit('close')" />

    </q-card-actions>
  </q-card>
  </q-dialog>
</template>

<script setup>
import { toRefs } from "vue"


const props = defineProps({
modal:Boolean,
text:String
})

const emit = defineEmits(['close'])

const {modal,text} = toRefs(props)
</script>

<style>

</style>
