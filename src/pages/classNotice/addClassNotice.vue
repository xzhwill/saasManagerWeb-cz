<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form label-width="120px" ref="classForm" :model="classForm">
      <div class="form-section" style="margin-bottom: 20px;width:100%;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="配置类型：">
          <el-select v-model="classForm.noticeType" style="width:202px" @change="changeType">
            <el-option label="班次公告" value="1"></el-option>
            <!--<el-option label="乘车日历页折扣描述" :value="parseInt(travelReportForms)"></el-option>
            <el-option label="购票公告" :value="parseInt(payReportForms)"></el-option>
            <el-option label="发车提醒公告" :value="parseInt(4)"></el-option>-->
            <el-option label="线路公告" value="5"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="业务类型：">
        <el-radio-group v-model="classForm.businessType" @change="changeBusiness">
          <el-radio :label="item.businessId" v-for="item in businessTypeList" :key="item.businessId">{{item.businessName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公告内容：" class="common-form-item">
        <el-input v-model="classForm.noticeContent" :maxLength="100"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio v-model="classForm.state" label="1">启用</el-radio>
        <el-radio v-model="classForm.state" label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label="有效期：" class="common-form-item">
        <el-date-picker
          v-model="timeArr"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable= "false"
          :picker-options="pickerOptions1"
          range-separator="至"
          @change="changeTime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="选择班次：" inline-message="true" v-if="classForm.noticeType  == 1">
        <el-input name="className" v-model="className" placeholder="班次名称" style="width:240px; text-align:left" @input="filterClass"></el-input>
        <div>
          <el-table
            border
            ref="classLeft "
            style="margin-top: 20px;width: 241px; float:left"
            @selection-change="handleSelectionClassLeft"
            header-row-class-name="tableHeader"
            class="page-table-main"
            :data="classList"
            height="300">
            <el-table-column type="selection"  width="40"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              v-for="(item, index) in tableHeader"
              :key="index"
              :label="item.label"
              align="center"
              :prop="item.name">
              <template slot-scope="scope">{{scope.row[item.name]}}</template>
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
          <el-table
            border
            ref="classRight"
            style="margin-top: 20px;width: 241px; float:right"
            @selection-change="handleSelectionClassRight"
            header-row-class-name="tableHeader"
            class="page-table-main"
            :data="classRight"
            height="300">
            <el-table-column type="selection"  width="40"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name"  show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row[item.name]}}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="选择线路：" v-if="classForm.noticeType  == 5" style="margin-left: 20px;" inline-message="true">
        <el-input name="lineNo" v-model="lineNo" placeholder="线路号" style="width:240px; text-align:left" @input="filterLine"></el-input>
        <div>
          <el-table ref="lineLeft" style="margin-top: 20px;width: 241px; float:left"  @selection-change="handleSelectionLineLeft" header-row-class-name="tableHeaderLine" class="page-table-main" :data="lineList" height="300" border>
            <el-table-column type="selection"  width="40"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeaderLine" :key="index" :label="item.label" align="center" :prop="item.name"  show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row[item.name]}}</template>
            </el-table-column>
          </el-table>
          <div class="el-transfer__buttons" style=" margin-top:80px;">
              <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleAdd(2)">
                <span> <i class="el-icon-arrow-right"></i></span>
            </button>
            <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleRemove(2)">
                <span> <i class="el-icon-arrow-left"></i></span>
            </button>
          </div>
          <el-table ref="lineRight" style="margin-top: 20px;width: 241px; float:right"  @selection-change="handleSelectionLineRight" header-row-class-name="tableHeaderLine" class="page-table-main" :data="rowLineRight" height="300" border>
            <el-table-column type="selection"  width="80"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeaderLine" :key="index" :label="item.label" align="center" :prop="item.name"  show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row[item.name]}}</template>
            </el-table-column>
          </el-table>
         </div>
      </el-form-item>
       <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import request from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加公告',
      channelList: [], // 默认获取所有渠道列表
      businessTypeList: enums.BUSINESSTYPE1,
      className: '',
      lineNo: '',
      checkedRow: [],
      checkedRowLine: [],
      tableHeader: [
        {
          label: '班次号',
          name: 'scheduleId'
        }, {
          label: '班次名称',
          name: 'className',
          fit: true
        }
      ],
      tableHeaderLine: [
        {
          label: '线路ID',
          name: 'lineId'
        }, {
          label: '线路名称',
          name: 'lineName',
          fit: true
        }
      ],
      labelWidth: '120px',
      classForm: {
        businessType: '1',
        effectiveTime: '', // 有效期开始时间
        expiryTime: '', // 有效期结束时间
        noticeContent: '', // 公告内容
        scheduleIds: [], // 线路列表
        noticeType: '1', // 配置类型:1-班次；5-线路；
        state: '1' // 状态
      },
      compList: [],
      allClassList: [], // 初始从后端拿到的所有的班次数据
      classList: [], // 左侧菜单筛选后的总数据（班次键值对）
      classRight: [], // 右侧菜单中的总数据（班次键值对）
      classRightAll: [], // 左侧菜单选中的值（班次键值对）
      classRightVal: [], // 右侧菜单选中的值（班次键值对）
      idsList1: [], // 左侧添加到右侧的ID数组（班次非键值对）
      classRightSelected: [], // 右侧选中的添加到左侧的ID数组（班次非键值对）
      allLineList: [], // 初始从后端拿到的所有的线路数据
      lineList: [], // 左侧菜单筛选后的总数据（线路键值对）
      rowLineRight: [], // 右侧菜单中的总数据（线路键值对）
      rowLineRightAll: [], // 左侧菜单选中的值（线路键值对）
      lineRightVal: [], // 右侧菜单选中的值（线路键值对）
      idsList2: [], // 左侧添加到右侧的ID数组（线路非键值对）
      rowLineRightSelected: [], // 右侧选中的添加到左侧的ID数组（线路非键值对）
      timeArr: [], // 有效期
      pickerOptions1: { // 日期选择范围
        disabledDate (time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now()
        }
      },
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.init()
  },
  methods: {
    /**
     * 初始化数据
     */
    init () {
      (async () => {
        // const channel = this.getAllChannelList()
        // const clas = this.getClassList()
        // const line = this.getLineList()
        // await channel;
        // await clas;
        // await line;
        this.getClassNoticeInfo() // async call
      })()
    },
    /**
     * 改变配置类型时，公告名称与公告内容的变化
     * @param val：类型值
     */
    changeType (val) {
      this.classForm.noticeContent = ''
      let data = {
        noticeType: val,
        businessType: this.classForm.businessType,
        effectiveTime: this.classForm.effectiveTime,
        expiryTime: this.classForm.expiryTime
      }
      val === '1' ? this.getClassList(data) : this.getLineList(data)
    },
    /**
     * 修改业务类型
     * @param val：类型值
     */
    changeBusiness (val) {
      let data = {
        noticeType: this.classForm.noticeType,
        businessType: val,
        effectiveTime: this.classForm.effectiveTime,
        expiryTime: this.classForm.expiryTime
      }
      if (this.classForm.noticeType === '1') { // 1：班次
        this.getClassList(data)
        this.classRight = [] // 切换业务类型，清空班次已选值
      } else { // 5：线路
        this.getLineList(data)
        this.rowLineRight = [] // 切换业务类型，清空班次已选值
      }
    },
    // getAllChannelList () { // 获取所有的渠道列表
    //   request.apiGet(api.channel.option).then(data => {
    //     if (data.msg && data.msg.code === enums.NET_SUCCESS) {
    //       this.channelList = data.data.list
    //     } else {
    //       help.E(data.msg.message)
    //     }
    //   })
    // },
    /**
     * 前端搜索班次内容
     */
    filterClass () {
      this.classList = this.allClassList.filter(item => {
        return item.className.indexOf(this.className) > -1
      })
      this.$refs.filterClass.clearSelection()
      this.showCheckedRow()
    },
    /**
     * 前端搜索线路内容
     */
    filterLine () {
      this.lineList = this.allLineList.filter((item) => {
        return item.lineNo.indexOf(this.lineNo) > -1
      })
    },
    /**
     * 判断修改、添加页面，获取对应的内容
     */
    getClassNoticeInfo () {
      if (this.uid) {
        this.title = '修改公告'
        request.apiGet(api.classNotice.info, { classNoticeId: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.classForm = data.data
            this.timeArr.push(this.classForm.effectiveTime)
            this.timeArr.push(this.classForm.expiryTime)
            let datas = {
              noticeType: this.classForm.noticeType,
              businessType: this.classForm.businessType,
              effectiveTime: this.classForm.effectiveTime,
              expiryTime: this.classForm.expiryTime
            }
            if (this.classForm.noticeType !== '5') { /// 班次
              this.getClassList(datas)
              this.classRight = this.classForm.noticeClassInfos
            } else {
              this.getLineList(datas)
              this.rowLineRight = this.classForm.noticeLineInfos
            }
          } else {
            help.E(data.msg)
          }
        })
      } else {
        this.getClassList({
          noticeType: this.classForm.noticeType,
          businessType: this.classForm.businessType,
          effectiveTime: this.classForm.effectiveTime,
          expiryTime: this.classForm.expiryTime
        })
      }
    },
    /**
     * 获取班次列表
     */
    getClassList (params) {
      request.apiGet(api.schedule.shiftsList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.allClassList = data.data
          this.classList = data.data
        }
      })
    },
    /**
     * 获取线路列表
     */
    getLineList (params) {
      request.apiGet(api.line.lineList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.allLineList = data.data
          this.lineList = data.data
        }
      })
    },
    /**
     * 将左侧选中的值添加到右侧列表（班次）
     * @param checkedArr：选中的值
     */
    handleSelectionClassLeft (checkedArr) {
      this.classRightAll = checkedArr
      this.idsList1 = []
      checkedArr.forEach((item) => {
        this.idsList1.push(item.scheduleId)
      })
    },
    /**
     * 将右侧选中的值添加到左侧列表（班次）
     * @param checkedArr：选中的值
     */
    handleSelectionClassRight (checkedArr) {
      this.classRightVal = checkedArr
      this.classRightSelected = []
      checkedArr.forEach((item) => {
        this.classRightSelected.push(item.scheduleId)
      })
    },
    /**
     * 将左侧选中的值添加到右侧列表（线路）
     * @param checkedArr：选中的值
     */
    handleSelectionLineLeft (checkedArr) {
      this.rowLineRightAll = checkedArr
      this.idsList2 = []
      checkedArr.forEach((item) => {
        this.idsList2.push(item.lineId)
      })
    },
    /**
     * 将右侧选中的值添加到左侧列表（线路）
     * @param checkedArr：选中的值
     */
    handleSelectionLineRight (checkedArr) {
      this.lineRightVal = checkedArr
      this.rowLineRightSelected = []
      checkedArr.forEach((item) => {
        this.rowLineRightSelected.push(item.lineId)
      })
    },
    handleAdd (type) { // 往右侧增加数据 对右边进行去重
      // if (this.rowLineRight === null || !this.rowLineRight.length) this.rowLineRight = []
      if (type == 2) {
        this.rowLineRightAll.forEach(item => { // 将左侧选中的值添加到右侧（线路）
          this.rowLineRight.unshift(item)
        })
        // this.rowLineRight.concat(this.rowLineRightAll)
        let hash = {}
        this.rowLineRight = this.rowLineRight.reduce((item, next) => {
          if (!hash[next.lineId]) {
            hash[next.lineId] = true
            item.push(next)
          }
          return item
        }, [])
        this.listDuplicateRemoval(this.lineList, this.idsList2, 2)
      } else {
        this.classRightAll.forEach(item => { // 将左侧选中的值添加到右侧（班次）
          this.classRight.unshift(item)
        })
        // this.classRight = this.classRight.concat(this.classRightAll)
        let hash = {}
        this.classRight = this.classRight.reduce((item, next) => {
          if (!hash[next.scheduleId]) {
            hash[next.scheduleId] = true
            item.push(next)
          }
          return item
        }, [])
        this.listDuplicateRemoval(this.classList, this.idsList1, 1)
      }
    },
    handleRemove (type) {
      if (type == 2) {
        this.lineRightVal.forEach(item => { // 将右侧选中的值添加到左侧（线路）
          this.lineList.unshift(item)
        })
        let hash = {}
        this.lineList = this.lineList.reduce((item, next) => {
          if (!hash[next.lineId]) {
            hash[next.lineId] = true
            item.push(next)
          }
          return item
        }, [])
        this.listDuplicateRemoval(this.rowLineRight, this.rowLineRightSelected, 2)
      } else {
        this.classRightVal.forEach(item => { // 将右侧选中的值添加到左侧（班次）
          this.classList.unshift(item)
        })
        let hash = {}
        this.classList = this.classList.reduce((item, next) => {
          if (!hash[next.scheduleId]) {
            hash[next.scheduleId] = true
            item.push(next)
          }
          return item
        }, [])
        this.listDuplicateRemoval(this.classRight, this.classRightSelected, 1)
        // this.classRight = this.classRight.filter(item => {
        //   return this.classRightSelected.every(data => data !== item.scheduleId)
        // })
      }
    },
    save () {
      // 班次ID填入
      this.classForm.scheduleIds = []
      if (+this.classForm.noticeType === 5) {
        if (this.rowLineRight && this.rowLineRight.length) {
          this.rowLineRight.forEach((item) => {
            this.classForm.scheduleIds.push(item.lineId)
          })
        }
      } else {
        if (this.classRight && this.classRight.length) {
          this.classRight.forEach((item) => {
            this.classForm.scheduleIds.push(item.scheduleId)
          })
        }
      }
      if (!this.classForm.noticeContent) {
        return help.W('请输入公告内容')
      }
      if (!this.timeArr.length) {
        return help.W('请选择有效期')
      } else {
        this.classForm.effectiveTime = this.timeArr[0]
        this.classForm.expiryTime = this.timeArr[1]
      }
      if (this.classForm.scheduleIds && !this.classForm.scheduleIds.length) {
        return help.W('请选择班次')
      }
      this.postClassData()
    },
    postClassData () {
      request.apiPost(this.uid ? api.classNotice.update : api.classNotice.create, this.classForm).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('classNoticeFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('classNoticeFlag', 'true')
      this.$router.back()
    },
    listDuplicateRemoval (lis, li, type) { // 将左边选中的值添加到右侧后，对左侧进行去重操作（班次）
      if (type === 1) { // 班次
        lis.filter((item, index) => {
          if (li.indexOf(item.scheduleId) > -1) {
            lis.splice(index, 1)
            this.listDuplicateRemoval(lis, li, type)
          }
          return lis
        })
      } else { // 线路
        lis.filter((item, index) => {
          if (li.indexOf(item.lineId) > -1) {
            lis.splice(index, 1)
            this.listDuplicateRemoval(lis, li, type)
          }
          return lis
        })
      }
    },
    changeTime (val) { // 改变时间
      let data = {
        noticeType: this.classForm.noticeType,
        businessType: this.classForm.businessType,
        effectiveTime: val[0],
        expiryTime: val[1]
      }
      this.classForm.noticeType === '1' ? this.getClassList(data) : this.getLineList(data)
    }
  }
}
</script>

<style>
@import "../../assets/style/common.css";
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
