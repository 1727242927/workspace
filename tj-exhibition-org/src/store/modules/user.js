import * as actionTypes from '../action-types'
import { orgLogin, getUserInfo } from '@/api'

const state = {
  // userInfo: {},
  currentExhibition: {} // 当前展会
}

const mutations = {
  [actionTypes.SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo
  },
  [actionTypes.SET_EXHIBITION](state, exhibition) {
    state.currentExhibition = exhibition
  },
  [actionTypes.CLEAR_EXHIBITION](state) {
    state.currentExhibition = {}
  }
}

const actions = {
  login({ commit }, params) {
    return new Promise((resolve, reject) => {
      orgLogin(params).then(response => {
        commit(actionTypes.SET_USER_INFO, response.data)
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        commit(actionTypes.SET_USER_INFO, response.data)
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setExhibition({ commit }, data) {
    commit(actionTypes.SET_EXHIBITION, data)
  },
  clearExhibition({ commit }) {
    commit(actionTypes.CLEAR_EXHIBITION)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}