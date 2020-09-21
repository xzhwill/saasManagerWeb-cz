<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="120px" style="width: 100%;" :model="groupCoupon" :rules="formRules" ref="addGroupCoupon"
             label-position="right">
      <el-form-item label="组合模板名称" prop="templateName" class="common-form-item" style="width: 340px;">
        <el-input v-model="groupCoupon.templateName" palceholder="请输入模板名称" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="绑定单模板">
        <el-button type="primary" @click="addSingleCoupon">新增</el-button>
      </el-form-item>
      <div v-for="(item, ind) in checkedCouponList" style="display: flex;">
          <el-form-item label="选择单模板" prop="couponList">
            <el-select v-model="item.templateId" filterable style="width: 200px;" @change="changeSingle">
              <el-option v-for="(item, index) in couponList" :disabled="item.disabled" :key="index" :label="item.templateName" :value="item.templateId"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="绑定数量" class="common-form-item">
          <el-input v-model="item.boundQuantity" style="width: 100px;" palceholder="请输入绑定数量" maxlength="3" type="number"></el-input>
        </el-form-item>
        <el-button style="height: 32px;margin-left: 15px;" @click="deleteSingle(ind)">删除</el-button>
      </div>
      <el-row class="btn-group" style="margin-left: 300px;">
        <el-button type="primary" @click="save" v-if="groupCoupon.templateStatus == '1'">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { marketCouponGroupRule } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'addMarketCouponGroup',
  data () {
    return {
      groupCoupon: {
        templateName: '', //  组合模板名称
        templateStatus: '1' // 组合模板状态 orderReportForms-草稿  travelReportForms-上线中  payReportForms-已下线 4-已删除'
      },
      checkedCouponList: [], // 已选单模板
      couponList: [], // 所有单模板
      formRules: marketCouponGroupRule,
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断为修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getGroupSingle()
    this.getCouponInfo()
  },
  methods: {
    getCouponInfo () {
      if (this.uid) {
        this.title = '修改单模板'
        request.apiGet(api.couponGroup.info, {
          templateId: this.uid
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.groupCoupon = res
            res.groupTemplateReInfoList.forEach(item => {
              let obj = {
                templateId: item.templateId,
                boundQuantity: item.boundQuantity
              }
              this.checkedCouponList.push(obj)
            })
            this.changeSingle()
          }
        })
      }
    },
    getGroupSingle () {
      request.apiGet(api.couponSingle.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          data.data.forEach(item => {
            item['disabled'] = false
            this.couponList.push(item)
          })
        } else {
          help.E(data.msg)
        }
      })
    },
    /* 添加绑定单模板 */
    addSingleCoupon () {
      let obj = {
        templateId: '',
        boundQuantity: ''
      }
      this.checkedCouponList.push(obj)
    },
    /* 修改绑定单模板 */
    changeSingle () {
      let str = JSON.stringify(this.checkedCouponList)
      this.couponList.forEach(val => {
        if (!this.checkedCouponList.length) {
          val.disabled = false
        } else {
          if (str.indexOf(val.templateId) > -1) {
            val.disabled = true
          } else {
            val.disabled = false
          }
        }
      })
    },
    /* 删除单模板 */
    deleteSingle (index) {
      this.checkedCouponList.splice(index, 1)
      this.changeSingle()
    },
    save () {
      this.$refs['addGroupCoupon'].validate((valid) => {
        if (valid) {
          if (!this.checkedCouponList.length) return help.W('请先绑定单模板')
          let params = this.groupCoupon
          let url
          this.uid ? url = api.couponGroup.update : url = api.couponGroup.create
          params.templateIdList = []
          params.boundQuantityList = []
          for (let i = 0; i < this.checkedCouponList.length; i++) {
            let item = this.checkedCouponList[i]
            if (item.boundQuantity != null && item.boundQuantity != '' && item.templateId != '') {
              if (!(item.boundQuantity % 1 === 0 && item.boundQuantity > 0)) {
                return help.E('绑定数量不能为负数')
              } else {
                params.boundQuantityList.push(item.boundQuantity)
                params.templateIdList.push(item.templateId)
              }
            } else {
              return help.W('信息不能为空')
            }
          }
          request.apiPost(url, params).then((data) => {
            if (data.code === enums.NET_SUCCESS) {
              sessionStorage.setItem('couponGroupFlag', 'true')
              help.S('保存成功')
              this.$router.back()
            } else {
              help.E(data.msg)
            }
          }).catch(() => {
            help.Echo('网络异常')
          })
        } else {
          return false
        }
      })
    },
    back () {
      sessionStorage.setItem('couponGroupFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
