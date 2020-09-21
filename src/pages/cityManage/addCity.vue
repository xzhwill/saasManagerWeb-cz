<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="120px" ref="formData" :model="formData" :rules="formTableRules">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="城市Id" prop="cityCode">
        <el-input v-model="formData.cityCode" @change="checkCityId" :readonly="updateFlag ? false : 'readonly'">
        </el-input>
      </el-form-item>
      <el-form-item label="城市名称" prop="cityName">
        <el-input v-model="formData.cityName">
        </el-input>
      </el-form-item>
      <el-form-item label="城市拼音" prop="citySpell">
        <el-input v-model="formData.citySpell">
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="formData.state" :label="parseInt(1)">启用</el-radio>
        <el-radio v-model="formData.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="formData.description"></el-input>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { cityRule } from '@/utils/rules.js'
import request from "@/utils/request.js";
import api from "@/utils/api.js";
import help from "@/utils/helper.js";
import enums from "@/utils/enums.js";
import { toTrim, Trim } from "@/utils/public.js";
export default {
  props: {
    searchData: {
      type: Array,
      required: true
    },
    tableHeaderCheckList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      updateFlag: true,
      clearTime: false,
      title: '添加城市',
      action: 0,
      className: '',
      labelWidth: '120px',
      formData: {
        cityCode: '',
        cityName: '',
        state: 0,
        citySpell: ''
      },
      formTableRules: cityRule
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', [])
    this.getCityInfo()
  },
  methods: {
    /**
     * 改变城市ID
     * @param val
     */
    checkCityId (val) {
      if (val && val !== '') {
        request.apiGet(api.city.checkCityCode, { cityCode: val }).then(data => {
          if (data.code === enums.NET_SUCCESS) {

          } else {
            help.E(data.msg)
            this.formData.cityCode = ''
          }
        })
      }
    },
    getCityInfo () {
      let id = this.$route.query.id
      if (id != undefined) {
        this.updateFlag = false
        this.action = 1
        this.title = '修改城市'
        request.apiGet(api.city.info, { cityCode: id }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.formData = data.data
          }
        })
      }
    },
    save () {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.postCityData()
        } else {
          return false;
        }
      });
    },
    postCityData() {
      let params = {}
      let url = ''
      params = this.formData

      if (parseInt(this.action) == 1) {
        url = api.city.updated
        delete params['addTime']
      } else {
        url = api.city.created
      }
      request.apiPost(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('cityFlag', 'true')
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
      sessionStorage.setItem('cityFlag', 'true')
      this.$router.back()
    }
  }
};
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
