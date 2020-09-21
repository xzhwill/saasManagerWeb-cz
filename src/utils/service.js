import api from './api'
import request from './request'
import helper from './helper'
import loginResult from '../../static/data/login.json'
// 全局service
const configService = {
  login (params) { // 登录
    // return loginResult
    return request.apiPost(api.config.login, params)
  },
  async todayDealOrder ({
    params,
    cb
  }) {
    const { msg, data, page } = await request.apiGet(api.config.todayDealOrder, params)
    if (msg && msg.code === '20000') cb(data, page)
    else helper.E(msg.message)
  }
}
// 认证用户
const authUser = {
  async authUserList ({
    params,
    cb
  }) { // 获取认证用户列表
    const { msg, data, page } = await request.apiGet(api.auth.tableList, params)
    if (msg && msg.code === '20000') cb(data, page)
    else helper.E(msg.message)
  }
}
// app用户
const appUser = {
  async appUserList ({
    params,
    cb
  }) { // 获取app用户列表
    const { msg, data, page } = await request.apiGet(api.app.tableList, params)
    if (msg && msg.code === '20000') cb(data, page)
    else helper.E(msg.message)
  }
}
// other用户
const otherUser = {
  async otherUserList ({
    params,
    cb
  }) { // 获取其他用户列表
    const { msg, data, page } = await request.apiGet(api.other.tableList, params)
    if (msg && msg.code === '20000') cb(data, page)
    else helper.E(msg.message)
  }
}

export {
  configService,
  authUser,
  appUser,
  otherUser
}
