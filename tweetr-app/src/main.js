// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import moment from 'moment'

import axios from 'axios'
import VeeValidate from 'vee-validate'

window.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:3333'

Vue.config.productionTip = false

Vue.use(VeeValidate)

Vue.filter('timeAgo', date => moment(date).fromNow())
Vue.filter('joined', date => moment(date).format('MMMM YYYY'))
Vue.filter('dob', date => moment(date).format('MMMM Do YYYY'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
