import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getter'
import mutations from "./mutation";
import actions from "./action";
Vue.use(Vuex)
import persistedState from "vuex-persistedstate";
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  plugins: [persistedState()]
});