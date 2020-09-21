<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="160px" ref="formData" :model="formData">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="城市" prop="cityCode" class="common-form-item">
        <el-select v-model="formData.cityCode" filterable>
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供给侧" prop="cityCode" class="common-form-item">
        <el-select v-model="formData.supplyId" filterable>
          <el-option v-for="(item, index) in supplyList " :key="index" :label="item.orzName" :value="item.orzId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票标识" prop="state">
        <el-radio v-model="formData.invoiceType" label="1">是</el-radio>
        <el-radio v-model="formData.invoiceType" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="销售方纳税人识别号" prop="sellerTaxpayerId" class="common-form-item">
        <el-input v-model="formData.sellerTaxpayerId" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方名称" prop="sellerName" class="common-form-item">
        <el-input v-model="formData.sellerName" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方地址" prop="sellerAddress" class="common-form-item">
        <el-input v-model="formData.sellerAddress" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方电话" prop="sellerPhone" class="common-form-item">
        <el-input v-model="formData.sellerPhone" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方开户行" prop="sellerOpenBank" class="common-form-item">
        <el-input v-model="formData.sellerOpenBank" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方银行账号" prop="sellerBankAccount" class="common-form-item">
        <el-input v-model="formData.sellerBankAccount" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方邮箱" prop="sellerEmail" class="common-form-item">
        <el-input v-model="formData.sellerEmail" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方开票人" prop="sellerDrawer" class="common-form-item">
        <el-input v-model="formData.sellerDrawer" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方收款人" prop="sellerPayee" class="common-form-item">
        <el-input v-model="formData.sellerPayee" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方复核人" prop="sellerChecker" class="common-form-item">
        <el-input v-model="formData.sellerChecker" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方开票地址" prop="sellerUrl" class="common-form-item">
        <el-input v-model="formData.sellerUrl" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="购买方商品编号" prop="buyerProductNo" class="common-form-item">
        <el-input v-model="formData.buyerProductNo" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="购买方项目名称" prop="buyerProjectName" class="common-form-item">
        <el-input v-model="formData.buyerProjectName" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="销售方发票下载地址" prop="downloadUrl" class="common-form-item">
        <el-input v-model="formData.downloadUrl" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="购买方密钥" prop="buyerAppkey" class="common-form-item">
        <el-input v-model="formData.buyerAppkey" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="税率" prop="taxRatio" class="common-form-item">
        <el-input v-model="formData.taxRatio" minlength="5" placeholder="0.03" type="number" max="1"></el-input>
      </el-form-item>
      <el-form-item label="最小开票金额" prop="minInvoicePriceYuan" class="common-form-item">
        <el-input v-model="formData.minInvoicePriceYuan" minlength="5" placeholder="0.03"></el-input>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import request from '@/utils/request.js'
import api from '@/utils/api.js'
import help from '@/utils/helper.js'
import enums from '@/utils/enums.js'
import { toFen } from '@/utils/public.js'

export default {
  data () {
    return {
      updateFlag: true,
      clearTime: false,
      title: '添加城市发票配置',
      action: 0,
      className: '',
      labelWidth: '120px',
      formData: {
        cityCode: '',
        invoiceType: '1',
        supplyId: ''
      },
      cityList: [],
      supplyList: []
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', {})
    this.getInfo()
    this.getCityList()
  },
  methods: {
    checkCityId (val) {
      if (val && val !== '') {
        request.apiGet(api.city.checkCityCode, { cityCode: val }).then(data => {
          if (data.msg && data.msg.code === enums.NET_SUCCESS) {

          } else {
            help.E(data.msg.message)
            this.formData.cityCode = ''
          }
        })
      }
    },
    getCityList () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.E('网络异常')
      })
      request.apiGet(api.supply.superiorOptionList).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.supplyList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.E('网络异常')
      })
    },
    getInfo () {
      let id = this.$route.query.id;
      if (id !== undefined) {
        this.updateFlag = false
        this.action = 1
        this.title = '修改城市发票配置'
        request.apiGet(api.invoice.info, { id: id }).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
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
          return false
        }
      })
    },
    postCityData () {
      let params = {}
      let url = ''
      params = this.formData
      params['minInvoicePrice'] = toFen(params['minInvoicePriceYuan'])
      if (parseInt(this.action) == 1) {
        url = api.invoice.update
        delete params['addTime']
        delete params['updateTime']
      } else {
        url = api.invoice.create
      }
      request.apiPost(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('cityInvoiceFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.E('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('cityInvoiceFlag', 'true')
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
