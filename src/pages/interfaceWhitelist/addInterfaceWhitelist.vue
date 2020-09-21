<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="operation" ref="addOperation" label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="接口地址" prop="path" class="common-form-item" >
        <el-input v-model="operation.path" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description" class="common-form-item">
        <el-input v-model="operation.description"  >
        </el-input>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-radio v-model="operation.state" :label="'1'">可用</el-radio>
        <el-radio v-model="operation.state" :label="'0'">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import helper from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加白名单',
      labelWidth: '120px',
      operation: {
        'state': '1',
        'description': ''
      },
      action: 0
    }
  },
  mounted () {
    this.getOperationInfo()
  },
  methods: {
    getOperationInfo () {
      let id = this.$route.query.id
      console.log(id)
      if (id != undefined) {
        this.action = 1
        this.title = '修改角色信息'
        request.apiGet(api.interfaceWhitelist.info, {
          id: id
        }).then(data => {
          if (data.msg && data.msg.code === enums.NET_SUCCESS) {
            console.log(data)
            let res = data.data.list[0]
            this.operation = res
          }
        })
      } else {
        this.action = 0
      }
    },
    save () {
      this.$refs['addOperation'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      let params = this.operation
      let url = ''
      if (parseInt(this.action) === 1) {
        url = api.interfaceWhitelist.update
        delete params['createTime']
      } else {
        url = api.interfaceWhitelist.create
      }
      request.apiPost(url, params).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('interfaceWhiteFlag','true')
          helper.S('保存成功')
          this.$router.back()
        } else {
          helper.E(data.msg.message)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('interfaceWhiteFlag','true')
      this.$router.back()
    }
  }
}
</script>

<style>
@import "../../assets/style/common.css";
  .btn-group{text-align: center;}
</style>
