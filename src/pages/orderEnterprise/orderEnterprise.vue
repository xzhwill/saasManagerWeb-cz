<template>
  <div class="common-container">
    <!--<div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="exportOrder" :disabled="!+page.total">导出</el-button>
      </div>
    </div>-->
    <div class="page-nav-btn fl">
      <el-button type="primary" @click="exportOrder()" :disabled="!+page.total">导出</el-button>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe :fit="true">
          <el-table-column width="110px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span style="color: red;" v-if="scope.row.payState === 1 ">未支付</span>
                <span
                  class="action-btn blue"
                  @click="showDialog(scope.row)"
                  v-if="scope.row.payState === 2 && (+scope.row.isTicketToRide !== 1) && (scope.row.payAmtYuan >= scope.row.refundAmtYuan)">行程退款</span>
                <span style="color: red;" v-if="+scope.row.payState === 4 || +scope.row.payState === 5">后台已退款</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="140px"
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'payState'">
                <span v-if="+scope.row.payState === 1">待支付</span>
                <span v-if="+scope.row.payState === 2">支付成功</span>
                <span v-if="+scope.row.payState === 3">用户退款成功</span>
                <span v-if="+scope.row.payState === 4">后台退款</span>
                <span v-if="+scope.row.payState === 5">后台退款成功</span>
              </span>
              <span v-else-if="item.name === 'orderState'">
								<span v-if="+scope.row.orderState === 1">待支付</span>
                <span v-if="+scope.row.orderState === 2">已支付</span>
                <span v-if="+scope.row.orderState === 3">手动取消</span>
                <span v-if="+scope.row.orderState === 4">自动取消</span>
							</span>
              <span v-else-if="item.name === 'payChannel'">
								<span v-if="scope.row.payChannel === '0'">自主账户</span>
                <span v-if="+scope.row.payChannel === 1">支付宝</span>
                <span v-if="+scope.row.payChannel === 2">微信</span>
                <span v-if="+scope.row.payChannel === 3">金码账户</span>
                <span v-if="+scope.row.payChannel === 9">企业支付</span>
                <span v-else></span>
							</span>
              <span v-else-if="item.name=='classType'">
								<span v-if="scope.row['classType'] == 1">早班</span>
								<span v-if="scope.row['classType'] == 2">晚班</span>
							</span>
              <span v-else-if="item.name=='ticketType'">
								<span v-if="scope.row['ticketType'] == 1">次票</span>
								<span v-if="scope.row['ticketType'] == 2">月票</span>
								<span v-if="scope.row['ticketType'] == 3">多次票</span>
							</span>
              <!--<span v-else-if="item.name=='businessType'">
								<span v-if="scope.row['businessType'] == 1">定制公交</span>
								<span v-if="scope.row['businessType'] == 2">出行专线</span>
							</span>-->
              <span v-else-if="item.name=='orderSource'">
								<span v-if="scope.row['orderSource'] == 1">android</span>
								<span v-if="scope.row['orderSource'] == 2">ios端</span>
								<span v-if="scope.row['orderSource'] == 3">微信小程序</span>
								<span v-if="scope.row['orderSource'] == 4">支付宝小程序</span>
							</span>
              <span v-else-if="item.name === 'isTicketToRide'">{{ scope.row[item.name] == 1 ? '不购票乘车' : '购票乘车' }}</span>
              <span v-else-if="item.name == 'businessType'" >
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{ val.businessName }}</span>
              </span>
              <span
                class="action-btn blue"
                @click="enterRegularTravel(scope.row)"
                v-else-if="item.name === 'orderId'"
                >{{ scope.row[item.name] }}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            background
            :current-page="page.pageNum"
            layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :page-sizes="page.pageSizes"
            :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- <el-dialog title="退款操作" :visible.sync="dialogTableVisible" :append-to-body='isOk' width="30%">
      <el-form :rules="refundOrderRules" v-model="refundOrder" label-position="right" label-width="120px" ref="orderRefund">
        <el-form-item label="用户支付金额：">
          <el-input v-model="refundOrder.payAmtYuan" disabled style="width: 200px;margin-right: 10px"></el-input>元
        </el-form-item>
        <el-form-item label="已退金额：">
          <el-input v-model="refundOrder.refundAmtYuan" disabled style="width: 200px;margin-right: 10px"></el-input>元
        </el-form-item>
        <el-form-item label="本次退款：">
          <el-input v-model="refundOrder.willWaitRefundAmt" type="number" style="width: 200px;margin-right: 10px"></el-input>元
        </el-form-item>
        <el-form-item label="退款原因：">
          <el-input v-model="refundOrder.cancelRemark" style="width: 200px;margin-right: 10px"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="refundSchedule">确定退款</el-button>
        <el-button type="danger" @click="cancelRefund">取消</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="行程退款" :visible.sync="dialogTableVisible" :append-to-body='isOk'>
      <el-table ref="scheduleList" tooltip-effect="dark" :data="scheduleList" height="250" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="checkSelectable" width="55"></el-table-column>
        <el-table-column property="rideDate" label="乘车日期" width="170"></el-table-column>
        <el-table-column property="phone" label="手机号" width="170"></el-table-column>
        <el-table-column property="scheduleId" label="班次号" width="170"></el-table-column>
        <el-table-column property="userId" label="用户号" width="170"></el-table-column>
        <el-table-column property="orderId" label="订单号" width="200"></el-table-column>
        <el-table-column property="stateName" label="状态" width="100"></el-table-column>
      </el-table>
      <div>
        <el-button type="primary" @click="refundSchedule()">行程退款</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { orderEnterpriseManageHeadSearch, orderEnterpriseManageTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'order',
  props: {
    searchData: {
      type: Array,
      required: true
    },
    tableHeaderCheckList: {
      type: Array,
      required: true
    },
    tableHeader: {
      type: Array,
      required: true
    }
  },
  data () {
    const isZero = (rule, value, callback) => {
      if (value != null && value != '') {
        if (value <= 0) {
          callback(new Error('必须大于0~'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      refundOrder: {
        payAmtYuan: '',
        payAmt: '',
        orderId: '',
        refundAmtYuan: '',
        refundAmt: '',
        willWaitRefundAmt: 0,
        willWaitRefundAmtFen: '',
        cancelRemark: ''
      },
      formModules: orderEnterpriseManageHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      dialogTableVisible: false,
      isOk: true,
      refundOrderRules: {
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
      businessTypeList: enums.BUSINESSTYPE1, // 业务类型
      options: [],
      scheduleList: []
    }
  },
  mounted () {
    // let thisDay = getYearMonthDayTime()
    // orderEnterpriseManageHeadSearch[1].data = [thisDay.dayStr, thisDay.dayStr]
    this.$parent.doClearObj()
    this.rmList = setOperation('orderEnterprise')
    this.$emit('getInfo', orderEnterpriseManageHeadSearch)
    // orderEnterpriseManageTableHead.splice(2, 0, {
    //   label: '供给侧',
    //   name: 'demandName'
    // })
    this.$emit('getTable', orderEnterpriseManageTableHead)
    this.$emit('getPage', this.page)
    // this.getCompanyList()
    this.getTableData()
  },
  methods: {
    /**
     * 点击行程退款弹出弹窗
     * @param val
     */
    showDialog (val) {
      this.dialogTableVisible = true
      this.orderId = val.orderId
      this.custId = val.custId
      this.getScheduleList(val.orderId)
    },
    /**
     * 点击订单编号跳转进入行程页面
     * @param val
     */
    enterRegularTravel (val) {
      this.$router.push({
        path: './regularTravel',
        query: { orderId: val.orderId }
      })
    },
    /**
     * 获取订单退款列表数据
     * @param e
     */
    getScheduleList (e) {
      net.apiGet(api.customerServiceManage.travelList, {
        orderId: e
      }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.scheduleList = data.data.list
        } else {
          help.E(data.msg)
        }
      })
      this.dialogTableVisible = true
    },
    /**
     * 获取渠道列表
     */
    getCompanyList () {
      net.apiGet(api.channel.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          let list = data.data
          for (var i = 0; i < list.length; i++) {
            this.options[i] = { label: list[i].channelName, value: list[i].channelId }
          }
          orderEnterpriseManageHeadSearch[(orderEnterpriseManageHeadSearch.length - 1)].option = this.options
        } else {
          help.E(data.msg)
        }
      })
    },
    // checkKeydown (e, value) {
    //   this.checkValue = value
    // },
    /**
     * 取消退款操作
     */
    // cancelRefund () {
    //   this.dialogTableVisible = false
    // },
    /**
     * 点击复选框，放置已选数据
     * @param val
     */
    handleSelectionChange (val) {
      this.checkScheduleList = val
    },
    /**
     * 点击复选框
     * @param row
     * @returns {boolean}
     */
    checkSelectable (row) {
      return +row.state !== 4 || !+row.state
    },
    /**
     * 改变每页数据条数
     * @param pageSize
     */
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    /**
     * 分页
     * @param pageNum
     */
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    /**
     * 获取列表数据接口
     * @param params
     */
    getTableData (params) {
      if (params) params.pageSize = this.page.pageSize
      net.apiGet(api.enterprise.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 点击弹窗行程退款的退款按钮，进行二次确认
     * @param e
     */
    refundSchedule (e) {
      if (!this.checkScheduleList || !this.checkScheduleList.length) return help.W('请先选择行程')
      var travelIds = []
      this.$confirm('此操作将取消选中行程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogTableVisible = false
        this.checkScheduleList.forEach((item) => {
          if (item.id) travelIds.push(parseInt(item.id))
        })
        this.updateOrder(travelIds)
        // this.getTableData(this.searchData)
      }).catch(() => {})
    },
    /**
     * 后台退款接口请求
     * @param e
     */
    updateOrder (e) {
      net.apiPost(api.commuteOrder.refund, {
        travelIds: e,
        orderId: this.orderId,
        refundType: 2,
        refundReasonType: 99,
        refundReasonExplain: '后台退款',
        custId: this.custId,
        businessType: 5
      }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          help.S('退款成功')
          this.getTableData(this.searchData)
          this.dialogTableVisible = false
          clearObj(this.refundOrder)
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 导出
     */
    exportOrder () {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) { } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.enterprise.regularExport + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  }
}
</script>

<style lang="less" type="text/less">
@import '../../assets/style/set.less';
.el-table th,
.el-table .tableHeader {
  text-align: center;
  font-size: 14px;
}
.detail-btn {
  color: #409eff;
  cursor: pointer;
}
.disabled {
  color: lightgray;
}
</style>
