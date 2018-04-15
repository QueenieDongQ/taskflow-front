import Vue from 'vue'
import Vuex from 'vuex'
import {people} from '../service/getData'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)


export default new Vuex.Store({
  people,
  actions,
  mutations,
})

