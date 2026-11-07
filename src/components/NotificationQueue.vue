<template>
  <Transition
    name="custom-classes"
    enter-active-class="animate__animated animate__bounceInDown"
    leave-active-class="animate__animated animate__bounceOutUp"
  >
    <div class="container-notification" v-if="notification.active">
      <div class="notification-card" :class="`${notification.status}`">
        <div class="card-icon" :class="`icon-${notification.status}`">
          <q-icon
            name="mdi-check-circle"
            size="24px"
            color="white"
            v-if="notification.status === 'success'"
          ></q-icon>
          <q-icon
            name="mdi-alert"
            size="24px"
            color="white"
            v-if="notification.status === 'warning'"
          ></q-icon>
          <q-icon
            name="mdi-cancel"
            size="24px"
            color="white"
            v-if="notification.status === 'error'"
          ></q-icon>
          <q-icon
            name="mdi-information"
            size="24px"
            color="white"
            v-if="notification.status === 'info'"
          ></q-icon>
          <q-icon
            name="mdi-alert-octagon"
            size="24px"
            color="white"
            v-if="notification.status === 'negative'"
          ></q-icon>
        </div>
        <div class="card-text">
          <h4>{{ notification.title }}</h4>
          <p>{{ notification.text }}</p>
        </div>
        <div class="close">
          <q-icon
            name="mdi-close"
            style="cursor: pointer"
            class="btn_close"
            @click="notification.setDesactiveNotification()"
          ></q-icon>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useNotificationStore } from "src/stores/notification";

const notification = useNotificationStore();
</script>

<style lang="scss">
.container-notification {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: grid;
  place-items: center;
  z-index: 9999;
  padding-top: 50px;
  background-color: #05050571;
  .notification-card {
    width: 470px;
    height: auto;
    margin: auto;
    position: fixed;
    padding: 18px;
    border-radius: 16px;
    z-index: 9998;
    display: grid;
    place-items: center;
    display: flex;
    .card-icon {
      width: 43px;
      height: 40px;
      border-radius: 8px;
      display: grid;
      place-items: center;
    }
    .card-text {
      width: 400px;
      margin-left: 10px;
      h4 {
        margin: 0;
        font-size: 22px;
        font-weight: 500;
        color: #ffffffb6;
      }
      p {
        margin-top: 0px;
        color: #ffffffb6;
        font-size: 15px;
      }
    }
    .close {
      width: 30px;
      text-align: center;
      color: #ffffffb6;
      .btn_close {
        font-size: 22px;
        &:hover {
          color: #fff;
        }
      }
    }
  }
  .success {
    background-color: #3bd17c;
  }
  .warning {
    background-color: rgb(214, 198, 52);
  }
  .negative {
    background-color: #c10015;
  }
  .error {
    background-color: #c02e2e;
  }
  .info {
    background-color: #3571df;
  }
  .icon-success {
    background-color: #226d43;
  }
  .icon-negative {
    background-color: #a72c3a;
  }
  .icon-warning {
    background-color: rgb(130, 120, 32);
  }
  .icon-error {
    background-color: #771e1e;
  }
  .icon-info {
    background-color: #23417a;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
</style>
