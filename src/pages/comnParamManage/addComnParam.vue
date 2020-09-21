<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data"
             label-width="100px"
             :model="comnParam"
             :rules="formRules"
             ref="addComnParam"
             label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="参数代码" prop="code" class="common-form-item">
        <el-input v-model="comnParam.code" minlength="5" :disabled="action == 1 "></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" class="common-form-item">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="comnParam.content"></el-input>
      </el-form-item>
      <el-form-item label="所属城市" prop="cityCode">
        <el-select v-model="comnParam.cityCode">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="businessType">
        <el-select v-model="comnParam.businessType">
          <el-option v-for="(item, index) in businessTypeList " :key="index" :label="item.businessName" :value="item.businessId"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="需求侧机构"-->
                    <!--prop="demandOrzId">-->
        <!--<el-select v-model="comnParam.demandOrzId">-->
          <!--<el-option v-for="(item, index) in compList "-->
                     <!--:key="index"-->
                     <!--:label="item.name"-->
                     <!--:value="item.tenantId"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!-- <el-form-item prop="state" label="状态">
        <el-radio v-model="comnParam.state" :label="'1'">启用</el-radio>
        <el-radio v-model="comnParam.state" :label="'0'">禁用</el-radio>
      </el-form-item> -->
      <el-form-item prop="description" class="common-form-item" label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model="comnParam.description"></el-input>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addComnParamFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

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
  data () {
    return {
      title: '添加公共参数',
      imageInfo: {
        iconType: '2'
      },
      action: 0,
      labelWidth: '120px',
      comnParam: {
        'code': '',
        'content': '',
        // 'state': '1',
        'description': '',
        demandOrzId: '',
        businessType: '1'
      },
      verificationRule: false,
      businessTypeList: enums.BUSINESSTYPE2,
      formRules: addComnParamFormRules,
      cityList: [],
      compList: [],
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', [])
    this.getComnInfo()
    this.getAllList()
  },
  methods: {
    getAllList () {
      request.apiGet(api.city.option).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    getComnInfo () {
      if (this.uid) {
        this.title = '修改参数信息'
        request.apiGet(api.comnParam.info, {commonParamterId: this.uid}).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            this.comnParam = data.data
            this.comnParam.businessType = data.data.businessType.toString();
          }
        })
      }
    },
    save () {
      this.$refs['addComnParam'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      request.apiPost(this.uid ? api.comnParam.update : api.comnParam.add, this.comnParam).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('comnParamFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
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
