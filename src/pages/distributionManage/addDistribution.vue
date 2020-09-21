<template>
  <div class="common-container"style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="120px" :model="distribution" :rules="formRules" ref="addDistribution"
             label-position="right">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="分销渠道名称:" prop="channelName" class="common-form-item">
        <el-input v-model="distribution.channelName" placeholder="请输入分销渠道名称"></el-input>
      </el-form-item>
      <el-form-item label="所属城市:" prop="cityCode" class="common-form-item">
        <el-select v-model="distribution.cityCode" placeholder="请选择">
          <el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人:" prop="contacts" class="common-form-item">
        <el-input v-model="distribution.contacts" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone" class="common-form-item">
        <el-input v-model="distribution.phone" placeholder="请输入手机号:"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="description" class="common-form-item">
        <el-input v-model="distribution.description" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="state">
        <el-radio v-model="distribution.state" label="1">启用</el-radio>
        <el-radio v-model="distribution.state" label="0">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;margin-left: 180px;">
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
import { distributionRules } from '@/utils/rules'
import { Trim } from '@/utils/public'

export default {
  name: 'addDistribution',
  data () {
    return {
      title: '添加分销渠道',
      formRules: distributionRules,
      action: 0,
      distribution: {
        channelName: '',
        cityCode: '',
        contacts: '',
        description: '',
        lineList: [],
        phone: '',
        shareTicketList: [],
        state: '0'
      },
      cityList: [],
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  created(){
    this.$emit('getInfo', [])
    this.$emit('getTable',[])
    this.$emit('getPage', {})
  },
  mounted () {
    this.getList()
    this.getInfo()
  },
  methods: {
    /* 获取城市列表 */
    getList () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          let res = data.data
          this.cityList = (res)
        }
      })
    },
    getInfo () {
      if (this.uid) {
        this.action = 1
        this.title = '修改分销渠道'
        request.apiGet(api.distribution.info, {
          id: this.uid
        }).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            this.distribution = data.data
            this.distribution['lineList'] = []
            this.distribution['shareTicketList'] = []
          }
        })
      }
    },
    save () {
      this.$refs['addDistribution'].validate((valid) => {
        if (valid) {
          let url = api.distribution.create
          if (this.uid) url = api.distribution.update
          request.apiPost(url, this.distribution).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              this.uid ? helper.S('修改成功~') : helper.S('创建成功~')
              this.back()
            } else {
              helper.E(data.msg)
            }
          })
        } else {
          helper.E('请输入必填项')
          return false
        }
      })
    },
    back () {
      sessionStorage.setItem('distributionFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
