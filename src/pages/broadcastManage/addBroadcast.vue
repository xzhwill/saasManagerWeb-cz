<template>
  <div class="common-container">
    <el-form enctype="multipart/form-data" label-width="100px" :model="broadcast" :rules="formRules" ref="broadcast" label-position="right">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="广播名称:" style="width: 300px;" prop="broadcastName" class="common-form-item">
        <el-input v-model="broadcast.broadcastName" maxlength="10" show-word-limit placeholder="请输入广播名称" style="padding-right: 46px;"></el-input>
      </el-form-item>
      <el-form-item label="广播内容:" style="width: 300px;" prop="broadcastContent" class="common-form-item">
        <el-input v-model="broadcast.broadcastContent" maxlength="30" show-word-limit placeholder="请输入广播内容" style="padding-right: 46px;"></el-input>
      </el-form-item>
      <el-form-item label="渠道" prop="channelArr">
        <el-checkbox-group v-model="channelArrList">
          <el-checkbox v-for="channel in channelList" :label="channel.channelId" :key="channel.channelId">
            {{channel.channelName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-checkbox-group v-model="businessTypeList">
          <el-checkbox v-for="business in businessTypeAll" :label="business.businessId" :key="business.businessId">{{ business.businessName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="展示顺序:" prop="seq" class="common-form-item" style="width: 300px;">
        <el-input v-model="broadcast.seq" placeholder="请输入展示顺序" type="number"></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="cityCode" class="common-form-item" style="width: 300px;">
        <el-select v-model="broadcast.cityCode" filterable>
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期" prop="startTime" class="common-form-item" style="width: 500px;">
        <el-date-picker v-model="startTime" value-format="yyyy-MM-dd" @change="changeTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item prop="state" label="广播状态:">
        <el-radio v-model="broadcast.state" label="1">可用</el-radio>
        <el-radio v-model="broadcast.state" label="0">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group" style="margin-left: 100px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import { broadcastRules } from '@/utils/rules'

export default {
  name: 'addBroadcast',
  data () {
    return {
      title: '添加广播',
      broadcast: {
        broadcastName: '',
        broadcastContent: '',
        effectiveDate: '',
        expiryDate: '',
        state: '1',
        cityCode: '',
        channelId: '',
        seq: '',
        businessTypes: ''
      },
      cityList: [],
      channelList: [{
        channelName: '常州微信小程序',
        channelId: '21300001'
      }], // 所有渠道列表
      channelArrList: [], // 已选渠道
      businessTypeAll: enums.BUSINESSTYPE, //  所有业务类型
      businessTypeList: [], //  所选业务类型
      formRules: broadcastRules,
      startTime: [],
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是新增页面
    }
  },
  mounted () {
    this.getCity()
    this.getBroadcastInfo()
    this.$emit('getInfo', [])
    this.$emit('getPage', {})
  },
  methods: {
    /* 获取城市列表 */
    getCity () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /* 获取广播详情 */
    getBroadcastInfo () {
      if (this.uid) {
        request.apiGet(api.broadcast.info, { broadcastId: this.uid }).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            this.broadcast = data.data
            this.broadcast.state = this.broadcast.state.toString() // 状态转String
            this.businessTypeList = data.data.businessTypes // 选择的业务类型
            this.channelArrList.push(data.data.channelId)
            this.startTime.push(data.data.effectiveDate)
            this.startTime.push(data.data.expiryDate)
          } else {
            helper.E(data.msg)
          }
        }).catch(() => {
          helper.Echo('网络异常')
        })
      }
    },
    /* 修改时间 */
    changeTime (val) {
      console.log(val)
    },
    /* 返回上一页 */
    back () {
      this.$router.push('./broadcastManage')
    },
    /* 保存修改内容 */
    save () {
      this.$refs['broadcast'].validate(valid => {
        if (valid) {
          if (!this.channelArrList.length) {
            return helper.W('渠道不能为空')
          } else {}
          console.log(this.channelArrList)
          if (!this.businessTypeList.length) {
            return helper.W('业务类型不能为空')
          }
          let params = this.broadcast
          /* 赋值有效期 */
          params.effectiveDate = this.startTime[0]
          params.expiryDate = this.startTime[1]
          /* 赋值渠道 */
          params.channelId = this.channelArrList[0]
          /* 赋值业务类型 */
          params.businessTypes = this.businessTypeList
          request.apiPost(this.uid ? api.broadcast.update : api.broadcast.create, params).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              helper.S('创建成功')
              this.back()
            } else {
              helper.E(data.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
