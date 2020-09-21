import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/reset.css'

Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  /* 初始化   key:高德应用的key */
  key: 'c81898428787ed6ed0303024f747a9c6',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.Geocoder',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.Driving',
    'AMap.PolyEditor',
    'AMap.Geolocation',
    'AMap.LngLat',
    'AMap.CircleEditor',
    'AMap.MarkerClusterer'
  ],
  v: '1.4.8',
  uiVersion: '1.0.11' // 版本号
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
