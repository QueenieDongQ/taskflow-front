// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import App from './App'
import router from './router'
import Vddl from 'vddl';
import VueResource from 'vue-resource';

Vue.use(Vddl);

Vue.use(Vuetify)
Vue.use(VueResource)
Vue.config.productionTip = false

// Vue.component('addnewproject',AddNewProject)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',

})
