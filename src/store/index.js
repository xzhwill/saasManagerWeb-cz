import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stateSlide: true,
    total: 0 // 总页码数
  },
  mutations: {
    change (state, city) {
      state.stateSlide = !state.stateSlide
    }
  }
})
