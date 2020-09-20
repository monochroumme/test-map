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

      Object.entries(data).filter(v => v[0] != 'id').forEach(entry => {
        if (entry[0] != 'details')
          formData.append(entry[0], entry[1]);
        else formData.append(entry[0], entry[1] || 'what'); // back gives exception if details is empty
      });

      await apiRequest.postFormData(`stands/${data.id}`, formData).then(() => {
        Vue.prototype.$toasted.success('Вы успешно забронировали место', {position: 'top-center'});
      }).catch(e => {
        Vue.prototype.$toasted.error(e.response.data.error, {position: 'top-center'});
        throw e;
      });
    }
  }
})
