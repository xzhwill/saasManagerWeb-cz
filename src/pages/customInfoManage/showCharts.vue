<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <div class="page-header" style="height: 80px;">
      <div class="page-search">
        <search-form
          label-width="120px"
          :formModules="formModules"
          ref="searchForm"
          v-if="formModules.length">
          <div class="page-search-btn">
            <el-button icon="el-icon-search" round plain type="primary" @click="doSearch">查询</el-button>
            <el-button icon="el-icon-delete" round plain type="danger" @click="doClearObj">清空</el-button>
            <el-button round plain type="warning" @click="$router.back()">返回</el-button>
          </div>
        </search-form>
      </div>
    </div>
    <div id="myChart" ref="myEchart" style="width: 100%;flex: 1;"></div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { clearObj } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import helper from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'showCharts1',
  props: {
    isShow: Boolean,
    id: String
  },
  data () {
    return {
      tableList: [],
      searchData: [],
      data: []
    }
  },
  mounted () {
    let time = new Date(new Date() - 24 * 60 * 60 * 1000) // 取前一天的时间
    time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    this.getTableData({})
  },
  methods: {
    getTableData (params) {
      params.sign = '1'
      this.chart = this.$echarts.init(document.getElementById('myChart'))
      net.apiGet(api.customInfo.hot, params).then(data => {
        if (data.msg.code === enums.NET_SUCCESS) {
          let heatmapData = data.data.list
          let arr = []
          let i = -1
          let length = heatmapData.length
          while (++i < length) {
            let item = heatmapData[i]
            arr.push({
              coordinate: [item.longitude, item.latitude],
              count: item.total
            })
          }
          var map = Loca.create('myChart', {
            mapStyle: 'amap://styles/midnight',
            features: ['bg', 'road'],
            center: [116.479547, 39.998554],
            zoom: 11
          })
          var layer = Loca.visualLayer({
            container: map,
            type: 'heatmap',
            shape: 'normal'
          })
          layer.setData(arr, {
            lnglat: 'coordinate',
            value: 'count'
          })
          layer.setOptions({
            style: {
              radius: 30
            },
            gradient: {
              0.5: '#2c7bb6',
              0.65: '#abd9e9',
              0.7: '#ffffbf',
              0.9: '#fde468',
              1.0: '#d7191c'
            }
          })
          layer.render()
        } else {
          helper.E(data.msg.message)
        }
      })
    },
    doSearch () {
      this.searchData = []
      let formData = this.$refs.searchForm.getFormData()
      for (const key in formData) {
        if (key === 'addTime') {
          if (formData[key].length !== 0) {
            // 创建时间
            this.searchData['addTimeStart'] = formData['addTime'][0]
            this.searchData['addTimeEnd'] = formData['addTime'][1]
          }
        } else if (key === 'goWork') {
          if (formData[key].length !== 0) {
            // 创建时间
            this.searchData['goWorkStart'] = formData['goWork'][0]
            this.searchData['goWorkEnd'] = formData['goWork'][1]
          }
        } else if (key === 'offWork') {
          if (formData[key].length !== 0) {
            // 创建时间
            this.searchData['offWorkStart'] = formData['offWork'][0]
            this.searchData['offWorkEnd'] = formData['offWork'][1]
          }
        }
      }
      this.getTableData(this.searchData)
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      clearObj(this.searchData)
      this.getTableData({})
    }
  },
  watch: {
    isShow () {
      if (this.isShow) {
        this.getTableData({})
      }
    }
  },
  components: {
    SearchForm
  }
}
</script>
<style>
@import "../../assets/style/set.less";
#myChart {
  margin: 0 auto;
  margin-top: 50px;
}
</style>
