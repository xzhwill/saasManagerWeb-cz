<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form
      enctype="multipart/form-data"
      label-width="150px"
      style="width: 100%;"
      :model="singleCoupon"
      :rules="formRules"
      ref="addSingleCoupon"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <div style="margin-top: 15px;">
        <el-button
          round
          plain
          class="search-form-toggle"
          :icon="show.showA ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          style="float: right;"
          type="success"
          @click="toggle(1)">
          {{ show.showA ? '收起' : '展开' }}
        </el-button>
        <div class="form-section" style="margin-bottom:15px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>基础信息</label>
        </div>
        <transition name="fade">
          <div class="showA" v-if="show.showA">
            <el-form-item label="券名称" prop="templateName" class="common-form-item">
              <el-input v-model="singleCoupon.templateName" palceholder="请输入单模板名称" maxlength="10" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="模板类型">
              <el-radio v-model="singleCoupon.templateType" label="1">单次券</el-radio>
              <el-radio v-model="singleCoupon.templateType" label="2">多次券</el-radio>
            </el-form-item>
            <el-form-item label="抵扣类型">
              <el-radio v-model="singleCoupon.templateKind" label="3">现金抵扣</el-radio>
              <el-radio v-model="singleCoupon.templateKind" label="4">消费折扣</el-radio>
            </el-form-item>
            <el-form-item label="面值" prop="faceValueYuan" class="common-form-item" v-if="+singleCoupon.templateKind === 3">
              <el-input v-model="singleCoupon.faceValueYuan" style="width: 150px;" :maxlength="7" @blur="judgeInfo(singleCoupon.faceValueYuan, 9)"></el-input>元
            </el-form-item>
            <el-form-item
              class="common-form-item"
              label="折扣"
              prop="faceValueDisc"
              v-if="+singleCoupon.templateKind === 4">
              <el-input
                v-model="singleCoupon.faceValueDisc"
                style="width: 150px;"
                :maxlength="4"
                @blur="judgeInfo(singleCoupon.faceValueDisc, 8)"></el-input>折
            </el-form-item>
            <el-form-item label="有效期">
              <el-radio v-model="singleCoupon.validityDateType" label="1">固定日期</el-radio>
              <el-radio v-model="singleCoupon.validityDateType" label="2">领劵当日开始有效天数</el-radio>
              <el-radio v-model="singleCoupon.validityDateType" label="3">永久有效</el-radio>
              <el-radio v-model="singleCoupon.validityDateType" label="4">自然月</el-radio>
              <el-radio v-model="singleCoupon.validityDateType" label="5">自然周</el-radio>
            </el-form-item>
            <el-form-item label="有效日期" v-if="+singleCoupon.validityDateType === 1">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="有效天数"
              prop="effectiveDays"
              class="common-form-item"
              v-if="+singleCoupon.validityDateType === 2">
              <el-input
                :maxlength="4"
                v-model="singleCoupon.effectiveDays"
                @blur="judgeInfo(singleCoupon.effectiveDays, 1)"></el-input>
            </el-form-item>
            <el-form-item
              class="common-form-item"
              label="使用次数"
              prop="effectiveTimes"
              v-if="+singleCoupon.templateType === 2">
              <el-input
                v-model="singleCoupon.effectiveTimes"
                :maxlength="4"
                @blur="judgeInfo(singleCoupon.effectiveTimes, 2)"></el-input>
            </el-form-item>
            <el-form-item class="common-form-item" label="券张数" prop="couponQuantity" v-if="+singleCoupon.templateType === 1">
              <el-input
                v-model="singleCoupon.couponQuantity"
                :maxlength="4"
                @blur="judgeInfo(singleCoupon.couponQuantity, 3)"></el-input>
            </el-form-item>
            <el-form-item label="权重" prop="templateWeight" class="common-form-item">
              <el-input v-model="singleCoupon.templateWeight" type="number" maxlength="3"></el-input>
            </el-form-item>
          </div>
        </transition>
      </div>
      <div class="divide"></div>
      <div style="margin-top: 15px;">
        <el-button class="search-form-toggle" :icon="show.showB ? 'el-icon-arrow-up':'el-icon-arrow-down'" style="float:right"
                   round plain type="success" @click="toggle(2)">{{show.showB?'收起':'展开'}}</el-button>
        <div class="form-section" style="margin-bottom:15px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>使用条件</label>
        </div>
        <transition name="fade">
          <div class="showB" v-if="show.showB">
            <el-form-item label="渠道" class="common-form-item" prop="chooseChannel">
              <el-checkbox-group v-model="singleCoupon.chooseChannel">
                <el-checkbox v-for="channel in channelList" :label="channel.channelId" :key="channel.channelId">{{channel.channelName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="业务类型" class="common-form-item" prop="businessTypeList">
              <el-checkbox-group v-model="singleCoupon.businessTypeList">
                <el-checkbox v-for="item in businessList" :label="item.businessId" :key="item.businessId">{{item.businessName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="选择城市" prop="checkedCityList">
              <el-transfer @change="checkedCityChanged" :button-texts="['移除', '添加']" :titles="['城市名称', '已选择']" v-model="singleCoupon.checkedCityList" :data="cityList"></el-transfer>
            </el-form-item>
            <el-form-item label="使用门槛" prop="useRuleValueYuan" class="common-form-item">
              <el-input
                v-model="singleCoupon.useRuleValueYuan"
                placeholder="超过多少元可用"
                :maxlength="7"
                @blur="judgeInfo(singleCoupon.useRuleValueYuan, 4)"></el-input>
            </el-form-item>
            <el-form-item label="优惠上限" prop="discountLimitYuan" class="common-form-item">
              每次最多优惠
              <el-input
                v-model="singleCoupon.discountLimitYuan"
                style="width: 100px;margin: 0 15px;"
                :maxlength="7"
                @blur="judgeInfo(singleCoupon.discountLimitYuan, 5)"></el-input>元
            </el-form-item>
            <el-form-item label="使用限制" prop="dailyUseLimit" class="common-form-item">
              每天最多使用
              <el-input
                v-model="singleCoupon.dailyUseLimit"
                style="width: 100px;margin: 0 15px;"
                :maxlength="4"
                @blur="judgeInfo(singleCoupon.dailyUseLimit, 6)"></el-input>次
            </el-form-item>
            <el-form-item label="最低消费金额" prop="minLimitYuan" class="common-form-item">
              <el-input
                v-model="singleCoupon.minLimitYuan"
                placeholder="最低消费多少元"
                :maxlength="7"
                @blur="judgeInfo(singleCoupon.minLimitYuan, 7)"></el-input>元
            </el-form-item>
            <el-form-item label="购票类型限制" class="common-form-item" prop="ticketTypeLimits">
              <el-checkbox-group v-model="singleCoupon.ticketTypeLimits">
                <el-checkbox
                  v-for="item in ticketType"
                  :label="item.value"
                  :key="item.value"
                  @change="getType(item.value, singleCoupon.ticketTypeLimits)">{{ item.ticketType }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="班次限制">
              <el-radio v-model="singleCoupon.scheduleLimit" label="0">全部班次</el-radio>
              <el-radio v-model="singleCoupon.scheduleLimit" label="1">部分班次</el-radio>
            </el-form-item>
            <el-form-item label="选择班次" v-if="singleCoupon.scheduleLimit == 1">
              <el-transfer @change="checkedScheduleChanged" :button-texts="['移除', '添加']" :titles="['班次名称', '已选择']" v-model="checkedScheduleList" :data="scheduleList"></el-transfer>
            </el-form-item>
            <el-form-item label="享受折上折">
              <el-radio v-model="singleCoupon.foldUp" label="1">是</el-radio>
              <el-radio v-model="singleCoupon.foldUp" label="0">否</el-radio>
            </el-form-item>
          </div>
        </transition>
      </div>
      <el-row class="btn-group">
        <el-button type="primary" @click="save" v-if="+singleCoupon.templateStatus === 1">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { marketCouponSingleRule } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'addMarketCouponSingle',
  data () {
    return {
      title: '添加单模板',
      show: {
        showA: true,
        showB: false
      },
      labelWidth: '120px',
      dateRange: [], // 有效期为1时
      singleCoupon: {
        templateName: '', //  券名称
        templateType: '1', // 模板类型 orderReportForms-单次劵 travelReportForms-多次卷
        templateWeight: '', // 权重
        templateKind: '3', // 抵扣类型 payReportForms-现金抵价券 4-折扣抵扣（orderReportForms-充值满减 travelReportForms-充值满送）
        validityDateType: '1', // 有效期类型 orderReportForms-固定日期 travelReportForms-领劵当日开始几天有效 payReportForms-永久有效 4-自然月 5-自然周
        startTime: '', // 开始日期
        endTime: '', // 结束日期
        effectiveDays: '', // 有效天数
        faceValue: '', //  面值或折扣
        faceValueYuan: '', // 面值，显示元
        faceValueDisc: '', // 面值，显示多少折
        couponQuantity: '', // 券张数（捆绑数量）
        effectiveTimes: '', // 多次券时的有效使用次数,0表示不限制使用次数
        useRuleValue: '', // 使用门槛（分）
        useRuleValueYuan: '', // 使用门槛（元）
        discountLimit: '', // 优惠上限（分）
        discountLimitYuan: '', // 优惠上限（元）
        dailyUseLimit: '', // 每天最多使用次数（使用限制）
        minLimit: '', // 最低消费金额（分）
        minLimitYuan: '', // 最低消费金额（元）
        foldUp: '1', // 是否享受折上折：0、否；orderReportForms、是
        scheduleLimit: '0', // 班次限制
        templateStatus: '1', // 券的状态 orderReportForms-草稿  travelReportForms-上线中  payReportForms-已下线 4-已删除
        chooseChannel: [], // 已选渠道
        businessTypeList: [], // 已选业务类型
        checkedCityList: [], // 已选城市
        ticketTypeLimits: [] // 购票类型限制
      },
      // chooseChannelList: [], // 已选渠道
      channelList: [], // 所有渠道
      cityList: [], // 城市列表
      checkedCityList: [], // 已选城市
      businessList: enums.BUSINESSTYPE2,
      ticketType: enums.TICKETTYPELIMIT,
      checkedScheduleList: [], // 已选班次
      scheduleList: [], // 所有班次
      formRules: marketCouponSingleRule,
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断为修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', []);
    (async () => {
      const city = this.getChannelAndCity()
      await city
      this.getCouponInfo() // async call
    })()
  },
  methods: {
    /**
     * 对输入值的校验
     * @param val：输入的值
     * @param index：类型判断
     */
    judgeInfo (val, index) {
      switch (index) {
        case 1:
          if (isNaN(val)) {
            this.singleCoupon.effectiveDays = ''
            return help.E('请输入正确的有效天数')
          } else if (val > 1000) {
            this.singleCoupon.effectiveDays = 1000
            return help.W('有效天数不能超过1000天')
          } else {
            if (val) this.singleCoupon.effectiveDays = parseInt(+val)
          }
          break
        case 2:
          if (val > 1000) {
            this.singleCoupon.effectiveTimes = 1000
            return help.W('使用次数不能超过1000次')
          }
          break
        case 3:
          if (val > 1000) {
            this.singleCoupon.couponQuantity = 1000
            return help.W('券张数不能超过1000张')
          }
          break
        case 4:
          if (isNaN(val)) {
            this.singleCoupon.useRuleValueYuan = ''
            return help.E('请输入正确的使用门槛')
          } else if (val > 1000) {
            this.singleCoupon.useRuleValueYuan = (1000).toFixed(2)
            return help.W('使用门槛不能超过1000.00元')
          } else {
            if (val) this.singleCoupon.useRuleValueYuan = (+val).toFixed(2)
          }
          break
        case 5:
          if (isNaN(val)) {
            this.singleCoupon.discountLimitYuan = ''
            return help.E('请输入正确的优惠上限')
          } else if (val > 1000) {
            this.singleCoupon.discountLimitYuan = (1000).toFixed(2)
            return help.W('优惠上限不能超过1000.00元')
          } else {
            if (val) this.singleCoupon.discountLimitYuan = (+val).toFixed(2)
          }
          break
        case 6:
          if (isNaN(val)) {
            this.singleCoupon.dailyUseLimit = ''
            return help.E('请输入正确的使用限制次数')
          } else if (val > 1000) {
            this.singleCoupon.dailyUseLimit = 1000
            return help.W('使用限制次数不能超过1000次')
          } else {
            if (val) this.singleCoupon.dailyUseLimit = parseInt(+val)
          }
          break
        case 7:
          if (isNaN(val)) {
            this.singleCoupon.minLimitYuan = ''
            return help.E('请输入正确的最低消费金额')
          } else if (val > 1000) {
            this.singleCoupon.minLimitYuan = (1000).toFixed(2)
            return help.W('最低消费金额不能超过1000.00元')
          } else {
            if (val) this.singleCoupon.minLimitYuan = (+val).toFixed(2)
          }
          break
        case 8:
          if (isNaN(val) || !val || val < 0) {
            this.singleCoupon.faceValueDisc = ''
            return help.E('请输入正确的折扣')
          } else if (val > 9.9) {
            this.singleCoupon.faceValueDisc = 9.9
            return help.W('折扣值不能超过9.9折')
          } else {
            if (val) this.singleCoupon.faceValueDisc = (+val).toFixed(1)
          }
          break
        case 9:
          if (isNaN(val) || val < 0) {
            this.singleCoupon.faceValueYuan = ''
            return help.E('请输入正确的面值')
          } else {
            if (val) this.singleCoupon.faceValueYuan = (+val).toFixed(2)
          }
          break
      }
    },
    /**
     * 购票类型判断
     * @param type：购票类型
     * @param val：是否选中
     */
    getType (type, val) {
      let li = this.singleCoupon.ticketTypeLimits
      if (+type === 1) { // 点击不限
        li.forEach((item) => {
          if (+item === 1) {
            this.singleCoupon.ticketTypeLimits = ['1', '2', '3', '4']
          } else {
            this.singleCoupon.ticketTypeLimits = []
          }
        })
      } else { // 点击除了不限的其它
        let val = li.indexOf('1')
        if (val > -1) { // 如果有不限
          this.singleCoupon.ticketTypeLimits.splice(val, 1)
        } else {
          if (li.indexOf('2') > -1 && li.indexOf('3') > -1 && li.indexOf('4') > -1) {
            this.singleCoupon.ticketTypeLimits = ['1', '2', '3', '4']
          }
        }
      }
    },
    toggle (arg) {
      if (arg == 1) {
        this.show['showA'] = !this.show['showA']
      } else {
        this.show.showB = !this.show.showB
      }
    },
    changeTime (time) { // 修改日期
      if (time.length > 0) {
        this.singleCoupon.startTime = time[0]
        this.singleCoupon.endTime = time[1]
      } else {
        this.singleCoupon.startTime = ''
        this.singleCoupon.endTime = ''
      }
    },
    getChannelAndCity () {
      request.apiGet(api.channel.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        }
      })
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          // this.cityList = data.data
          data.data.forEach(item => {
            this.cityList.push({
              key: item.cityCode,
              label: item.cityName
            })
          })
        }
      })
    },
    checkedCityChanged (a, direction, moveArr) {
      if (direction === 'right') { // 添加城市
        let flag = -1
        moveArr.forEach(item => {
          // 更新改变活动渠道配置内容
          for (let i = 0; i < this.cityList.length; i++) {
            if (item == this.cityList[i].key) {
              // 如果选择数组里存在该渠道id 则加入
              flag = i
            }
          }
        })
      } else if (direction === 'left') {
        // 删除城市
        moveArr.forEach((item) => {
          for (let i = 0; i < this.singleCoupon.checkedCityList.length; i++) {
            if (item == this.singleCoupon.checkedCityList[i].key) {
              this.singleCoupon.checkedCityList.splice(i, 1)
            }
          }
        })
      }
      this.getScheduleList()
    },
    getScheduleList () { // 获取班次
      if (this.singleCoupon.checkedCityList.length > 0 && this.singleCoupon.businessTypeList.length > 0) {
        let params = {
          businessType: this.singleCoupon.businessTypeList.join(','),
          cityCode: this.singleCoupon.checkedCityList.join(',')
        }
        request.apiGet(api.schedule.option).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            data.data.forEach(item => {
              this.scheduleList.push({
                key: item.scheduleId,
                label: item.className
              })
            })
          }
        })
      }
    },
    checkedScheduleChanged (a, direction, moveArr) {
      if (direction === 'right') { // 添加班次
        let flag = -1
        moveArr.forEach(item => {
          // 更新改变内容
          for (let i = 0; i < this.scheduleList.length; i++) {
            if (item == this.scheduleList[i].key) {
              // 如果选择数组里存在该渠道id 则加入
              flag = i
            }
          }
        })
      } else if (direction === 'left') {
        // 删除城市
        moveArr.forEach((item) => {
          for (let i = 0; i < this.checkedScheduleList.length; i++) {
            if (item == this.checkedScheduleList[i].key) {
              this.checkedScheduleList.splice(i, 1)
            }
          }
        })
      }
    },
    getCouponInfo () {
      if (this.uid) {
        this.title = '修改单模板'
        request.apiGet(api.couponSingle.info, {
          templateId: this.uid
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            for (let key in res) {
              this.singleCoupon[key] = res[key]
            }
            /* 抵扣类型 */
            if (+res.templateKind === 3) {
              if (+res.faceValue) this.singleCoupon.faceValueYuan = (res.faceValue / 100).toFixed(2)
            } else {
              // this.singleCoupon.faceValueDisc = (res.faceValue / 100).toFixed(travelReportForms)
              this.singleCoupon.faceValueDisc = res.faceValue
            }
            if (+res.validityDateType === 1) this.dateRange = [res.startTime, res.endTime] // 有效期
            /* 渠道 */
            res.channelInfoList.forEach(item => {
              // this.chooseChannelList.push(item.channelId)
              this.singleCoupon.chooseChannel.push(item.channelId)
            })
            /* 城市列表 */
            res.cityInfoList.forEach(item => {
              this.singleCoupon.checkedCityList.push(item.cityCode)
            })
            this.singleCoupon.ticketTypeLimits = res.ticketTypeLimit.split(',') // 购票类型限制
            /* 最低消费金额 */
            // this.$set(this.singleCoupon,'minLimitYuan',res.minLimit)
            if (res.minLimit) this.singleCoupon.minLimitYuan = (res.minLimit / 100).toFixed(2)
            if (res.discountLimit) this.singleCoupon.discountLimitYuan = (res.discountLimit / 100).toFixed(2)
            if (res.useRuleValue) this.singleCoupon.useRuleValueYuan = (res.useRuleValue / 100).toFixed(2)
            /* 班次限制 */
            if (+res.scheduleLimit === 1) { // 部分班次
              this.getScheduleList()
              res.classInfoList.forEach(item => {
                this.checkedScheduleList.push(item.scheduleId)
              })
            }
          }
        })
      }
    },
    save () {
      this.$refs['addSingleCoupon'].validate((valid) => {
        if (valid) {
          let params = this.singleCoupon
          if (this.uid) params.templateId = this.uid
          params.cahnnelIdList = this.singleCoupon.chooseChannel
          params.cityCodeList = this.singleCoupon.checkedCityList
          // params.businessTypeList = this.businessTypeList
          // params.businessTypeList = this.singleCoupon.businessTypeList
          params.ticketTypeLimit = this.singleCoupon.ticketTypeLimits.join(',')
          params.discountLimit = params.discountLimitYuan ? ((params.discountLimitYuan) * 100).toString() : ''
          params.useRuleValue = params.useRuleValueYuan ? ((params.useRuleValueYuan) * 100).toString() : ''
          params.minLimit = params.minLimitYuan ? ((params.minLimitYuan) * 100).toString() : ''
          params.faceValue = +params.templateKind === 3 ? ((params.faceValueYuan) * 100).toString() : params.faceValueDisc // 抵扣类型
          if (+params.validityDateType === 1) { // 有效期
            if (!this.dateRange.length) {
              return help.W('请输入有效期')
            } else {
              params.startTime = this.dateRange[0]
              params.endTime = this.dateRange[1]
            }
          }
          if (+params.scheduleLimit === 1) { // 部分班次
            params.scheduleIdList = this.checkedScheduleList // 班次ID
          }
          request.apiPost(this.uid ? api.couponSingle.update : api.couponSingle.create, params).then((data) => {
            if (data.code === enums.NET_SUCCESS) {
              sessionStorage.setItem('marketCouponSingleFlag', 'true')
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
    back () {
      sessionStorage.setItem('marketCouponSingleFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
  @import '../../assets/style/common.css';
  @import "./addMarketCouponSingle.less";
</style>
