<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form
      enctype="multipart/form-data"
      label-width="100px"
      style="width: 100%;"
      :model="activity"
      :rules="formRules"
      ref="addActivity"
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
          :icon="showA ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          style="float: right;"
          type="success"
          @click="showA = !showA">{{ showA ? '收起' : '展开' }}</el-button>
        <div class="form-section" style="margin-bottom:30px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>基础信息</label>
        </div>
        <transition name="fade">
          <div class="showA" v-if="showA">
            <el-form-item label="活动名称" prop="activityName" class="common-form-item">
              <el-input style="width: 200px;" v-model="activity.activityName" placeholder="请输入活动名称" maxlength="10" show-word-limit></el-input>
            </el-form-item>
            <el-form-item prop="dateRange" label="有效日期">
              <el-date-picker
                v-model="activity.dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"></el-date-picker>
            </el-form-item>
            <el-form-item prop="templateType" label="模板类型">
              <el-radio v-model="activity.activityType" label="1">老带新活动</el-radio>
              <el-radio v-model="activity.activityType" label="2">送券活动</el-radio>
              <el-radio v-model="activity.activityType" label="3">买票送券活动</el-radio>
              <!--<el-radio v-model="activity.activityType" label="4">新人活动</el-radio>-->
            </el-form-item>
            <el-form-item prop="chooseChannelList" label="渠道" class="common-form-item">
              <el-checkbox-group v-model="activity.chooseChannelList">
                <el-checkbox v-for="channel in channelList" :label="channel.channelId" :key="channel.channelId">{{channel.channelName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="chooseBusinessTypeList" label="业务类型" class="common-form-item">
              <el-checkbox-group v-model="activity.chooseBusinessTypeList">
                <el-checkbox v-for="item in businessTypeList" :label="item.businessId" :key="item.businessId">{{item.businessName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item prop="successType" label="拉新成功" v-if="activity.activityType == '1'">
              <el-radio v-model="activity.successType" label="1">首次购票并乘车</el-radio>
              <el-radio v-model="activity.successType" label="2">首次注册</el-radio>
            </el-form-item>
          </div>
        </transition>
      </div>
      <div class="divide"></div>
      <div style="margin-top: 15px;">
        <el-button
          round
          plain
          class="search-form-toggle"
          :icon="showB ? 'el-icon-arrow-up':'el-icon-arrow-down'"
          style="float:right"
          type="success"
          @click="showB = !showB">{{ showB ? '收起' : '展开' }}</el-button>
        <div class="form-section" style="margin-bottom:15px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>使用条件</label>
        </div>
        <transition name="fade">
          <div class="showB" v-if="showB">
            <el-form-item prop="joinUserType" label="用户限制">
              <el-radio v-model="activity.joinUserType" label="1">仅新用户</el-radio>
              <el-radio v-model="activity.joinUserType" label="2">仅老用户</el-radio>
              <el-radio v-model="activity.joinUserType" label="3">所有用户</el-radio>
            </el-form-item>
            <el-form-item label="参与限制" prop="limitJoinTimes">
              每个用户
              <el-select placeholder="请选择" v-model="activity.limitFrequency" style="width: 100px;margin: 0 10px;">
                <el-option label="无限制" key="0" value="0"></el-option>
                <el-option label="每天" key="1" value="1"></el-option>
                <el-option label="每周" key="2" value="2"></el-option>
                <el-option label="每月" key="3" value="3"></el-option>
                <el-option label="永久" key="4" value="4"></el-option>
              </el-select>
              可参与<el-input style="width: 100px;margin: 0 10px;" v-model="activity.limitJoinTimes" placeholder="参与次数" maxlength="3"></el-input>次
            </el-form-item>
            <div style="display: flex;">
              <el-form-item :label="activity.activityType == '1'?'选择老人券':'选择优惠券'" prop="templateId1">
                <el-select placeholder="请选择模板" v-model="activity.templateId1" style="margin-right: 10px;">
                  <el-option v-for="item in templateList" :label="item.templateName" :key="item.templateId" :value="item.templateId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="券的数量：" prop="launchQuantity1">
                <el-input style="width: 200px;" type="number" v-model="activity.launchQuantity1" placeholder="券的投放量" maxlength="10"></el-input>
              </el-form-item>
            </div>
            <div style="display: flex;">
              <el-form-item label="选择新人券" v-if="activity.activityType == '1'" prop="templateId2">
                <el-select placeholder="请选择模板" v-model="activity.templateId2" style="margin-right: 10px;">
                  <el-option v-for="item in templateList" :label="item.templateName" :key="item.templateId" :value="item.templateId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="券的数量：" prop="launchQuantity2" v-if="activity.activityType == '1'">
                <el-input style="width: 200px;" type="number" v-model="activity.launchQuantity2" placeholder="券的投放量" maxlength="10"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="预警值" prop="warnQuantity" class="common-form-item">
              <el-input style="width: 200px;" v-model="activity.warnQuantity" placeholder="请输入预警值" maxlength="3" type="number"></el-input>
            </el-form-item>
            <el-form-item label="预警手机号" prop="warnPhone" class="common-form-item">
              <el-input style="width: 200px;" v-model="activity.warnPhone" placeholder="请输入预警手机号" maxlength="11" show-word-limit type="number"></el-input>
            </el-form-item>
            <el-form-item label="选择班次" prop="cityList" v-if="activity.activityType == '3'">
              <el-transfer
                @change="checkedScheduleChanged"
                :button-texts="['移除', '添加']"
                :titles="['班次名称', '已选择']"
                v-model="checkedScheduleList"
                :data="scheduleIdList"></el-transfer>
            </el-form-item>
            <pageImg @sendImg="sendImg" :hadBtn="hadBtn" :fileGroup="fileGroup" :buttonIcon="buttonIcon" v-if="+activity.activityType !== 3"></pageImg>
          </div>
        </transition>
      </div>
      <el-row class="btn-group" style="display: flex;justify-content: center;">
        <el-button type="primary" @click="save" v-if="+activity.activityStatus === 1">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { marketActivityRule } from '@/utils/rules'
import pageImg from '@/pages/common/pageImg.vue'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'addMarketActivity',
  data () {
    return {
      activity: {
        activityName: '',
        activityStatus: '1', // 活动状态 orderReportForms-待审核 travelReportForms-待发布 payReportForms-已发布 4-已下线
        activityType: '1', // 活动类型 orderReportForms-老带新 travelReportForms-送券 payReportForms-买票送券  4-新人
        buyIconUrl: '', // 按钮图片
        chooseBusinessTypeList: [], // 已选业务类型
        chooseChannelList: [], // 已选渠道
        dateRange: [], // 活动有效期
        endTime: '', // 活动结束时间
        joinUserType: '1', //  参与用户 orderReportForms-仅新用户 travelReportForms-仅老用户 payReportForms-所有用户
        launchQuantity1: '', //  模板1绑定的数量
        launchQuantity2: '', //  模板2绑定的数量
        limitFrequency: '0', //  参与频率,与limit_time联合使用,代表时间周期(0-无限制 orderReportForms-天 travelReportForms-周 payReportForms-月 4-永久)
        limitJoinTimes: '', //  参与次数,与limit_frequency联合使用
        startTime: '', // 活动开始时间
        templateId1: '', //  活动绑定的模板id，活动类型为老带新的时候为老人券的模板
        templateId2: '', //  活动绑定的模板id,仅老带新活动传入，新人券的模板
        themeIconUrlList: [], //  页面图片
        warnPhone: '', // 预警手机号,
        warnQuantity: '', //  预警值,
        successType: '1' // 拉新成功标识
      },
      businessTypeList: enums.BUSINESSTYPE2, // 业务类型
      channelList: [], // 所有渠道
      title: '新增营销活动',
      showA: true, // 基础信息内容是否展开：true - 展开；false - 闭合；
      showB: false, // 使用条件内容是否展开：true - 展开；false - 闭合；
      hadBtn: true, // 是否有按钮图片
      fileGroup: [], // 静态页面图
      buttonIcon: [], // 按钮图
      scheduleIdList: [], //  所有班次
      checkedScheduleList: [], //  已选班次
      templateList: [], // 模板列表
      formRules: marketActivityRule,
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断为修改还是添加页面
    }
  },
  components: { pageImg },
  mounted () {
    this.$emit('getInfo', [])
    this.getChannelList()
    this.getCouponList()
    this.getActivityInfo()
  },
  methods: {
    /**
     * 活动回显
     */
    getActivityInfo () {
      if (this.uid) {
        this.title = '修改活动'
        request.apiGet(api.marketActivity.info, { activityId: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.activity = data.data
            let res = data.data
            this.activity.dateRange = [res.startTime, res.endTime] // 有效期
            this.activity.chooseChannelList = res.channelList // 渠道
            this.activity.chooseBusinessTypeList = res.businessTypeList // 业务类型
            if (res.buyIconUrl) this.buttonIcon.push({name: 'button', url: res.buyIconUrl}) // 按钮图片
            if (res.themeIconUrlList.length) { // 页面图片
              res.themeIconUrlList.forEach(item => this.fileGroup.push({ name: 'static', url: item }))
            }
          } else {
            help.E(data.msg)
          }
        })
      } else {
        this.getScheduleList()
      }
    },
    /**
     * 获取班次列表
     */
    getScheduleList () {
      request.apiGet(api.schedule.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          if (data.data.length) {
            data.data.forEach(item => {
              this.scheduleIdList.push({
                key: item.scheduleId,
                label: item.className
              })
            })
          }
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 获取渠道
     */
    getChannelList () {
      request.apiGet(api.channel.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 获取优惠券
     */
    getCouponList () {
      request.apiGet(api.couponSingle.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.templateList = data.data
          request.apiGet(api.couponGroup.option).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              this.templateList = [...this.templateList, ...data.data]
            } else {
              help.E(data.msg)
            }
          })
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 绑定班次
     * @param a
     * @param direction
     * @param moveArr
     */
    checkedScheduleChanged (a, direction, moveArr) {
      if (direction === 'right') { // 添加班次
        let flag = -1
        moveArr.forEach(item => {
          for (let i = 0; i < this.scheduleList.length; i++) { // 更新改变内容
            if (item === this.scheduleIdList[i].key) flag = i // 如果选择数组里存在该渠道id 则加入
          }
        })
      } else if (direction === 'left') { // 删除城市
        moveArr.forEach((item) => {
          for (let i = 0; i < this.checkedScheduleList.length; i++) {
            if (item === this.checkedScheduleList[i].key) {
              this.checkedScheduleList.splice(i, 1)
            }
          }
        })
      }
    },
    /**
     * 获取上传图片
     * @param list
     * @param type
     */
    sendImg (list, type) {
      console.log(list, '***list', type)
      if (type === 'button') { // 按钮图片
        list.length ? this.activity.buyIconUrl = list[0].url : this.activity.buyIconUrl = ''
      } else if (type === 'static') { // 静态图片
        this.activity.themeIconUrlList = []
        if (list.length) {
          list.forEach(item => this.activity.themeIconUrlList.push(item.url))
        }
      }
    },
    /**
     * 保存
     */
    save () {
      this.$refs.addActivity.validate((valid) => {
        if (valid) {
          let params = this.activity
          if (!params.themeIconUrlList.length) return help.W('请先上传页面图片')
          if (!params.buyIconUrl) return help.W('请先上传按钮图片')
          params.channelList = this.activity.chooseChannelList
          params.businessTypeList = this.activity.chooseBusinessTypeList
          params.startTime = this.activity.dateRange[0]
          params.endTime = this.activity.dateRange[1]
          if (+params.activityType === 3) params.scheduleIdList = this.checkedScheduleList // 班次限制 买票送券
          request.apiPost(this.uid ? api.marketActivity.update : api.marketActivity.create, params).then((data) => {
            if (data.code === enums.NET_SUCCESS) {
              sessionStorage.setItem('marketActivityFlag', 'true')
              help.S('保存成功')
              this.$router.back()
            } else {
              help.E(data.msg)
            }
          }).catch(() => {
            help.E('网络异常')
          })
        } else {
          return false
        }
      })
    },
    /**
     * 返回上一页 修改本地存储状态-回显搜索条件
     */
    back () {
      sessionStorage.setItem('marketActivityFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
