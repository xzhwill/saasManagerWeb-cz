<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="120px" ref="cityForm" :model="cityForm" :rules="formTableRules">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="渠道" prop="channelId">
        <el-select v-model="cityForm.channelId">
          <el-option v-for="(item, index) in channelList " :key="index" :label="item.channelName"
            :value="item.channelId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市" prop="cityCode">
        <el-select v-model="cityForm.cityCode" @change="changeCity">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="需求侧机构" prop="demandId">
        <el-select v-model="cityForm.demandId" @change="changeDemand">
          <el-option v-for="(item, index) in demandList " :key="index" :label="item.orzName" :value="item.orzId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessTypeList">
        <el-checkbox-group v-model="businessTypeList" @change="changeBusinessType">
          <el-checkbox v-for="item in businessList" :label="item.businessTypeId" :key="item.businessTypeId" style="margin-bottom: 10px;">
            <el-input
              @mousewheel.prevent
              maxlength=1
              :disabled="businessTypeList.indexOf(item.businessTypeId) === -1"
              v-model="item.valueNumber"
              style="width: 60px;padding: 0;text-align: center;"></el-input>
            <div style="display: inline-block;padding-left: 20px">{{ item.businessTypeName }}</div>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="cityForm.state" :label="parseInt(1)">启用</el-radio>
        <el-radio v-model="cityForm.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-form-item prop="defaultCity" label="是否为默认城市">
        <el-radio v-model="cityForm.defaultCity" :label="parseInt(1)">是</el-radio>
        <el-radio v-model="cityForm.defaultCity" :label="parseInt(0)">否</el-radio>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { cityChannelRule } from '@/utils/rules'
import request from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      clearTime: false,
      title: '添加城市渠道配置',
      action: 0,
      className: '',
      labelWidth: '120px',
      cityForm: {
        channelId: '',
        cityCode: '',
        state: 0,
        defaultCity: 1,
        showBusinessTypeList: [],
        businessTypeList: '',
        demandId: ''
      },
      oldChannelId: '',
      businessList: [],
      businessListAll: [{ // 业务类型
        businessTypeName: '定制公交',
        businessTypeId: '1',
        valueNumber: ''
      }, {
        businessTypeName: '预约包车',
        businessTypeId: '4',
        valueNumber: ''
      }],
      businessListCompany: [{ // 业务类型
        businessTypeName: '定制公交',
        businessTypeId: '1',
        valueNumber: ''
      }, {
        businessTypeName: '预约包车',
        businessTypeId: '4',
        valueNumber: ''
      }
      // {
      //   businessTypeName: '企业班车',
      //   businessTypeId: '5',
      //   valueNumber: ''
      // }, {
      //   businessTypeName: '企业包车',
      //   businessTypeId: '6',
      //   valueNumber: ''
      // }
      ],
      chooseBusinessTypeList: [],
      channelList: [], //  渠道列表
      cityList: [], //  城市列表
      businessTypeList: [0], //  业务列表
      demandList: [],
      formTableRules: cityChannelRule
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getChannelList() //  获取渠道列表
    this.businessList = this.businessListAll
    this.getChannelList()
    this.getCityList()
    this.getInfo()
  },
  methods: {
    getChannelList () { //  获取渠道列表
      request.apiGet(api.channel.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    changeCity (val) { //  获取需求侧机构列表
      request.apiGet(api.orgnization.option, { orzType: 2, cityCode: val }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.demandList = data.data
          this.demandList.unshift({ orzId: '', orzName: '无' })
        } else {
          help.E(data.msg)
        }
      })
    },
    getCityList () { //  修改渠道，重新获取可绑定城市
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    changeDemand (val) {
      if (val != '') {
        this.businessList = this.businessListCompany
      } else {
        this.businessList = this.businessListAll
      }
    },
    changeBusinessType (val) {
      this.cityForm.showBusinessTypeList = val
      this.cityForm.showBusinessTypeList.push(0)
      this.businessList.forEach(item => {
        if (val.indexOf(item.businessTypeId) > -1) { } else {
          item.valueNumber = ''
        }
      })
    },
    getInfo () { //  获取城市渠道绑定Info
      let id = this.$route.query.id
      if (id != undefined) {
        this.action = 1
        this.title = '修改城市渠道配置'
        let that = this
        request.apiGet(api.city.cityChannelInfo, { id: id }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            that.cityForm = data.data
            that.changeCity(that.cityForm.cityCode)
            that.oldChannelId = data.data.channelId
            if (that.cityForm.demandId != null && that.cityForm.demandId != '') {
              that.businessList = that.businessListCompany
            } else {
              that.businessList = that.businessListAll
            }
            that.businessTypeList = data.data.businessTypeList.split(',')
            that.businessList.forEach(item => {
              if (that.businessTypeList.indexOf(item.businessTypeId) > -1) {
                item.valueNumber = that.businessTypeList.indexOf(item.businessTypeId) + 1
              }
            })
            that.cityForm.showBusinessTypeList = that.businessTypeList
            that.cityForm.businessTypeList = data.data.businessTypeList
          }
        })
      }
    },
    save() {
      var reg = /^[0-9]$/
      for (let i = 0; i < this.businessList.length; i++) {
        let item = this.businessList[i]
        if (item.valueNumber == '' && this.cityForm.showBusinessTypeList.indexOf(item.businessTypeId) > -1) {
          help.E('请输入数字')
          return
        } else if (this.cityForm.showBusinessTypeList.indexOf(item.businessTypeId) > -1) {
          if (reg.test(item.valueNumber)) { } else {
            help.E('请输入数字')
            return
          }
        }
      }
      this.$refs["cityForm"].validate(valid => {
        if (valid) {
          this.postCityData()
        } else {
          return false;
        }
      })
    },
    postCityData() {
      let params = {}
      let url = ''
      params = this.cityForm
      if (parseInt(this.action) == 1) {
        url = api.city.cityChannelUpdated
        delete params['addTime']
      } else {
        url = api.city.cityChannelCreate
      }
      for (let i = 0; i < params.showBusinessTypeList.length; i++) {
        if (params.showBusinessTypeList[i] == 0) {
          params.showBusinessTypeList.splice(i, 1)
          i--;
        }
      }
      let businessList = []
      businessList = this.bubble(this.businessList)
      // console.log(businessList)
      params['businessTypeList'] = businessList.join(',')
      request.apiPost(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('cityChannelFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    bubble(arr) {
      var newArr = []
      var businessList = []
      businessList = arr.sort((a, b) => {
        if (a.valueNumber == '') {
          return (b.valueNumber) - (a.valueNumber)
        } else if (b.valueNumber == '') {
          return (b.valueNumber) - (a.valueNumber)
        } else {
          return (a.valueNumber) - (b.valueNumber)
        }
      })
      businessList.forEach(item => {
        if (item.valueNumber != '') {
          newArr.push(item.businessTypeId)
        }
      })
      return newArr;
    },
    back() {
      sessionStorage.setItem('cityChannelFlag', 'true')
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
