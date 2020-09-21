<template>
  <div class="login-container">
    <div class="login-main-wrapper">
      <div class="login-main-container">
        <div class="login">
          <div class="login-title"><h3>用户管理系统</h3></div>
          <div class="login-body">
            <el-form :model="ruleForm" :rules="rules" status-icon label-position="right"
              ref="ruleForm">
              <el-form-item prop="username">
                <el-input v-model.trim="ruleForm.username" placeholder="请输入您的账号" @keyup.enter.native="submit"></el-input>
              </el-form-item>
              <el-form-item prop="showPwd">
                <el-input v-model.trim="ruleForm.showPwd" type="password" placeholder="请输入您的密码"
                  @keyup.enter.native="submit"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="login-footer">
            <el-button type="primary" class="login-btn" @click="submit" style="background: #48C0CD;">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { configService } from '../../utils/service'
import { sessionLoginInfo, formatRouter } from '../../utils/public'
import helper from '../../utils/helper'
import md5 from 'js-md5'

export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: '',
        showPwd: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号' }],
        showPwd: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) this.doLogin()
      })
    },
    async doLogin () {
      this.ruleForm.password = md5(this.ruleForm.showPwd)
      const { code, msg, data } = await configService.login({
        username: this.ruleForm.username,
        password: this.ruleForm.password
      })
      if (code === '000000') {
        let modules = data.fuMenuList
        let menuList = data.ziMenuList
        modules.forEach(item => {
          let menu = []
          menuList.forEach(val => {
            if (val.parentId === item.menuId) {
              menu.push(val)
            }
          })
          item.menu = menu
        })
        sessionLoginInfo(modules, data, menuList)
        this.$router.addRoutes(formatRouter(modules))
        this.$router.replace(modules[0].menu[0].link)
      } else {
        helper.E(msg)
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: url(../../assets/images/bg.png) #eee no-repeat center;
  background-size: cover;
}
.login-bg-wrapper,
.login-main-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  overflow: hidden;
}
.login-bg-wrapper {
  z-index: 10;
}
.login-main-wrapper {
  z-index: 20;
}
.login-main-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.login {
  width: 320px;
  position: absolute;
  z-index: 30;
  left: 50%;
  margin-left: -160px;
  padding: 10px;
  top: 30%;
  height: 260px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
}
.login-title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  padding-bottom: 20px;
}
.login-body .el-form-item__label:before {
  content: '';
  display: table;
}
.login-btn {
  width: 100%;
}
</style>
