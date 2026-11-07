import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { useQueueStore } from './queue-store';
import { timeMinutes } from 'src/filters';

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    unattendedTickets: [],
    allTickets: [],
    unAttendedTicketsPerCounter: [],
    statusCallTicket: 'counter',
    ticketAttending: null,
    callingTicket: null,
    ticketCall: false,

    attendingMinutes: 0,
  }),
  persist: true,
  getters: {
    queue() {
      return useQueueStore();
    },
  },
  actions: {

    async getTodaysTickets() {
      try {
        const response = await api.get("queue/tickets/today");
        if (response.status == 200 || response.status == 201) {
          this.unattendedTickets = response.data.unAttendedTickets;
          this.allTickets = response.data.todaysTickets;
          this.unAttendedTicketsPerCounter = response.data.unAttendedTicketsPerCounter;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    },

    async getTicketInAttention() {
      try {
        const response = await api.get(`/queue/tickets/currentlyattending`);
        if (response.status == 200) {
          this.ticketAttending = response.data;
        } else if (response.status == 204) {
          this.ticketAttending = {};
        }
      } catch (e) {
        console.log(e);
      }
    },

    updateMinutes() {
      this.attendingMinutes = timeMinutes(this.queue.userProfile.ticketAttendingStartDateTime);
    },

    setCounterVerified() {
      this.statusCallTicket = 'counter'
    },

    setInit() {
      this.statusCallTicket = 'init'
    },
    setCall() {
      this.statusCallTicket = 'call'
    },
    setStart() {
      this.statusCallTicket = 'start'
    }
  },
});
