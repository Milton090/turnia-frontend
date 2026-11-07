<template>
  <q-dialog id="dialogNoShow" v-model="modal">
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white flex justify-between">
        <div class="text-h6">CONFIRMAR</div>
        <q-btn flat round icon="mdi-close" color="white" @click="emit('close')" />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 80vh" class="scroll bg-white text-black">
        <div class="row">
          <div class="col-12" align="center">
            <p class="text-negative" style="font-weight:700;font-size:18px">¿Confirma que el usuario no se presentó?</p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-white q-px-md q-py-md">
        <q-btn id="cancelNoShowBtn" flat label="No" color="negative" @click="emit('close')" />
        <q-btn id="confirmNoShowBtn" class="q-ml-md" label="SÍ" color="positive" icon-right="mdi-check"
          @click="emit('create')"></q-btn>

      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { toRefs } from "vue"


const props = defineProps({
  modal: Boolean
})

const emit = defineEmits(['close', 'create'])

const { modal } = toRefs(props)
</script>

<style></style>
