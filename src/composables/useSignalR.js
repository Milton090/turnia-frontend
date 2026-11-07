import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import * as signalR from '@microsoft/signalr';

import { useQueueStore } from 'src/stores/queue-store';

export function useSignalR(hubUrl, key) {
  const connectionSr = ref(null);
  const isConnected = ref(false);
  const errors = ref([])
  const connectionState = ref('desconectado')

  const queueStore = useQueueStore();

  const startConnection = async () => {
    try {
      await connectionSr.value.start();
      isConnected.value = true;
      console.log('Conectado con éxito');
      connectionState.value = 'conectado';
      setupListeners();
      queueStore.getTicketsForScreen();
    } catch (err) {
      console.log('Error al conectar', err);
      connectionState.value = 'error de conexión';
      queueStore.setDataClean();
      isConnected.value = false;
      setTimeout(startConnection, 3000);
    }
  };

  const setupListeners = () => {
    console.log('activando listeners')

    connectionSr.value.on("CallingTicket", (ticketId, ticketNumber) => {
      console.log('calling ticket')
      queueStore.getTicketsForScreen()
    })

    connectionSr.value.on("StopCallingTicket", (ticketId, ticketNumber) => {
      console.log('stop calling ticket')
      queueStore.getTicketsForScreen()
    })

    connectionSr.value.on("RefreshAttendingList", (temporaryReason) => {
      console.log('refresh attending list')
      queueStore.getTicketsForScreen()
    })

  };

  const setupConnection = () => {
    connectionSr.value = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          return key;
        },
        withCredentials: false
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          return Math.random() * 10000;
        }
      })
      .build();

    watchEffect(() => {
      if (connectionSr.value) {
        const currentState = connectionSr.value.state;
        switch (currentState) {
          case signalR.HubConnectionState.Connected:
            connectionState.value = 'conectado';
            console.log('Status:connected')
            break;
          case signalR.HubConnectionState.Connecting:
            connectionState.value = 'conectando...';
            console.log('Status:connecting')
            break;
          case signalR.HubConnectionState.Reconnecting:
            connectionState.value = 'reconectando';
            console.log('Status:reconnecting')
            break;
          case signalR.HubConnectionState.Disconnected:
            connectionState.value = 'desconectado';
            console.log('Status:disconnected')
            break;
          default:
            connectionState.value = 'estado desconocido';
            console.log('Status:unknown status')
        }
      }
    });
    connectionSr.value.onclose(async () => {
      console.log('Conexión cerrada. Intentando reconectar...');
      isConnected.value = false;
      await startConnection();
    });

    connectionSr.value.onreconnecting((error) => {
      console.log('Intentando reconectar...', error);

      queueStore.setDataClean();
      connectionState.value = 'conectando...'

      let reconnectionAttempts = localStorage.getItem('reconnectionAttempts')
      if (reconnectionAttempts === null) {
        localStorage.setItem('reconnectionAttempts', 1)
      } else {
        let attempts = parseInt(reconnectionAttempts) + 1
        localStorage.setItem('reconnectionAttempts', attempts)
      }

      isConnected.value = false
    });

    connectionSr.value.onreconnected((connectionId) => {
      console.log('Reconectado con el ID de conexión:', connectionId);
      connectionState.value = 'connected';

      let reconnection = localStorage.getItem('reconnection')
      if (reconnection === null) {
        localStorage.setItem('reconnection', 1)
      } else {
        let reconect = parseInt(reconnection) + 1
        localStorage.setItem('reconnection', reconect)
      }

      isConnected.value = true;
    });


};

  onMounted(() => {
    setupConnection();
    startConnection();
  });

  onUnmounted(() => {
    if (connectionSr.value) {
      connectionSr.value.stop();
    }
  });

  return {
    connectionSr,
    isConnected,
    connectionState
  };
}
