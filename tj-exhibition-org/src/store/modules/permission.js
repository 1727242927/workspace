import * as actionTypes from '../action-types'

const state = {
  routes: []
}

const mutations = {
  [actionTypes.SET_ROUTE](state, route) {
    state.routes = route
  }
}

const actions = {
  getRoute({ commit }, routes) {
    return new Promise(resolve => {
      commit(actionTypes.SET_ROUTE, routes)
      resolve(routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}