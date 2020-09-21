<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="driver" :rules="formRules" ref="addDriver"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="城市" prop="cityCode">
        <el-select v-model="driver.cityCode" @change="getOrzList(driver.cityCode)">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构" prop="supplyId">
        <el-select v-model="driver.supplyId">
          <el-option v-for="item in orzList" :label="item.orzName" :key="item.orzId" :value="item.orzId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="司机编号" prop="driverNo" class="common-form-item">
        <el-input v-model="driver.driverNo" :maxLength="18" placeholder="请输入司机编号"></el-input>
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName" class="common-form-item">
        <el-input v-model="driver.driverName" :maxLength="6" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone" class="common-form-item">
        <el-input v-model="driver.phone" placeholder="请输入手机号" :maxLength="11">
        </el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCardNo" class="common-form-item">
        <el-input v-model="driver.idCardNo" placeholder="请输入身份证" :maxLength="18"></el-input>
      </el-form-item>
      <el-form-item prop="sex" label="性别">
        <el-radio v-model="driver.sex" :label="parseInt(1)">男</el-radio>
        <el-radio v-model="driver.sex" :label="parseInt(0)">女</el-radio>
      </el-form-item>
      <el-form-item label="驾照类型">
        <el-select v-model="driver.driverLicense">
          <el-option v-for="item in licenseArr" :label="item.licenseName" :key="item.licenseName" :value="item.licenseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登录密码" prop="password" class="common-form-item">
        <el-input v-model="driver.password" placeholder="请输入密码" type="password" :maxLength="16"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          v-model="driver.avatar"
          list-type="picture-card"
          :limit=1
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          :http-request="uploadImage"
          :on-remove="removePhoto"
          multiple
          action="''">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-radio v-model="driver.state" :label="parseInt(1)">启用</el-radio>
        <el-radio v-model="driver.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-form-item prop="remark" class="common-form-item" label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" :maxlength="140" v-model="driver.remark"
          placeholder=""></el-input>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addDriverFormRules } from '@/utils/rules'
import { checkedImage, checkNumber, checkNumber1, checkIdcard, checkTelphone } from '@/utils/public'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加司机',
      action: 0,
      labelWidth: '120px',
      driver: {
        driverName: '',
        driverNo: '',
        phone: '',
        idCardNo: '',
        driverLicense: '',
        password: '',
        sex: 1,
        state: 1,
        orzId: '',
        remark: '',
        updateFlag: true
      },
      orzList: [],
      fileList: [],
      cityList: [],
      licenseArr: enums.DRIVERLICENSE,
      verificationRule: false,
      formRules: addDriverFormRules,
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getOrzList()
    this.getCityList()
    this.getDriverInfo()
  },
  methods: {
    getCityList () { //  修改渠道，重新获取可绑定城市
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getOrzList (val) {
      let params = { orzType: 1 }
      if (val) params.cityCode = val
      request.apiGet(api.orgnization.option, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orzList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getDriverInfo () {
      if (this.uid) {
        this.driver.updateFlag = false
        this.action = 1
        this.title = '修改司机信息'
        request.apiGet(api.driver.driverInfo, {
          driverId: this.uid
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.driver = (data.data)
            this.fileList.push({ name: '1', url: data.data.avatar })
          }
        })
      } else {
        this.driver.updateFlag = true
      }
    },
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    uploadImage (file) {
      request.apiFile(api.common.upload, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
          help.E(data.msg)
        } else {
          this.fileList = []
          this.fileList.push({ name: '1', url: data.data })
        }
      })
    },
    removePhoto (file) {
      this.fileList = []
    },
    save () {
      this.$refs['addDriver'].validate((valid) => {
        if (valid) {
          let info = this.driver
          if (!checkNumber(info.driverNo)) return help.E('请输入英文、数字格式的司机编号')
          if (!checkNumber1(info.driverName)) return help.E('请输入中英文、数字格式的司机姓名')
          if (!checkTelphone(info.phone)) return help.E('请输入正确的手机号')
          if (info.idCardNo && !checkIdcard(info.idCardNo)) return help.E('请输入正确的身份证号')
          if (info.password && !/^\d{6,16}$/.test(info.password)) return help.E('请输入6-16位数字格式的密码')
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      let params = this.driver
      params.avatar = this.fileList.length ? this.fileList[0].url : ''
      request.apiPost(this.uid ? api.driver.updateDriver : api.driver.addDriver, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('driverFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('driverFlag', 'true')
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
