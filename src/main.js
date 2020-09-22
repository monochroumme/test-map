import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// plugins
import Toasted from 'vue-toasted'
import LoadScript from 'vue-plugin-load-script'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false

// registering plugins
Vue.use(Toasted)
Vue.use(LoadScript)
Vue.use(VueCookie)
Vue.use(require('vue-moment'))

Promise.all([
	Vue.loadScript('https://unpkg.com/@google/markerclustererplus@5.1.0/dist/markerclustererplus.min.js'),
	Vue.loadScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`)
]).then(() => {
	new Vue({
	  router,
	  store,
	  render: h => h(App)
	}).$mount('#app')
})

