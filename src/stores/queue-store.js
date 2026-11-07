import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useTicketsStore } from "./tickets-store";
import { useLoginStore } from "./login";

export const useQueueStore = defineStore('queue', {
  state: () => ({
    attendingTickets: [],
    callingTickets: [],
    lengthCallingTickets: 0,
    stateConnection: '',
    countersActives: [],
    userProfile: {},
    counter: null,
    assign: false,
    customizationCss: {
      checkinPrimaryColor: "#0F766E",
      checkinPrimaryTextColor: "#FFFFFF",
      checkinLabelTextColor: "#1F2937",
      checkinScreenBackgroundColor: "#E6F4F1",
    },
  }),

  getters: {
    ticket() {
      return useTicketsStore();
    },

    login() {
      return useLoginStore();
    }
  },

  actions: {

    async getTicketsForScreen() {
      try {
        const response = await api.post(`/devices/ViewerScreen/GetTickets/getTicketForScreen`, {},
          {
            headers: {
              "Turnia-DeviceKey": localStorage.getItem('Turnia-ViewerScreenKey'),
            },
          }
        );
        if (response.status == 200) {
          this.attendingTickets = response.data.attendingTickets;
          this.callingTickets = response.data.callingTickets;
          this.lengthCallingTickets = response.data.callingTickets.length;
          return true;
        }
      } catch (e) {
        console.log(e);
      }
      return false;
    },

    setDataClean() {
      this.attendingTickets = []
      this.callingTickets = []
      this.lengthCallingTickets = 0
    },

    async getCountersActive() {
      try {
        const response = await api.get(`/queue/counters/active`);
        if (response.status == 200) {
          this.countersActives = response.data;
        }
      } catch (e) {
        console.log(e);
      }
    },


    async getUserProfile() {
      try {
        const response = await api.post(`/api/Authentication/userprofile`);
        if (response.status == 200) {

          this.userProfile = Object.assign({}, response.data);
          this.counter = this.userProfile.counterId;

          if (this.counter) {
            this.ticket.setInit();
            this.checkedStatusTicket(this.userProfile.ticketStatus, this.userProfile.ticketNumber);
          } else {
            this.ticket.setCounterVerified();
            if (!this.login.isAdmin) {
              this.login.showMainModal = true;
            }
          }
          this.assign = true;
        }
      } catch (e) {
        console.log(e);
      }
    },


    assignCounter() {

      if (
        this.ticket.statusCallTicket === "init" ||
        this.ticket.statusCallTicket === "counter"
      ) {
        return true;
      }

      return false;
    },

    async checkedStatusTicket(statusTicket, ticketNumber) {
      if (statusTicket) {
        switch (statusTicket) {
          case 1:
            this.ticket.setCall();
            this.ticket.ticketCall = true;
            this.ticket.callingTicket = ticketNumber
            break;
          case 2:
            this.ticket.getTicketInAttention()
            this.ticket.setStart();
            this.ticket.ticketCall = false;
            this.ticket.callingTicket = "";
            break;
          case 3:
            break;
          default:
            break;
        }
      } else {
        this.ticket.setInit();
        this.ticket.ticketCall = false;
        this.ticket.callingTicket = "";
        this.ticket.ticketAttending = null;
      }
    },

    async asingDataCounter() {
      try {
        const response = await api.post(`/queue/counters/${this.counter}/assign`);
        if (response.status == 200) {
          this.getUserProfile();
          this.getCountersActive();
          this.ticket.getTodaysTickets();
          return response.data;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  }
});
