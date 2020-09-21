<template>
  <div class="common-container"style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="ticketImg" :rules="formRules" ref="addTicketImg"
             label-position="right">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="票面名称:" prop="displayName" class="common-form-item">
        <el-input v-model="ticketImg.displayName" placeholder="请输入票面名称"></el-input>
      </el-form-item>
      <el-form-item label="所属渠道:" prop="channelId" class="common-form-item">
        <el-select v-model="ticketImg.channelId" placeholder="请选择">
          <el-option v-for="(item, index) in channelList" :key="index" :label="item.channelName" :value="item.channelId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生效日期：" class="common-form-item" prop="timeArr">
        <el-date-picker
          v-model="timeArr"
          type="datetimerange"
          @change="changeTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="clearTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"></el-date-picker>
      </el-form-item>
      <el-form-item label="图片类型：" prop="iconTpe">
        <el-radio v-model="ticketImg.iconTpe" label="1">票面</el-radio>
        <el-radio v-model="ticketImg.iconTpe" label="2">广告</el-radio>
      </el-form-item>
      <el-form-item label="票面图片：" v-if="ticketImg.iconTpe == 1">
        <el-upload
          list-type="picture-card"
          class="showImage"
          :limit="1"
          :before-upload="beforeAvatarUpload"
          :data="{ photoType: 'share' }"
          :file-list="type2Url"
          :http-request="uploadImage"
          :on-remove="removeImage"
          action="''"
          ref="uploadRef">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
        <p style="color: red; font-size: 12px;">注：票面图片的宽不得超过347px，高不得超过119px。</p>
      </el-form-item>
      <el-form-item label="广告图片：" class="common-form-item" v-if="ticketImg.iconTpe == 2">
        <div style="margin-top: 15px;" ref="divView">
          <el-upload
            list-type="picture-card"
            class="showImage"
            :before-upload="beforeAvatarUpload"
            :data="{photoType:'static'}"
            :http-request="uploadImage"
            :file-list="fileGroup"
            :on-remove="removeImage"
            action="''"
            ref="static">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="选择线路：" inline-message="true">
        <el-input name="className" v-model="lineName" placeholder="线路名称" style="width:240px; text-align:left" @input="filterClass"></el-input>
        <div>
          <el-table ref="classLeft " style="margin-top: 20px;width: 331px; float:left" @selection-change="handleSelectionClassLeft" header-row-class-name="tableHeader" class="page-table-main" :data="lineList" height="300" border>
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row[item.name] }}</template>
            </el-table-column>
          </el-table>
          <div class="el-transfer__buttons" style=" margin-top:80px;">
            <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleAdd(1)">
              <span> <i class="el-icon-arrow-right"></i></span>
            </button>
            <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleRemove(1)">
              <span> <i class="el-icon-arrow-left"></i></span>
            </button>
          </div>
          <el-table ref="classRight" style="margin-top: 20px;width: 331px; float:right" @selection-change="handleSelectionClassRight" header-row-class-name="tableHeader" class="page-table-main" :data="lineRight" height="300" border>
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row[item.name] }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="状态：" prop="state">
        <el-radio v-model="ticketImg.state" label="1">启用</el-radio>
        <el-radio v-model="ticketImg.state" label="0">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import { ticketImgRule } from '@/utils/rules'
import { checkedImage } from '@/utils/public'

export default {
  name: 'addTicketImg',
  data () {
    return {
      title: '添加票面',
      clearTime: false,
      ticketImg: {
        displayName: '',
        iconTpe: '1', //  图片类型：orderReportForms-票面图片 travelReportForms-广告
        ticketIconUrl: '', // 票面图片
        displayStartTime: '',
        displayEndTime: '',
        state: '0',
        channelId: '',
        timeArr: []
      },
      fileGroup: [], // 图片放置的数组
      channelList: [], // 渠道列表
      timeArr: [], // 有效期
      type2Url: [], //  上传的图片
      lineName: '', //  搜索线路名称
      allLineList: [], // 初始从后端拿到的所有的线路数据
      idsList: [], // 左侧添加到右侧的ID数组（非键值对）
      classRightSelected: [], // 右侧选中的添加到左侧的ID数组（非键值对）
      lineList: [], // 左侧菜单筛选后的总数据（键值对）
      lineRight: [], // 右侧菜单中的总数据（键值对）
      lineRightAll: [], // 左侧菜单选中的值（键值对）
      lineRightVal: [], // 右侧菜单选中的值（键值对）
      formRules: ticketImgRule,
      tableHeader: [
        {
          label: '线路名称',
          name: 'lineName',
          fit: true
        }
      ],
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断是修改还是添加页面
    }
  },
  created () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', {})
  },
  mounted () {
    this.getList()
    this.getlineList('', '', '') // 获取线路列表
    this.getTicketImgInfo()
  },
  methods: {
    /* 获取渠道 */
    getList () {
      request.apiGet(api.channel.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          let res = data.data
          this.channelList = (res)
        }
      })
    },
    /* 回显 */
    getTicketImgInfo () {
      var that = this
      if (this.uid) {
        that.title = '修改票面'
        request.apiGet(api.ticketDisplay.info, { id: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.ticketImg.displayName = res.displayName
            this.ticketImg.state = res.state
            this.ticketImg.id = res.displayId
            this.ticketImg.channelId = res.channelId
            this.ticketImg.displayStartTime = (res.displayStartTime)
            this.ticketImg.displayEndTime = (res.displayEndTime)
            this.ticketImg.timeArr.push(res.displayStartTime)
            this.ticketImg.timeArr.push(res.displayEndTime)
            this.timeArr.push(res.displayStartTime)
            this.timeArr.push(res.displayEndTime)
            this.lineRight = res.ticketDisplayLineInfoDtoList
            if (res.advertIconUrlList.length) {
              this.ticketImg.iconTpe = '2'
              res.advertIconUrlList.forEach(item => {
                this.fileGroup.push({ name: 'static', url: item })
              })
            } else {
              this.ticketImg.iconTpe = '1'
              if (res.ticketIconUrl) {
                this.ticketImg.ticketIconUrl = res.ticketIconUrl
                this.type2Url.push({ name: '1', url: res.ticketIconUrl })
              }
            }
          } else {
            helper.E(data.msg)
          }
        })
      }
    },
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    removePhoto () {
      this.type2Url = []
    },
    removeImage (file) {
      if (this.ticketImg.iconTpe === '1') {
        this.ticketImg.ticketIconUrl = ''
      } else {
        this.fileGroup.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.fileGroup.splice(index, 1)
          }
        })
      }
    },
    uploadImage (file) {
      request.apiFile(api.common.upload, 'file', file.file).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          if (this.ticketImg.iconTpe === '1') {
            this.ticketImg.ticketIconUrl = data.data
            this.type2Url = [{ name: '1', url: data.data }]
          } else {
            this.fileGroup.push({name: file.data.photoType, url: data.data})
          }
        } else {
          helper.E(data.msg)
        }
      })
    },
    changeTime (val) {
      if (!val || !val.length) {
        this.getlineList('', '', '')
        this.ticketImg.timeArr = []
        this.ticketImg.displayStartTime = ''
        this.ticketImg.displayStartTime = ''
      } else {
        this.getlineList('', val[0], val[1])
        this.ticketImg.timeArr.push(val[0])
        this.ticketImg.timeArr.push(val[1])
        this.ticketImg.displayStartTime = val[0]
        this.ticketImg.displayEndTime = val[1]
      }
    },
    filterClass () {
      this.lineList = this.allLineList.filter((item) => {
        return item.lineName.indexOf(this.lineName) > -1
      })
    },
    handleSelectionClassLeft (checkedArr) { // 班次 从左边勾选数据
      this.lineRightAll = checkedArr
      this.idsList = []
      checkedArr.forEach((item) => {
        this.idsList.push(item.lineId)
      })
    },
    handleSelectionClassRight (checkedArr) { // 班次 从右边勾选数据
      this.lineRightVal = checkedArr
      this.classRightSelected = []
      checkedArr.forEach((item) => {
        this.classRightSelected.push(item.lineId)
      })
    },
    handleAdd () { // 往右侧增加数据 对右边进行去重
      this.lineRightAll.forEach(item => { // 将左侧选中的值添加到右侧
        this.lineRight.unshift(item)
      })
      // this.lineRight = this.lineRight.concat(this.lineRightAll)
      let hash = {}
      this.lineRight = this.lineRight.reduce((item, next) => {
        if (!hash[next.lineId]) {
          hash[next.lineId] = true
          item.push(next)
        }
        return item
      }, [])
      this.listDuplicateRemoval(this.lineList, this.idsList)
    },
    handleRemove (type) {
      this.lineRightVal.forEach(item => { // 将右侧选中的值添加到左侧
        this.lineList.unshift(item)
      })
      // this.lineList = this.lineList.concat(this.lineRightVal)
      let hash = {}
      this.lineList = this.lineList.reduce((item, next) => {
        if (!hash[next.lineId]) {
          hash[next.lineId] = true
          item.push(next)
        }
        return item
      }, [])
      this.listDuplicateRemoval(this.lineRight, this.classRightSelected)
    },
    save () {
      this.$refs['addTicketImg'].validate((valid) => {
        if (valid) {
          let params = this.ticketImg
          params.advertIconUrlList = []
          params.lineList = []
          this.lineRight.forEach(item => {
            params.lineList.push(item.lineId)
          })
          if (+this.ticketImg.iconTpe === 2) {
            this.ticketImg.ticketIconUrl = ''
            this.fileGroup.forEach(item => {
              params.advertIconUrlList.push(item.url)
            })
          } else {
            this.fileGroup = []
          }
          if (!params.ticketIconUrl) return helper.W('请先上传票面图片')
          if (!params.lineList.length) return helper.W('请先选择线路')
          request.apiPost(this.uid ? api.ticketDisplay.update : api.ticketDisplay.create, params).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              helper.S(data.msg)
              this.back()
            } else {
              helper.E(data.msg)
            }
          })
        }
      })
    },
    back () {
      sessionStorage.setItem('ticketImgFlag', 'true')
      this.$router.back()
    },
    listDuplicateRemoval (lis, li) { // 将左边选中的值添加到右侧后，对左侧进行去重操作
      lis.filter((item, index) => {
        if (li.indexOf(item.lineId) > -1) {
          lis.splice(index, 1)
          this.listDuplicateRemoval(lis, li)
        }
        return lis
      })
    },
    getlineList (displayId, displayStartTime, displayEndTime) { // 获取线路列表
      request.apiGet(api.line.lineInfoTicket, { displayId, displayStartTime, displayEndTime }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.allLineList = data.data
          this.lineList = data.data
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
