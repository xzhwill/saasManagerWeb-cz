<template>
  <el-header height="40px">
    <el-row>
      <el-col :span="3">
        <div class="logo"><img src="../../assets/images/logo_changzhou.png"></div>
        <!--<el-button @click="toggleSide" type="info" :icon=' stateSlide ? "el-icon-arrow-left" : "el-icon-arrow-right"' class="toggle-side" ></el-button>-->
      </el-col>
      <el-col :span="3"
              class="header-right">
        <!--<el-dropdown @command="loginOut">-->
        <span class="el-dropdown-link" style="border-right: 1px solid #08c5ca;padding-right: 7px;margin-right: 7px;">
          你好，{{ loginName }}
          <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        </span>
        <img src="../../assets/images/icon-exit.png" alt="" style="width: 20px;position: relative;top: -2px;" @click="loginOut()">
        <!--<el-dropdown-menu slot="dropdown">-->
        <!--<el-dropdown-item>退出</el-dropdown-item>-->
        <!--</el-dropdown-menu>-->
        <!--</el-dropdown>-->
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
import { clearSessionLoginInfo } from '../../utils/public'
import { mapState } from 'vuex'
export default ({
  name: 'Header',
  data () {
    return {
      activeIndex: '7'
    }
  },
  computed: {
    loginName () {
      return JSON.parse(sessionStorage.getItem('login')).chinesename
    },
    ...mapState(['stateSlide'])
  },
  methods: {
    loginOut () {
      clearSessionLoginInfo()
      this.$router.replace('/')
      location.reload(true)
    },
    toggleSide () {
      this.$store.commit('change')
    }
  }
})
</script>

<style type="text/css" scoped>
.toggle-side {
  margin-top: 6px;
}
.el-header {
  background: #1e232b;
  width: 100%;
  color: #08c5ca;
  /*border-bottom: 1px solid #ddd;*/
}

.logo {
  font-size: 0px;
  line-height: 40px;
  /*text-align: center;*/
}
.logo img {
  width: 76px;
}
.header-right {
  float: right;
  text-align: right;
  height: 40px;
  line-height: 40px;
}
.el-dropdown {
  color: #08c5ca;
  font-size: 12px;
}
.el-menu-item-group__title {
  padding: 0;
}
.el-menu--horizontal > .el-menu-item {
  height: 44px;
  line-height: 44px;
}
.el-dropdown-menu__item {
  display: block;
  width: 65px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  font-size: 14px;
}
</style>
