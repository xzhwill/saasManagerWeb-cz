<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="120px" :model="ticketInfo" ref="addOrgnization"
             label-position="right">
      <div class="form-section" style="margin-bottom: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="城市" prop="cityCode" class="common-form-item">
        <el-select v-model="ticketInfo.cityCode" filterable>
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" class="common-form-item" prop="ticketName">
        <el-input v-model="ticketInfo.ticketName" pleaceholder="请输入名称"></el-input>
      </el-form-item>
      <div style="display: none;">
        <div class="title">往返</div>
        <el-form-item label="起步价" class="common-form-item" prop="showGoBackInitiatePrice">
          <el-input v-model="ticketInfo.showGoBackInitiatePrice" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                    onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"
                    @mousewheel.native.prevent minlength="5"></el-input>元
        </el-form-item>
        <el-form-item label="免费里程：" class="common-form-item" prop="roundFreeInterval">
          <el-input v-model="ticketInfo.roundFreeInterval">
          </el-input>KM
        </el-form-item>
        <div v-for="(item ,index) in goBackUnit">
          <el-row>
            <el-col :span="11.5">
              <el-form-item label="里程区间：" class="common-form-item">
                <el-input v-model="item.mileage" oninput="javascript:this.value = this.value.replace(/[^0-9]/g, '');">
                </el-input>KM
              </el-form-item>
            </el-col>
            <el-col :span="12.5">
              <el-form-item label="里程单价：" class="common-form-item">
                <el-input v-model="item.showUnitPrice" style="width: 120px" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                          onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"
                          @mousewheel.native.prevent minlength="5"> </el-input>元 /&nbsp;
                <el-input v-model="item.unitMileage" style="width: 120px"> </el-input>KM
                <el-button style="margin-left:10px" type="warning" plain v-if="index>0" @click.prevent="removeSMoneyRule(index,'return')"
                           icon="el-icon-remove"></el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item>
          <el-button type="primary" plain @click.prevent="addMoneyRule('return')" icon="el-icon-circle-plus"></el-button>
        </el-form-item>
      </div>
      <div class="title">单程</div>
      <el-form-item label="起步价" class="common-form-item" prop="showOneWayInitiatePrice">
        <el-input v-model="ticketInfo.showOneWayInitiatePrice" minlength="5" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                  onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"></el-input>元
      </el-form-item>
      <el-form-item label="免费里程：" class="common-form-item" prop="singleFreeInterval">
        <el-input v-model="ticketInfo.singleFreeInterval">
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
              <el-input v-model="item.showUnitPrice" style="width: 120px" minlength="5" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                        onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"> </el-input>元/
              <el-input v-model="item.unitMileage" style="width: 120px"> </el-input>KM
              <el-button style="margin-left:10px" type="warning" plain v-if="index>0" @click.prevent="removeSMoneyRule(index,'one')"
                         icon="el-icon-remove"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" plain @click.prevent="addMoneyRule('one')" icon="el-icon-circle-plus"></el-button>
      </el-form-item>
      <div class="title">全天</div>
      <el-form-item label="起步价" class="common-form-item" prop="showAllDayInitiatePrice" style="display: none;">
        <el-input v-model="ticketInfo.showAllDayInitiatePrice" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                  onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"
                  @mousewheel.native.prevent minlength="5"></el-input>元
      </el-form-item>
      <el-form-item label="免费时长：" class="common-form-item" prop="allDayFreeInterval" style="display: none;">
        <el-input v-model="ticketInfo.allDayFreeInterval">
        </el-input>H
      </el-form-item>
      <div v-for="(item ,index) in allDayUnit">
        <el-row>
          <el-col :span="11.5" v-if="index==0" style="display: none;">
            <el-form-item label="时长：" class="common-form-item">
              <el-input v-model="item.hour" oninput="javascript:this.value=this.value.replace(/[^\d]/g,'')"> </el-input>H
            </el-form-item>
          </el-col>
          <el-col :span="12.5">
            <el-form-item :label="'套餐'+(parseInt(index)+1)+'：'" class="common-form-item">
              <el-input
                v-model="item.showUnitPrice"
                style="width: 120px"
                type="number"
                oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"
                @mousewheel.native.prevent minlength="5"
              ></el-input>元 &nbsp;
              <el-input v-model="item.unitHour" style="width: 120px" disabled></el-input>公里
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!--<el-form-item>-->
        <!--<el-button type="primary" plain @click.prevent="addMoneyRule('all')" icon="el-icon-circle-plus" class="btn"></el-button>-->
      <!--</el-form-item>-->
      <div style="display: none;">
        <div class="title">半天</div>
        <el-form-item label="起步价" class="common-form-item" prop="showHalfDayInitiatePrice">
          <el-input v-model="ticketInfo.showHalfDayInitiatePrice" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                    onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"
                    @mousewheel.native.prevent minlength="5"></el-input>元
        </el-form-item>
        <el-form-item label="免费时长：" class="common-form-item" prop="allDayFreeInterval">
          <el-input v-model="ticketInfo.halfDayFreeInterval">
          </el-input>H
        </el-form-item>
        <div v-for="(item ,index) in halfDayUnit">
          <el-row>
            <el-col :span="11.5">
              <el-form-item label="时长：" class="common-form-item">
                <el-input v-model="item.hour" oninput="javascript:this.value=this.value.replace(/[^\d]/g,'')"> </el-input>H
              </el-form-item>
            </el-col>
            <el-col :span="12.5">
              <el-form-item label="单价：" class="common-form-item">
                <el-input v-model="item.showUnitPrice" style="width: 120px" type="number" oninput="if(value.length>15)value=value.slice(0,15);value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3))"
                          onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"
                          @mousewheel.native.prevent minlength="5"> </el-input>元 /&nbsp;
                <el-input v-model="item.unitHour" style="width: 120px"> </el-input>H
                <el-button style="margin-left:10px" type="warning" plain v-if="index>0" @click.prevent="removeSMoneyRule(index,'all')"
                           icon="el-icon-remove"></el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- <el-form-item>
        <el-button type="primary" plain @click.prevent="addMoneyRule('all')" icon="el-icon-circle-plus" class="btn"></el-button>
      </el-form-item> -->
      <!-- <el-form-item label="服务费比例：" prop="serviceRate" class="common-form-item">
        <el-input v-model="ticketInfo.serviceRate">
        </el-input><span style="color:red;margin-left:10px"> 配置小数，最大值为1。例如：0.orderReportForms 表示 10% 服务费</span>
      </el-form-item> -->
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
      goBackUnit: [{ // 往返的套餐
        'mileage': '',
        'unitPrice': '',
        'showUnitPrice': '',
        'unitMileage': ''
      }],
      oneWayUnit: [{ // 单程的套餐
        'mileage': '',
        'unitPrice': '',
        'showUnitPrice': '',
        'unitMileage': ''
      }],
      halfDayUnit: [{ // 半天的套餐
        'mileage': '',
        'unitPrice': '',
        'showUnitPrice': '',
        'unitMileage': ''
      }],
      allDayUnit: [ // 全天的套餐
        {
          hour: 0,
          unitPrice: '',
          showUnitPrice: '',
          unitHour: '100'
        }, {
          hour: 0,
          unitPrice: '',
          showUnitPrice: '',
          unitHour: '200'
        }
      ],
      ticketInfo: {
        // showGoBackInitiatePrice: '', // 往返起步价
        // roundFreeInterval: '', // 往返里程
        showOneWayInitiatePrice: '', // 单程的起步价
        singleFreeInterval: '', // 单程的免费里程
        // showAllDayInitiatePrice: '', 全天的起步价
        // allDayFreeInterval: '', // 免费时长
        state: '1',
        // halfDayStartPriceYuan: '', // 半天的价格
        // halfDayFreeInterval: '', // 半天的免费时长
        cityCode: ''
      },
      // showGoBackInitiatePrice: '',
      showOneWayInitiatePrice: '',
      // showAllDayInitiatePrice: '',
      // showHalfDayInitiatePrice: '',
      verificationRule: false
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getInfo()
    this.getCity()
  },
  methods: {
    getCity () {
      request.apiGet(api.city.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    getInfo () {
      let groupId = this.$route.query.id
      this.status = this.$route.query.status
      if (groupId != undefined) {
        this.action = 1
        this.title = '修改票价'
        request.apiGet(api.charteredTicket.Info, {
          ticketId: groupId
        }).then(data => {
          if (data.code && data.code === enums.NET_SUCCESS) {
            let res = data.data
            var ticketInfo = { ...res
            }
            // var goBackUnit = [...res.roundStagedTicketList]
            var oneWayUnit = [...res.singleStagedTicketList]
            var allDayUnit = [...res.allDayStagedTicketList] // 全天的套餐
            // var halfDayUnit = [...res.halfDayStagedTicketList]
            // for (let i = 0; i < goBackUnit.length; i++) {
            //   let item = goBackUnit[i]
            //   item.showUnitPrice = (Number(parseFloat(item.price) / 100)).toFixed(2)
            //   item.mileage = item.ruleInterval
            //   item.unitMileage = item.border
            // }
            for (let i = 0; i < oneWayUnit.length; i++) {
              let item = oneWayUnit[i]
              item.showUnitPrice = (Number(parseFloat(item.price) / 100)).toFixed(2)
              item.mileage = item.ruleInterval
              item.unitMileage = item.border
            }

            for (let i = 0; i < 2; i++) {
              let item = allDayUnit[i]
              if (item != undefined) {
                item.showUnitPrice = (Number(parseFloat(item.price) / 100)).toFixed(2)
                item.hour = item.ruleInterval
                item.unitHour = item.border
              } else {
                if (i == 0) {
                  allDayUnit.push({
                    hour: '',
                    unitPrice: '',
                    showUnitPrice: '',
                    unitHour: '100'
                  })
                } else {
                  allDayUnit.push({
                    hour: '',
                    unitPrice: '',
                    showUnitPrice: '',
                    unitHour: '200'
                  })
                }
              }
            }
            // for (let i = 0; i < halfDayUnit.length; i++) {
            //   let item = halfDayUnit[i]
            //   item.showUnitPrice = (Number(parseFloat(item.price) / 100)).toFixed(2)
            //   item.hour = item.ruleInterval
            //   item.unitHour = item.border
            // }

            // this.one = goBackUnit.length
            this.two = oneWayUnit.length
            this.three = allDayUnit.length
            ticketInfo.state = String(ticketInfo.state)
            // this.$set(ticketInfo, 'showHalfDayInitiatePrice', res.halfDayStartPriceYuan)
            // this.$set(ticketInfo, 'showGoBackInitiatePrice', res.roundStartPriceYuan)
            this.$set(ticketInfo, 'showOneWayInitiatePrice', res.singleStartPriceYuan)
            // this.$set(ticketInfo, 'showAllDayInitiatePrice', res.allDayStartPriceYuan)
            // this.goBackUnit = goBackUnit
            this.oneWayUnit = oneWayUnit
            this.allDayUnit = allDayUnit
            // this.halfDayUnit = halfDayUnit
            this.ticketInfo = ticketInfo
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    save () {
      this.$refs['addOrgnization'].validate((valid) => {
        if (valid && this.valide()) {
          this.postData()
        } else {
          return false
        }
      })
    },
    valide () {
      // for (let i = 0; i < this.goBackUnit.length; i++) {
      //   let item = this.goBackUnit[i]
      //   if (item.mileage == '' || item.showUnitPrice == '' || item.unitMileage == '' || Number(item.showUnitPrice == 0) ||
      //     Number(item.mileage == 0) || Number(item.unitMileage == 0)) {
      //     help.E('往返的里程区间和里程单价不能为空或0')
      //     return false
      //   } else {
      //     item.price = (Number(item.showUnitPrice).toFixed(2) * 100).toFixed(0).toString()
      //     item.ruleInterval = String(parseInt(item.mileage + ''))
      //     item.border = String(parseInt(item.unitMileage + ''))
      //   }
      // }
      for (let i = 0; i < this.oneWayUnit.length; i++) {
        let item = this.oneWayUnit[i]
        if (item.mileage == '' || item.showUnitPrice == '' || item.unitMileage == '' || Number(item.showUnitPrice == 0) ||
          Number(item.mileage == 0) || Number(item.unitMileage == 0)) {
          help.E('单程的里程区间和里程单价不能为空或0')
          return false
        } else {
          item.price = (Number(item.showUnitPrice).toFixed(2) * 100).toFixed(0).toString()
          item.ruleInterval = String(parseInt(item.mileage + ''))
          item.border = String(parseInt(item.unitMileage + ''))
        }
      }
      for (let i = 0; i < this.allDayUnit.length; i++) {
        let item = this.allDayUnit[i]
        if (!item.showUnitPrice || (+item.showUnitPrice <= 0)) {
          help.E('全天的套餐价格不能为空或0')
          return false
        } else {
          item.price = (Number(item.showUnitPrice).toFixed(2) * 100).toFixed(0).toString()
          // item.ruleInterval = String(parseInt(this.allDayUnit[0].hour + ''))
          item.ruleInterval = ''
          item.border = String(parseInt(item.unitHour + ''))
        }
      }
      // for (let i = 0; i < this.halfDayUnit.length; i++) {
      //   let item = this.halfDayUnit[i]
      //   if (item.hour == '' || item.showUnitPrice == '' || item.unitHour == '' || Number(item.showUnitPrice == 0) ||
      //     Number(item.hour == 0) || Number(item.unitHour == 0)) {
      //     help.E('半天的里程区间和里程单价不能为空或0')
      //     return false;
      //   } else {
      //     item.price = (Number(item.showUnitPrice).toFixed(2) * 100).toFixed(0).toString()
      //     item.ruleInterval = String(parseInt(item.hour + ''))
      //     item.border = String(parseInt(item.unitHour + ''))
      //   }
      // }
      return true
    },
    postData () {
      let params = this.ticketInfo
      let url = ''
      if (parseInt(this.action) === 1) {
        url = api.charteredTicket.update
      } else {
        url = api.charteredTicket.add
      }
      // params.roundStartPrice = (Number(this.ticketInfo.showGoBackInitiatePrice).toFixed(2) * 100).toFixed(0).toString()
      params.singleStartPrice = (Number(this.ticketInfo.showOneWayInitiatePrice).toFixed(2) * 100).toFixed(0).toString()
      // params['allDayStartPrice'] = (Number(this.ticketInfo.showAllDayInitiatePrice).toFixed(2) * 100).toFixed(0).toString()
      // params.halfDayStartPrice = (Number(this.ticketInfo.showHalfDayInitiatePrice).toFixed(2) * 100).toFixed(0).toString()
      // params.roundStagedTicketList = this.goBackUnit
      params.singleStagedTicketList = this.oneWayUnit
      params.allDayStagedTicketList = this.allDayUnit
      // params.halfDayStagedTicketList = this.halfDayUnit

      // params.allDayFreeInterval = Number(this.ticketInfo.allDayFreeInterval).toFixed(2)
      // params.halfDayFreeInterval = Number(this.ticketInfo.halfDayFreeInterval).toFixed(2)
      params.singleFreeInterval = Number(this.ticketInfo.singleFreeInterval).toFixed(2)
      // params.roundFreeInterval = Number(this.ticketInfo.roundFreeInterval).toFixed(2)
      params.cityCode = this.ticketInfo.cityCode

      request.apiPost(url, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('ticketPriceFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch((data) => {
        help.E(data.msg)
      })
    },
    addMoneyRule (params) {
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
          hour: '',
          unitPrice: '',
          unitHour: ''
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
    back () {
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
