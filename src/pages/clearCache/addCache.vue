<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="120px" ref="formData" :model="formData" :rules="formTableRules">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="待清理缓存的url" prop="url" class="common-form-item">
        <el-input v-model="formData.url" placeholder="请输入url"></el-input>
      </el-form-item>
      <el-form-item prop="cacheType" label="缓存类型">
        <el-radio v-model="formData.cacheType" :label="parseInt(1)">redis</el-radio>
      </el-form-item>
      <el-form-item prop="db" label="清理对象">
        <el-radio v-model="formData.db" label="0" @change="changeType">定制公交</el-radio>
        <el-radio v-model="formData.db" label="1">专线</el-radio>
        <el-radio v-model="formData.db" label="8">订单服务</el-radio>
        <el-radio v-model="formData.db" label="3">公共服务</el-radio>
      </el-form-item>
      <el-form-item prop="cacheKeyType" label="缓存key类型">
        <el-radio v-model="formData.cacheKeyType" :label="parseInt(1)" @change="changeType">普通</el-radio>
        <el-radio v-model="formData.cacheKeyType" :label="parseInt(2)">hash</el-radio>
      </el-form-item>
      <el-form-item label="key" prop="cacheKey" class="common-form-item">
        <el-input v-model="formData.cacheKey" minlength="5" placeholder="请输入key"></el-input>
      </el-form-item>
      <el-form-item label="field" prop="cacheField" class="common-form-item">
        <el-input v-model="formData.cacheField" minlength="5" placeholder="请输入field"
          :disabled="this.formData.cacheKeyType==1"></el-input>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { cacheRule } from '@/utils/rules.js'
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
      title: "添加缓存清理配置",
      action: 0,
      className: "",
      labelWidth: "120px",
      formData: {
        db: '1',
        url: '',
        cacheType: 1,
        cacheKey: '1',
        cacheKeyType: 1,
        cacheField: '',
      },
      formTableRules: cacheRule,
    }
  },
  mounted() {
    this.$emit('getInfo', [])
    this.init()
  },
  methods: {
    init() {
      this.getInfo()
    },
    getInfo() {
      let id = this.$route.query.id;
      if (id != undefined) {
        this.updateFlag = false
        this.action = 1
        this.title = '修改缓存清理配置'
        request.apiGet(api.cache.info, { id: id }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.formData = data.data
          }
        })
      }
    },
    save() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.postData()
        } else {
          return false;
        }
      });
    },
    postData() {
      let params = {}
      let url = ''
      params = this.formData
      if (parseInt(this.action) == 1) {
        url = api.cache.update
        delete params['addTime']
      } else {
        url = api.cache.create
      }
      request.apiPost(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    changeType(val) {
      if (val == 1) {
        this.formData.cacheField = ''
      }
    },
    back() {
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
