<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="operation" ref="addOperation"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="按钮名称" prop="operationName" class="common-form-item">
        <el-input v-model="operation.operationName" :maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description" class="common-form-item">
        <el-input v-model="operation.operationDepict">
        </el-input>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-radio v-model="operation.state" :label="1">可用</el-radio>
        <el-radio v-model="operation.state" :label="0">禁用</el-radio>
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
      title: '添加按钮',
      labelWidth: '120px',
      operation: {
        state: 1, // 状态
        operationDepict: '', // 描述
        operationName: '' // 按钮名称
      },
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getOperationInfo()
  },
  methods: {
    getOperationInfo () {
      if (this.uid) {
        this.title = '修改按钮'
        request.apiGet(api.operate.info, {
          operationId: this.uid
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.operation = res
          }
        })
      }
    },
    save () {
      if (!this.operation.operationName) return helper.W('请先填写按钮名称')
      let url
      this.uid ? url = api.operate.update : url = api.operate.add
      request.apiPost(url, this.operation).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('operateFlag', 'true')
          helper.S('保存成功')
          this.$router.back()
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('operateFlag', 'true')
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
</style>
