<template>
  <div>
    <el-form-item label="页面图片" class="common-form-item">
      <div ref="divView">
        <el-upload
          list-type="picture-card"
          class="showImage"
          :before-upload="beforeAvatarUpload"
          :data="{ photoType:'static' }"
          :http-request="uploadImage"
          :file-list="fileGroup"
          :on-remove="removeImage"
          action="''"
          ref="static">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </div>
    </el-form-item>
    <el-form-item label="按钮图片" class="common-form-item" v-if="hadBtn">
      <div ref="divView">
        <el-upload
          list-type="picture-card"
          class="showImage"
          :limit=1
          :before-upload="beforeAvatarUpload"
          :data="{ photoType:'button' }"
          :http-request="uploadImage"
          :file-list="hasImg ? buttonIcon : []"
          :on-remove="removeImage"
          action="''"
          ref="button">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
        <span style="color: red;font-size: 12px;">注：按钮距离底部40px</span>
      </div>
    </el-form-item>
    <el-form-item label="预览图片" class="common-form-item" v-if="fileGroup.length">
      <el-button @click="drawer = true" type="primary">预览</el-button>
    </el-form-item>
    <el-drawer
      title="页面预览" :visible.sync="drawer" :before-close="handleClose" style="overflow: auto;">
      <div :style="contentStyleObj">
        <div style="position: relative;">
          <el-image v-for="(item, index) in fileGroup" :src="item.url" style="font-size: 0" :key="index">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <el-image
            style="position: absolute;left: 50%;transform: translate(-50%, -50%);bottom: 40px;"
            :src="buttonIcon[0].url"
            v-if="buttonIcon.length"></el-image>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { checkedImage } from '@/utils/public'
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  props: {
    hadBtn: {
      type: Boolean,
      default: false
    },
    fileGroup: {
      type: Array,
      default: () => []
    },
    buttonIcon: {
      type: Array,
      default: () => []
    }
  },
  name: 'pageImg',
  data () {
    return {
      contentStyleObj: {
        height: '100px',
        overflow: 'auto',
        fontSize: '0'
      },
      drawer: false,
      url: api.common.upload, // 图片上传地址
      hasImg: false // 是否有按钮图片
    }
  },
  created () {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    if (this.buttonIcon) this.hasImg = true
  },
  methods: {
    /* 获取高度 */
    getHeight () {
      this.contentStyleObj.height = window.innerHeight - 120 + 'px'
    },
    /* 上传图片之前的校验 */
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    /* 上传图片请求 */
    uploadImage (file) {
      request.apiFile(this.url, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
          helper.E(data.msg)
        } else {
          if (file.data.photoType === 'banner') {

          } else if (file.data.photoType === 'share') {

          } else if (file.data.photoType === 'static') { // 静态页面图片
            this.fileGroup.push({ name: 'static', url: data.data })
            this.sendImgList(this.fileGroup, 'static')
          } else if (file.data.photoType === 'button') { // 按钮图片
            this.hasImg = true
            this.buttonIcon.push({name: 'button', url: data.data})
            this.sendImgList(this.buttonIcon, 'button')
          }
        }
      })
    },
    /* 移除图片 */
    removeImage (file) {
      if (file.name === 'static') {
        this.fileGroup.forEach((item, index) => {
          if (item.uid === file.uid) this.fileGroup.splice(index, 1)
        })
        this.sendImgList(this.fileGroup, 'static')
      } else if (file.name === 'button') {
        this.hasImg = false
        this.buttonIcon.forEach((item, index) => {
          if (item.uid === file.uid) this.buttonIcon.splice(index, 1)
        })
        this.sendImgList(this.buttonIcon, 'button')
      }
    },
    /* 将数据发送给父级 */
    sendImgList (list, type) {
      this.$emit('sendImg', list, type)
    },
    handleClose (done) {
      this.drawer = false
    }
  }
}
</script>

<style scoped>
</style>
