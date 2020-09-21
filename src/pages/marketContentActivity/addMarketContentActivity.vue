<template>
  <el-container style="display: flex; justify-content: flex-start;">
    <el-form
      :rules="formRules"
      enctype="multipart/form-data"
      label-width="100px"
      style="width: 100%;"
      :model="contentActivity"
      ref="addContentActivity"
      label-position="right">
      <el-form-item label="活动名称" prop="activityName" class="common-form-item">
        <el-input style="width: 240px;" v-model="contentActivity.activityName" palceholder="请输入活动名称" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item prop="chooseChannelList" label="渠道" class="common-form-item">
        <el-checkbox-group v-model="contentActivity.chooseChannelList">
          <el-checkbox v-for="channel in channelList" :label="channel.channelId" :key="channel.channelId">{{channel.channelName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="chooseBusinessTypeList" label="业务类型" class="common-form-item">
        <el-checkbox-group v-model="contentActivity.chooseBusinessTypeList">
          <el-checkbox v-for="item in businessList" :label="item.businessId" :key="item.businessId">{{item.businessName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="dateRange" label="有效日期">
        <el-date-picker
          v-model="contentActivity.dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="绑定类型" prop="relationType">
        <el-radio v-model="contentActivity.relationType" label="1">线路</el-radio>
        <el-radio v-model="contentActivity.relationType" label="2">通票</el-radio>
      </el-form-item>
      <el-form-item label="选择线路" v-if="contentActivity.relationType == '1'" prop="lineId">
        <el-select placeholder="请选择线路" v-model="contentActivity.lineId">
          <el-option v-for="item in lineList" :label="item.lineName" :key="item.lineId" :value="item.lineId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择通票" v-if="contentActivity.relationType == '2'">
        <el-select placeholder="请选择通票" v-model="contentActivity.shareTicketId">
          <el-option v-for="item in shareLine" :label="item.lineName" :key="item.lineId"></el-option>
        </el-select>
      </el-form-item>
      <pageImg @sendImg="sendImg" :hadBtn="hadBtn" :fileGroup="fileGroup" :buttonIcon="buttonIcon"></pageImg>
      <el-row class="btn-group" style="margin-left: 200px;">
        <el-button type="primary" @click="save" v-if="contentActivity.activityStatus == '1'">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import pageImg from '@/pages/common/pageImg.vue'
import { contentMarketRule } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'addMarketContentActivity',
  data () {
    return {
      formRules: contentMarketRule, // 必填校验
      hadBtn: true, // 是否有按钮图片
      fileGroup: [], // 静态页面图
      buttonIcon: [], // 按钮图
      contentActivity: {
        chooseBusinessTypeList: [], // 已选业务类型
        dateRange: [], // 有效期
        chooseChannelList: [], // 已选渠道
        relationType: '1', // 绑定线路或者绑定通票
        activityName: '', //  内容活动名称
        activityStatus: '1', // 内容活动状态 orderReportForms-待审核  travelReportForms-待发布 payReportForms-已发布 4-已下线
        lineId: '',
        shareTicketId: '', // 通票
        businessTypeList: [], // 已选业务类型
        channelList: [], // 已选渠道
        buyIconUrl: '', // 按钮图片
        themeIconUrlList: [] // 页面图片
      },
      businessList: enums.BUSINESSTYPE1,
      channelList: [], // 所有渠道
      lineList: [], // 所有线路
      shareLine: [], // 所有通票
      uid: this.$route.query.id ? this.$route.query.id : ''
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getChannelList()
    this.getActivityInfo()
  },
  methods: {
    /* 获取上传图片 */
    sendImg (list, type) {
      if (type === 'button') { // 按钮图片
        list.length ? this.contentActivity.buyIconUrl = list[0].url : this.contentActivity.buyIconUrl = ''
      } else if (type === 'static') { // 静态图片
        this.contentActivity.themeIconUrlList = []
        if (list.length) {
          list.forEach(item => {
            this.contentActivity.themeIconUrlList.push(item.url)
          })
        }
      }
    },
    /* 回显 */
    getActivityInfo () {
      if (this.uid) {
        this.title = '修改活动'
        request.apiGet(api.contentActivity.info, {
          activityId: this.uid
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.contentActivity = res
            if (res.relationType === '1') this.getLineList() // 获取所有线路
            this.contentActivity.dateRange = [res.startTime, res.endTime] // 有效期
            this.contentActivity.chooseBusinessTypeList = res.businessTypeList // 业务类型
            res.channelList.forEach(item => { // 渠道
              this.contentActivity.chooseChannelList.push(item.channelId)
            })
            if (res.buyIconUrl) this.buttonIcon.push({name: 'button', url: res.buyIconUrl}) // 按钮图片
            if (res.themeIconUrlList.length) {
              res.themeIconUrlList.forEach(item => {
                this.fileGroup.push({ name: 'static', url: item })
              })
            }
          }
        })
      } else {
        this.getLineList()
      }
    },
    /* 获取线路列表 */
    getLineList () {
      request.apiGet(api.line.optionList).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.lineList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    /* 获取渠道 */
    getChannelList () {
      request.apiGet(api.channel.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    save () {
      this.$refs.addContentActivity.validate(valid => {
        if (valid) {
          let params = this.contentActivity
          if (+params.relationType === 1 && !params.lineId) return help.W('请先选择线路')
          if (+params.relationType === 2 && !params.shareTicketId) return help.W('请先选择通票')
          if (!params.themeIconUrlList.length) return help.W('请先上传页面图片')
          if (!params.buyIconUrl) return help.W('请先上传按钮图片')
          if (this.uid) {
            params.activityStatus = params.activityStatus + ''
          }
          params.startTime = this.contentActivity.dateRange[0]
          params.endTime = this.contentActivity.dateRange[1]
          params.businessTypeList = this.contentActivity.chooseBusinessTypeList
          params.channelList = this.contentActivity.chooseChannelList
          params.lineType = this.contentActivity.relationType
          request.apiPost(this.uid ? api.contentActivity.update : api.contentActivity.create, params).then((data) => {
            if (data.code === enums.NET_SUCCESS) {
              sessionStorage.setItem('contentActivityFlag', 'true')
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
    back () {
      sessionStorage.setItem('contentActivityFlag', 'true')
      this.$router.back()
    }
  },
  components: {
    pageImg
  }
}
</script>

<style scoped>
  .el-upload--picture-card{
    width: auto;
    height: auto;
    line-height: 1;
    border: 0;
  }
</style>
