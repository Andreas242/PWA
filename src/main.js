// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuefire from 'vuefire'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import firebase from './services/firebase'

Vue.use(VueResource)
Vue.use(Vuefire)

Vue.config.productionTip = false

Vue.prototype.$first = '1'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  firebase: {
    players: firebase.database.ref('players/player').orderByChild('score'),
    currentPlayer: firebase.database.ref(`players/player/${localStorage.id}`).orderByChild('score'),
    storage: firebase.storage.ref('images/andy.png'),
    asObject: true
  },
  template: '<App/>',
  components: { App }
})
