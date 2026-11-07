<template>
  <q-dialog v-model="modal">
<q-card style="width: 600px; max-width: 90vw;">
  <q-card-section class="bg-primary text-white flex justify-between">
    <div class="text-h6"> {{ title }}</div>
    <q-btn flat round icon="mdi-close" color="white" @click="closeModal()" />
  </q-card-section>

  <q-separator />

  <q-card-section style="max-height: 80vh" class="scroll bg-white text-black">
    <div class="row">
      <div class="col-12">
        <q-input type="text" outlined label="Nombre del counter" v-model="datos.name"></q-input>
        <q-input class="q-mt-md" type="textarea" outlined label="Descripción:" v-model="datos.description"></q-input>
      </div>
      <div class="col-12">
        <p class="q-mt-sm">Seleccione los servicios que atiende el counter:</p>
        <div class="services">
          <div class="item-service"  v-for="(item,index) of services" :key="index" @click="selectedService(item,index)" :class="{'selected': item.selected}">
             {{ item.name}}
             <q-icon v-if="item.selected" name="mdi-check" color="positive" class="q-ml-sm" size="18px" ></q-icon>
          </div>
        </div>
      </div>
    </div>
  </q-card-section>

  <q-separator />

  <q-card-actions align="right" class="bg-white q-px-md q-py-md">
    <q-btn flat label="Cancelar" color="negative" @click="closeModal()" />
    <q-btn label="GUARDAR" color="primary" icon-right="mdi-content-save" @click="emit('save')" v-if="acc === 'add'" />
    <q-btn label="ACTUALIZAR" color="warning" icon-right="mdi-update" @click="emit('update')" v-else></q-btn>
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
 services:Object,
 acc:String
})

const {modal, datos, title, services} = toRefs(props)

const emit = defineEmits(['close','save','selected','update'])


const closeModal = () =>  emit('close')

const selectedService = (item,index) =>{
    emit('selected',item,index)
}


</script>

<style lang="scss">
  .services{
    width: 100%;
    display: flex;
    justify-content:flex-start;
    margin-top: 0px;
    flex-wrap: wrap;
    .item-service{
      width: auto;
      padding: 6px;
      margin-top: 5px;
      border: 1px solid $primary;
      margin-right: 10px;
      border-radius: 15px;
      cursor: pointer;
      &:hover{
        background-color: $primary;
        color: #fff;
      }
    }
  }
  .selected{
    background-color: $primary;
    color: #fff;
  }
</style>
