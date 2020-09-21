<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form :label-width="labelWidth" :model="ruleForm" :rules="systemFormRules" ref="ruleForm">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="所属城市" prop='cityCode'>
        <el-select v-model="ruleForm.cityCode">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车票类型" >
        <el-radio v-model="ruleForm.ticketType" :label="parseInt(1)">普通</el-radio>
        <el-radio v-model="ruleForm.ticketType" :label="parseInt(2)" @change='ticketTypeChange'>通票</el-radio>
      </el-form-item>
      <el-form-item label="业务类型" prop='businessType' v-if="ruleForm.ticketType==1">
        <el-select v-model="ruleForm.businessType">
          <el-option label="定制公交" value="1"></el-option>
          <el-option label="预约包车" value="4"></el-option>
          <!--<el-option label="企业班车" value="5"></el-option>-->
          <!--<el-option label="企业包车" value="6"></el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="更改类型" >
        <el-radio v-model="ruleForm.changeType" :label="parseInt(1)">改签</el-radio>
        <el-radio v-model="ruleForm.changeType" :label="parseInt(2)">退票</el-radio>
      </el-form-item>
      <el-form-item label="班次类型" v-if="ruleForm.businessType==2">
        <el-radio v-model="ruleForm.cycleType" :label="parseInt(1)">固定</el-radio>
        <el-radio v-model="ruleForm.cycleType" :label="parseInt(2)">循环</el-radio>
      </el-form-item>
      <el-form-item class="common-form-item" label="生效时间">
        <el-date-picker
          v-model="timeGroup"
          type="datetimerange"
          range-separator="至"
          :picker-options="pickerOptions1"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"></el-date-picker>
      </el-form-item>
      <el-form-item label="不可退/改时间（分钟）" class="common-form-item" prop="noRefundTime">
        <el-input v-model="ruleForm.noRefundTime" @blur="judgeInfo(ruleForm.noRefundTime)"></el-input>
      </el-form-item>
      <el-form-item label="距离发车时间">
        <div v-for="(item ,index) in moneyForm.list" :key="index" class="refundBox">
          <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input
              style="width:100px"
              v-model="item.intervalTime"
              type="number"
              onblur="if(value)value = (+value).toFixed()"
              oninput="if(value.length > 8) value = value.slice(0, 8); if (value < 0); value = value.replace(/[^\0-9\.]/g, '')"
              onpaste="value = value.replace(/[^\0-9\.]/g, '')"
              oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"
              @mousewheel.native.prevent></el-input> /分
          </el-form-item>
          <el-form-item :rules="{required: true, message: '不能为空', trigger: 'blur'}">
            <el-input
              onblur="if(value<0 || isNaN(value) || value>1){value=''}else{if(value)value=(+value).toFixed(2)}"
              style="width:100px;margin-left:30px"
              v-model="item.feeRatio"
              type="number"
              @mousewheel.native.prevent></el-input> 费率
            <span style="color:red;margin-left:10px"> 配置小数，最大值为1。例如：0.1 表示 10% 手续费</span>
          </el-form-item>
          <el-button
            style="margin-left:30px"
            type="warning"
            plain
            v-if="moneyForm.list.length>1"
            @click.prevent="removeSMoneyRule(index)"
            icon="el-icon-remove" class="btn"></el-button>
        </div>
        <el-form-item>
          <el-button type="primary" plain @click="addMoneyRule" icon="el-icon-circle-plus" class="btn"></el-button>
        </el-form-item>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="ruleForm.state" :label="parseInt(1)">启用</el-radio>
        <el-radio v-model="ruleForm.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { ruleRules } from '@/utils/rules'
import request from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      clearTime: false,
      title: '退/改手续费',
      action: 0,
      labelWidth: '180px',
      cityList: '',
      ruleForm: {
        cityCode: '',
        businessType: '',
        effectiveDate: '', // 生效时间
        expiryDate: '', // 失效时间
        noRefundTime: '', // 不可退时间 单位分
        ruleList: '', // 手续费规则
        state: 0,
        cycleType: 1,
        changeType: 2,
        ticketType: 1
      },
      timeGroup: [],
      orzList: [],
      systemFormRules: ruleRules,
      index: 1,
      moneyForm: {
        list: [{
          intervalTime: '',
          feeRatio: ''
        }]
      },
      cross: false,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now()
        }
      },
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getCouponInfo()
    this.getAllCityList()
  },
  methods: {
    getAllCityList () {
      request.apiGet(api.city.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    ticketTypeChange () {
      this.ruleForm.businessType = ''
    },
    getCouponInfo () {
      if (this.uid) {
        this.title = '修改退款手续费'
        request.apiGet(api.refundRule.info, { ruleId: this.uid }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            this.ruleForm = data.data
            this.ruleForm.businessType = data.data.businessType.toString()
            this.moneyForm.list = this.ruleForm.ruleList
            this.index = this.moneyForm.list.length
            this.timeGroup = [this.ruleForm.effectiveDate, this.ruleForm.expiryDate]
          }
        })
      }
    },
    save () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.moneyForm.list.map((item, index) => {
            if (item.intervalTime == '') {
              this.cross = true
            } else if (item.feeRatio == '') {
              this.cross = true
            } else {
              this.cross = false
            }
          })
          if (this.cross) return help.E('请完善手续费规则')
          if (this.timeGroup == null || !this.timeGroup.length) return help.E('请选择生效时间')
          let params = this.ruleForm
          params.businessType = +params.businessType
          params.effectiveDate = this.timeGroup[0]
          params.expiryDate = this.timeGroup[1]
          params.noRefundTime = +params.noRefundTime
          let flag = true
          this.moneyForm.list.forEach((item) => {
            if (!item.intervalTime || !item.feeRatio) {
              flag = false
              return help.W('距离发车时间下的分钟数和费率都不能为空')
            }
            item.feeRatio = (+item.feeRatio).toFixed(2)
            item.intervalTime = (+item.intervalTime).toFixed()
          })
          params.ruleList = this.moneyForm.list
          if (!flag) return false
          request.apiPost(this.uid ? api.refundRule.update : api.refundRule.create, params).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              sessionStorage.setItem('returnRuleConfiguration', 'true')
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
    addMoneyRule () {
      this.index++
      this.moneyForm.list.push({
        feeRatio: '',
        intervalTime: ''
      })
    },
    removeSMoneyRule (idx) {
      if (this.index > 1) {
        this.index--
        this.moneyForm.list.splice(idx, 1)
      } else {
        help.E('不能再删除了！')
      }
    },
    back () {
      sessionStorage.setItem('returnRuleConfiguration', 'true')
      this.$router.back()
    },
    judgeInfo (val) {
      if (isNaN(val) || val < 0) {
        this.ruleForm.noRefundTime = ''
        return help.W('请输入正整数')
      } else {
        if (+val) this.ruleForm.noRefundTime = (+val).toFixed()
      }
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
  .refundBox {
    display: flex;
    height: 32px;
    margin-bottom: 10px
  }
  .line {
    width: 30px;
    height: 1px;
    border-top: 1px solid #ddd;
    margin: 0 10px;
    margin-top: 16px;
  }
</style>
