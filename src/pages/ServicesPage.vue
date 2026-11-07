<template>
  <q-page padding>
    <modal-add-service :modal="modal_service" :datos="modelService" :title="titleForm" :acc="action"
      @close="closeModalService" @save="submitDataService" @update="updateService"></modal-add-service>

    <modal-estatus :modal="modal_estatus" :servicio="service" @close="cancelChangeStatus"
      @update="updateStatus"></modal-estatus>

    <div class="row">
      <div class="col-12">
        <q-table title="" :rows="services" :columns="columns" row-key="name">
          <template v-slot:top="">
            <div class="col-2 q-table__title">
              SERVICIOS<q-icon name="content_paste_search" color="primary" size="32px" />
            </div>

            <q-space />
            <q-btn label="NUEVO SERVICIO" color="primary" icon-right="mdi-plus" @click="addService"></q-btn>
          </template>

          <template v-slot:body-cell-estatus="props">
            <q-td :props="props">
              <div>
                <q-toggle v-model="services[props.row.indice].isActive" @click="changeStatus(props.row)" clickeable
                  checked-icon="check" color="positive" :label="props.row.isActive ? 'Activo' : 'Inactivo'"
                  unchecked-icon="clear" />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div>
                <q-btn flat round color="warning" icon="mdi-pencil" @click="editedItem(props.row)">
                  <q-tooltip class="bg-amber text-black shadow-4" :offset="[10, 10]">
                    Editar servicio
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

import modalAddService from '../components/ServicesComponents/modalAddService.vue'
import modalEstatus from '../components/ServicesComponents/modalEstatus.vue'

const columns = [
  {
    name: "service",
    align: "center",
    label: "Servicio",
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
    name: "code",
    align: "center",
    label: "Código",
    field: "ticketCode",
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

let services = ref([]);
const modal_service = ref(false)
const modal_estatus = ref(false)
const action = ref('')
const service = ref('')
const statusService = ref(null)
const indiceService = ref(null)
const idService = ref(null)

let modelService = reactive({
  name: "",
  description: "",
  ticketCode: "",
  isActive: true
})

const titleForm = computed(() => {
  return action.value === 'add' ? 'NUEVO SERVICIO' : 'EDITAR SERVICIO'
})

onMounted(() => {
  getServices();
});

const getServices = async () => {
  try {
    const response = await api.get(`/queue/services`);
    services.value = response.data.map((item, index) => {
      item.indice = index
      return item;
    });
  } catch (e) {
    console.log(e);
  }
};

const addService = () => {
  action.value = 'add'
  modal_service.value = true
}

const submitDataService = async () => {
  try {
    const response = await api.post(`/queue/services`, modelService)
    if (response.status == 200) {
      getServices()
      closeModalService()
    }
  } catch (e) {
    console.log(e)
  }
}

const editedItem = (item) => {
  modelService.id = item.id
  modelService.name = item.name
  modelService.description = item.description
  modelService.ticketCode = item.ticketCode
  modelService.isActive = item.isActive
  action.value = "edit";
  modal_service.value = true;
};

const updateService = async () => {
  try {
    const response = await api.post(`/queue/services/${modelService.id}/update`, modelService)
    if (response.status == 200) {
      getServices()
      closeModalService()
    }
  } catch (e) {
    console.log(e)
  }
}

const changeStatus = (item) => {
  idService.value = item.id
  statusService.value = item.isActive
  service.value = item.name
  indiceService.value = item.indice
  modal_estatus.value = true
}

const updateStatus = async () => {
  try {
    let data = { "status": statusService.value }
    const response = await api.post(`/queue/service/status?serviceId=${idService.value}`, data)
    if (response.status == 200) {
      getServices()
      closeModalEstatus()
    }
  } catch (e) {
    console.log(e)
  }
}

const closeModalService = () => {
  modelService.name = ""
  modelService.description = ""
  modelService.ticketCode = ""
  action.value = ""
  modal_service.value = false
}

const closeModalEstatus = () => {
  statusService.value = null
  service.value = ''
  indiceService.value = null
  idService.value = null
  modal_estatus.value = false
}

const cancelChangeStatus = () => {
  statusService.value = null
  service.value = ''
  idService.value = null
  services.value[indiceService.value].isActive = !services.value[indiceService.value].isActive
  modal_estatus.value = false
}
</script>

<style></style>
