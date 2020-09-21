<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="demandCompany" :rules="formRules"
      ref="addOrgnization" label-position="right">
      <div class="form-section" style="margin-bottom: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="所属城市" prop="cityCode" class="common-form-item">
        <el-select v-model="demandCompany.cityCode" @change="getOrzList">
          <el-option v-for="item in cityList" :label="item.cityName" :key="item.cityCode" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业" prop="demandId" class="common-form-item">
        <el-select v-model="demandCompany.demandId" @change="setDemandName">
          <el-option v-for="item in orzList" :label="item.orzName" :key="item.orzId" :value="item.orzId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业简称" prop="shortName" class="common-form-item">
        <el-input v-model="demandCompany.shortName"></el-input>
      </el-form-item>
      <el-form-item label="企业英文简称" prop="shortNameEng" class="common-form-item">
        <el-input v-model="demandCompany.shortNameEng"></el-input>
      </el-form-item>
      <el-form-item label="企业规模" prop="scale" class="common-form-item">
        <el-input v-model="demandCompany.scale"></el-input>
      </el-form-item>
      <el-form-item label="企业地址" prop="demandAddr" class="common-form-item">
        <el-input v-model="demandCompany.demandAddr"></el-input>
      </el-form-item>
      <el-form-item label="行业" prop="industry" class="common-form-item">
        <el-input v-model="demandCompany.industry"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactName" class="common-form-item">
        <el-input v-model="demandCompany.contactName"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactPhone" class="common-form-item">
        <el-input v-model="demandCompany.contactPhone"></el-input>
      </el-form-item>
      <el-form-item label="联系人邮箱" prop="contactMail" class="common-form-item">
        <el-input v-model="demandCompany.contactMail"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio v-model="demandCompany.status" :label="1">启用</el-radio>
        <el-radio v-model="demandCompany.status" :label="0">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addDemandCompanyFormRules } from '@/utils/rules.js'
import help from '@/utils/helper.js'
import request from '@/utils/request.js'
import api from '@/utils/api.js'
import enums from '@/utils/enums.js'
export default {
  data() {
    return {
      title: '添加机构',
      imageInfo: {
        iconType: '2'
      },
      action: 0,
      labelWidth: '120px',
      orzList: [],
      cityList: [], // 城市列表
      demandCompany: {
        'demandId': '',
        'demandName': '',
        'cityCode': '',
        'status': 0
      },
      verificationRule: false,
      formRules: addDemandCompanyFormRules
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
      this.getCityList()
      this.getOrgnizationInfo()
    },
    setDemandName(value){
      console.log(value)
    },
    getOrzList() {
      request.apiGet(api.orgnization.option,{cityCode:this.demandCompany.cityCode,orzType:2 }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orzList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getCityList(){
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    getOrgnizationInfo() {
      let demandId = this.$route.query.id
      if (demandId != undefined) {
        this.action = 1
        this.title = '修改机构信息'
        request.apiGet(api.demandCompany.info, { demandId: demandId}).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.demandCompany = res
            this.getOrzList()
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    save() {
      this.$refs['addOrgnization'].validate((valid) => {
        if (valid) {
            this.postData()
        } else {
          return false
        }
      })
    },
    postData() {
      let params = this.demandCompany
      let url = ''
      if (parseInt(this.action) === 1) {
        delete params['createDate']
        delete params['lastModdate']
        delete params['activeDate']
        url = api.demandCompany.update
      } else {
        params['creater'] = JSON.parse(sessionStorage.getItem('login')).userName
        params['lastModer'] = JSON.parse(sessionStorage.getItem('login')).userName
        url = api.demandCompany.create
      }
      request.apiPost(url, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('demandCompanyFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back() {
      sessionStorage.setItem('demandCompanyFlag', 'true')
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
