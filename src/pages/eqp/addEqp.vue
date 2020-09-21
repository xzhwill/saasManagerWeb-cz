<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="eqp" :rules="formRules" ref="addEqp"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="城市" prop="cityCode">
        <el-select v-model="eqp.cityCode" @change="changeCity(eqp.cityCode, 1)">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构" prop="orzId">
        <el-select v-model="eqp.orzId">
          <el-option v-for="item in orzList" :label="item.orzName" :key="item.orzId" :value="item.orzId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备号" prop="eqpNo" class="common-form-item">
        <el-input v-model="eqp.eqpNo" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="设备品牌" prop="eqpBrand" class="common-form-item">
        <el-input v-model="eqp.eqpBrand"></el-input>
      </el-form-item>
      <el-form-item label="设备型号" prop="eqpModel" class="common-form-item">
        <el-input v-model="eqp.eqpModel"></el-input>
      </el-form-item>
      <el-form-item label="设备版本" prop="eqpVersion" class="common-form-item">
        <el-input v-model="eqp.eqpVersion"></el-input>
      </el-form-item>
      <el-form-item prop="state" label="设备状态">
        <el-radio v-model="eqp.state" :label="parseInt(1)">启用</el-radio>
        <el-radio v-model="eqp.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addEqpFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加车辆',
      labelWidth: '120px',
      eqp: {
        'eqpNo': '',
        'eqpBrand': '',
        'orzId': '',
        'eqpModel': '',
        'eqpVersion': 1,
        'delState': 0,
        'state': 1,
        'updateFlag': true
      },
      verificationRule: false,
      formRules: addEqpFormRules,
      orzList: [],
      cityList: [],
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是新增页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getEqpInfo()
    this.getOtherList()
  },
  methods: {
    getEqpInfo () {
      if (this.uid) {
        this.eqp.updateFlag = false
        this.title = '修改车辆信息'
        request.apiGet(api.eqp.info, {
          eqpId: this.uid
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.eqp = (data.data)
            this.changeCity(this.eqp.cityCode, 0)
          } else {
            help.E(data.msg)
          }
        })
      } else {
        this.eqp.updateFlag = true
      }
    },
    changeCity (val, index) { //  获取供给侧机构列表
      if (index) this.eqp.orzId = ''
      request.apiGet(api.orgnization.option, { orzType: 1, cityCode: val }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orzList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getOtherList () {
      request.apiGet(api.city.option).then(data => { // 城市
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    save () {
      this.$refs['addEqp'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      request.apiPost(this.uid ? api.eqp.update : api.eqp.create, this.eqp).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('flag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('flag', 'true')
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
/*.avatar-uploader .el-upload {*/
/*border: 1px dashed #d9d9d9;*/
/*border-radius: 6px;*/
/*cursor: pointer;*/
/*position: relative;*/
/*overflow: hidden;*/
/*}*/
/*.avatar-uploader .el-upload:hover {*/
/*border-color: #409EFF;*/
/*}*/
/*.avatar-uploader-icon {*/
/*font-size: 28px;*/
/*color: #8c939d;*/
/*width: 178px;*/
/*height: 178px;*/
/*line-height: 178px;*/
/*text-align: center;*/
/*}*/
/*.avatar {*/
/*width: 178px;*/
/*height: 178px;*/
/*display: block;*/
/*}*/
</style>
