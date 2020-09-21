<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="orgnization" :rules="formRules"
      ref="addOrgnization" label-position="right">
      <div class="form-section" style="margin-bottom: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item prop="orzType" label="类型">
        <el-radio v-model="orgnization.orzType" :label="1" :disabled="+action === 1">供给侧</el-radio>
        <el-radio v-model="orgnization.orzType" :label="2" :disabled="+action === 1">需求侧</el-radio>
      </el-form-item>
      <el-form-item label="机构号" prop="orzId" class="common-form-item">
        <el-input :disabled="+action === 1" v-model="orgnization.orzId" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="orzName" class="common-form-item">
        <el-input v-model="orgnization.orzName">
        </el-input>
      </el-form-item>
      <el-form-item label="机构简称" class="common-form-item">
        <el-input v-model="orgnization.orzAbbr"></el-input>
      </el-form-item>
      <el-form-item label="所属城市" prop="cityCode" class="common-form-item">
        <el-select v-model="orgnization.cityCode">
          <el-option v-for="item in cityList" :label="item.cityName" :key="item.cityCode" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级机构" class="common-form-item">
        <el-select v-model="orgnization.parentOrzId">
          <el-option v-for="item in parentList" :label="item.orzName" :key="item.orzId" :value="item.orzId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-radio v-model="orgnization.state" :label="1">可用</el-radio>
        <el-radio v-model="orgnization.state" :label="0">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addOrgnizationFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加机构',
      imageInfo: {
        iconType: '2'
      },
      action: 0,
      labelWidth: '120px',
      parentList: [],
      cityList: [], // 城市列表
      orgnization: {
        'orzId': '',
        'orzName': '',
        'orzAbbr': '',
        'orzType': 1,
        'cityCode': '',
        'parentOrzId': '',
        'state': 0
      },
      verificationRule: false,
      formRules: addOrgnizationFormRules
    }
  },
  mounted() {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', [])
    this.init()
  },
  methods: {
    init() {
      this.getOrgnizationInfo()
      this.getOptionList()
    },
    getOptionList() {
      request.apiGet(api.orgnization.parentOrz).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.parentList = data.data
        } else {
          help.E(data.msg)
        }
      })
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getOrgnizationInfo() {
      let orzId = this.$route.query.id
      if (orzId != undefined) {
        this.action = 1
        this.title = '修改机构信息'
        request.apiGet(api.orgnization.info, { orzId: orzId }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.orgnization = res
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    save() {
      this.$refs['addOrgnization'].validate((valid) => {
        if (valid) {
          if (this.orgnization.parentOrzId == this.orgnization.orzId) {
            help.E('上级机构不能选择机构本身，请重新选择')
          } else {
            this.postData()
          }
        } else {
          return false
        }
      })
    },
    postData() {
      let params = this.orgnization
      let url = ''
      if (parseInt(this.action) === 1) {
        delete params['createDate']
        delete params['lastModdate']
        delete params['activeDate']
        url = api.orgnization.update
      } else {
        params['creater'] = JSON.parse(sessionStorage.getItem('login')).userName
        params['lastModer'] = JSON.parse(sessionStorage.getItem('login')).userName
        url = api.orgnization.create
      }
      request.apiPost(url, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('orgnizationFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back() {
      sessionStorage.setItem('orgnizationFlag', 'true')
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
