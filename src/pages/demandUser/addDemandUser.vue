<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form
      enctype="multipart/form-data"
      label-width="100px"
      :model="demandUser"
      :rules="formRules"
      ref="addOrgnization"
      label-position="right">
      <div class="form-section" style="margin-bottom: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="所属城市" prop="parentOrzId" class="common-form-item">
        <el-select v-model="demandUser.cityCode" @change="getOrzList">
          <el-option
            v-for="item in cityList"
            :label="item.cityName"
            :key="item.cityCode"
            :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业" prop="demandId" class="common-form-item">
        <el-select v-model="demandUser.demandId">
          <el-option
            v-for="item in orzList"
            :label="item.demandName"
            :key="item.demandId"
            :value="item.demandId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username" class="common-form-item">
        <el-input v-model="demandUser.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="common-form-item">
        <el-input v-model="demandUser.password" type="password" :disabled="isDis"></el-input>
        <el-button type="primary" @click="isDis = false; demandUser.password = ''" v-if="!!uid">修改</el-button>
      </el-form-item>
      <el-form-item label="姓名" prop="chinesename" class="common-form-item">
        <el-input v-model="demandUser.chinesename"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone" class="common-form-item">
        <el-input v-model="demandUser.phone"></el-input>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-radio v-model="demandUser.state" :label="1">启用</el-radio>
        <el-radio v-model="demandUser.state" :label="0">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { adddemandUserFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'
import md5 from 'js-md5'

export default {
  data () {
    return {
      title: '添加机构',
      imageInfo: {
        iconType: '2'
      },
      labelWidth: '120px',
      orzList: [],
      cityList: [], // 城市列表
      demandUser: {
        demandId: '',
        demandName: '',
        cityCode: '',
        state: 0,
        password: ''
      },
      verificationRule: false,
      formRules: adddemandUserFormRules,
      isDis: true, // 是否可以修改密码
      uid: this.$route.query.id ? this.$route.query.id : '', // 判断修改还是添加页面
      flag: true // 判断是否对密码进行加密
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', [])
    this.getCityList()
    this.getOrgnizationInfo()
  },
  methods: {
    getOrzList (type) {
      request.apiGet(api.demandCompany.option, {cityCode: this.demandUser.cityCode}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          if (type !== 1) {
            this.demandUser.demandId = ''
          }
          this.orzList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getCityList () {
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getOrgnizationInfo () {
      if (this.uid) {
        this.isDis = true
        this.title = '修改机构信息'
        request.apiGet(api.demandUser.info, { userId: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.demandUser = data.data
            // this.$set(this.demandUser, 'password', data.data.password)
            this.getOrzList(1)
          } else {
            help.E(data.msg)
          }
        })
      } else {
        this.isDis = false
      }
    },
    save () {
      this.$refs['addOrgnization'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      let params = this.demandUser
      if (this.flag) {
        if (this.uid) {
          if (!this.isDis) params.password = md5(params.password) // 点击了修改密码
        } else {
          params.creater = JSON.parse(sessionStorage.getItem('login')).userName
          params.lastModer = JSON.parse(sessionStorage.getItem('login')).userName
          params.password = md5(params.password)
        }
      }
      request.apiPost(this.uid ? api.demandUser.update : api.demandUser.create, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          this.flag = true
          sessionStorage.setItem('demandUserFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          this.flag = false
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('demandUserFlag', 'true')
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
