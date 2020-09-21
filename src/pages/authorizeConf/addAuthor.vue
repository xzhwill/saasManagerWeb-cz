<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="formMsg" ref="formMsg" label-position="right"  :rules="formTableRules">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="渠道" style="margin-top: 20px;" prop="channelId">
        <el-select v-model="formMsg.channelId">
          <el-option v-for="(item, index) in channelList " :key="index" :label="item.channelName" :value="item.channelId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APPId" class="common-form-item" prop="appId">
        <el-input v-model="formMsg.appId" placeholder="请输入APPId"></el-input>
      </el-form-item>
      <el-form-item label="微信secret">
        <el-input v-model="formMsg.wxSecret" placeholder="请输入微信secret"></el-input>
      </el-form-item>
      <el-form-item label="支付宝公钥" class="common-form-item">
        <el-input v-model="formMsg.alipayPublicKey" placeholder="请输入支付宝公钥"></el-input>
      </el-form-item>
      <el-form-item label="支付宝私钥" class="common-form-item">
        <el-input v-model="formMsg.alipayPrivateKey" placeholder="请输入支付宝私钥"></el-input>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { authorizateRule } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      formTableRules: authorizateRule,
      title: '添加授权配置',
      action: 0,
      labelWidth: '120px',
      formMsg: {
        channelId: '',
        appId: '',
        wxSecret: '',
        alipayPublicKey: '',
        alipayPrivateKey: ''
      },
      channelList: []
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getQueryParams()
    this.getChannel()
  },
  methods: {
    getChannel () {
      request.apiGet(api.channel.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    getQueryParams () {
      let id = this.$route.query.id
      if (id != undefined) {
        this.action = 1
        this.title = '修改配置信息'
        request
          .apiGet(api.auth.info, { id: id })
          .then(data => {
            // 回显
            if (data.code === enums.NET_SUCCESS) {
              let res = data.data
              this.formMsg = res
            }
          })
      }
    },
    save() {
      this.$refs['formMsg'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData() {
      let params = this.formMsg
      let url = ''
      if (parseInt(this.action) === 1) {
        url = api.auth.update
        delete params['addTime']
        delete params['updateTime']
      } else {
        url = api.auth.create
      }
      request.apiPost(url, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('cacheFlag', 'true')
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
        this.formMsg.cacheField = ''
      }
    },
    back() {
      sessionStorage.setItem('cacheFlag', 'true')
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
