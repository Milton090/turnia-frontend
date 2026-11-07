<template>
  <q-dialog v-model="modal">
    <q-card style="width: 550px; max-width: 90vw">
      <q-card-section class="bg-primary text-white flex justify-between">
        <div class="text-h6">Roles</div>
        <q-btn
          flat
          round
          icon="mdi-close"
          color="white"
          @click="closeModal()"
        />
      </q-card-section>

      <q-separator />

      <q-card-section
        style="max-height: 80vh"
        class="scroll bg-white text-black"
      >
        <div class="row">
          <div class="col-12 q-px-sm">
            <div
              class="item-rol"
              v-for="item in datos"
              :key="item.id"
              :class="{ active: item.selected }"
            >
              <p>
                {{ item.name }}
                <q-icon name="mdi-check" v-if="item.selected"></q-icon>
              </p>
              <span>
                <q-btn flat v-if="item.selected" @click="emit('remove', item)">
                  <q-icon
                    name="mdi-close-thick"
                    size="22px"
                    color="negative"
                  ></q-icon>
                  <q-tooltip
                    class="bg-negative text-white shadow-4"
                    :offset="[10, 10]"
                  >
                    Quitar rol
                  </q-tooltip>
                </q-btn>
                <q-btn flat v-else @click="emit('add', item)">
                  <q-icon name="mdi-plus" size="22px" color="positive"></q-icon>
                  <q-tooltip
                    class="bg-amber text-black shadow-4"
                    :offset="[10, 10]"
                  >
                    Agregar rol
                  </q-tooltip>
                </q-btn>
              </span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-teal-1 q-px-md q-py-md">
        <q-btn flat label="Cerrar" color="negative" @click="closeModal()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  modal: Boolean,
  datos: Object,
});

const { modal, datos } = toRefs(props);

const emit = defineEmits(["close", "add", "remove"]);

const closeModal = () => emit("close");
</script>

<style lang="scss">
.item-rol {
  width: 100%;
  height: 50px;
  border: 1px solid $primary;
  border-radius: 8px;
  display: flex;
  padding: 15px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.5s;
  p {
    margin-top: 10px;
  }
  &:hover {
    background-color: $teal-3;
    color: #fff;
  }
}
.active {
  background-color: $teal-3;
  color: #fff;
}
</style>
