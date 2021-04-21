import axios from './axios'

export const post = url => (params, config = {}) => axios.request({ url, method: 'post', data: params, ...config })

export const get = url => (params, config = {}) => axios.request({ url, method: 'get', params: params, ...config })
