<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="150px" :model="peopleForm" :rules="peopleFormRules" ref="peopleForm">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="姓名" class="common-form-item" prop="staffName">
        <el-input v-model="peopleForm.staffName" maxlength="5" show-word-limit>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号" class="common-form-item" prop="phone">
        <el-input v-model="peopleForm.phone" maxlength="11" show-word-limit>
        </el-input>
      </el-form-item>
      <el-form-item label="所属城市" prop="cityList">
        <el-select v-model="chooseCity" multiple  placeholder="请选择">
          <el-option
            v-for="(val,idx) in cityList"
            :value="val.cityCode"
            :key="idx"
            :label="val.cityName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop='dutyType'>
        <el-select v-model="peopleForm.dutyType" @change="getVal">
          <el-option label="运营人员" value="1"></el-option>
          <el-option label="紧急联系人" value="2"></el-option>
          <!--<el-option label="值班人员" value="payReportForms"></el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item prop="state" label="状态">
          <el-radio v-model="peopleForm.state" label="1">启用</el-radio>
          <el-radio v-model="peopleForm.state" label="0">禁用</el-radio>
      </el-form-item>
        <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addEmergencyContactRules } from '@/utils/rules'
import request from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      clearTime: false,
      title: '新建运营人员',
      labelWidth: '120px',
      index: 1,
      peopleForm: {
        staffName: '',
        phone: '',
        cityList: [],
        dutyType: '1',
        state: '1'
      },
      peopleFormRules: addEmergencyContactRules,
      cityList: [], // 所有城市
      chooseCity: [],
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', {})
    this.getPeopleInfo()
    this.getAllList()
  },
  methods: {
    getVal (val) {
      this.peopleForm.dutyType = val
    },
    getAllList () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getPeopleInfo () {
      if (this.uid) {
        this.title = '修改运营人员'
        request.apiGet(api.staff.info, {staffId: this.uid}).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            this.peopleForm = data.data
            data.data.staffCityInfoList.forEach(item => {
              // this.cityList.push(item.cityCode)
              this.chooseCity.push(item.cityCode)
            })
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    save () {
      this.peopleForm.cityList = this.chooseCity
      this.$refs['peopleForm'].validate(valid => {
        if (valid) {
          this.postNoticeData()
        } else {
          return false
        }
      })
    },
    postNoticeData () {
      request.apiPost(this.uid ? api.staff.update : api.staff.create, this.peopleForm).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('emergencyContactListFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('emergencyContactListFlag', 'true')
      this.$router.push({path: '/emergencyContact'})
    }
  }
}
</script>

<style>
@import "../../assets/style/common.css";
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
.box {
  border: 1px solid #eee;
  box-shadow: 3px 3px 6px #eee;
  margin-left: 0;
  width: 650px;
  padding-top: 20px;
}
.btn {
  position: absolute;
  top: -10px;
  right: 10px;
}
</style>
