<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="bus" :rules="formRules" ref="addBus"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="城市" prop="cityCode">
        <el-select v-model="bus.cityCode" @change="changeCity">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构" prop="supplyId">
        <el-select v-model="bus.supplyId" @change="getEqpList">
          <el-option v-for="item in orzList" :label="item.orzName" :key="item.orzId" :value="item.orzId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆编号" prop="busNo" class="common-form-item">
        <el-input v-model="bus.busNo" minlength="5" placeholder="例:北京: BJ001" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="车牌号" prop="busNumber" class="common-form-item">
        <el-input v-model="bus.busNumber" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="车型" prop="busTypeId" class="common-form-item">
        <el-select v-model="bus.busTypeId" filterable>
          <el-option v-for="(item, index) in busTypeArr " :key="index" :label="item.busTypeName"
            :value="item.busTypeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出厂编号" prop="engineNumber" class="common-form-item">
        <el-input v-model="bus.engineNumber"></el-input>
      </el-form-item>
      <!-- <el-form-item label="设备号" prop="eqpId" class="common-form-item">
        <el-select v-model="bus.eqpId">
          <el-option v-for="item in eqpList" :label="item.eqpNo +' '+item.eqpModel" :key="item.eqpId"
            :value="item.eqpId"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="state" label="车辆状态">
        <el-radio v-model="bus.state" :label="parseInt(1)">启用</el-radio>
        <el-radio v-model="bus.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-form-item prop="remark" class="common-form-item" label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" :maxlength="20" v-model="bus.remark"
          placeholder=""></el-input>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addBusFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加车辆',
      labelWidth: '120px',
      bus: {
        'busNumber': '',
        'busTypeId': '',
        'supplyId': '',
        'engineNumber': '',
        'state': 1,
        'remark': '',
        'delState': 0,
        'updateFlag': true
      },
      verificationRule: false,
      formRules: addBusFormRules,
      busTypeArr: [],
      orzList: [],
      cityList: [],
      eqpList: [],
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断为修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getOtherList()
    this.getBusInfo()
  },
  methods: {
    getEqpList (orzId) {
      request.apiGet(api.eqp.option, { orzId: orzId, bindState: 1 }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.eqpList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getBusInfo () {
      if (this.uid) {
        this.bus.updateFlag = false
        this.title = '修改车辆信息'
        request.apiGet(api.bus.busInfo, {
          busId: this.uid
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.bus = (data.data)
            this.changeCity(this.bus.cityCode)
            this.getEqpList(this.bus.orzId)
          } else {
            help.E(data.msg)
          }
        })
      } else {
        this.bus.updateFlag = true
      }
    },
    changeSelectOrz () {
      this.busTypeArr.forEach(item => {
        if (item.busTypeId === this.bus.busTypeId) {
          this.bus.orzId = item.orzId
          this.bus.orzIname = item.orzIname
        }
      })
    },
    changeCity (val) { //  获取供给侧机构列表
      request.apiGet(api.orgnization.option, { orzType: 1, cityCode: val }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orzList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getOtherList () {
      request.apiGet(api.city.option).then(data => { // 城市
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
      request.apiGet(api.busType.optionList).then(data => { // 车型
        if (data.code === enums.NET_SUCCESS) {
          this.busTypeArr = data.data
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    save () {
      this.$refs['addBus'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      request.apiPost(this.uid ? api.bus.updateBus : api.bus.addBus, this.bus).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('flag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('flag', 'true')
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
