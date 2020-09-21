<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form
      enctype="multipart/form-data"
      label-width="100px"
      :model="busType"
      :rules="formRules"
      ref="addBusType"
      label-position="right">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="车型名称" prop="busTypeName" class="common-form-item">
        <el-input v-model="busType.busTypeName" :maxlength="7"></el-input>
      </el-form-item>
      <el-form-item label="出厂型号" class="common-form-item">
        <el-input v-model="busType.busTypeNo" :maxLength="32"></el-input>
      </el-form-item>
      <el-form-item label="缩略图">
        <el-upload list-type="picture-card" :limit=1 :before-upload="beforeAvatarUpload" :file-list="thumbNailUrl"
          :http-request="uploadImage" :on-remove="removePhoto" action="''" :data="{type: 1}">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="详细图">
        <el-upload list-type="picture-card" :limit=9 :before-upload="beforeAvatarUpload" :file-list="detailUrl"
          :http-request="uploadImage" :on-remove="removePhoto" multiple action="''" :data="{type: 2}">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="标准载客数" prop="seatCount" class="common-form-item">
        <el-input v-model="busType.seatCount" style="margin-right: 15px;" type="number">
        </el-input>人
      </el-form-item>
      <el-form-item label="最高载客数" prop="seatMaxCount" class="common-form-item">
        <el-input v-model="busType.seatMaxCount" style="margin-right: 15px;" type="number"></el-input>人
      </el-form-item>
      <el-form-item label="续航里程" prop="mileageCount" class="common-form-item">
        <el-input v-model="busType.mileageCount" style="width:150px;margin:0 10px 0 0;" type="number" @blur="judgeInfo(busType.mileageCount)"></el-input>公里
      </el-form-item>
      <el-form-item prop="description" class="common-form-item" label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="200" v-model="busType.description"
          placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="busType.state">
          <el-option :value='parseInt(0)' label="禁用"></el-option>
          <el-option :value='parseInt(1)' label="启用"></el-option>
        </el-select>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addBusTypeFormRules } from '@/utils/rules'
import { checkedImage } from '@/utils/public'
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
      title: '添加车辆类型',
      action: 0,
      labelWidth: '120px',
      padList: [],
      thumbNailUrl: [],
      detailUrl: [],
      busType: {
        busTypeNo: '',
        busTypeName: '',
        seatCount: '',
        seatMaxCount: '',
        mileageCount: '',
        description: '',
        state: 1,
        busTypeIconList: [], // 详细图
        iconAddress: '' // 缩略图
      },
      formRules: addBusTypeFormRules,
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getBusTypeInfo()
  },
  methods: {
    /**
     * 校验input框中的输入值
     * @param val：拿到的值
     */
    judgeInfo (val) {
      if (val && val <= 0) {
        this.busType.mileageCount = ''
        return help.W('请填写正确的里程数')
      } else {
        if (val) this.busType.mileageCount = (+val).toFixed()
      }
    },
    getBusTypeInfo () {
      if (this.uid) {
        this.title = '修改车型信息'
        request.apiGet(api.busType.busTypeInfo, { busTypeId: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.busType = (res)
            this.thumbNailUrl = []
            if (res.iconAddress != null && res.iconAddress != '') {
              this.thumbNailUrl.push({ name: '1', url: res.iconAddress })
            }
            if (res.detailIconList != null && res.detailIconList.length > 0) {
              res.detailIconList.map((item, index) => {
                this.detailUrl.push({ name: '2', url: item })
              })
            }
          }
        })
      }
    },
    uploadImage (file) {
      request.apiFile(api.common.upload, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
          help.E(data.msg)
        } else {
          if (file.data.type === 1) {
            this.thumbNailUrl.push({ name: '1', url: data.data })
          } else {
            this.detailUrl.push({ name: '2', url: data.data })
          }
          // this.iconOrder++;
          // if (this.iconOrder > 9) {
          //   document.getElementsByClassName("el-upload el-upload--picture-card")[0].style.display = "none";
          // }
        }
      })
    },
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    removePhoto (file) {
      let removeUrl = file.url
      if (file.name === '1') {
        this.thumbNailUrl.map((item, index) => {
          if (item.url == removeUrl) {
            this.thumbNailUrl.splice(index, 1)
          }
        })
      } else {
        this.detailUrl.map((item, index) => {
          if (item.url == removeUrl) {
            this.detailUrl.splice(index, 1)
          }
        })
      }
    },
    save () {
      this.$refs['addBusType'].validate((valid) => {
        if (valid) {
          let params = this.busType
          if (this.thumbNailUrl.length) {
            params.iconAddress = this.thumbNailUrl[0].url
          } else {
            return help.W('请先上传缩略图')
          }
          if (this.detailUrl.length) {
            let arr = []
            this.detailUrl.map((item, index) => {
              arr.push(item.url)
            })
            params.busTypeIconList = arr
          } else {
            return help.W('请先上传详细图')
          }
          this.postData(params)
        } else {
          return false
        }
      })
    },
    postData (params) {
      request.apiPost(this.uid ? api.busType.update : api.busType.create, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          this.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('busTypeFlag', 'true')
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
