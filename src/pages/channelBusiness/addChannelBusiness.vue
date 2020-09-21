<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="120px"
             ref="formData"
             :model="formData"
             :rules="formTableRules">
      <div class="form-section"
           style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="渠道"
                    prop="channelId">
        <el-select v-model="formData.channelId">
          <el-option v-for="(item, index) in channelList "
                     :key="index"
                     :label="item.channelName"
                     :value="item.channelId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市"
                    prop="cityCode">
        <el-select v-model="formData.cityCode">
          <el-option v-for="(item, index) in cityList "
                     :key="index"
                     :label="item.cityName"
                     :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="需求侧机构"
                    prop="demandOrzId">
        <el-select v-model="formData.demandOrzId">
          <el-option v-for="(item, index) in compList "
                     :key="index"
                     :label="item.name"
                     :value="item.tenantId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型"
                    prop="businessTypeList">
        <el-checkbox-group v-model="businessTypeList"
                           @change="changeChannel">
          <el-checkbox v-for="item in businessList"
                       :label="item.id"
                       :key="item.id">{{item.name}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="defaultCity"
                    label="是否默认城市">
        <el-radio v-model="formData.defaultCity"
                  :label="'1'">是</el-radio>
        <el-radio v-model="formData.defaultCity"
                  :label="'0'">否</el-radio>
      </el-form-item>
      <el-form-item prop="state"
                    label="状态">
        <el-radio v-model="formData.state"
                  :label="'1'">启用</el-radio>
        <el-radio v-model="formData.state"
                  :label="'0'">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary"
                   @click="save">保存</el-button>
        <el-button type="info"
                   @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { channelBusinessRule } from '@/utils/rules.js'
import request from "@/utils/request.js";
import api from "@/utils/api.js";
import help from "@/utils/helper.js";
import enums from "@/utils/enums.js";
import { toTrim, Trim } from "@/utils/public.js";
export default {
  props: {
    searchData: {
      type: Array,
      required: true
    },
    tableHeaderCheckList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      updateFlag: true,
      clearTime: false,
      title: "添加渠道需求侧配置",
      action: 0,
      className: "",
      labelWidth: "120px",
      formData: {
        channelId: '',
        cityCode: '',
        demandOrzId: '',
        defaultCity: '0',
        state: '1'
      },
      businessList: [{ name: '企业班车', id: '1', }, { name: '企业包车', id: '2', }],
      businessTypeArr: [],
      channelList: [], //  渠道列表
      cityList: [], //  城市列表
      businessTypeList: [0], //  业务列表
      compList: [],
      formTableRules: channelBusinessRule,
    }
  },
  mounted() {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', [])
    this.init()
  },
  methods: {
    init() {
      this.getAllList()
      this.getInfo()
    },
    getAllList() {
      request.apiGet(api.city.option).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          this.cityList = data.data.list
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
      request.apiGet(api.channel.option).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          this.channelList = data.data.list
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
      request.apiGet(api.comnParam.compList).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          this.compList = data.data.list
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    getInfo() {
      let id = this.$route.query.id;
      if (id != undefined) {
        this.updateFlag = false
        this.action = 1
        this.title = '修改渠道需求侧配置'
        request.apiGet(api.channelBusiness.info, { id: id }).then(data => {
          if (data.msg && data.msg.code === enums.NET_SUCCESS) {
            this.formData = data.data.list[0]
            this.businessTypeList = this.formData.businessType.split(',')
          }
        })
      }
    },
    changeChannel(val) {
      this.businessTypeArr = val
      this.businessTypeArr.push(0)
      let set = new Set(this.businessTypeArr)
      this.businessTypeArr = Array.from(set)
      if (this.businessTypeArr.length === 1) {
        this.businessTypeArr = []
      }
      console.log(this.businessTypeArr)
    },
    save() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.postData()
        } else {
          return false;
        }
      });
    },
    postData() {
      let params = {}
      let url = ''
      params = this.formData

      if (parseInt(this.action) == 1) {
        url = api.channelBusiness.update
        delete params['addTime']
      } else {
        url = api.channelBusiness.create
      }
      params['businessType'] = this.businessTypeArr.filter(item => item != 0)
      params['businessType'] = params['businessType'].join(',')
      console.log(params)
      request.apiPost(url, params).then(data => {
        if (data.msg.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back() {
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
