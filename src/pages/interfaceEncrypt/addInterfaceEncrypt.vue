<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data"
             label-width="100px"
             :model="interfaceEncrypt"
             :rules="formRules"
             ref="addInterfaceEncrypt"
             label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="渠道"
                    prop="channelId">
        <el-select v-model="interfaceEncrypt.channelId">
          <el-option v-for="(item, index) in channelList "
                     :key="index"
                     :label="item.channelName"
                     :value="item.channelId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="URL"
                    prop="servletPath"
                    class="common-form-item">
        <el-input v-model="interfaceEncrypt.servletPath"
                  minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="加密字段	"
                    prop="secretFields"
                    class="common-form-item">
        <el-input v-model="interfaceEncrypt.secretFields"
                  minlength="5"
                  placeholder="field1,field2..."></el-input>
      </el-form-item>
      <el-form-item prop="state"
                    label="状态">
        <el-radio v-model="interfaceEncrypt.state"
                  :label="'1'">启用</el-radio>
        <el-radio v-model="interfaceEncrypt.state"
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
import { addInterfaceEncryptRules } from '@/utils/rules.js'
import help from '@/utils/helper.js'
import request from '@/utils/request.js'
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
      title: '添加接口加密配置',
      imageInfo: {
        iconType: '2'
      },
      labelWidth: '120px',
      interfaceEncrypt: {
        'servletPath': '',
        'secretFields': '',
        'state': '1',
        channelId: ''
      },
      verificationRule: false,
      formRules: addInterfaceEncryptRules,
      channelList: [],
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
      this.getComnInfo()
      this.getAllList()
    },
    getAllList() {
      request.apiGet(api.channel.option).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          this.channelList = data.data.list
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    getComnInfo() {
      let id = this.$route.query.id
      if (id != undefined) {
        this.action = 1
        this.title = '修改接口加密配置'
        request.apiGet(api.interfaceEncrypt.info, {
          id: id
        }).then(data => {
          if (data.msg && data.msg.code === enums.NET_SUCCESS) {
            this.interfaceEncrypt = data.data
          }
        })
      }
    },
    save() {
      this.$refs['addInterfaceEncrypt'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData() {
      let params = this.interfaceEncrypt
      let url = ''
      if (parseInt(this.action) === 1) {
        url = api.interfaceEncrypt.update
      } else {
        url = api.interfaceEncrypt.create
      }
      request.apiPost(url, params).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('interfaceEncryptFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back() {
      sessionStorage.setItem('interfaceEncryptFlag', 'true')
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
