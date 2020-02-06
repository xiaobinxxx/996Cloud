import Vue from 'vue'
import Vuex from 'vuex'
import progress from './modules/progress'
import SearchValue from './modules/SearchValue'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    progress,
    SearchValue,
  },
});

export default store
