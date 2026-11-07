<template>
  <q-page padding>
    <ModalAddUser
      :datos="modelUser"
      :title="titleForm"
      :acc="action"
      :modal="modal_user"
      :data="Roles"
      :counters="Counters"
      @save="submitDataUser"
      @update="updateUser"
      @close="closeModalUser"
    ></ModalAddUser>

    <ModalStatus
      :modal="modal_estatus"
      :username="user"
      @close="cancelChangeStatus"
      @update="updatedStatus"
    ></ModalStatus>

    <ModalAddRole
      :modal="modal_role"
      :datos="Roles"
      @add="addRoleUser"
      @remove="removeRoleUser"
      @close="closeModalRole"
    ></ModalAddRole>

    <ModalChangePassword
      :changeModal="modal_password"
      :userName="passwordUserName"
      @close="modal_password = false"
    ></ModalChangePassword>

    <div class="row">
      <div class="col-12">
        <q-table
          title=""
          :rows="Users"
          :columns="columns"
          row-key="name"
          :rows-per-page-options="[50, 100]"
        >
          <template v-slot:top="">
            <div class="col-2 q-table__title">
              USUARIOS<q-icon
                name="mdi-account-plus"
                color="primary"
                size="32px"
                class="q-ml-sm"
              />
            </div>

            <q-space />
            <q-btn
              label="NUEVO USUARIO"
              color="primary"
              icon-right="mdi-account-multiple-plus"
              @click="addNewUser"
            ></q-btn>
          </template>
          <template v-slot:body-cell-estatus="props">
            <q-td :props="props">
              <div>
                <q-toggle
                  v-model="Users[props.row.indice].active"
                  @click="changeStatus(props.row)"
                  clickeable
                  checked-icon="check"
                  color="positive"
                  :label="props.row.active ? 'Activo' : 'Inactivo'"
                  unchecked-icon="clear"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-rol="props">
            <q-td :props="props">
              <div>
                <p class="text-primary">
                  <b>{{ props.row.role[0] }}</b>
                </p>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div>
                <q-btn
                  flat
                  round
                  color="warning"
                  icon="mdi-pencil"
                  @click="editedItem(props.row)"
                >
                  <q-tooltip
                    class="bg-amber text-black shadow-4"
                    :offset="[10, 10]"
                  >
                    Editar usuario
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="light-blue-9"
                  icon="mdi-account-convert"
                  @click="editedRoles(props.row)"
                >
                  <q-tooltip
                    class="bg-amber text-black shadow-4"
                    :offset="[10, 10]"
                  >
                    Roles
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="mdi-lock-reset"
                  @click="openPasswordModal(props.row)"
                >
                  <q-tooltip
                    class="bg-amber text-black shadow-4"
                    :offset="[10, 10]"
                  >
                    Cambiar contraseña
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

import { useNotificationStore } from "src/stores/notification";

import ModalAddUser from "src/components/users/ModalAddUser.vue";
import ModalStatus from "src/components/users/ModalStatus.vue";
import ModalAddRole from "src/components/users/modalAddRole.vue";
import ModalChangePassword from "src/components/users/ModalChangePassword.vue";

const notification = useNotificationStore();

const columns = [
  {
    name: "firstName",
    align: "center",
    label: "Nombre",
    field: "firstName",
    sortable: true,
  },
  {
    name: "lastName",
    align: "center",
    label: "Apellido",
    field: "lastName",
    sortable: true,
  },
  {
    name: "userName",
    align: "center",
    label: "Usuario",
    field: "userName",
    sortable: true,
  },
  {
    name: "rol",
    align: "center",
    label: "Rol",
    field: "rol",
    sortable: true,
  },
  {
    name: "counter",
    align: "center",
    label: "Counter",
    field: (row) =>
      Counters.value.find((c) => c.id === row.assignedCounterId)?.name || "-",
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

let Users = ref([]);
let Roles = ref([]);
let Counters = ref([]);
let userEditRol = ref({});

const modal_user = ref(false);
const modal_estatus = ref(false);
const modal_role = ref(false);
const modal_password = ref(false);
const passwordUserName = ref("");

const action = ref("");
const user = ref("");
const statusUser = ref(null);
const indiceUser = ref(null);
const idUser = ref(null);

let modelUser = reactive({
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  active: true,
  userRole: "",
  assignedCounterId: null,
});

const titleForm = computed(() => {
  return action.value === "add" ? "NUEVO USUARIO" : "EDITAR USUARIO";
});

onMounted(() => {
  getRoles();
  getCounters();
  getAllUsers();
});

const getAllUsers = async () => {
  try {
    const response = await api.get(`/api/UserManagement/getusers/`);
    if (response.status == 200) {
      Users.value = response.data.map((item, index) => {
        item.indice = index;
        return item;
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const getRoles = async () => {
  try {
    const response = await api.get(`/api/Authentication/getallroles`);
    Roles.value = response.data.map((item, index) => {
      item.indice = index;
      item.selected = false;
      return item;
    });
  } catch (e) {
    console.log(e);
  }
};

const getCounters = async () => {
  try {
    const response = await api.get(`/queue/counters`);
    Counters.value = response.data;
  } catch (e) {
    console.log(e);
  }
};

const addNewUser = () => {
  action.value = "add";
  modal_user.value = true;
};

const submitDataUser = async () => {
  if (
    !modelUser.firstName ||
    !modelUser.lastName ||
    !modelUser.userName ||
    !modelUser.password ||
    !modelUser.userRole
  ) {
    notification.setActivateNotification(
      "negative",
      "Error",
      "Todos los campos son obligatorios."
    );
    return;
  }

  try {
    const response = await api.post(
      "/api/UserManagement/createuser",
      modelUser
    );
    if (response.status === 200 || response.status === 201) {
      notification.setActivateNotification(
        "success",
        "Listo",
        "Usuario creado correctamente."
      );

      getAllUsers();
      closeModalUser();
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Ocurrió un error al crear el usuario.";
    notification.setActivateNotification("negative", "Error", errorMessage);
  }
};

const editedItem = (item) => {
  modelUser.lastName = item.lastName;
  modelUser.firstName = item.firstName;
  modelUser.userName = item.userName;
  modelUser.userId = item.id;
  modelUser.userRole = item.role[0];
  modelUser.assignedCounterId = item.assignedCounterId;
  action.value = "edit";
  modal_user.value = true;
};

const updateUser = async () => {
  try {
    const response = await api.post(`/api/UserManagement/edituser`, modelUser);
    if (response.status == 200) {
      notification.setActivateNotification(
        "success",
        "Listo",
        response.data
      );
      getAllUsers();
      closeModalUser();
    }
  } catch (e) {
    console.log(e);
  }
};

const changeStatus = (item) => {
  idUser.value = item.id;
  statusUser.value = item.active;
  user.value = item.userName;
  indiceUser.value = item.indice;
  modal_estatus.value = true;
};

const updatedStatus = async () => {
  try {
    let data = {
      userId: idUser.value,
      activate: statusUser.value,
    };
    const response = await api.post(
      `/api/UserManagement/toggleactivation`,
      data
    );
    if (response.status == 200) {
      notification.setActivateNotification(
        "success",
        "Listo",
        response.data
      );
      getAllUsers();
      closeModalEstatus();
    }
  } catch (e) {
    console.log(e);
  }
};

const addRoleUser = async (item) => {
  try {
    let rol = [];
    rol.push(item.name);
    let data = {
      userId: userEditRol.value?.id,
      roleName: rol,
    };
    const response = await api.post(`/api/UserManagement/addrole`, data);
    if (response.status == 200 || response.status == 201) {
      notification.setActivateNotification(
        "success",
        "Listo",
        "El rol fue agregado al usuario"
      );
      let itemData = await getUserId(userEditRol.value.id);
      editedRoles(itemData);
    }
  } catch (e) {
    console.log(e);
  }
};

const removeRoleUser = async (item) => {
  if (userEditRol.value.role.length < 2) {
    notification.setActivateNotification(
      "warning",
      "Atención",
      "El usuario debe tener al menos un rol asignado"
    );
  } else {
    try {
      let rol = [];
      rol.push(item.name);
      let data = {
        userId: userEditRol.value?.id,
        roleName: rol,
      };
      const response = await api.post(`/api/UserManagement/removerole`, data);
      if (response.status == 200 || response.status == 201) {
        notification.setActivateNotification(
          "success",
          "Listo",
          "El rol fue quitado del usuario"
        );
        let itemData = await getUserId(userEditRol.value.id);
        Roles.value.map((r) => {
          r.selected = false;
          return r;
        });
        editedRoles(itemData);
      }
    } catch (e) {
      console.log(e);
    }
  }
};

const getUserId = async (id) => {
  try {
    const response = await api.get(`/api/UserManagement/getuser/${id}`);
    if (response.status == 200) {
      return response.data;
    }
  } catch (e) {
    console.log(e);
  }
};

const closeModalUser = () => {
  for (let key in modelUser) {
    if (modelUser.hasOwnProperty(key)) {
      modelUser[key] = "";
    }
  }
  modelUser.active = true;
  modelUser.assignedCounterId = null;
  action.value = "";
  modal_user.value = false;
};

const closeModalEstatus = () => {
  statusUser.value = null;
  user.value = "";
  indiceUser.value = null;
  idUser.value = null;
  modal_estatus.value = false;
};

const cancelChangeStatus = () => {
  statusUser.value = null;
  user.value = "";
  idUser.value = null;
  Users.value[indiceUser.value].active = !Users.value[indiceUser.value].active;
  modal_estatus.value = false;
};

const editedRoles = async (item) => {
  userEditRol.value = item;

  let userDetails = await getUserId(item.id);

  Roles.value = Roles.value.map((role) => {
    role.selected = userDetails.role.includes(role.name);
    return role;
  });

  modal_role.value = true;
};

const closeModalRole = () => {
  modal_role.value = false;
};

const openPasswordModal = (item) => {
  passwordUserName.value = item.userName;
  modal_password.value = true;
};
</script>

<style></style>
