import Vue from 'vue'
import Vuex from 'vuex'
import apiRequest from '../utils/apiRequest'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	allEvents: [],
    fullEvents: []
  },

  mutations: {
  	setAllEvents(state, data) {
  		state.allEvents = data;
  	},

    setEvent(state, payload) {
      state.fullEvents[payload.id] = payload.data;
    }
  },

  actions: {
  	async getAllEvents({commit}) {
  		const res = await apiRequest.get('events');
  		if (res && res.data) {
  			commit('setAllEvents', res.data);
  		}
  	},

    async getEvent({commit, state}, id) {
      if (!state.fullEvents[id]) {
        const res = await apiRequest.get(`events/${id}`);
        if (res && res.data) {
          commit('setEvent', { id, data: res.data});
        }
      }
    },

    async unbookEvents({commit}) {
      await apiRequest.delete('companies');
    },

    async bookPlace({commit}, data) {
      let formData = new FormData();
      formData.append('name', data.name);
      formData.append('admin', data.admin);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('details', data.details || "what");
      formData.append('logo', data.logo);

      let success = false;
      await apiRequest.postFormData(`stands/${data.id}`, formData).then(() => {
        success = true;
      }).catch(e => {
        console.error(e);
        success = e.response.data.error;
      });

      return success;
    }
  }
})
