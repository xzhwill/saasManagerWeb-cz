<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form
      enctype="multipart/form-data"
      label-width="100px"
      style="width: 100%;"
      :inline="true"
      :model="schedule"
      :rules="formRules"
      ref="addSchedule"
      label-position="right">
      <div class="form-section" style="font-size: 18px;margin-bottom: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <div>
        <el-button
          round
          plain
          class="search-form-toggle"
          :icon="show.showA ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          style="float: right"
          type="success"
          @click="show.showA = !show.showA">{{ show.showA ? '收起' : '展开' }}</el-button>
        <div class="form-section" style="margin-bottom:15px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>班次基础信息</label>
        </div>
        <transition name="fade">
          <div class="showA" v-if="show.showA">
            <el-form-item prop="className" label="班次名称">
              <el-input v-model=" schedule.className" :readonly="Boolean(uid) && isLine"></el-input>
            </el-form-item>
            <el-form-item prop="cityCode" label="城市" class="common-form-item">
              <el-select v-model="schedule.cityCode" filterable @change="changeCity" :disabled="Boolean(uid)">
                <el-option
                  v-for="(item, index) in cityList"
                  :key="index"
                  :label="item.cityName"
                  :value="item.cityCode"
                  :readonly="uid ? 'readonly' : false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="supplyOrzId" label="供给侧" class="common-form-item">
              <el-select v-model="schedule.supplyOrzId" filterable @change="changeSupplyOrz" :disabled="Boolean(uid)">
                <el-option v-for="(item, index) in supplyList" :key="index" :label="item.orzName" :value="item.orzId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路类型:" prop="businessType" class="common-form-item">
              <el-select v-model="schedule.businessType" filterable @change="changeBusinessType" :disabled="Boolean(uid)">
                <el-option v-for="(item, index) in businessTypeList " :key="index" :label="item.businessName" :value="parseInt(item.businessId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="lineId" label="选择线路" class="common-form-item">
              <el-select
                filterable
                v-model="schedule.lineId"
                placeholder="请优先选择城市"
                @change="getLineSite(schedule)"
                style="width: 350px;"
                :disabled="Boolean(uid)">
                <el-option v-for="(item, index) in lineList" :key="index" :label="item.lineName" :value="item.lineId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="classType" label="班次类型">
              <el-radio v-model="schedule.classType" :label="1" v-if="lineProperty != '2'" :disabled="Boolean(uid) && isLine">早班</el-radio>
              <el-radio v-model="schedule.classType" :label="2" v-if="lineProperty != '2'" :disabled="Boolean(uid) && isLine">晚班</el-radio>
              <el-radio v-model="schedule.classType" :label="3" v-if="lineProperty == '2'" :disabled="Boolean(uid) && isLine">循环班</el-radio>
            </el-form-item>
            <!--<el-form-item label="发车频率:" prop="scheduleFrequence" class="common-form-item" v-if="schedule.classType == payReportForms">
              <el-input v-model="schedule.scheduleFrequence" placeholder="" type="number" style="width:150px;"></el-input>分钟
            </el-form-item>
            <el-form-item  prop="startTime" label="首班车时间:" >
              <el-input v-model="schedule.startTime" placeholder="时间格式严格参照xx:xx"></el-input>
            </el-form-item>
            <el-form-item prop="endTime"  label="晚班车时间:">
              <el-input v-model="schedule.endTime" placeholder="时间格式严格参照xx:xx"></el-input>
            </el-form-item>-->
            <el-form-item label="车型" prop="busTypeId" class="common-form-item" style='width: 2000px;'>
              <el-select v-model="schedule.busTypeId" filterable @change="changeBusType()">
                <el-option v-for="(item, index) in busTypeList" :key="index" :label="item.busTypeName" :value="item.busTypeId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="seatCount" label="标准载客数">
              <el-input v-model="schedule.seatCount"></el-input>
            </el-form-item>
            <el-form-item prop="seatMaxCount" label="最大载客数">
              <el-input v-model="schedule.seatMaxCount" @blur="judgeCount" type="tel"></el-input>
            </el-form-item>
            <el-form-item prop="dateRange" label="有效期" style='width: 2000px;'>
              <el-date-picker
                v-model="schedule.dateRange"
                :picker-options="dateRangPickerOptions"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                @change="changeTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item prop="workingCirculate" label="运行周期" style='width: 2000px;'>
              <el-radio v-model="schedule.workingCirculate" :label="1">工作日</el-radio>
              <el-radio v-model="schedule.workingCirculate" :label="2">节假日</el-radio>
              <el-radio v-model="schedule.workingCirculate" :label="3">不限</el-radio>
              <el-radio v-model="schedule.workingCirculate" :label="4">指定日期</el-radio>
              <el-date-picker
                v-model="schedule.specialDateList"
                type="dates"
                :disabled="+schedule.workingCirculate !== 4 || !schedule.dateRange.length"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item prop="priceYuan" label="价格">
              <el-input v-model="schedule.priceYuan"></el-input>
            </el-form-item>
            <el-form-item prop="classNature" label="是否预售">
              <el-radio v-model="schedule.classNature" :label="1" :disabled="canAdvanceSale">是</el-radio>
              <el-radio v-model="schedule.classNature" :label="2" :disabled="canAdvanceSale">否</el-radio>
            </el-form-item>
            <el-form-item label="最少开线人数:" prop="openLineNumber" class="common-form-item" v-if="schedule.classNature==1">
              <el-input v-model="schedule.openLineNumber" type="tel" @blur="judgePerson"></el-input>
            </el-form-item>
            <!--<el-form-item prop="isAlter" label="是否可改签">
              <el-radio v-model="schedule.isAlter" :label="1">是</el-radio>
              <el-radio v-model="schedule.isAlter" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item prop="isRefund" label="是否可退款">
              <el-radio v-model="schedule.isRefund" :label="1">是</el-radio>
              <el-radio v-model="schedule.isRefund" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item prop="seatType" label="是否可选座">
              <el-radio v-model="schedule.seatType" :label="1">是</el-radio>
              <el-radio v-model="schedule.seatType" :label="0">否</el-radio>
            </el-form-item>-->
            <el-table header-row-class-name="tableHeader" class="page-table-main" :data="siteList" border style="margin-bottom: 15px;">
              <el-table-column
                v-for="(item, index) in tableHeader"
                :key="index"
                :label="item.label"
                align="center"
                :prop="item.name"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="item.name != 'siteTime' && item.name != 'siteType'">{{scope.row[item.name]}}</span>
                  <span v-if="item.name == 'siteType'">
										<!--<span v-if="scope.row.siteType == orderReportForms">上车点</span>-->
                    <!--<span v-if="scope.row.siteType == travelReportForms">下车点</span>-->
										<span v-if="scope.row.siteType == 3">上下车点</span>
										<span v-if="scope.row.siteType == 4">途径点</span>
									</span>
                  <span v-if="item.name == 'siteTime'">
										<el-input
                      style="width:130px"
                      v-model="showTimeList[scope.row.siteNum].siteTime"
                      :disabled="+scope.row.siteType === 4 ? true : false"
                      placeholder="例：09:00"></el-input>
									</span>
                </template>
              </el-table-column>
            </el-table>
            <el-form-item prop="state" label="班次状态:">
              <el-radio v-model="schedule.state" :label="parseInt(1)">可用</el-radio>
              <el-radio v-model="schedule.state" :label="parseInt(0)">禁用</el-radio>
            </el-form-item>
          </div>
        </transition>
      </div>
      <!--<div>
        <el-button class="search-form-toggle" :icon="show.showB ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="float: right" round plain type="success" @click="toggle('showB')">{{show.showB?'收起':'展开'}}</el-button>
        <div class="form-section" style="margin-bottom:15px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>购票开放时间配置</label>
        </div>
        <transition name="fade">
          <div class="showB" v-if="show.showB">

            <el-form-item label="渠道" prop="channelArr" style="width: 100%;">
              <el-checkbox-group v-model="channelArrList" @change="changeChannel">
                <el-checkbox v-for="channel in channelList" :label="channel.channelId" :key="channel.channelId">{{channel.channelName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div>
            </div>
          </div>
        </transition>
      </div>
      <div class="divide"></div>-->
      <el-row class="btn-group" style="margin-top: 15px;text-align: center">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'
import { addScheduleFormRules } from '@/utils/rules'
import { getToDayDate } from '@/utils/public'

export default {
  data () {
    return {
      canAdvanceSale: false, // 预售按钮是否可以切换
      show: {
        showA: true,
        showB: false
      },
      title: '新建班次',
      labelWidth: '80px',
      schedule: {
        scheduleName: '',
        lineName: '',
        demandOrzId: '', //  需求侧机构id
        classType: 1,
        classNature: 2,
        state: 0,
        remark: '',
        workingCirculate: 1,
        platformPriceYuan: '',
        price: '',
        priceYuan: '',
        supplyOrzId: '', // 供给侧ID
        dateRange: [], // 有效期
        scheduleFrequence: '',
        businessType: '', // 线路类型
        orzName: '请选择线路',
        busTypeId: '',
        supplyId: '',
        specialDateList: [],
        openLineNumber: '', // 最少开线人数
        lineId: '', // 线路
        seatCount: '', // 标准载客数
        cityCode: '', // 城市ID
        seatMaxCount: '' // 最大载客数
      },
      tableHeader: [
        {
          label: '站点ID',
          name: 'siteSid'
        }, {
          label: '站点名称',
          name: 'siteName'
        }, {
          label: '站点描述',
          name: 'description'
        }, {
          label: '站点类型',
          name: 'siteType'
        }, {
          label: '时刻表',
          name: 'siteTime'
        }
      ],
      busTypeInfo: {},
      siteList: [],
      specialDateRange: [],
      showTimeList: [],
      lineList: [],
      busTypeList: [],
      siteTimeList: [],
      verificationRule: false,
      days: [],
      checkedCount: 20,
      originLineId: '',
      formRules: addScheduleFormRules,
      cityList: [], // 城市列表
      // channelArrList: [], // 选择渠道列表
      // channelDateList: [], //  开放日期配置
      supplyList: [], //  供给侧列表
      businessTypeList: enums.BUSINESSTYPE4,
      lineProperty: '',
      uid: this.$route.query.id ? this.$route.query.id : '', // 判断修改还是添加页面
      isLine: this.$route.query.isLine ? this.$route.query.isLine : false, // 判断是否是从线路管理跳转过来的
      pickerOptions: { // 设置禁选时间
        disabledDate: (time) => {
          return (new Date(this.schedule.dateRange[0]).getTime() - 24 * 3600 * 1000) > time.getTime() || new Date(this.schedule.dateRange[1]).getTime() < time.getTime()
        }
      },
      dateRangPickerOptions: { // 设置禁选时间
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      initSeatMaxCount: '', // 初始化最大载客数数量（修改页面使用）
      copyTime: [] // 有效期副本
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getChannel() // 获取所有的城市信息
    this.getQueryParams() // 判断是否是修改页面
    this.getParamsFromLine() // 判断是否是从线路管理页面过来的
  },
  methods: {
    /**
     * 获取城市列表
     */
    getChannel () {
      request.apiGet(api.city.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    /**
     * 改变城市
     */
    changeCity () {
      this.schedule.lineId = ''
      this.schedule.supplyOrzId = ''
      this.schedule.orzName = ''
      this.schedule.businessType = ''
      this.getBaseList() // 获取供给侧列表
    },
    /**
     * 获取线路
     */
    changeSupplyOrz () {
      this.schedule.businessType = '' // 清空线路类型
      this.schedule.lineId = '' // 清空线路列表
      request.apiGet(api.line.getLine, { // 获取线路列表值
        cityCode: this.schedule.cityCode,
        orzId: this.schedule.supplyOrzId
      }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.lineList = data.data.list
        }
      })
    },
    /**
     * 判断是否是从线路管理页面过来的
     */
    getParamsFromLine () {
      if (this.isLine) {
        this.schedule.cityCode = this.$route.query.cityCode // 设置城市
        this.schedule.supplyOrzId = this.$route.query.supplyId // 设置供给侧
        this.schedule.businessType = +this.$route.query.businessType // 设置线路类型
        this.schedule.lineId = this.$route.query.lineId // 设置线路
        this.getBaseList() // 获取供给侧列表
        this.getLineSite(this.schedule) // 获取线路下的站点
        this.getLineList({ // 获取线路
          cityCode: this.schedule.cityCode,
          orzId: this.schedule.supplyOrzId,
          businessType: this.schedule.businessType
        })
      }
    },
    /**
     * 改变线路类型
     */
    changeBusinessType () {
      this.schedule.lineId = '' // 清空线路列表
      this.getLineList({ // 获取线路列表值
        cityCode: this.schedule.cityCode,
        orzId: this.schedule.supplyOrzId,
        businessType: this.schedule.businessType
      })
    },
    /**
     * 获取线路列表
     * @param params：接口参数
     */
    getLineList (params) {
      request.apiGet(api.line.optionList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.lineList = data.data
        }
      })
    },
    /**
     * 判断是否是修改页面
     */
    getQueryParams () {
      if (this.uid) {
        this.title = '修改班次'
        this.classId = this.uid
        request.apiGet(api.schedule.info, { scheduleId: this.uid }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.schedule = {
              ...this.schedule,
              ...res
            }
            this.initSeatMaxCount = res.seatMaxCount
            if (+res.classNature === 2) this.canAdvanceSale = true
            this.originLineId = res.lineId
            this.schedule.dateRange = [res.effectiveDate, res.expiryDate]
            this.copyTime = [res.effectiveDate, res.expiryDate]
            this.schedule.showWorkingDay = res.workingDay
            this.siteTimeList = res.siteTimeList
            this.schedule.supplyOrzId = res.supplyId
            this.schedule.ticketPriceType = res.ticketPriceType
            this.schedule.priceYuan = parseFloat(res.priceYuan)
            this.schedule.businessType = parseInt(res.businessType)
            if (res.frequence != undefined) {
              this.schedule.scheduleFrequence = parseInt(res.frequence)
            }
            this.siteList = res.siteList
            this.showTimeList = []
            let newTimeArr = []
            this.siteList.forEach((item, index) => {
              let obj = {
                siteSid: item.siteSid,
                siteId: item.siteId,
                siteTime: item.siteTime,
                siteType: item.siteType
              }
              item.siteNum = index
              newTimeArr.push(obj)
            })
            this.showTimeList = newTimeArr
            this.getBaseList()
            this.getLineList({
              cityCode: res.cityCode,
              orzId: this.schedule.supplyOrzId,
              businessType: this.schedule.businessType
            })
            this.changeBusType()
            // this.getLineSite(this.schedule.lineId)
          }
        })
      }
    },
    /**
     * 改变车型
     */
    changeBusType () {
      this.busTypeList.forEach(item => {
        if (item.busTypeId === this.schedule.busTypeId) {
          this.schedule.seatCount = item.seatCount
          this.schedule.seatMaxCount = item.seatMaxCount
        }
      })
    },
    /**
     * 获取供给侧列表
     */
    getBaseList () {
      request.apiGet(api.supply.optionList, {
        cityCode: this.schedule.cityCode,
        orzType: 1
      }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.supplyList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
      request.apiGet(api.busType.optionList).then(data => { // 获取车型
        if (data && data.code === enums.NET_SUCCESS) {
          this.busTypeList = data.data
        }
      })
    },
    /**
     * 时间改变
     * @param time：接收的时间
     */
    changeTime (time) {
      let today = getToDayDate()
      let year = time[0].slice(0, 4)
      let month = time[0].slice(5, 7)
      let day = time[0].slice(8, 10)
      if (getToDayDate().year > year) {
        return this.toast()
      } else if (+today.year === +year) {
        if (today.month > month) {
          return this.toast()
        } else if (+today.month === +month) {
          if (today.day > day) return this.toast()
        }
      }
      // if (time.length) this.schedule.dateRange = time
    },
    /**
     * toast提示封装
     */
    toast () {
      this.schedule.dateRange = this.copyTime
      help.W('初始日期不可改为今日之前')
    },
    getLineSite (val) {
      this.lineProperty = val.lineProperty
      if (this.schedule.lineId != null) {
        request.apiGet(api.line.show, { lineId: this.schedule.lineId }).then(data => { // 获取该线路的站点
          if (data && data.code === enums.NET_SUCCESS) {
            this.siteList = data.data.siteList
            this.lineProperty = data.data.lineProperty
            if (this.lineProperty == 1) {
              this.schedule.classType = 1
            } else if (this.lineProperty == 2) {
              this.schedule.classType = 3
            }
            this.showTimeList = []
            let newTimeArr = []
            this.siteList.forEach((item, index) => {
              let obj = {
                siteSid: item.siteSid,
                siteId: item.siteId,
                siteTime: '',
                siteType: item.siteType
              }
              newTimeArr.push(obj)
              item['siteNum'] = index
            })
            for (let i = 0; i < newTimeArr.length; i++) {
              for (let j = 0; j < this.showTimeList.length; j++) {
                if (newTimeArr[i].siteId == this.showTimeList[j].siteId) {
                  newTimeArr[i].siteTime = this.showTimeList[j].siteTime
                  break
                } else {
                  if (j == (this.showTimeList.length - 1)) {

                  }
                }
              }
            }
            this.showTimeList = newTimeArr
          }
        })
      }
    },
    save () {
      this.$refs['addSchedule'].validate((valid) => {
        if (valid) {
          if (+this.schedule.classNature === 1 && !this.schedule.openLineNumber) return help.W('请填写最少开线人数')
          // let isTime = 0
          let arr = []
          let flag = true
          this.showTimeList.forEach((item, index) => {
            if (!item.siteTime && +item.siteType !== 4) {
              flag = false
              return help.W('请先填写站点时刻')
            }
            if (item.siteTime && +item.siteType !== 4) arr.push(item.siteTime)
            // if (+item.siteType !== 4 && !item.siteTime) {
            //   isTime = isTime + orderReportForms
            // }
          })
          let arr1 = arr.join(',') + ','
          for (let i = 0; i < arr.length; i++) { // 判断每个班次的时间不能重复
            if (arr1.replace(arr[i] + ',', '').indexOf(arr[i] + '') > -1) {
              flag = false
              return help.W('每个班次的时间不可重复，请重新设置')
            }
          }
          // if (isTime > 0) return help.E('时间表未配置~')
          if (flag) this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      let params = this.schedule
      delete params['addTime']
      delete params['updateTime']
      params['workingDay'] = Number.parseInt(params['showWorkingDay'])
      params['price'] = Math.round(parseFloat(this.schedule.priceYuan) * 100)
      params.effectiveDate = this.schedule.dateRange[0]
      params.expiryDate = this.schedule.dateRange[1]
      // params.sellTicketList = this.channelDateList
      params['openLineNumber'] = this.schedule.openLineNumber
      let reg = /^(([1-9]{1})|([0-1][0-9])|([1-2][0-3])):([0-5][0-9])$/
      var regExp = new RegExp(reg)
      for (let i = 0; i < this.showTimeList.length; i++) {
        if (!regExp.test(this.showTimeList[i].siteTime) && this.showTimeList[i].siteType == 1) {
          help.E('输入的时刻表时间格式有误，请重新填写')
          return false
        }
      }
      params.siteTimeList = (this.showTimeList)
      params.siteList = (this.showTimeList)
      params.seatMaxCount = Number.parseInt(this.schedule.seatMaxCount)
      params.seatCount = Number.parseInt(this.schedule.seatCount)
      params.classNature = parseInt(this.schedule.classNature)
      params.classType = parseInt(this.schedule.classType)
      params.openLineNumber = parseInt(this.schedule.openLineNumber)
      params.ticketPriceType = 1
      params.workingCirculate = parseInt(this.schedule.workingCirculate)
      params.supplyId = this.schedule.supplyOrzId
      params.specialDateList = this.schedule.specialDateList
      params.frequence = parseInt(this.schedule.scheduleFrequence)
      let url = (this.isLine || !this.uid) ? api.schedule.add : api.schedule.update
      request.apiPost(url, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('scheduleFlag', 'true')
          this.$router.push({ path: './schedulingManage' })
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('scheduleFlag', 'true')
      this.$router.back()
    },
    /**
     * 判断修改页面的最大载客数
     */
    judgeCount (e) {
      let val = e.target.value
      if (val) {
        if (isNaN(+val) || (val <= 0)) {
          this.schedule.seatMaxCount = ''
          return help.W('最大载客数为正整数，请重新输入')
        } else {
          this.schedule.seatMaxCount = (+val).toFixed()
        }
      }

      // if (this.uid) {
      //   if (this.initSeatMaxCount > val) {
      //     help.W('不能低于已设定的最大载客数')
      //     this.schedule.seatMaxCount = this.initSeatMaxCount
      //     return false
      //   }
      // }
    },
    /**
     * 最小开线人数字段判断
     * @param e
     */
    judgePerson (e) {
      let val = e.target.value
      if (val) {
        if (isNaN(+val) || (val <= 0)) {
          this.schedule.openLineNumber = ''
          return help.W('最小开线人数为正整数，请重新输入')
        } else {
          this.schedule.openLineNumber = (+val).toFixed()
        }
      }
    }
  }
}
</script>

<style scoped>
  @import '../../assets/style/common.css';
  .el-form-item {
    width: 40%;
  }
</style>
