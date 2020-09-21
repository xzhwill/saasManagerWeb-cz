<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form
      enctype="multipart/form-data"
      label-width="120px"
      :model="discount"
      ref="addDiscount"
      label-position="right"
      :rules="formRules">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item prop="discountName" label="折扣名称：" class="common-form-item">
        <el-input v-model="discount.discountName"></el-input>
      </el-form-item>
      <el-form-item label="业务类型：">
        <el-radio-group v-model="discount.businessType" @change="getScheduleList(discount.businessType, cityCode)">
          <el-radio v-for="item in businessTypeList" :label="item.businessId" :key="item.businessId">{{ item.businessName }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="折扣类型：">
        <el-radio-group v-model="discount.discountType" @change="changeDiscountType">
          <el-radio :label="'1'">次票折扣</el-radio>
          <el-radio :label="'2'">月票折扣</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生效月份" class="common-form-item" prop="timeArr1" v-if="discount.discountType == '2'">
        <el-date-picker
          v-model="discount.timeArr1"
          type="monthrange"
          :clearable="clearTime"
          format="yyyy-MM"
          value-format="yyyy-MM"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="生效日期：" class="common-form-item" prop="timeArr" v-if="discount.discountType == '1'">
        <el-date-picker
          v-model="discount.timeArr"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="clearTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="月票折扣：" v-if="discount.discountType == '2'">
        <el-radio-group v-model="discount.monthType" @change="clearMonthType">
          <el-radio label="1">
            <el-input
              @mousewheel.native.prevent
              v-model="discount.monthTicketDiscount"
              style="width:100px;margin:0 10px;"
              :disabled="discount.monthType != '1'"
              @blur="discount.monthTicketDiscount = (+discount.monthTicketDiscount).toFixed(4)"
              type="number"
              placeholder="打多少折"></el-input>折
          </el-radio>
          <el-radio label="2">
            月票总价：
            <el-input
              @mousewheel.native.prevent
              v-model="discount.showMonthTicketAmt"
              style="width:150px;margin:0 10px;"
              type="number"
              maxlength='4'
              :disabled="discount.monthType != '2'"
              placeholder="请输入面值金额"></el-input>元
          </el-radio>
          <el-radio label="3">
            月票单价：
            <el-input
              @mousewheel.native.prevent
              v-model="discount.showMonthTicketOneAmt"
              style="width:150px;margin:0 10px;"
              type="number"
              maxlength='4'
              :disabled="discount.monthType != '3'"
              placeholder="请输入面值金额"></el-input>元
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="showDiscountDetail" label="添加折扣：" class="common-form-item" v-if="discount.discountType === '1'">
        <div>
          <el-button type="primary" @click='addNewGroup'>新增</el-button>
          <div v-for="(item,index) in groupList" :key="index" track-by="index" style="margin-top: 15px;">
            <el-input name="count" v-model='item.count' :value="item.count" style="width:90px" @blur="item.count = (+item.count).toFixed()"></el-input>次
            <el-input name="discount" v-model='item.discount' :value="item.discount" style="width:90px;margin-left:15px;" @blur="item.discount = (+item.discount).toFixed(4)"></el-input>折
            <el-button @click='groupList.splice(index, 1)' style="margin-left:15px;">删除</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="选择班次：" v-if="discount.discountType != 4" style="margin-left: 20px;" inline-message="true">
        <el-input name="className" v-model="className" placeholder="班次名称" style="width:240px; text-align:left" @input="filterClass"></el-input>
        <el-select v-model="cityCode" filterable @change="changeCity" placeholder="通过城市筛选">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
        </el-select>
        <div>
          <el-table header-row-class-name="tableHeader" ref="classLeft " style="margin-top: 20px;width: 331px; float:left" @selection-change="handleSelectionClassLeft" class="page-table-main" :data="classList" height="300" border>
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row[item.name]}}
              </template>
            </el-table-column>
          </el-table>
          <div class="el-transfer__buttons" style=" margin-top:80px;">
            <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleAdd">
              <span> <i class="el-icon-arrow-right"></i></span>
            </button>
            <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleRemove">
              <span> <i class="el-icon-arrow-left"></i></span>
            </button>
          </div>
          <el-table ref="classRight" style="margin-top: 20px;width: 331px; float:right" @selection-change="handleSelectionClassRight" header-row-class-name="tableHeader" class="page-table-main" :data="classRight" height="300" border>
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row[item.name]}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="折扣描述：">
        <el-input v-model="discount.description" placeholder="请输入折扣描述" style="width:300px;" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-radio v-model="discount.state" label="1">启用</el-radio>
        <el-radio v-model="discount.state" label="0">禁用</el-radio>
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
import { addDiscountRules } from '@/utils/rules'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'
import { toFen, Trim } from '@/utils/public'

export default {
  data () {
    return {
      formRules: addDiscountRules, // 必填项判断
      clearTime: false,
      title: '添加折扣',
      cityCode: '', //  城市id
      imageInfo: {
        iconType: '2'
      },
      className: '',
      lineNo: '',
      lineId: '',
      CarpooLine: '',
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
      labelWidth: '120px',
      scheduleList: [], // 班次列表
      newAddText: '',
      nextTodoId: 4,
      discount: {
        discountName: '', // 折扣名称
        businessType: '1', // 业务类型
        discountType: '1', // 折扣类型
        monthTicketAmt: '', // 月票金额
        monthTicketDiscount: '', // 月票折扣
        monthType: '1', // 月票折扣类型
        showDiscountDetail: [], // 次票折扣列表
        description: '', // 描述
        state: '1', // 状态
        showMonthTicketOneAmt: '', // 月票单价
        showMonthTicketAmt: '', // 月票总价
        timeArr: [], // 生效日期
        timeArr1: [], // 生效月份
        classList: [] // 绑定的班次ID
      },
      cityList: [], // 获取的城市列表
      groupList: [],
      allClassList: [], // 初始从后端拿到的所有的线路数据
      classList: [], // 左侧菜单筛选后的总数据（键值对）
      classRight: [], // 右侧菜单中的总数据（键值对）
      classRightAll: [], // 左侧菜单选中的值（键值对）
      classRightVal: [], // 右侧菜单选中的值（键值对）
      idsList: [], // 左侧添加到右侧的ID数组（非键值对）
      classRightSelected: [], // 右侧选中的添加到左侧的ID数组（非键值对）
      uid: this.$route.query.id ? this.$route.query.id : '', // 判断为修改还是添加页面
      businessTypeList: enums.BUSINESSTYPE1 // 业务类型
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.init()
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      (async () => {
        const city = this.getCityList()
        await city
        this.getDiscountInfo() // async call
      })()
    },
    /**
     * 获取城市列表
     */
    getCityList () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
          this.cityList.unshift({ cityName: '全部', cityCode: '' })
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.E('网络异常')
      })
    },
    /**
     * 修改城市列表
     * @param e：获取到的值
     */
    changeCity (e) {
      this.getScheduleList(this.discount.businessType, e)
    },
    /**
     * 获取班次列表
     * @param businessType：业务类型
     * @param cityCode：城市code
     */
    getScheduleList (businessType, cityCode) {
      this.classRight = [] // 切换业务类型，清空班次已选值
      request.apiGet(api.schedule.scheduleList, {
        businessType,
        cityCode: cityCode ? cityCode : '',
        discountType: this.discount.discountType
      }).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.scheduleList = data.data
          this.allClassList = data.data
          this.classList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.E('网络异常')
      })
    },
    /**
     * 切换折扣类型，清空除当前值的值
     */
    clearMonthType () {
      let lis = this.discount
      if (+lis.monthType === 1) {
        lis.showMonthTicketAmt = ''
        lis.showMonthTicketOneAmt = ''
      } else if (+lis.monthType === 2) {
        lis.monthTicketDiscount = ''
        lis.showMonthTicketOneAmt = ''
      } else if (+lis.monthType === 3) {
        lis.monthTicketDiscount = ''
        lis.showMonthTicketAmt = ''
      }
    },
    /**
     * 切换折扣类型
     */
    changeDiscountType () {
      if (this.discount.discountType === '2') this.$set(this.discount, 'monthType', '1')
      this.cityCode = ''
      this.getScheduleList(this.discount.businessType, '')
    },
    /**
     * 前端模糊匹配（班次）
     */
    filterClass () {
      this.classList = this.allClassList.filter((item) => {
        return item.className.indexOf(this.className) > -1
      })
    },
    /**
     * 初始化调用接口判断当前页面未修改还是添加页面
     */
    getDiscountInfo () {
      this.addNewGroup()
      if (this.uid) {
        this.title = '修改折扣信息'
        request.apiGet(api.discount.info, { discountId: this.uid }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.discount.state = res.state + ''
            this.discount.description = res.description
            this.discount.discountName = res.discountName
            this.discount.businessType = res.businessType
            this.discount.monthType = res.monthType + ''
            this.discount.discountType = res.discountType
            this.getScheduleList(res.businessType)
            this.classRight = res.discountClassInfos // 班次回显
            // /* 是否为次票折扣 */
            // if (res.discountType == 'orderReportForms') { // 次票折扣
            //   this.discount['showDiscountDetail'] = []
            //   this.discount['showDiscountDetail'].push(JSON.parse(res.daysDiscount))
            // }
            // this.$set(this.discount, 'showMonthTicketOneAmt', this.discount.monthTicketOneAmtYuan)
            // this.$set(this.discount, 'showMonthTicketAmt', this.discount.monthTicketAmtYuan)
            // this.discount.startTime = this.timeArr
            // 是否为次票折扣
            this.discount.showDiscountDetail = []
            if (+res.discountType === 1) {
              let arrList = JSON.parse(res.daysDiscount)
              this.discount.showDiscountDetail = arrList
              this.groupList = arrList
              this.discount.timeArr = [res.effectiveDate, res.expiryDate]
            } else {
              if (+res.monthType === 1) {
                this.discount.monthTicketDiscount = res.monthDiscount
              } else if (+res.monthType === 2) {
                this.discount.showMonthTicketAmt = (res.monthDiscount / 100).toFixed(2)
              } else if (+res.monthType === 3) {
                this.discount.showMonthTicketOneAmt = (res.monthDiscount / 100).toFixed(2)
              }
              this.discount.timeArr1 = [res.effectiveDate, res.expiryDate] // 有效月份
            }
          }
        })
      } else { // 添加页面
        this.getScheduleList(this.discount.businessType)
      }
    },
    /**
     * 点击新增折扣
     */
    addNewGroup () {
      this.groupList = this.discount.showDiscountDetail
      this.groupList.push({ count: '', discount: '' })
      this.discount.showDiscountDetail = this.groupList
    },
    handleSelectionClassLeft (checkedArr) { // 班次 从左边勾选数据
      this.classRightAll = checkedArr
      this.idsList = []
      checkedArr.forEach((item) => {
        this.idsList.push(item.scheduleId)
      })
    },
    handleSelectionClassRight (checkedArr) { // 班次 从右边勾选数据
      this.classRightVal = checkedArr
      this.classRightSelected = []
      checkedArr.forEach((item) => {
        this.classRightSelected.push(item.scheduleId)
      })
    },
    handleAdd () { // 往右侧增加数据 对右边进行去重
      this.classRightAll.forEach(item => { // 将左侧选中的值添加到右侧
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
      this.listDuplicateRemoval(this.classList, this.idsList)
    },
    handleRemove () {
      this.classRightVal.forEach(item => { // 将右侧选中的值添加到左侧
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
      this.listDuplicateRemoval(this.classRight, this.classRightSelected)
    },
    save () {
      this.$refs.addDiscount.validate(valid => {
        if (valid) {
          let flag = true
          if (+this.discount.discountType === 1) { //  次票
            if (!this.discount.showDiscountDetail.length) return help.W('请添加折扣')
            this.discount.showDiscountDetail.forEach((item, index) => {
              item.discount = Trim(item.discount)
              item.count = Trim(item.count)
              if (!item.count || !item.discount) {
                flag = false
                return help.W('添加折扣时，"次数"和"折扣"不能为空')
              } else {
                if (item.count <= 0 || item.count > 20) {
                  flag = false
                  return help.E('折扣次数为1~20内的正整数，请重新输入')
                } else if (item.discount < 0 || item.discount > 10) {
                  flag = false
                  return help.E('折扣值在0-10以内，请重新输入')
                }
              }
            })
          } else if (+this.discount.discountType === 2) { //  月票
            if (+this.discount.monthType === 1 && !this.discount.monthTicketDiscount) return help.W('请输入月票折扣')
            if (+this.discount.monthType === 2 && !this.discount.showMonthTicketAmt) return help.W('请输入月票总价')
            if (+this.discount.monthType === 3 && !this.discount.showMonthTicketOneAmt) return help.W('请输入月票单价')
          }
          if (!this.classRight.length) return help.W('请选择班次')
          if (flag) this.postData()
        }
      })
    },
    postData () {
      this.discount.classList = []
      this.classRight.forEach((item, index) => {
        this.discount.classList.push(item.scheduleId)
      })
      let params = this.discount
      if (+params.discountType === 1) { // 次票
        params.effectiveDate = this.discount.timeArr[0]
        params.expiryDate = this.discount.timeArr[1]
      } else if (+params.discountType === 2) { // 月票
        params.effectiveDate = this.discount.timeArr1[0]
        params.expiryDate = this.discount.timeArr1[1]
      }
      if (+params.discountType === 1) { // 次票
        delete params.monthTicketDiscount
        delete params.monthTicketAmt
        delete params.monthTicketOneAmt
        delete params.monthType
        this.discount.showDiscountDetail.forEach(item => {
          params.daysDiscount += JSON.stringify(item)
        })
      } else if (+params.discountType === 2) { // 月票
        delete params.showDiscountDetail
        if (+params.monthType === 2) {
          params.monthTicketAmt = toFen(params.showMonthTicketAmt)
        } else if (+params.monthType === 3) {
          params.monthTicketOneAmt = toFen(params.showMonthTicketOneAmt)
        }
      }
      if (this.uid) params.id = this.uid
      request.apiPost(this.uid ? api.discount.update : api.discount.create, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('discountFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.E('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('discountFlag', 'true')
      this.$router.back()
    },
    listDuplicateRemoval (lis, li) { // 将左边选中的值添加到右侧后，对左侧进行去重操作
      lis.filter((item, index) => {
        if (li.indexOf(item.scheduleId) > -1) {
          lis.splice(index, 1)
          this.listDuplicateRemoval(lis, li)
        }
        return lis
      })
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
.el-table th,
.el-table .tableHeader {
  background-color: #e5e5e5;
  color: #333;
  text-align: center;
  font-size: 14px;
}
</style>
