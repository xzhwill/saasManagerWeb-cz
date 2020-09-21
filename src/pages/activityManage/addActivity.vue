<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="activity" :rules="formRules" ref="activity" label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="活动名称" prop="bannerName" class="common-form-item" style="width: 310px;">
        <el-input placeholder="活动名称" v-model="activity.bannerName"></el-input>
      </el-form-item>
      <el-form-item prop="timeArr" class="common-form-item" label="活动时间">
        <el-date-picker
          v-model="activity.timeArr"
          type="daterange"
          :picker-options="pickerOptions1"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="clearTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="城市" prop="cityCode" class="common-form-item">
        <el-select v-model="activity.cityCode" filterable @change="changeCity">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展示渠道" prop="channelId" class="common-form-item">
        <el-select v-model="activity.channelId" filterable>
          <el-option v-for="(item, index) in channelList " :key="index" :label="item.channelName" :value="item.channelId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-radio-group v-model="activity.businessType" @change="changeBusiness">
          <el-radio v-for="item in businessTypeList" :label="item.businessId" :key="item.businessId">{{ item.businessName }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动类型">
        <el-select v-model="activity.advertType">
          <el-option label="首页banner" :value="'3'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="common-form-item" label="展示顺序" prop="seq">
        <el-input placeholder="序号" v-model="activity.seq" type=number style="width: 210px;" @blur="judgeInfo(activity.seq)"></el-input>
      </el-form-item>
      <el-form-item label="跳转类型" prop="jumpType" v-if="activity.advertType== '3'">
        <el-select v-model="activity.jumpType" style="width:202px" @change="changeJumpType">
          <el-option label="端内url" value="1"></el-option>
          <el-option label="端外url" value="2"></el-option>
          <el-option label="静态页面" value="3"></el-option>
          <el-option label="线路详情页面" value="4"></el-option>
          <el-option label="无跳转" value="5"></el-option>
          <el-option label="活动" value="6"></el-option>
          <el-option label="通票" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转地址" v-if="+activity.jumpType === 2 || +activity.jumpType === 1" prop="jumpAddr">
        <el-input spellcheck="false" v-model="activity.jumpAddr" placeholder="请输入跳转地址" style="width:202px;"></el-input>
      </el-form-item>
      <el-form-item label="营销活动" prop="channelId" class="common-form-item" v-if="+activity.jumpType === 6">
        <el-select v-model="activity.jumpAddr" filterable>
          <el-option v-for="(item, index) in couponList " :key="index" :label="item.activityName" :value="item.activityId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择通票" prop="channelId" class="common-form-item" v-if="+activity.jumpType === 7">
        <el-select v-model="activity.jumpAddr" filterable>
          <el-option v-for="(item, index) in channellist " :key="index" :label="item.channelName" :value="item.channelId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择线路" prop="channelId" class="common-form-item" v-if="+activity.jumpType === 4">
        <el-select v-model="activity.jumpAddr" filterable>
          <el-option v-for="(item, index) in lineList " :key="index" :label="item.lineName" :value="item.lineId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面图片" class="common-form-item" v-if="+activity.jumpType === 3">
        <div style="margin-top: 15px;" ref="divView">
          <el-upload
            class="showImage"
            list-type="picture-card"
            :before-upload="beforeAvatarUpload"
            :data="{ photoType:'static' }"
            :http-request="uploadImage"
            :file-list="fileGroup"
            :on-remove="removePhoto"
            action="''"
            ref="static">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="活动图片" class="common-form-item" prop="type2Url">
        <div style="margin-top: 15px;" ref="divView">
          <el-upload
            class="showImage"
            list-type="picture-card"
            :limit=1
            :before-upload="beforeAvatarUpload"
            :data="{ photoType: 'banner' }"
            :http-request="uploadImage"
            :file-list="type2Url"
            :on-remove="removePhoto"
            action="''"
            ref="uploadBanner">
            <el-button type="primary">上传banner图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="分享地址" v-if="+activity.jumpType !== 5">
        <el-input spellcheck="false" v-model="activity.shareUrl" placeholder="请输入分享地址" style="width:202px;"></el-input>
      </el-form-item>
      <el-form-item label="分享图片" v-if="+activity.jumpType !== 5">
        <el-upload
          class="showImage"
          list-type="picture-card"
          :limit=1
          :before-upload="beforeAvatarUpload"
          :data="{ photoType:'share' }"
          :file-list="shareImg"
          :http-request="uploadImage"
          :on-remove="removePhoto"
          action="''"
          ref="uploadRef">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="分享标题" v-if="+activity.jumpType !== 5">
        <el-input placeholder="请填写分享标题" v-model="activity.shareTitle" style="width: 210px;"></el-input>
      </el-form-item>
      <el-form-item label="分享描述" v-if="+activity.jumpType !== 5">
        <el-input placeholder="请输入分享描述" v-model="activity.shareDescription" style="width: 210px;"></el-input>
      </el-form-item>
      <el-form-item label="页面标题" v-if="+activity.jumpType !== 5">
        <el-input placeholder="请输入页面标题" v-model="activity.pageTitle" style="width: 210px;"></el-input>
      </el-form-item>
      <el-row class="btn-group" style="text-align: center">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import { checkedImage } from '@/utils/public'
import { addActivityRules } from '@/utils/rules'

export default {
  data () {
    return {
      clearTime: false,
      title: '创建活动',
      isUpdated: false,
      activity: {
        bannerId: '',
        bannerName: '',
        activityImgUrl: [],
        alertType: 1,
        jumpType: '1', // 跳转类型
        jumpAddr: '',
        iconUrl: '', // banner图片
        advertType: '3',
        businessType: '1',
        cityCode: '',
        channelId: '',
        time: '',
        loginState: 1,
        timeArr: [], // 活动时间
        shareUrl: '',
        shareImg: '',
        shareTitle: '',
        shareDescription: '',
        state: 0,
        pageTitle: '',
        seq: ''
      },
      businessTypeList: enums.BUSINESSTYPE,
      cityList: [], // 城市列表
      compList: [], // 供给侧（暂时不用）
      fileGroup: [], // 页面图片
      type2Url: [], //  banner图片
      shareImg: [], //  分享图片
      channelList: [], // 渠道列表
      lineList: [], // 线路列表
      couponList: [], // 活动列表
      pickerOptions1: { // 校验有效期
        disabledDate (time) {
          return (time.getTime() + 3600 * 1000 * 24) < Date.now()
        }
      },
      formRules: addActivityRules, // form表单校验
      url: api.common.upload, // 图片上传地址
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.getChannel() // 获取渠道列表
    this.getCity() // 获取城市列表
    this.showActivity() // 判断是否为修改页面；如果为修改页面，调用详情信息接口
  },
  methods: {
    /**
     * 判断输入的值是否正确
     * @param val：输入框中的值
     */
    judgeInfo (val) {
      if (val < 0) {
        this.activity.seq = 0
      } else if (val > 0) {
        this.activity.seq = parseInt(+this.activity.seq)
      }
    },
    /* 修改城市 */
    changeCity () {
      this.getChannel()
      this.getLine() // 获取对应的线路（跳转类型为：线路详情页面）
    },
    /* 修改业务类型 */
    changeBusiness () {
      if (+this.activity.jumpType === 4) this.getLine()
    },
    /* 获取渠道列表 */
    getChannel () {
      request.apiGet(api.city.bannerChannelCity, { cityCode: this.activity.cityCode }).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /* 获取城市列表 */
    getCity () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /* 获取线路列表 */
    getLine () {
      request.apiGet(api.line.optionList, {
        cityCode: this.activity.cityCode,
        businessType: this.activity.businessType
      }).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.lineList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /* 获取营销活动列表 */
    getActivityCoupon () {
      request.apiGet(api.marketActivity.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.couponList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /* 修改跳转类型 */
    changeJumpType () {
      this.activity.jumpAddr = ''
      if (+this.activity.jumpType === 4) { // 跳转类型为线路详情，获取线路列表
        this.getLine()
      } else if (+this.activity.jumpType === 6) { // 跳转类型为活动，获取营销活动
        this.getActivityCoupon()
      } else if (+this.activity.jumpType === 7) { // 跳转类型为通票，获取通票列表
        // 暂无
      } else if (+this.activity.jumpType === 3) { // 跳转类型为静态页面
        this.fileGroup = []
      }
    },
    /* 上传图片方法 */
    uploadImage (file) {
      request.apiFile(this.url, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
        } else {
          if (file.data.photoType === 'banner') {
            this.activity.iconUrl = data.data
            // this.activity.activityImgUrl = [{ name: 'orderReportForms', url: data.data.imageReqUrl }]
            this.type2Url = [{ name: 'banner', url: data.data }]
          } else if (file.data.photoType === 'share') {
            this.activity.shareImg = data.data
            this.shareImg = [{ name: 'share', url: data.data }]
          } else if (file.data.photoType === 'static') {
            this.fileGroup.push({ name: file.data.photoType, url: data.data })
          }
        }
      })
    },
    removePhoto (file) {
      if (file.name === 'share') {
        this.shareImg = []
        this.activity.shareImg = ''
      } else if (file.name === 'banner') {
        this.activity.iconUrl = ''
        this.type2Url = []
      } else if (file.name === 'static') {
        this.fileGroup.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.fileGroup.splice(index, 1)
          }
        })
      }
    },
    /* 回显 */
    showActivity () {
      if (this.uid) {
        this.title = '修改活动'
        this.isUpdated = true
        request.apiGet(api.activity.info, { bannerId: this.uid }).then(data => {
          let res = data.data
          this.activity = {
            ...this.activity,
            ...res
          }
          this.activity.advertType = '3' // 活动类型
          this.activity.timeArr = [res.effectiveDate, res.expiryDate] // 有效期
          if (res.iconUrl) this.type2Url = [{ name: 'banner', url: res.iconUrl }] // banner图片
          if (res.shareImg) this.shareImg = [{ name: 'share', url: res.shareImg }] // 分享图片
          if (this.activity.jumpType === '4') { // 跳转类型为线路详情，获取线路列表
            this.getLine()
          } else if (this.activity.jumpType === '6') { // 跳转类型为活动，获取营销活动
            this.getActivityCoupon()
          } else if (this.activity.jumpType === '7') { // 跳转类型为通票，获取通票列表
            // 暂无
          } else if (this.activity.jumpType === '3') {
            this.fileGroup = []
            this.activity.bannerPagesUrls.forEach((item, index) => {
              this.fileGroup.push({name: 'static', url: item})
            })
          }
        })
      } else {
        this.title = '添加活动'
        this.isUpdated = false
      }
    },
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    save () {
      this.$refs.activity.validate((valid) => {
        if (valid) {
          if (+this.activity.jumpType === 3) {
            if (this.fileGroup != null && this.fileGroup.length) {
              this.activity.bannerPagesUrls = []
              this.fileGroup.forEach(item => {
                this.activity.bannerPagesUrls.push(item.url)
              })
            } else {
              return helper.E('请上传图片')
            }
          }
          let params = this.activity
          // if (this.uid) {
          //   delete this.activity.effectiveDate
          //   delete this.activity.expiryDate
          //   delete this.activity.addTime
          //   delete this.activity.updateTime
          // }
          params.effectiveDate = this.activity.timeArr[0]
          params.expiryDate = this.activity.timeArr[1]
          params.fileGroup = this.fileGroup
          request.apiPost(this.uid ? api.activity.update : api.activity.create, params).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              sessionStorage.setItem('activityFlag', 'true')
              let msg = this.uid ? '修改成功' : '创建成功'
              helper.S(msg)
              this.back()
            } else {
              helper.E(data.msg)
            }
          })
        }
      })
    },
    back () {
      sessionStorage.setItem('activityFlag', 'true')
      this.$router.push('./activityManage')
    }
  }
}
</script>

<style lang="less" type="text/less">
.divView {
}
.rule-item {
  margin-bottom: 10px;
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
  margin-bottom: 5px;
  margin-top: 5px;
}
</style>
