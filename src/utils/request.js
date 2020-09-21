import request from 'axios'
import helper from './helper'
import { Loading } from 'element-ui'
import router from '@/router/index'
import { operationType, clearSessionLoginInfo } from './public'
let loadingInstance
const showLoading = () => {
  loadingInstance = Loading.service({
    fullscreen: true
  })
}
const hideLoading = () => {
  loadingInstance.close()
}

class Request {
  constructor () {
    // 参数
    request.defaults.params = {}
    // 最大请求时间
    request.defaults.timeout = 120 * 1000
    // http code
    request.defaults.validateStatus = status => {
      return status >= 200 && status < 300
    }
    // 赋予内部
    this.instance = request
  }
  setToken () {
    let userInfo = JSON.parse(sessionStorage.getItem('login'))
    this.instance.defaults.headers.common['token'] = userInfo.token
    this.instance.defaults.headers.common['userId'] = userInfo.userId
  }
  // 检查code 判断是否去重新登录
  checkCode (params) {
    if (params.code === '30094' || params.code === '30095' || params.code === '30079') {
      clearSessionLoginInfo()
      helper.E(params.msg)
      setTimeout(() => {
        router.replace('/')
        location.reload(true)
        hideLoading()
      }, 1000)
    } else {
      return true
    }
  }
  /*
   * @apiExport get方式导出文档
   * @apiGet 公共get请求
   * @apiPost 公共post请求
   * @apiJson post参数json格式
   * @apiFile 公共上传
   * @url 必填
   * @params 必填
   * */
  apiExport (url, params, fileName) {
    showLoading()
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          let blob = new Blob([xhr.response], { type: 'application/vnd.ms-excel' })
          const a = document.createElement('a')
          a.download = fileName
          a.href = URL.createObjectURL(blob)
          a.click()
        }
      }
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      if (params.pageSizes) delete params.pageSizes
      let datas = '?'
      Object.keys(params).forEach(function (key, val) {
        if (Object.keys(params).length - 1 === +val) {
          datas += key + '=' + params[key]
        } else {
          datas += key + '=' + params[key] + '&'
        }
      })
      datas = datas === '?' ? '' : datas
      console.log(url, '******', datas)
      // return false
      xhr.open('GET', url + '' + datas)
      xhr.responseType = 'arraybuffer'
      xhr.setRequestHeader('Content-Type', 'application/vnd.ms-excel;charset=UTF-8')
      xhr.setRequestHeader('token', userInfo.token)
      xhr.setRequestHeader('userId', userInfo.userId)
      xhr.setRequestHeader('operationId', operationType(url))
      xhr.send(JSON.stringify(params))
      hideLoading()
    }).catch((error) => {
      reject(error)
      hideLoading()
      helper.E('网络异常')
    })
  }
  apiGet (url, params = {}) {
    showLoading()
    let userInfo = JSON.parse(sessionStorage.getItem('login'))
    if (params.pageSizes) delete params['pageSizes']
    params.userName = userInfo.chinesename
    this.instance.defaults.headers.common.token = userInfo.token
    // this.instance.defaults.headers.common['token'] = "20200703141047121777104807031196"
    this.instance.defaults.headers.common.userId = userInfo.userId
    this.instance.defaults.headers.common.operationId = operationType(url)
    url = url + '?t=' + Date.now()
    return new Promise((resolve, reject) => {
      this.instance.get(`${url}`, {
        params: { ...params }
      }).then(res => {
        hideLoading()
        if (!this.checkCode(res.data)) return false
        resolve(res.data)
      }).catch((error) => {
        console.log(error)
        reject(error)
        hideLoading()
        helper.E('网络异常')
      })
    })
  }

  apiPost (url, params = {}) {
    showLoading()
    // this.instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    if (url.indexOf('login') > -1) {} else {
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      params.userName = userInfo.chinesename
      this.instance.defaults.headers.common['token'] = userInfo.token

      // this.instance.defaults.headers.common['token'] = "20200703141047121777104807031196"
      this.instance.defaults.headers.common['userId'] = userInfo.userId
      this.instance.defaults.headers.common['operationId'] = operationType(url)
    }
    url = url + '?t=' + Date.now()
    return new Promise((resolve, reject) => {
      this.instance.post(`${url}`, params).then((res) => {
        hideLoading()
        if (!this.checkCode(res.data)) return false
        resolve(res.data)
      }).catch((error) => {
        reject(error)
        hideLoading()
        helper.E('网络异常')
      })
    })
  }

  apiJson (url, params = {}) {
    showLoading()
    this.getSessionStorage()

    return new Promise((resolve, reject) => {
      this.instance.post(`${url}`, {
        params
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        hideLoading()
        if (!this.checkCode(res.data)) return false
        resolve(res.data)
      }).catch((error) => {
        reject(error)
        hideLoading()
        helper.E('网络异常')
      })
    })
  }

  apiFile (url, fileKey, file, type) {
    showLoading()
    const formData = new FormData()
    formData.append(fileKey, file)
    console.log("fileKey===",fileKey)
    console.log("file===",file)
    if (type == 1) { //  APP使用图片
      formData.append('dirName', 'chartCar_wx')
    } else if(type == 2){
      formData.append('mfile', file.name)
    }
    return new Promise((resolve, reject) => {
      this.instance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        hideLoading()
        if (!this.checkCode(res.data)) return false
        resolve(res.data)
      }).catch(error => {
        hideLoading()
        reject(error)
        helper.E('网络异常')
      })
    })
  }
}

export default new Request()
