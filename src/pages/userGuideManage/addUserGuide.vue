<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data"
             label-width="100px"
             :model="userGuide"
             :rules="formRules"
             ref="addUserGuide"
             label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="问题"
                    prop="question"
                    class="common-form-item">
        <el-input v-model="userGuide.question"
                  minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="答案"
                    prop="answer"
                    class="common-form-item">
        <el-input v-model="userGuide.answer"></el-input>
      </el-form-item>
      <el-form-item label="顺序"
                    prop="seq"
                    class="common-form-item">
        <el-input v-model="userGuide.seq"
                  type="number"
                  maxlength="5">></el-input>
      </el-form-item>

      <el-form-item label="所属城市"
                    prop="cityCode">
        <el-select v-model="userGuide.cityCode" @change="changeCity">
          <el-option v-for="item in cityListArr"
                     :label="item.cityName"
                     :key="item.cityCode"
                     :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属渠道"
                    prop="channelId">
        <el-select v-model="userGuide.channelId">
          <el-option v-for="(item, index) in channelListArr "
                     :key="index"
                     :label="item.channelName"
                     :value="item.channelId"></el-option>
        </el-select>
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
import { addUserGuideFormRules } from '@/utils/rules.js'
import help from '@/utils/helper.js'
import request from '@/utils/request.js'
import net from '@/utils/request.js'
import api from '@/utils/api.js'
import enums from '@/utils/enums.js'
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
      title: '添加用户指南',
      action: 0,
      labelWidth: '120px',
      userGuide: {
        'question': '',
        'answer': '',
        'seq': '',
        cityCode: ''
      },
      verificationRule: false,
      formRules: addUserGuideFormRules,
      operateInfo: enums.OPERATIONID,
      cityListArr: [],
      channelListArr: [],
      compList: []
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
      this.getUserGuideInfo()
      this.getAllList()
    },
    /* 修改城市 */
    changeCity () {
      net.apiGet(api.city.channelCity,{cityCode: this.userGuide.cityCode}).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.channelListArr = data.data
        }
      }).catch((data) => {
        help.E(data.msg)
      })
    },
    getAllList() {
      // net.apiGet(api.city.option).then(data => {
      //   if (data.msg && data.msg.code === enums.NET_SUCCESS) {
      //     this.cityListArr = data.data.list
      //   }
      // }).catch((data) => {
      //   help.E(data.msg)
      // })
      net.apiGet(api.city.option).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityListArr = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    getUserGuideInfo() {
      let userGuideId = this.$route.query.id
      if (userGuideId != undefined) {
        this.action = 1
        this.title = '修改用户指南'
        request.apiGet(api.userGuide.info, {
          id: String(userGuideId)
        }).then(data => {
          if (data.msg && data.code == enums.NET_SUCCESS) {
            this.userGuide = data.data
            this.changeCity()
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    save() {
      this.$refs['addUserGuide'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData() {
      let params = this.userGuide
      let url = ''
      if (parseInt(this.action) === 1) {
        url = api.userGuide.update
        params.operationId = this.operateInfo.change.operationId
      } else {
        url = api.userGuide.add
        params.operationId = this.operateInfo.create.operationId
      }
      params['sequenceNo'] = String(params.sequenceNo)
      params['id'] = String(params.id)
      params['operationId'] = String(params.operationId)
      request.apiPost(url, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('userGuideFlag', 'true')
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
      sessionStorage.setItem('userGuideFlag', 'true')
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
