<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { clearSessionLoginInfo, formatRouter } from './utils/public'
export default {
  name: 'App',
  mounted () {
    this.onReady()
  },
  methods: {
    onReady () {
      if (sessionStorage.getItem('login')) {
        // 设置动态路由
        this.$router.addRoutes(formatRouter(JSON.parse(sessionStorage.getItem('modules'))))
      } else {
        clearSessionLoginInfo()
        this.$router.replace('/')
      }
    }
  }
}
</script>
