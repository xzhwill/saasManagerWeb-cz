<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form :label-width="labelWidth" :model="ticketForm" style="width: 100%;" :inline="false" :rules="formRules" ref="ticketForm">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="商品名称" prop='updatesName' class="common-form-item">
        <el-input v-model="ticketForm.updatesName">
        </el-input>
      </el-form-item>
      <el-form-item prop="busTypeId" label="选择车型" class="common-form-item">
        <el-select v-model="ticketForm.busTypeId" filterable @change="getBusTypeInfo(ticketForm.busTypeId)" :disabled="charter.updateFlag ? 'readonly':false">
          <el-option
            v-for="(item, index) in busTypeList"
            :key="index"
            :label="item.busTypeName"
            :value="item.busTypeId"
            :readonly="charter.updateFlag ? 'readonly' : false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出厂型号" prop='busTypeNo' class="common-form-item" v-if="busType!=''">
        <el-input style="width:150px" v-model="busType.busTypeNo" :disabled="true">
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="所属机构" disabled="true" prop='price' class="common-form-item">
        <el-input style="width:150px" v-model="busType.price" type="number">
        </el-input>
      </el-form-item> -->
      <el-form-item label="标准载客数" prop='seatCount' class="common-form-item" v-if="busType!=''">
        <el-input style="width:150px" v-model="busType.seatCount" type="number" :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item label="最高载客数" prop='seatMaxCount' class="common-form-item" v-if="busType!=''">
        <el-input style="width:150px" v-model="busType.seatMaxCount" type="number" :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item label="续航里程" prop='mileageCount' class="common-form-item" v-if="busType!=''">
        <el-input style="width:150px" v-model="busType.mileageCount" type="number" :disabled="true">
        </el-input>公里
      </el-form-item>
      <el-form-item prop="cityCode" label="城市" class="common-form-item">
        <el-select v-model="ticketForm.cityCode" filterable @change="changeCity" :disabled="charter.updateFlag ? 'readonly' : false">
          <el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.cityCode" :readonly="charter.updateFlag ? 'readonly' : false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="timeRange" label="运营时间段" style="width: 3020px;">
        <el-time-picker
          is-range
          v-model="timeRange"
          format="HH:mm"
          value-format="HH:mm"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"></el-time-picker>
      </el-form-item>
      <el-form-item label="最小准备时间" prop='prepareTime' class="common-form-item">
        <el-input v-model="ticketForm.prepareTime" type="number" @blur="judgeInfo(ticketForm.prepareTime, 0)"></el-input>小时
      </el-form-item>
      <el-form-item label="起步价" prop='startingPriceYuan' class="common-form-item">
        <el-input v-model="ticketForm.startingPriceYuan" type="number" @blur="judgeInfo(ticketForm.startingPriceYuan, 1)"></el-input>元
      </el-form-item>
      <el-form-item label="图片" prop='image' class="common-form-item" v-if="busType!=''" style="max-width: 500px;">
        <el-image :src="ticketForm.thumbnailAddress"></el-image>
      </el-form-item>

      <el-form-item label="价格" prop='prices' class="common-form-item" style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;">
        <div v-for="(item ,index) in prices">
          <el-row style='display: flex;flex-direction: row;justify-content: flex-start;align-items: center;'>
            <el-select v-model="item.dayFlag" filterable :disabled="true">
              <!--charter.updateFlag ? 'readonly' : false-->
              <!--{ dayFlag: 2, dayFlagName: '工作日' }, { dayFlag: 3, dayFlagName: '节假日' }-->
              <el-option
                style="width: 100px;"
                v-for="(item, index) in [{ dayFlag: 1, dayFlagName: '全天' }]"
                :key="index"
                :label="item.dayFlagName"
                :value="item.dayFlag"
                :readonly="charter.updateFlag ? 'readonly' : false"></el-option>
            </el-select>
            <!-- <el-date-picker
              v-model="item.dateRange"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              range-separator="至"
              end-placeholder="结束日期"
              style='margin-right:10px;'>
            </el-date-picker> -->
            计费规则：
            <el-select v-model="item.ticketId" filterable @change="changePriceRulue" :disabled="charter.updateFlag ? 'readonly' : false">
              <el-option
                v-for="(item, index) in priceRulues"
                :key="index"
                :label="item.ticketName"
                :value="item.ticketId"
                :readonly="charter.updateFlag ? 'readonly' : false"></el-option>
            </el-select>
            <el-button
              style="margin-left:10px;"
              type="warning"
              plain
              v-if="index > 0"
              @click.prevent="removeCharter(index)"
              icon="el-icon-remove"
              class="btn"></el-button>
          </el-row>
        </div>
        <!-- <el-form-item>
          <el-button type="primary" plain @click.prevent="addCharter" icon="el-icon-circle-plus" class="btn"></el-button>
        </el-form-item> -->
      </el-form-item>
      <el-form-item label="商品详情">
      </el-form-item>
      <el-form-item label="图片" prop='image' class="common-form-item" v-if="busType!=''" style="max-width: 1000px;">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(item ,index) in ticketForm.detailIconAddress" :key="item" style="display: flex;justify-content: center;">
            <el-image :src="item" style="background: #fff;width: 100%;"></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="ticketForm.description" style='width: 400px' :maxLength="400"></el-input>
      </el-form-item>
      <el-form-item prop="state" label="线路状态:">
        <el-radio v-model="ticketForm.state" :label="parseInt(1)">可用</el-radio>
        <el-radio v-model="ticketForm.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group" style="margin-top: 15px;text-align: center">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { charteredUpShelfRules } from '@/utils/rules'
import request from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      clearTime: false,
      title: '新增包车商品',
      labelWidth: '180px',
      ticketForm: {
        updatesName: '', // 商品名称
        cityCode: '', // 城市编码
        description: '', // 描述
        thumbnailAddress: '', // 商品图片
        detailIconAddress: '', // 商品图片
        startTime: '', // 运营开始时间
        endTime: '', // 运营结束时间
        state: 0, // 线路状态
        ticketList: [], // 价格list
        updatesId: '',
        prepareTime: '', // 最小准备时间
        startingPriceYuan: '' // 起步价
      },
      cityList: [],
      busTypeList: [],
      busType: '',
      prices: [{
        dayFlag: 1,
        effectiveDate: '',
        expiryDate: '',
        ticketId: '',
        dateRange: []
      }],
      timeRange: ['08:00', '20:00'],
      dateRange: [],
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      currentPage: 1,
      formRules: charteredUpShelfRules,
      charter: {
        updateFlag: false
      },
      priceRulues: [],
      one: 1,
      index: 1,
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断为修改还是添加
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getAllCityList() // 城市
    this.getBusTypeList() // 车型
    this.getCharterRule() // 计费规则
    this.getQueryParams()
  },
  methods: {
    judgeInfo (val, index) {
      if (val) {
        if (!index) {
          if (isNaN(val) || (val <= 0)) {
            this.ticketForm.prepareTime = ''
            return help.W('最小准备时间为正整数，请重新输入')
          } else {
            this.ticketForm.prepareTime = (+val).toFixed()
          }
        } else {
          if (isNaN(val) || val < 0) {
            this.ticketForm.startingPriceYuan = ''
            return help.W('起步价为不小于0的数，请重新输入')
          }

        }
      }
    },
    /**
     * 获取所有的城市
     */
    getAllCityList () {
      request.apiGet(api.city.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 获取所有的车型
     */
    getBusTypeList () {
      request.apiGet(api.busType.optionList).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.busTypeList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 获取计费规则
     */
    getCharterRule () {
      this.priceRulues = []
      request.apiGet(api.charteredTicket.optionList).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.priceRulues = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 选择或改变车型
     * @param e：车型ID
     */
    getBusTypeInfo (e) {
      request.apiGet(api.charteredUpShelf.busTypeInfo, { busTypeId: e }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.busType = data.data
          if (this.busType.detailIconAddress) this.ticketForm.detailIconAddress = this.busType.detailIconAddress.split(',')
          this.ticketForm.thumbnailAddress = this.busType.thumbnailAddress
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 选择或改变城市
     * @param e：城市编码
     */
    changeCity (e) {},
    /**
     * 选择或改变计费规则
     * @param e：计费规则ID
     */
    changePriceRulue (e) {},
    /**
     * 删除价格列表项
     * @param idx：列表下标
     */
    removeCharter (idx) {
      if (this.one > 1) {
        this.one--
        this.prices.splice(idx, 1)
      }
    },
    /**
     * 添加价格列表项
     */
    addCharter () {
      this.one++
      this.prices.push({
        dayFlag: 1,
        effectiveDate: '',
        expiryDate: '',
        ticketId: '',
        dateRange: []
      })
    },
    /**
     * 点击保存按钮
     */
    save () {
      this.$refs['ticketForm'].validate(valid => {
        if (valid) {
          let params = this.ticketForm
          if (this.prices.length) { // 价格列表
            params.ticketList = this.prices
            params.ticketList.forEach(item => {
              item.effectiveDate = item.dateRange[0]
              item.expiryDate = item.dateRange[1]
            })
          }
          this.timeRange.forEach((item, index) => { // 反显标签
            !+index ? params.startTime = item : params.endTime = item
          })
          params.startingPrice = Math.round(parseFloat(params.startingPriceYuan) * 100)
          request.apiPost(this.uid ? api.charteredUpShelf.update : api.charteredUpShelf.create, params).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              sessionStorage.setItem('charteredUpShelf', 'true')
              help.S('保存成功')
              this.$router.back()
            } else {
              help.E(data.msg)
            }
          }).catch(() => {
            help.Echo('网络异常')
          })
        } else {
          return false
        }
      })
    },
    /**
     * 点击取消回退
     */
    back () {
      sessionStorage.setItem('charteredUpShelf', 'true')
      this.$router.back()
    },
    /**
     * 添加、修改页面初始化
     */
    getQueryParams () {
      if (this.uid) {
        this.title = '修改包车商品'
        request.apiGet(api.charteredUpShelf.info, { updatesId: this.uid }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            let res = data.data
            let ticketForm = { ...this.ticketForm, ...res }
            // ticketForm.startingPrice = res.startingPriceYuan
            this.timeRange = [res.startTime, res.endTime]
            if (res.ticketList.length) {
              this.prices = []
              ticketForm.ticketList.forEach((item) => {
                item.dateRange = [item.effectiveDate, item.expiryDate]
                this.prices.push({
                  dayFlag: item.dayFlag,
                  effectiveDate: item.effectiveDate,
                  expiryDate: item.expiryDate,
                  ticketId: item.ticketId,
                  dateRange: item.dateRange
                })
              })
              this.one = res.ticketList.length
            }
            this.ticketForm = ticketForm
            this.getBusTypeInfo(res.busTypeId)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/style/common.css";
  @import "./addCharteredUpShelf.less";
</style>
