<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="150px" :model="collectLine" :rules="collectLineRules" ref="collectLine">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="所属城市" prop="cityCode">
        <el-select v-model="collectLine.cityCode"  placeholder="请选择">
          <el-option v-for="(val,idx) in cityList" :value="val.cityCode" :key="idx" :label="val.cityName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上班开始时间" class="common-form-item" prop="goWorkStart">
        <el-time-select placeholder="上班开始时间" v-model="collectLine.goWorkStart" :picker-options="{start: '04:00',step: '00:01',end: '11:00'}">
        </el-time-select>
      </el-form-item>
      <el-form-item label="上班结束时间" class="common-form-item" prop="goWorkEnd">
        <el-time-select placeholder="上班结束时间" v-model="collectLine.goWorkEnd" :picker-options="{start: '04:00',step: '00:01',end: '11:00',minTime: collectLine.goWorkStart}">
        </el-time-select>
      </el-form-item>
      <el-form-item label="下班开始时间" class="common-form-item" prop="offWorkStart">
        <el-time-select placeholder="下班开始时间" v-model="collectLine.offWorkStart" :picker-options="{start: '15:00',step: '00:01',end: '23:00'}">
        </el-time-select>
      </el-form-item>
      <el-form-item label="下班结束时间" class="common-form-item" prop="offWorkEnd">
        <el-time-select placeholder="下班结束时间" v-model="collectLine.offWorkEnd" :picker-options="{start: '15:00',step: '00:01',end: '23:00',minTime: collectLine.offWorkStart}">
        </el-time-select>
      </el-form-item>
      <el-form-item label="间隔时间" class="common-form-item" prop="runInterval">
        <el-input v-model="collectLine.runInterval" type="number" placeholder="请输入间隔时间">
        </el-input>
      </el-form-item>
      <el-form-item label="banner图片" class="common-form-item">
        <el-upload
          class="showImage"
          list-type="picture-card"
          :limit=1
          :before-upload="beforeAvatarUpload"
          :data="{ photoType: 'banner' }"
          :http-request="uploadImage"
          :file-list="iconUrl"
          :on-remove="removeImage"
          action="''"
          ref="uploadBanner">
          <el-button type="primary">上传banner图片</el-button>
        </el-upload>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addCollectLineRules } from '@/utils/rules'
import request from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'
import { checkedImage } from '@/utils/public'

export default {
  data () {
    return {
      clearTime: false,
      title: '新建线路征集',
      labelWidth: '120px',
      iconUrl: [],
      collectLine: {
        goWorkStart: '', // 上班开始时间
        goWorkEnd: '', // 上班结束时间
        cityCode: '', // 城市编码
        offWorkStart: '', // 下班开始时间
        offWorkEnd: '', // 下班结束时间,
        runInterval: '' // 间隔时间
      },
      collectLineRules: addCollectLineRules,
      cityList: [], // 存放城市
      url: api.common.upload,
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断为修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', {})
    this.getPeopleInfo()
    this.getAllList()
  },
  methods: {
    /**
     * 获取城市列表
     */
    getAllList () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 上传前校验
     * @param file：上传的文件
     * @returns {boolean|*}
     */
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    /**
     * 上传图片
     * @param file：上传的文件
     */
    uploadImage (file) {
      request.apiFile(this.url, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
          help.E(data.msg)
        } else {
          this.iconUrl = [{ name: 'banner', url: data.data }]
          this.collectLine.iconUrl = data.data
        }
      })
    },
    /**
     * 移除图片
     */
    removeImage () {
      this.iconUrl = []
      this.collectLine.iconUrl = ''
    },
    getPeopleInfo () {
      if (this.uid) {
        this.title = '修改线路征集配置'
        request.apiGet(api.lineGather.info, { id: this.uid }).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            this.collectLine = data.data
            if (data.data.iconUrl) this.iconUrl = [{ name: 'banner', url: data.data.iconUrl }]
          }
        })
      }
    },
    /**
     * 点击保存
     */
    save () {
      this.$refs['collectLine'].validate(valid => {
        if (valid) {
          this.postNoticeData()
        } else {
          return false
        }
      })
    },
    /**
     * 调用保存的接口
     */
    postNoticeData () {
      request.apiPost(this.uid ? api.lineGather.update : api.lineGather.create, {
        ...this.collectLine,
        iconUrl: this.iconUrl.length ? this.iconUrl[0].url : ''
      }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('emergencyContactListFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    /**
     * 返回上级页面
     */
    back () {
      sessionStorage.setItem('emergencyContactListFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../assets/style/common.css";
  @import "./addCollectLine.less";
</style>
