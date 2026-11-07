<template>
  <div id="mensaje-container">
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
      mode="out-in"
    >
      <div class="mensaje-queue" v-if="!connected">
              <q-icon name="mdi-wifi-off" size="30px" color="white"></q-icon>
              <p class="text-white q-mt-md q-ml-sm">{{ status }} </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { toRefs } from "vue"


const props = defineProps({
  connected:Boolean,
  status:String
})

const {connected,status} = toRefs(props)

</script>

<style lang="scss">
  #mensaje-container{
   
    width: 100%;
    height: 100vh;
    z-index: 9999;
    position: fixed;
    display: flex;
    justify-content: center;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    .mensaje-queue{
      width: 250px;
      height: 50px;
      background: rgb(213,55,55);
      background: linear-gradient(90deg, rgba(213,55,55,1) 49%, rgba(163,19,19,1) 64%);
      display: flex;
      place-items: center;
      border-radius: 5px;
      padding: 10px;
      margin-top: 10px;
    }
  }

  .fade-enter-from,
.fade-leave-to {
  opacity: 0
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .8s ease-out
}
</style>
