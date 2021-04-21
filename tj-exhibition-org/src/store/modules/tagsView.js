import * as actionTypes from '../action-types'

const state = {
  tagsList: []
}

const mutations = {
  [actionTypes.ADD_TAGS](state, route) {
    const index = state.tagsList.findIndex(item => item.path === route.path)
    if (index === -1) {
      state.tagsList.push({
        ...route
      })
    }
  },
  [actionTypes.REMOVE_TAGS](state, path) {
    const index = state.tagsList.findIndex(item => item.path === path)
    state.tagsList.splice(index, 1)
  },
  [actionTypes.DELETE_TAGS](state) {
    state.tagsList = []
  }
}

const actions = {
  addTags({ commit }, route) {
    commit(actionTypes.ADD_TAGS, route)
  },
  removeTags({ commit, state }, path) {
    return new Promise(resolve => {
      commit(actionTypes.REMOVE_TAGS, path)
      resolve(state.tagsList)
    })
  },
  deleteTags({ commit }) {
    commit(actionTypes.DELETE_TAGS)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}