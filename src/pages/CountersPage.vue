<template>
  <q-page padding>
    <div class="row">

    <modal-add-counter
    :modal="modal_counter"
    :datos="modelCounter"
    :title="titleForm"
    :services="servicios"
    :acc="action"
    @close="closeModalCounter"
    @selected="selectedServiceCounter"
    @save="submitDataCounter"
    @update="updatedCounter"
    ></modal-add-counter>

    <modal-estatus
    :modal="modal_estatus"
    :servicio="counter"
    @close="cancelChangeStatus"
    @update="updatedStatus"
    ></modal-estatus>

      <div class="col-12">
        <q-table title="" :rows="counters" :columns="columns" row-key="name">
          <template v-slot:top="">
            <div class="col-2 q-table__title">
              COUNTERS<q-icon
                name="content_paste_search"
                color="primary"
                size="32px"
              />
            </div>

            <q-space />
            <q-btn
              label="NUEVO COUNTER"
              color="primary"
              icon-right="mdi-plus"
              @click="addCounter"
            ></q-btn>
          </template>
          <template v-slot:body-cell-servi="props">
            <q-td :props="props">
              <div style="display:flex;flex-wrap:wrap;">
                <q-chip outline color="primary" v-for="(i,index) of props.row.services" :key="index">{{ i.name }} </q-chip>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-estatus="props">
            <q-td :props="props">
              <div>
                <q-toggle
                  v-model="counters[props.row.indice].isActive"
                  @click="changeStatus(props.row)"
                  clickeable
                  checked-icon="check"
                  color="positive"
                  :label="props.row.isActive ?  'Abierto' : 'Cerrado'"
                  unchecked-icon="clear"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div>
                <q-btn flat round color="warning" icon="mdi-pencil" @click="editedItem(props.row)">
                  <q-tooltip
                    class="bg-amber text-black shadow-4"
                    :offset="[10, 10]"
                  >
                    Editar counter
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { api } from "boot/axios";

import modalAddCounter from '../components/counters/modalAddCounter.vue'
import modalEstatus from "src/components/ServicesComponents/modalEstatus.vue";

const columns = [
  {
    name: "counter",
    align: "center",
    label: "Counter",
    field: "name",
    sortable: true,
  },
  {
    name: "description",
    align: "center",
    label: "Descripción",
    field: "description",
    sortable: true,
  },
  {
    name: "servi",
    align: "center",
    label: "Servicios",
    field: "servi",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estado",
    field: "estatus",
    sortable: true,
  },
  { name: "actions", align: "center", label: "Acciones", field: "actions" },
];

let counters = ref([]);
const modal_counter = ref(false)
const modal_estatus = ref(false)
const action   = ref('')
let servicios = ref([])
let serviProvisional = ref([])

const counter = ref('')
const statusCounter = ref(null)
const indiceCounter = ref(null)
const idcounter     = ref(null)

let modelCounter = reactive({
  id:"",
  name: "",
  description: "",
  isActive: true,
  services: []
})

onMounted(() => {
  getCounters();
  getServices()
});

const titleForm = computed(()=>{
  return action.value === 'add' ? 'NUEVO COUNTER' : 'EDITAR COUNTER'
})

const getCounters = async () => {
  try {
    const response = await api.get(`/queue/counters`);
    counters.value = response.data.map((item,index) => {
       item.indice = index
       return item;
    });
  } catch (e) {
    console.log(e);
  }
};

const getServices = async () => {
  try {
    const response = await api.get(`/queue/services`);
    serviProvisional.value = response.data
    servicios.value = response.data.map((item) =>{
      item.selected = false
      return item;
    })
    serviProvisional.value = [...servicios.value]
  } catch (e) {
    console.log(e);
  }
};

const addCounter = ()=>{
  action.value = 'add'
  modal_counter.value = true
}

const selectedServiceCounter = (item,index) =>{
  let id = modelCounter.services.findIndex(i => i === item.id)
  if(id >= 0){
    modelCounter.services.splice(id, 1)
  }else{
    modelCounter.services.push(item.id)
  }
  servicios.value[index].selected =  !servicios.value[index].selected
}

const submitDataCounter = async () =>{
  try{
    const response = await api.post('/queue/counters',modelCounter)
    if(response.status == 200){
      getCounters()
      closeModalCounter()
    }
  }catch(e){
    console.log(e)
  }
}

const editedItem = (item) => {
  modelCounter.name = item.name
  modelCounter.description = item.description
  modelCounter.id = item.id
  action.value = 'edit'

  for(let j =0; j < item.services.length; j++ ){
    modelCounter.services.push(item.services[j].id)
  }

  let servi = servicios.value.map((it) => {
    for(let i =0; i < item.services.length;i++ ){
       if(item.services[i].id === it.id){
         it.selected = true
       }
    }
    return it;
  })
  servicios.value = [...servi]
  modal_counter.value = true
}

const updatedCounter = async () =>{
  try{
    const response = await api.post(`/queue/counters/${modelCounter.id}/update`,modelCounter)
    if(response.status == 200){
      getCounters()
      closeModalCounter()
    }
  }catch(e){
    console.log(e)
  }
}

const changeStatus = (item) => {
  idcounter.value     = item.id
  statusCounter.value = item.isActive
  counter.value       = item.name
  indiceCounter.value = item.indice
  modal_estatus.value = true
}

const cancelChangeStatus = () =>{
  statusCounter.value = null
  counter.value  = ''
  idcounter.value  = null
  counters.value[indiceCounter.value].isActive = !counters.value[indiceCounter.value].isActive
  modal_estatus.value = false
}

const updatedStatus = async () => {
    try{
      let data = {"status":statusCounter.value}
      const response = await api.post(`/queue/counters/status?counterId=${idcounter.value}`,data)
      if(response.status == 200){
        getCounters()
        closeModalEstatus()
      }
    }catch(e){
      console.log(e)
    }
}

const closeModalEstatus = () =>{
  statusCounter.value = null
  counter.value  = ''
  indiceCounter.value = null
  idcounter.value  = null
  modal_estatus.value = false
}


const closeModalCounter = () =>{
  servicios.value = servicios.value.map((item) =>{
      item.selected = false
      return item;
  })
  modelCounter.name        = ""
  modelCounter.description = ""
  modelCounter.services    = []
  modal_counter.value = false
}
</script>

<style></style>
