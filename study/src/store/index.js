import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
        token:0
    },
    mutations: {
        add(state, step) {
            state.count += step
        },
        sub(state, sunN) {
            state.count -= sunN
        },
        loging(){
            this.state.token=1
        }
    },
    actions: {
        addAsync(context, step) {
            setTimeout(() => {
                context.commit('add', step)
            }, 1000)
        },
        subAsync(context, sunN) {
            setTimeout(() => {
                context.commit('sub', sunN)
            }, 1000)
        },
    },
  getters:{
      showNum(state){
        return '当前zuixin数量是['+state.count+']'
      }
  },
    modules: {}
})
