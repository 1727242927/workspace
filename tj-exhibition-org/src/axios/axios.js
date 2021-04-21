import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

class Axios {
  constructor() {
    this.baseURL = '/tj-exhibition'
    this.timeout = 20000
    this.queue = {}
  }

  request(options) {
    let instance = axios.create()
    let config = {
      ...options,
      baseURL: this.baseURL,
      timeout: this.timeout,
      withCredentials: true
    }
    this.setInterceptor(instance, options.url)
    return instance(config)
  }

  setInterceptor(instance, url) {
    instance.interceptors.request.use(config => {
      config.headers.flag = 1
      // 设置token
      if (Object.keys(this.queue).length === 0) {
        // 显示全局loading
      }
      this.queue[url] = url
      return config
    }, err => {
      return Promise.reject(err)
    })

    instance.interceptors.response.use(response => {
      const data = response.data
      const code = data.code
      const messageInfo = data.message

      // 删除url队列
      this.deleteQueue(url)

      if (!code || code === 1000) {
        return response.data
      } else {
        message.error(messageInfo)

        // 用户登陆过期，请重新登陆
        if (code === 1023) {
          router.push('/login')
          return Promise.reject(new Error('跳转至登录页'))
        }
        return Promise.reject(new Error(messageInfo || 'org custom Error'))
      }
    }, error => {
      // 删除url队列
      this.deleteQueue(url)
      let code
      try {
        code = error.response.data.status
      } catch (error) {
        if (error.toString().indexOf('timeout')) {
          alert('请求超时！')
          return Promise.reject(error)
        }
      }

      if (code === 401) {
        // 登录过期
      }

      if (code === 403) {
        // 没有权限
      }

      return Promise.reject(error)
    })
  }

  deleteQueue(url) {
    delete this.queue[url]
    if (Object.keys(this.queue).length === 0) {
      // 隐藏全局loading
    }
  }
}

export default new Axios()
