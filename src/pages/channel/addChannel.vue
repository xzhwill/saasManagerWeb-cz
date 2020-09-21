<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="120px" ref="formData" :model="formData" :rules="formTableRules">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="渠道ID" prop="channelId" class="common-form-item">
        <el-input v-model="formData.channelId" minlength="5" :disabled="!updateFlag"></el-input>
      </el-form-item>
      <el-form-item label="渠道名称" prop="channelName" class="common-form-item">
        <el-input v-model="formData.channelName" minlength="5"></el-input>
      </el-form-item>
      <!--<el-form-item prop="state" label="状态">-->
      <el-form-item class="common-form-item" label="短信签名">
        <el-input v-model="formData.smsSignName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item class="common-form-item" label="短信模板ID">
        <el-input v-model="formData.smsTemplateId " placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="description" class="common-form-item" label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="200" v-model="formData.description"
          placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="加密类型">
        <el-select v-model="formData.encryptType">
          <el-option label="RSA加密" :value="'1'"></el-option>
          <el-option label="MD5加密" :value="'2'"></el-option>
          <el-option label="SM2" :value="'3'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="common-form-item" label="渠道身份认证公钥">
        <el-input v-model="formData.channelPublicKey " placeholder=""></el-input>
      </el-form-item>
      <el-form-item class="common-form-item" label="渠道身份认证私钥">
        <el-input v-model="formData.channelPrivateKey " placeholder=""></el-input>
      </el-form-item>
      <el-form-item class="common-form-item" label="盐值" v-if="formData.encryptType == '2'">
        <el-input v-model="formData.saltValue" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="formData.state" :label="1">启用</el-radio>
        <el-radio v-model="formData.state" :label="0">禁用</el-radio>
      </el-form-item>
      <el-row class=" btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { channelRule } from '@/utils/rules.js'
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
      title: "添加渠道",
      action: 0,
      className: "",
      labelWidth: "120px",
      formData: {
        channelId: '',
        channelName: '',
        state: 0,
        encryptType: '1',
        description: '',
        smsSignName: '',
        smsTemplateId: '',
        channelPublicKey: '',
        channelPrivateKey: ''
      },
      formTableRules: channelRule
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.getInfo()
  },
  methods: {
    getInfo () {
      let id = this.$route.query.id
      if (id != undefined) {
        this.updateFlag = false
        this.action = 1
        this.title = '修改渠道'
        request.apiGet(api.channel.info, { id: id }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.formData = data.data
          } else {
            help.E(data.msg)
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
        url = api.channel.update
        delete params['addTime']
      } else {
        url = api.channel.create
      }
      request.apiPost(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('channelFlag', 'true')
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
      sessionStorage.setItem('channelFlag', 'true')
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
