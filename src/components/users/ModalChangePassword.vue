<template>
  <q-dialog v-model="modal" @hide="closeModal">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="bg-primary text-white flex justify-between">
        <div class="row items-center">
          <q-icon name="mdi-lock-reset" size="28px" class="q-mr-sm" />
          <div class="text-h6">
            Cambiar contraseña
          </div>
        </div>

        <q-btn flat round icon="mdi-close" color="white" @click="closeModal" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-body2 text-grey-7 q-mb-md">
          <span v-if="userName">Ingrese una nueva contraseña para {{ userName }}.</span>
          <span v-else>Ingrese una nueva contraseña para su cuenta.</span>
          La contraseña debe tener al menos 10 caracteres, una mayúscula, un número y un carácter especial.
        </div>

        <q-input label="Nueva contraseña" hint="Mínimo 10 caracteres" :type="showNewPass ? 'text' : 'password'"
          v-model="newPassword" :rules="[rules.required, rules.min, rules.complexity]" lazy-rules outlined
          class="q-mb-md">
          <template #prepend>
            <q-icon name="mdi-lock" color="primary" />
          </template>

          <template #append>
            <q-icon :name="showNewPass ? 'mdi-eye' : 'mdi-eye-off'" class="cursor-pointer"
              @click="showNewPass = !showNewPass" />
          </template>
        </q-input>

        <q-input label="Confirmar contraseña" :type="showConfirm ? 'text' : 'password'" v-model="confirmPassword"
          :rules="[rules.required, rules.matchConfirm]" lazy-rules outlined>
          <template #prepend>
            <q-icon name="mdi-lock-check" color="primary" />
          </template>

          <template #append>
            <q-icon :name="showConfirm ? 'mdi-eye' : 'mdi-eye-off'" class="cursor-pointer"
              @click="showConfirm = !showConfirm" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="negative" @click="closeModal" />

        <q-btn color="primary" label="Cambiar contraseña" icon-right="mdi-lock-reset" :disable="!formValid"
          @click="changePassword" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { api } from "src/boot/axios";
import { useNotificationStore } from "src/stores/notification";

const props = defineProps({
  changeModal: {
    type: Boolean,
    default: false,
  },
  userName: {
    type: String,
    default: "",
  },
});


const notification = useNotificationStore();

const emit = defineEmits(["close", "notificar"]);

const newPassword = ref("");
const confirmPassword = ref("");

const showNewPass = ref(false);
const showConfirm = ref(false);

const rules = {
  required: (value) => !!value || "Obligatorio.",
  min: (v) => v.length >= 10 || "La contraseña debe tener mínimo 10 caracteres",
  complexity: (v) => {
    if (!/[A-Z]/.test(v)) return "Debe contener al menos una mayúscula.";
    if (!/[0-9]/.test(v)) return "Debe contener al menos un número.";
    if (!/[^a-zA-Z0-9]/.test(v)) return "Debe contener al menos un carácter especial.";
    return true;
  },
  matchConfirm: (v) => v === newPassword.value || "Las contraseñas no coinciden.",
};


const formValid = computed(() => {
  return (
    newPassword.value.length >= 10 &&
    /[A-Z]/.test(newPassword.value) &&
    /[0-9]/.test(newPassword.value) &&
    /[^a-zA-Z0-9]/.test(newPassword.value) &&
    newPassword.value === confirmPassword.value
  );
});


const modal = computed({
  get: () => props.changeModal,
  set: (val) => {
    if (!val) emit("close");
  },
});

function closeModal() {
  emit("close");
}

async function changePassword() {
  try {
    const payload = {
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    };

    const response = props.userName
      ? await api.post("/api/UserManagement/changeuserpassword", { ...payload, userName: props.userName })
      : await api.post("/api/Authentication/changepassword", payload);

    if (response.status === 200 || response.status === 201) {
      notification.setActivateNotification("success", "Listo", "Contraseña actualizada correctamente");
      closeModal();
      newPassword.value = "";
      confirmPassword.value = "";
    }
  } catch (e) {
    notification.setActivateNotification("error", "Error", "No se pudo cambiar la contraseña");
    console.log(e);
  }
}
</script>
