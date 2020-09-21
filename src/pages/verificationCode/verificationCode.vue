<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="120px">
      <el-form-item label="用户手机号" class="common-form-item">
        <el-input v-model="telePhone" type="number" placeholder="请输入手机号"></el-input>
        <el-button type="primary" @click="queryMsg">查询</el-button>
      </el-form-item>
      <el-form-item label="验证码" class="common-form-item">
        <el-input v-model="code" type="number"></el-input>
      </el-form-item>
      <el-form-item label="生成时间" class="common-form-item">
        <el-input v-model="time"></el-input>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
import request from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'
import { timestampToTime, checkPhone } from '@/utils/public'

export default {
  data () {
    return {
      labelWidth: '120px',
      telePhone: '',
      code: '',
      time: ''
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
  },
  methods: {
    queryMsg () {
      if (!this.telePhone) return help.W('请先输入手机号')
      if (!checkPhone(this.telePhone)) return help.E('请输入正确的手机号')
      let params = { phone: this.telePhone }
      request.apiGet(api.common.shortMsgCode, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          if (data.data) {
            this.code = data.data.smsCode
            this.time = timestampToTime(data.data.createTime)
          } else {
            help.E('查询失败')
          }
        } else {
          help.E(data.msg)
        }
      })
    },
    back () {
      this.$router.back()
    }
  }
}
</script>

<style>
@import '../../assets/style/common.css';
.btn-group {
  text-align: center;
}
.el-upload--picture-card {
  border: none;
  width: 80px;
  height: 28px;
  line-height: 28px;
}
.showImage {
  display: flex;
  align-items: center;
}
</style>
