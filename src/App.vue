<template>
  <notification></notification>
  <router-view />
</template>

<script >
import { defineComponent } from 'vue'
import notification from 'src/components/NotificationQueue.vue'

export default defineComponent({
  name: 'App',
  components:{notification},

})
</script>
