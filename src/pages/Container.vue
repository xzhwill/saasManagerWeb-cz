<template>
  <div class="container">
    <div class="header">
      <Header></Header>
    </div>
    <section class="main">
      <div class="slider clearfix" v-show="stateSlide" :style="{ width:isCollapse ? '60px': '200px' }">
        <img src="../assets/images/openMenu.png" class="openMenu" alt="" @click="isCollapse = !isCollapse" v-if="isCollapse">
        <img src="../assets/images/retractMenu.png" class="retractMenu" alt="" @click="isCollapse = !isCollapse" v-else>
        <Aside @clickItem="sliderItemClick" :isCollapse="isCollapse"></Aside>
      </div>
      <!--<Tabnav ref="tabNav" class="wrapper-nav-list"></Tabnav>-->
      <div
        class="main-body"
        :style="{
          left: isCollapse ? '80px': '220px',
          height: visible ? '88%' : '',
          overflowX: visible ? 'hidden' : '',
          overflowY: visible ? 'auto' : ''
        }">
        <div class="bread">
          <span class="bread-title gray">{{ bread.parentTitle }}</span>
          <span class="bread-separator">/</span>
          <span class="bread-title">{{ bread.title }}</span>
        </div>
        <!--class="searchForm"-->
        <search-form label-width="120px" :formModules="formModules" ref="searchForm" :visible="visible" v-show="formModules.length !== 0">
          <div class="page-search-btn">
            <img src="../assets/images/icon-s-query.png" @click="doSearch" />
            <img src="../assets/images/icon-clear.png" alt="" @click="doClearObj">
            <img src="../assets/images/icon-more.png" alt="" @click="visible = !visible" v-if="formModules.length > 3" :class="visible?'changeRotate':''">
            <!--<img src="../assets/images/icon-set.png" alt="" v-popover:popover @click="showPopover = !showPopover">
            <el-popover ref="popover" placement="bottom" trigger="manual" v-model="showPopover">
              <div class="page-check-list">
                <el-checkbox-group class="checkbox-list-info" v-model="tableHeaderCheckList">
                  <el-checkbox v-for="(item, index) in tableHeader" :key="index" :label="item.label">{{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-popover>-->
          </div>
        </search-form>
        <transition name="fade">
          <router-view
            v-if="isRouterAlive"
            ref="childPage"
            class="main-body-box"
            @getPage="getPageInfo"
            @getTable="getTableInfo"
            @getInfo="getSearchForm"
            :searchData="searchData"
            :tableHeader="tableHeader"
            :tableHeaderCheckList="tableHeaderCheckList"></router-view>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import { Header, Aside } from './common'
import SearchForm from './common/SearchForm/SearchForm.vue'
import { mapState } from 'vuex'
import { clearObj, getYearMonthDayTime, getYearMonthTime, checkPhone ,calcTimestamp} from '../utils/public'
import enums from '../utils/enums'
import net from '@/utils/request'
import api from '@/utils/api'
import helper from '@/utils/helper'

export default ({
  name: 'Container',
  components: { Header, Aside, SearchForm },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      showPopover: false,
      bread: '',
      formModules: [],
      searchData: [],
      tableHeaderCheckList: [],
      tableHeader: [],
      isCollapse: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      visible: false
    }
  },
  computed: {
    ...mapState(['stateSlide'])
  },
  watch: {
    $route () {
      this.getBreadcrumb()
      this.getSearchForm(this.searchData)
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    sliderItemClick (item) {
      this.$refs.searchForm.clearForm()
      // this.$refs.tabNav.addList(item)
    },
    getTableInfo (data) { //  获取表格头部信息
      this.visible = false
      this.showPopover = false
      this.tableHeader = data
      this.initCheckList(data)
    },
    initCheckList (data) {
      this.tableHeaderCheckList = []
      data.forEach(item => { // 默认全选
        this.tableHeaderCheckList.push(item.label)
      })
    },
    getPageInfo () {},
    getSearchForm (data, type) {
      if (!data.length) {
        this.formModules = []
      } else {
        this.formModules = []
        data.forEach((item, index) => {
          if (item.name === 'channelId') {
            item.option = []
            net.apiGet(api.channel.option).then(data => {
              if (data.msg && data.code === enums.NET_SUCCESS) {
                data.data.forEach((val) => {
                  item.option.push({
                    label: val.channelName,
                    value: val.channelId
                  })
                })
              }
            })
          } else if (item.name === 'cityCode') {
            item.option = []
            net.apiGet(api.city.option).then(data => {
              if (data.msg && data.code === enums.NET_SUCCESS) {
                data.data.forEach((val) => {
                  item.option.push({
                    label: val.cityName,
                    value: val.cityCode
                  })
                })
              }
            })
          } else if (item.name === 'businessType' && type !== 'line') {
            item.option = []
            if (item.type === 'transitSchedule') {
              enums.BUSINESSTYPE1.forEach(val => {
                item.option.push({
                  label: val.businessName,
                  value: val.businessId
                })
              })
            } else if (item.type === 'orderReport') {
              enums.BUSINESSTYPE2.forEach(val => {
                item.option.push({
                  label: val.businessName,
                  value: val.businessId
                })
              })
            } else if (item.type === 'orderCustom') {
              enums.BUSINESSTYPE4.forEach(val => {
                item.option.push({
                  label: val.businessName,
                  value: val.businessId
                })
              })
            } else if (item.type === 'orderShuttle') {
              enums.BUSINESSTYPE5.forEach(val => {
                item.option.push({
                  label: val.businessName,
                  value: val.businessId
                })
              })
            } else {
              enums.BUSINESSTYPE.forEach(val => {
                item.option.push({
                  label: val.businessName,
                  value: val.businessId
                })
              })
            }
          } else if (item.name === 'businessType') {
            item.option = []
            enums.BUSINESSTYPE1.forEach(val => {
              item.option.push({
                label: val.businessName,
                value: val.businessId
              })
            })
          } else if (item.name === 'orzId' || item.name === 'supplyId') {
            item.option = []
            if (item.type === 'busSchedule') return false
            let params = {}
            if (item.type === 'orzId' || item.name === 'orzId'){
              params.orzType = 1
            }
            net.apiGet(api.supply.optionList, params).then(data => {
              if (data.code === enums.NET_SUCCESS) {
                var options = []
                data.data.forEach(item => {
                  options.push({
                    label: item.orzName,
                    value: item.orzId
                  })
                })
                item.option = options
              } else {
                helper.E(data.msg)
              }
            })
          } else if (item.name === 'demandId') {
            item.option = []
            net.apiGet(api.supply.optionList, { orzType: 2 }).then(data => {
              if (data.code === enums.NET_SUCCESS) {
                var options = []
                data.data.forEach(item => {
                  options.push({
                    label: item.orzName,
                    value: item.orzId
                  })
                })
                item.option = options
              } else {
                helper.E(data.msg)
              }
            })
          } else if (item.name === 'isTicketToRide') { // 乘车形式
            item.option = []
            net.apiGet(api.customerServiceManage.isTicketToRide, {}).then(data => {
              if (data.code === enums.NET_SUCCESS) {
                var options = []
                data.data.forEach(item => {
                  options.push({
                    label: item.desc,
                    value: item.isTicketToRide
                  })
                })
                item.option = options
              } else {
                helper.E(data.msg)
              }
            })
          }
          // else if (item.name === 'demandId') {// 订单状态
          //   item.option = []
          //   net.apiGet(api.customerServiceManage.orderState, {}).then(data => {
          //     if (data.code === enums.NET_SUCCESS) {
          //       var options = []
          //       data.data.forEach(item => {
          //         options.push({
          //           label: item.orzName,
          //           value: item.orzId
          //         })
          //       })
          //       item.option = options
          //     } else {
          //       helper.E(data.msg)
          //     }
          //   })
          // }
          // else if (item.name === 'demandId') {// 支付渠道
          //   item.option = []
          //   net.apiGet(api.customerServiceManage.payChannelId, {}).then(data => {
          //     if (data.code === enums.NET_SUCCESS) {
          //       var options = []
          //       data.data.forEach(item => {
          //         options.push({
          //           label: item.orzName,
          //           value: item.orzId
          //         })
          //       })
          //       item.option = options
          //     } else {
          //       helper.E(data.msg)
          //     }
          //   })
          // }
          else if (item.name === 'payState') { // 支付状态
            item.option = []
            net.apiGet(api.customerServiceManage.payState, {}).then(data => {
              if (data.code === enums.NET_SUCCESS) {
                var options = []
                data.data.forEach(item => {
                  options.push({
                    label: item.desc,
                    value: item.payState
                  })
                })
                item.option = options
              } else {
                helper.E(data.msg)
              }
            })
          }
          if (index == data.length - 1) {
            this.formModules = data
          }
        })
      }
    },
    getBreadcrumb () {
      if (this.$route.meta.title != undefined) {
        this.bread = this.$route.meta
      }
    },
    doSearch () {
      this.searchData = []
      let formData = this.$refs.searchForm.getFormData()
      console.log("this.searchData==123",this.searchData)
      for (const key in formData) {
        if (key === 'lineTime' && formData.lineTime && formData.lineTime.length) {
          this.searchData.startCreateTime = formData.lineTime[0] + ' 00:00:00'
          this.searchData.endCreateTime = formData.lineTime[1] + ' 23:59:59'
        } else if (key === 'addTime' && key != null && formData['addTime'] != null) {
          // 创建时间
          this.searchData['startTime'] = formData['addTime'][0] + ' 00:00:00'
          this.searchData['endTime'] = formData['addTime'][1] + ' 23:59:59'
        } else if (key === 'orderTime' && formData['orderTime'] != null && formData['orderTime'].length > 0) {
          // 创建时间
          this.searchData['startTime'] = formData['orderTime'][0] + ' 00:00:00'
          this.searchData['endTime'] = formData['orderTime'][1] + ' 23:59:59'
        } else if (key === 'payTime' && formData['payTime'] != null && formData['payTime'].length > 0) {
          // 支付时间
          this.searchData['payTimeBegin'] = formData['payTime'][0] + ' 00:00:00'
          this.searchData['payTimeEnd'] = formData['payTime'][1] + ' 23:59:59'
        } else if (key === 'payTimeCustom' && formData.payTimeCustom && formData.payTimeCustom.length) {
          this.searchData.payTimeStart = formData.payTimeCustom[0] + ' 00:00:00'
          this.searchData.payTimeEnd = formData.payTimeCustom[1] + ' 23:59:59'
        } else if (key === 'customeDetailTime' && formData.customeDetailTime && formData.customeDetailTime.length) {
          let date1 = formData.customeDetailTime[0]
          let date2 = formData.customeDetailTime[1]
          date1 = date1.split('-')
          date2 = date2.split('-')
          this.searchData.rideDateStart = date1[0] + date1[1] + date1[2]
          this.searchData.rideDateEnd = date2[0] + date2[1] + date2[2]
        } else if (key === 'newOrderTime' && formData['newOrderTime'] != null && formData['newOrderTime'].length > 0) {
          // 下单时间
          this.searchData['orderTimeBegin'] = formData['newOrderTime'][0] + ' 00:00:00'
          this.searchData['orderTimeEnd'] = formData['newOrderTime'][1] + ' 23:59:59'
        } else if (key === 'workDate') {
          if (key === 'workDate' && formData['workDate'] != null && formData['workDate'].length > 0) {
            // 创建时间
            this.searchData['startTime'] = formData['workDate'][0]
            this.searchData['endTime'] = formData['workDate'][1]
          }
        } else if (key === 'workDates') {
          if (key === 'workDates' && formData.workDates != null && formData.workDates.length) {
            this.searchData.startTime = formData.workDates[0] + ' 00:00:00'
            this.searchData.endTime = formData.workDates[1] + ' 23:59:59'
          }
        } else if (key === 'charterType') {
          if (formData[key] === '单程') {
            this.searchData[key] = '1'
          } else if (formData[key] === '全天') {
            this.searchData[key] = '2'
          } else if (formData[key] === '往返') {
            this.searchData[key] = '3'
          } else {
            this.searchData[key] = '4'
          }
        } else if (key === 'isAlter' || key === 'isRefund') {
          switch (formData[key]) {
            case '是':
              this.searchData[key] = 1
              break
            case '否':
              this.searchData[key] = 0
              break
            default:
              break
          }
        } else if (key === 'lineProperty') {
          switch (formData[key]) {
            case '固定时间发车':
              this.searchData[key] = 1
              break
            case '周期循环发车':
              this.searchData[key] = 2
              break
            default:
              break
          }
        } else if(key==="createTime"){
          if(formData[key]&&formData[key][0]){
            this.searchData.sendTimeStart = formData[key][0] + ' 00:00:00'
            this.searchData.sendTimeEnd = formData[key][1] + ' 23:59:59'
          }else{
            this.searchData.sendTimeStart = ''
            this.searchData.sendTimeEnd = ''
          }
        } else if(key==="createTimeCardCoupon"){
          if(formData[key]&&formData[key][0]){
            this.searchData.startCreateTime = formData[key][0] + ' 00:00:00'
            this.searchData.endCreateTime = formData[key][1] + ' 23:59:59'
          } else{
            this.searchData.startCreateTime = ''
            this.searchData.endCreateTime = ''
          }
        }else if( key==="createTimeCouponBag"){
            if(formData[key]&&formData[key][0]){
              this.searchData.effectiveBeginDate =(formData[key][0] + ' 00:00:00')
              this.searchData.expiryEndDate = (formData[key][1] + ' 23:59:59') 
            } else{
              // this.searchData.effectiveBeginDate = ''
              // this.searchData.expiryEndDate = ''
            }
          }else if (key != null && formData[key] != null) {
          this.searchData[key] = (formData[key])
        }
      }
      for (const key in this.page) {
        this.searchData[key] = this.page[key]
      }
      this.$refs.childPage.getTableData(this.searchData)
    },
    doClearObj () {
      let thisDay = getYearMonthDayTime()
      let thisMon = getYearMonthTime()
      let dateInfo = {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      }
      if (this.$refs.searchForm === undefined) {} else {
        this.$refs.searchForm.clearForm()
        clearObj(this.searchData) // 清空搜索条件中的值
        let data = this.$refs.childPage.$data.formModules
        if (data && data.length) {
          data.forEach(item => {
            if (item.hasTime) {
              item.data = []
              if (item.hasTime === 'typeDay') {
                let time = thisDay.year + thisDay.month + thisDay.day // 取得初始化时间
                item.data = [thisDay.dayStr, thisDay.dayStr]
                this.searchData.rideDateStart = time
                this.searchData.rideDateEnd = time
                dateInfo.rideDateStart = time
                dateInfo.rideDateEnd = time
              } else if (item.hasTime === 'typeMon') {
                let time1 = thisMon.dayStr + '-01 00:00:00' // 开始时间
                let time2 = thisMon.dayStr + '-' + thisMon.days + ' 23:59:59' // 结束时间
                item.data = [thisMon.dayStr + '-01', thisMon.dayStr + '-' + thisMon.days]
                this.searchData.startTime = time1
                this.searchData.endTime = time2
                dateInfo.startTime = time1
                dateInfo.endTime = time2
              }
            } else {
              item.data = ''
            }
          })
        }
        this.$refs.childPage.getTableData(dateInfo)
      }
    }
  },
  created () {
    this.getBreadcrumb()
  }
})
</script>

<style scoped lang="less">
  @import "Container.less";
</style>
