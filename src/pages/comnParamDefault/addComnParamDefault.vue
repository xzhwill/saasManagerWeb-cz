<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="comnParam" :rules="formRules" ref="addComnParam" label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <!--<el-form-item label="业务类型" prop="channelId" class="common-form-item">-->
        <!--<el-select v-model="comnParam.businessType" filterable :disabled="action == orderReportForms ">-->
          <!--<el-option key="0" label="不限制" value="0"></el-option>-->
          <!--<el-option key="orderReportForms" label="定制公交" value="orderReportForms"></el-option>-->
          <!--<el-option key="travelReportForms" label="出行专线" value="travelReportForms"></el-option>-->
          <!--<el-option key="payReportForms" label="网约拼车" value="payReportForms"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="参数代码" prop="code" class="common-form-item">
        <el-input v-model="comnParam.code" minlength="5" :disabled="action == 1 "></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="defaultValue" class="common-form-item">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="comnParam.defaultValue" placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="description" class="common-form-item" label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="comnParam.description" placeholder=""></el-input>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addComnParamFormRules } from '@/utils/rules.js'
import help from '@/utils/helper.js'
import request from '@/utils/request.js'
import api from '@/utils/api.js'
import enums from '@/utils/enums.js'
export default {
  data() {
    return {
      title: '修改公共参数',
      imageInfo: {
        iconType: '2'
      },
      action: 1,
      labelWidth: '120px',
      comnParam: {
        'code': '',
        'defaultValue': '',
        'state': 1,
        'description': '',
        // 'businessType': '0'
      },
      verificationRule: false,
      formRules: addComnParamFormRules,
      cityList: [],
    }
  },
  mounted() {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.init()
  },
  methods: {
    init() {
      this.getComnInfo()
    },
    getComnInfo() {
      let id = this.$route.query.id
      this.action = 1
      this.title = '修改参数信息'
      request.apiGet(api.parameterCity.info, {
        id: id
      }).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          this.comnParam = data.data
        }
      })
    },
    save() {
      this.$refs['addComnParam'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData() {
      let params = this.comnParam
      console.log(params)
      let url = ''
      url = api.parameterCity.update
      request.apiPost(url, params).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('comnParamFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back() {
      sessionStorage.setItem('comnParamFlag', 'true')
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
