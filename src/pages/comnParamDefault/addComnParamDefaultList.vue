<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="comnParam" ref="addComnParam" label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <!--<el-form-item label="业务类型" prop="businessType" class="common-form-item">-->
        <!--<el-select v-model="comnParam.businessType" filterable @change="getComnInfo">-->
          <!--<el-option key="0" label="不限制" value="0"></el-option>-->
          <!--<el-option key="orderReportForms" label="定制公交" value="orderReportForms"></el-option>-->
          <!--<el-option key="travelReportForms" label="出行专线" value="travelReportForms"></el-option>-->
          <!--<el-option key="payReportForms" label="网约拼车" value="payReportForms"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="参数代码" class="common-form-item" prop="paramList">
        <el-button type="primary" plain @click="add" icon="el-icon-circle-plus" class="btn"></el-button>
        <div v-for="(item,index) in comnParam.paramList" :key="index" class="input-class">
          <el-input minlength="5" v-model="comnParam.paramList[index]" maxlength="120"></el-input>
          <el-button style="margin-left:10px" type="warning" plain v-if="index>0" @click.prevent="remove(index)" icon="el-icon-remove"></el-button>
        </div>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
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
      title: '添加公共参数',
      // imageInfo: {
      //   iconType: 'travelReportForms'
      // },
      action: 0,
      labelWidth: '120px',
      comnParam: {
        // 'businessType': '0',
        paramList: []
      }
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.init()
  },
  methods: {
    init() {
      this.getComnInfo()
    },
    getAllCityList() {
      request.apiGet(api.city.option).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          this.cityList = data.data.list
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    getComnInfo() {
      // let businessType = this.comnParam.businessType
      request.apiGet(api.parameterCity.optionList, {}).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          let res = data.data.list
          this.$set(this.comnParam, 'paramList', res)
        }
      })
    },
    add() {
      this.comnParam.paramList.push('')
    },
    remove(index) {
      this.comnParam.paramList.splice(index, 1)
    },
    save() {
      console.log(this.comnParam)
      this.$refs['addComnParam'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData() {
      let params = {
        // businessType: this.comnParam.businessType,
        codeList: this.comnParam.paramList
      }
      let url = api.parameterCity.create
      request.apiPost(url, params).then((data) => {
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
.input-class {
  display: inherit;
}
</style>
