import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    active:false,
    status:'',
    title:'',
    text:'',
  }),

  persist: true,

  actions: {

    setActivateNotification(estatus,title,text){
      this.status = estatus
      this.title  = title
      this.text   = text
      this.active = true
      setTimeout(()=>{
        this.setDesactiveNotification()
      },4000)
    },

    setDesactiveNotification(){
        this.active = false
        this.status = ''
        this.title = ''
        this.text = ''
    }
  },
  getters: {},
});
