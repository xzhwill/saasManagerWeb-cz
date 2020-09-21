<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="120px" :model="ticketInfo" ref="addOrgnization" label-position="right">
      <div class="form-section" style="margin-bottom: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="名称" class="common-form-item" prop="ruleName">
        <el-input v-model="ticketInfo.ruleName" pleaceholder="请输入名称"></el-input>
      </el-form-item>
      <div class="title">往返</div>
      <el-form-item label="起步价" class="common-form-item" prop="showGoBackInitiatePrice">
        <el-input v-model="ticketInfo.showGoBackInitiatePrice" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')" @mousewheel.native.prevent minlength="5"></el-input>元
      </el-form-item>
      <el-form-item label="免费里程：" class="common-form-item" prop="goBackFreeMileage">
        <el-input v-model="ticketInfo.goBackFreeMileage">
        </el-input>KM
      </el-form-item>
      <div v-for="(item ,index) in goBackUnit">
        <el-row>
          <el-col :span="11.5">
            <el-form-item label="里程区间：" class="common-form-item">
              <el-input v-model="item.mileage" oninput="javascript:this.value = this.value.replace(/[^0-9]/g, '');"> </el-input>KM
            </el-form-item>
          </el-col>
          <el-col :span="12.5">
            <el-form-item label="里程单价：" class="common-form-item">
              <el-input v-model="item.showUnitPrice" style="width: 120px" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')" @mousewheel.native.prevent minlength="5"> </el-input>元 /&nbsp;
              <el-input v-model="item.unitMileage" style="width: 120px"> </el-input>KM
              <el-button style="margin-left:10px" type="warning" plain v-if="index>0" @click.prevent="removeSMoneyRule(index,'return')" icon="el-icon-remove" class="btn"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" plain @click.prevent="addMoneyRule('return')" icon="el-icon-circle-plus" class="btn"></el-button>
      </el-form-item>
      <div class="title">单程</div>
      <el-form-item label="起步价" class="common-form-item" prop="showOneWayInitiatePrice">
        <el-input v-model="ticketInfo.showOneWayInitiatePrice" minlength="5" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"></el-input>元
      </el-form-item>
      <el-form-item label="免费里程：" class="common-form-item" prop="oneWayFreeMileage">
        <el-input v-model="ticketInfo.oneWayFreeMileage">
        </el-input>KM
      </el-form-item>
      <div v-for="(item ,index) in oneWayUnit">
        <el-row>
          <el-col :span="11.5">
            <el-form-item label="里程区间：" class="common-form-item">
              <el-input v-model="item.mileage" oninput="javascript:if(value){value=value.replace(/[^\d]/g,'')}"> </el-input>KM
            </el-form-item>
          </el-col>
          <el-col :span="12.5">
            <el-form-item label="里程单价：" class="common-form-item">
              <el-input v-model="item.showUnitPrice" style="width: 120px" minlength="5" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"> </el-input>元/
              <el-input v-model="item.unitMileage" style="width: 120px"> </el-input>KM
              <el-button style="margin-left:10px" type="warning" plain v-if="index>0" @click.prevent="removeSMoneyRule(index,'one')" icon="el-icon-remove" class="btn"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" plain @click.prevent="addMoneyRule('one')" icon="el-icon-circle-plus" class="btn"></el-button>
      </el-form-item>
      <div class="title">全天</div>
      <el-form-item label="起步价" class="common-form-item" prop="showAllDayInitiatePrice">
        <el-input v-model="ticketInfo.showAllDayInitiatePrice" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')" @mousewheel.native.prevent minlength="5"></el-input>元
      </el-form-item>
      <el-form-item label="免费时长：" class="common-form-item" prop="allDayFreeTime">
        <el-input v-model="ticketInfo.allDayFreeTime">
        </el-input>H
      </el-form-item>
      <div v-for="(item ,index) in allDayUnit">
        <el-row>
          <el-col :span="11.5">
            <el-form-item label="时长：" class="common-form-item">
              <el-input v-model="item.hour" oninput="javascript:this.value=this.value.replace(/[^\d]/g,'')"> </el-input>H
            </el-form-item>
          </el-col>
          <el-col :span="12.5">
            <el-form-item label="单价：" class="common-form-item">
              <el-input v-model="item.showUnitPrice" style="width: 120px" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')" @mousewheel.native.prevent minlength="5"> </el-input>元 /&nbsp;
              <el-input v-model="item.unitHour" style="width: 120px"> </el-input>H
              <el-button style="margin-left:10px" type="warning" plain v-if="index>0" @click.prevent="removeSMoneyRule(index,'all')" icon="el-icon-remove" class="btn"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" plain @click.prevent="addMoneyRule('all')" icon="el-icon-circle-plus" class="btn"></el-button>
      </el-form-item>
      <el-form-item label="服务费比例：" prop="serviceRate" class="common-form-item">
        <el-input v-model="ticketInfo.serviceRate">
        </el-input><span style="color:red;margin-left:10px"> 配置小数，最大值为1。例如：0.1 表示 10% 服务费</span>
      </el-form-item>
      <el-form-item label="状态：" prop="state">
        <el-radio v-model="ticketInfo.state" :label="'1'">启用</el-radio>
        <el-radio v-model="ticketInfo.state" :label="'0'">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" v-if="status!='0'" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '新建票价',
      imageInfo: {
        iconType: '2'
      },
      action: 0,
      labelWidth: '120px',
      parentList: [],
      cityList: [], // 城市列表
      one: 1,
      two: 1,
      three: 1,
      status: '',
      goBackUnit: [{
        'mileage': '',
        'unitPrice': '',
        'showUnitPrice': '',
        'unitMileage': ''
      }],
      oneWayUnit: [{
        'mileage': '',
        'unitPrice': '',
        'showUnitPrice': '',
        'unitMileage': ''
      }],
      allDayUnit: [{
        'hour': '',
        'showUnitPrice': '',
        'unitHour': ''
      }],
      ticketInfo: {
        id: '',
        ruleName: '',
        goBackInitiatePrice: '',
        showGoBackInitiatePrice: '',
        goBackFreeMileage: '',
        oneWayInitiatePrice: '',
        showOneWayInitiatePrice: '',
        oneWayFreeMileage: '',
        allDayInitiatePrice: '',
        showAllDayInitiatePrice: '',
        allDayFreeTime: '',
        serviceRate: '',
        state: '1'
      },
      showGoBackInitiatePrice: '',
      showOneWayInitiatePrice: '',
      showAllDayInitiatePrice: '',
      verificationRule: false
    }
  },
  mounted () {
    this.getOrgnizationInfo()
  },
  methods: {
    getOrgnizationInfo () {
      let ticketId = this.$route.query.id
      this.status = this.$route.query.status
      if (ticketId != undefined) {
        this.action = 1
        this.title = '修改机构信息'
        request.apiGet(api.ticket.Info, { ticketId: ticketId }).then(data => {
          if (data.msg.code && data.msg.code === enums.NET_SUCCESS) {
            let res = data.data.list[0]
            this.ticketInfo = res
            this.goBackUnit = JSON.parse(res.goBackUnit)
            this.oneWayUnit = JSON.parse(res.oneWayUnit)
            this.allDayUnit = JSON.parse(res.allDayUnit)
            this.one = this.goBackUnit.length
            this.two = this.oneWayUnit.length
            this.three = this.allDayUnit.length
            this.ticketInfo.state = String(this.ticketInfo.state)
            this.$set(this.ticketInfo, 'showGoBackInitiatePrice', res.goBackInitiatePrice)
            this.$set(this.ticketInfo, 'showOneWayInitiatePrice', res.oneWayInitiatePrice)
            this.$set(this.ticketInfo, 'showAllDayInitiatePrice', res.allDayInitiatePrice)
            if (this.ticketInfo.serviceRate === '1.00') {
              this.ticketInfo.serviceRate = '1'
            }
          } else {
            help.E(data.msg.message)
          }
        })
      }
    },
    save() {
      this.$refs['addOrgnization'].validate((valid) => {
        if (valid && this.valide()) {
          this.postData()
        } else {
          return false
        }
      })
    },
    valide(){
      for(let i = 0;i<this.goBackUnit.length;i++){
        let item = this.goBackUnit[i]
        if(item.mileage == '' || item.showUnitPrice == '' || item.unitMileage == '' || Number(item.showUnitPrice == 0) || Number(item.mileage == 0) || Number(item.unitMileage == 0) ){
          help.E('往返的里程区间和里程单价不能为空或0')
          return false
        } else {
          item.unitPrice = (Number(item.showUnitPrice).toFixed(2) * 100).toFixed(0).toString()
          item.mileage = String(parseInt(item.mileage + ''))
          return true
        }
      }
      for(let i = 0;i<this.oneWayUnit.length;i++){
        let item = this.oneWayUnit[i]
        if(item.mileage == '' || item.showUnitPrice == '' || item.unitMileage == '' || Number(item.showUnitPrice == 0) || Number(item.mileage == 0) || Number(item.unitMileage == 0)){
          help.E('单程的里程区间和里程单价不能为空或0')
          return false
        } else {
          item.unitPrice = (Number(item.showUnitPrice).toFixed(2) * 100).toFixed(0).toString()
          item.mileage = String(parseInt(item.mileage + ''))
          return true
        }
      }
      for(let i = 0;i<this.allDayUnit.length;i++){
        let item = this.allDayUnit[i]
        if(item.mileage == '' || item.showUnitPrice == '' || item.unitMileage == '' || Number(item.showUnitPrice == 0) || Number(item.mileage == 0) || Number(item.unitMileage == 0)){
          help.E('全天的里程区间和里程单价不能为空或0')
          return false;
        } else {
          item.unitPrice = (Number(item.showUnitPrice).toFixed(2) * 100).toFixed(0).toString()
          item.mileage = String(parseInt(item.mileage + ''))
          return true
        }
      }
    },
    postData() {
      let params = this.ticketInfo
      let url = ''
      if (parseInt(this.action) === 1) {
        url = api.ticket.update
      } else {
        url = api.ticket.add
      }
      params['goBackInitiatePrice'] = (Number(this.ticketInfo.showGoBackInitiatePrice).toFixed(2) * 100).toFixed(0).toString()
      params['oneWayInitiatePrice'] = (Number(this.ticketInfo.showOneWayInitiatePrice).toFixed(2) * 100).toFixed(0).toString()
      params['allDayInitiatePrice'] = (Number(this.ticketInfo.showAllDayInitiatePrice).toFixed(2) * 100).toFixed(0).toString()
      params['goBackUnit'] = JSON.stringify(this.goBackUnit)
      params['oneWayUnit'] = JSON.stringify(this.oneWayUnit)
      params['allDayUnit'] = JSON.stringify(this.allDayUnit)
      params['oneWayFreeMileage'] = Number(this.ticketInfo.oneWayFreeMileage).toFixed(2) + ''
      params['goBackFreeMileage'] = Number(this.ticketInfo.goBackFreeMileage).toFixed(2) + ''
      request.apiPost(url, params).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('ticketPriceFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg.message)
        }
      }).catch((data) => {
        help.E(data.msg.message)
      })
    },
    addMoneyRule(params) {
      if (params == 'return') {
        this.one++
        this.goBackUnit.push({
          'mileage': '',
          'unitPrice': '',
          'unitMileage': ''
        })
      } else if (params == 'one') {
        this.two++
        this.oneWayUnit.push({
          'mileage': '',
          'unitPrice': '',
          'unitMileage': ''
        })
      } else if (params == 'all') {
        this.three++
        this.allDayUnit.push({
          'hour': '',
          'unitPrice': '',
          'unitHour': ''
        })
      }
    },
    removeSMoneyRule(idx, params) {
      if (params == 'return') {
        if (this.one > 1) {
          this.one--
          this.goBackUnit.splice(idx, 1)
        } else {
          help.E('不能再删除了！')
        }
      } else if (params == 'one') {
        if (this.two > 1) {
          this.two--
          this.oneWayUnit.splice(idx, 1)
        } else {
          help.E('不能再删除了！')
        }
      } else if (params == 'all') {
        if (this.three > 1) {
          this.three--
          this.allDayUnit.splice(idx, 1)
        } else {
          help.E('不能再删除了！')
        }
      }
    },
    back() {
      sessionStorage.setItem('ticketPriceFlag', 'true')
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
.title {
  text-align: left;
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
}
</style>
