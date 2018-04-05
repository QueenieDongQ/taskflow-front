// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import App from './App'
import router from './router'

import VueResource from 'vue-resource';
import vueKanban from 'vue-kanban'

Vue.use(vueKanban)

Vue.use(Vuetify)
Vue.use(VueResource)

Vue.config.productionTip = false


window.getData = (that, url,callback = undefined) => {

  that.$http.get(url).then(response => {
    // get body data
    if(response.data.code != 0) {
      // this.notify(response.data.error);
      alert(response.data.error);
      return;
    }
    let data = response.data.data;
    if(callback) {
      callback(data);
    }

  }, error=> {
    // error callback
    that.notify(error)
  });
},

  window.postData = (that, url, data, callback = undefined) => {
    that.$http.post(url, data).then(response => {
      if(response.data.code != 0) {
        // this.notify(response.data.error);
        alert(response.data.error);
        return;
      }
      let data = response.data.data;
      if(callback) {
        callback(data);
      }
    }, error => {
      // this.notify(error);
      alert(error);
    });
  }
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  methods:{



  }
})
