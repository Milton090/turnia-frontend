<template>
  <div>
  <div class="called">
    <div class="main-buttons">
    <q-btn
      id="callNextTicketBtn"
      label="LLAMAR SIGUIENTE"
      color="primary"
      icon-right="phone_forwarded"
          class="action-btn"
      :class="{
        'actions-btns-disabled':
          ticket.statusCallTicket === 'call' ||
          ticket.statusCallTicket === 'start' ||
          ticket.statusCallTicket === 'counter' ||
          ticket.unAttendedTicketsPerCounter.length < 1,
      }"
      :disable="
        ticket.statusCallTicket === 'call' ||
        ticket.statusCallTicket === 'start' ||
        ticket.statusCallTicket === 'counter' ||
        ticket.unAttendedTicketsPerCounter.length < 1
      "
      @click="$emit('callNextTicket')"
    >
      <q-tooltip v-if="!counter" class="big-tooltip">
        ¡No tiene un counter asignado!
      </q-tooltip>
      <q-tooltip
        v-else-if="ticket.unAttendedTicketsPerCounter.length < 1"
        class="big-tooltip"
      >
        ¡Su counter no tiene tickets pendientes!
      </q-tooltip>
    </q-btn>

    <q-btn
      id="startTicketBtn"
      label="INICIAR"
      color="green"
      icon-right="start"
          class="action-btn"
      :class="{
        'actions-btns-disabled': ticket.statusCallTicket !== 'call',
      }"
      :disable="ticket.statusCallTicket !== 'call'"
      @click="$emit('startNextTicket')"
    >
      <q-tooltip v-if="!counter" class="big-tooltip">
        ¡No tiene un counter asignado!
      </q-tooltip>
      <q-tooltip
        v-else-if="ticket.unAttendedTicketsPerCounter.length < 1"
        class="big-tooltip"
      >
        ¡Su counter no tiene tickets pendientes!
      </q-tooltip>
    </q-btn>

    <q-btn
      id="completeTicketBtn"
      label="FINALIZAR"
      color="primary"
      icon-right="done_all"
      class="action-btn"
      :class="{
        'actions-btns-disabled': ticket.statusCallTicket !== 'start',
      }"
      :disable="ticket.statusCallTicket !== 'start'"
      @click="$emit('completeTicket')"
    >
      <q-tooltip v-if="!counter" class="big-tooltip">
        ¡No tiene un counter asignado!
      </q-tooltip>
      <q-tooltip
        v-else-if="ticket.unAttendedTicketsPerCounter.length < 1"
        class="big-tooltip"
      >
        ¡Su counter no tiene tickets pendientes!
      </q-tooltip>
    </q-btn>

    <div class="conditional-buttons-container">
        <div class="conditional-buttons">
          <q-btn
            id="noShowBtn"
            color="primary"
            label="No se presentó"
            class="conditional-btn"
            @click="$emit('showNoShowModal')"
            v-if="ticket.statusCallTicket === 'call'"
          ></q-btn>


          <div
            class="conditional-placeholder"
            v-if="
              ticket.statusCallTicket !== 'call'
            "
          ></div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>

import { toRefs } from 'vue'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  },
  counter: String
})

const { ticket, counter } = toRefs(props)


defineEmits([
  'callNextTicket',
  'startNextTicket', 
  'completeTicket',
  'showNoShowModal'
])
</script>


<style scoped>
.called-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 22000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
}

.called {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  gap: 16px;
}

.main-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.conditional-buttons-container {
  min-width: 120px;
  display: flex;
  justify-content: flex-end;
}

.conditional-buttons {
  display: flex;
  gap: 8px;
  position: relative;
}

.conditional-placeholder {
  visibility: hidden;
  width: 88px;
  height: 40px;
}

.action-btn,
.conditional-btn {
  min-height: 40px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 88px;
}

.action-btn:hover,
.conditional-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.actions-btns-disabled {
  background-color: #9e9e9e !important;
  color: #f5f5f5 !important;
  opacity: 0.7 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.big-tooltip {
  font-size: 14px;
  padding: 8px 12px;
}

@media (min-width: 1024px) {
  .called {
    padding: 0 24px;
  }

  .main-buttons {
    flex-wrap: nowrap;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .called {
    flex-direction: row;
    align-items: center;
  }

  .main-buttons {
    justify-content: center;
  }

  .conditional-buttons-container {
    min-width: 150px;
  }
}

@media (max-width: 767px) {
  .called {
    flex-direction: column;
    gap: 12px;
    padding: 0 12px;
  }

  .main-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .conditional-buttons-container {
    width: 100%;
    min-width: auto;
    justify-content: center;
  }

  .conditional-buttons {
    width: 100%;
    justify-content: center;
  }

  .action-btn,
  .conditional-btn {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    padding: 8px 12px;
  }

  .action-btn :deep(.q-btn__content),
  .conditional-btn :deep(.q-btn__content) {
    flex-direction: column;
    gap: 4px;
  }

  .action-btn :deep(.q-icon),
  .conditional-btn :deep(.q-icon) {
    font-size: 16px;
  }

  .conditional-placeholder {
    display: none;
  }
}

@media (max-width: 480px) {
  .called {
    padding: 0 8px;
  }

  .main-buttons {
    gap: 4px;
  }

  .action-btn,
  .conditional-btn {
    font-size: 11px;
    padding: 6px 8px;
  }

  .action-btn :deep(.q-btn__content),
  .conditional-btn :deep(.q-btn__content) {
    gap: 2px;
  }
}
</style>