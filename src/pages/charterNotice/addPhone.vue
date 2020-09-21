<template>
  <div class="common-container">
    <el-form enctype="multipart/form-data" label-width="150px" :model="info" :rules="formRules" ref="addPhone" label-position="right">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="客服电话:" prop="servicePhone" class="common-form-item">
        <!--<el-input v-model="info.servicePhone" placeholder="请输入客服电话" :maxLength="11" @blur="judgeInfo(info.servicePhone)"></el-input>-->
        <el-input v-model="info.servicePhone" placeholder="请输入客服电话"></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="cityCode" class="common-form-item">
        <el-select v-model="info.cityCode" filterable>
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置类型" prop="type" class="common-form-item">
        <el-radio-group v-model="info.type">
          <el-radio :label="2">线路征集 - 企业</el-radio>
          <el-radio :label="1">预约包车</el-radio>
        </el-radio-group>
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
import { customePhoneRules } from '@/utils/rules'
import { tcheckTelPhone } from '@/utils/public'

export default {
  name: 'addPhone',
  data () {
    return {
      title: '添加客服电话',
      info: {
        servicePhone: '', // 客服电话
        cityCode: '', // 城市编码
        type: 2 // 配置类型
      },
      cityList: [], // 城市列表
      formRules: customePhoneRules, // 校验规则
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断是修改还是添加
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.showPhoneInfo() // 初始化获取页面信息
    this.getCity()
  },
  methods: {
    /**
     * 校验客服电话
     */
    judgeInfo (val) {
      if (isNaN(+val)) {
        this.info.servicePhone = ''
        return helper.E('请输入正确的客服电话')
      } else {
        if (val && !tcheckTelPhone(val)) return helper.E('请输入正确的客服电话')
      }
    },
    /**
     * 获取城市列表
     */
    getCity () {
      request.apiGet(api.city.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /**
     * 点击保存
     */
    save () {
      let param = this.info
      if (this.uid) param.id = this.uid
      this.$refs.addPhone.validate(valid => {
        if (valid) {
          request.apiPost(this.uid ? api.serviceTelManage.update : api.serviceTelManage.create, param).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              this.uid ? helper.S('更新成功') : helper.S('创建成功')
              this.back()
            } else {
              helper.E(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 点击取消按钮，返回
     */
    back () {
      sessionStorage.setItem('phoneFlag', 'true')
      this.$router.back()
    },
    /**
     * 初始化获取数据接口
     */
    showPhoneInfo () {
      if (this.uid) {
        this.title = '修改客服电话'
        request.apiGet(api.serviceTelManage.info, { id: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.info.servicePhone = res.servicePhone
            this.info.cityCode = res.cityCode
            this.info.type = res.type
          } else {
            helper.E(data.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
