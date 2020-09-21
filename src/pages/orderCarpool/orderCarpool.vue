<template>
  <div class="common-container">
    <!--<div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="exportOrder" :disabled="!+page.total">导出</el-button>
      </div>
    </div>-->
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column min-width="80px" align="center" label="操作" v-if="rmList.indexOf(operateInfo.refund.operationId) > -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span style="color: red;" v-if="+scope.row.payState === 1 ">未支付</span>
                <span
                  class="action-btn blue"
                  @click="showDialog(scope.row)"
                  v-if="(scope.row.payState === 2 || scope.row.payState === 3) && (scope.row.payAmtYuan >= scope.row.refundAmtYuan)">退款</span>
                <span style="color: red;" v-if="scope.row.payState == 4 || scope.row.payState == 5">后台已退款</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
							<span v-if="item.name=='payState'">
								<span v-if="scope.row['payState'] == 1">等待支付</span>
								<span v-if="scope.row['payState'] == 2">支付成功</span>
								<span v-if="scope.row['payState'] == 3">用户退款成功</span>
								<span v-if="scope.row['payState'] == 4">后台退款 </span>
								<span v-if="scope.row['payState'] == 5">后台退款成功</span>
							</span>
              <span v-if="item.name=='orderState'">
								<span v-if="scope.row['orderState'] == 1">待支付</span>
								<span v-if="scope.row['orderState'] == 2">已支付</span>
								<span v-if="scope.row['orderState'] == 3">手动取消</span>
								<span v-if="scope.row['orderState'] == 4">自动取消</span>
							</span>
              <span v-if="item.name=='tranState'">
								<span v-if="scope.row['tranState'] == 1">未调营销平台</span>
								<span v-if="scope.row['tranState'] == 2">已调营销平台，未回调</span>
								<span v-if="scope.row['tranState'] == 3">已调营销平台，已回调</span>
								<span v-if="scope.row['tranState'] == 4">未调支付网关</span>
								<span v-if="scope.row['tranState'] == 5">已调支付网关，未回调</span>
								<span v-if="scope.row['tranState'] == 6">已调支付网关，已回调扣款成功</span>
								<span v-if="scope.row['tranState'] == 7">已调支付网关，已回调扣款失败</span>
							</span>
              <span v-if="item.name=='payChannelId'">
								<span v-if="scope.row['payChannelId'] == 1">支付宝</span>
								<span v-if="scope.row['payChannelId'] == 2">微信</span>
							</span>
              <span v-if="item.name=='classType'">
								<span v-if="scope.row['classType'] == 1">早班</span>
								<span v-if="scope.row['classType'] == 2">晚班</span>
							</span>
              <span v-if="item.name=='ticketType'">
								<span v-if="scope.row['ticketType'] == 1">次票</span>
								<span v-if="scope.row['ticketType'] == 2">月票</span>
								<span v-if="scope.row['ticketType'] == 3">多次票</span>
							</span>
              <span v-if="item.name=='businessType'">
								<span v-if="scope.row['businessType'] == 1">定制公交</span>
								<span v-if="scope.row['businessType'] == 2">出行专线</span>
							</span>
              <span v-if="item.name=='orderSource'">
								<span v-if="scope.row['orderSource'] == 1">android</span>
								<span v-if="scope.row['orderSource'] == 2">ios端</span>
								<span v-if="scope.row['orderSource'] == 3">微信小程序</span>
								<span v-if="scope.row['orderSource'] == 4">支付宝小程序</span>
							</span>
              <span v-if="item.name !='payState' && item.name != 'orderState' && item.name!='orderSource'
                  && item.name != 'payChannelId'&& item.name !='ticketType' && item.name !='classType' && item.name!='businessType'">{{scope.row[item.name]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination :current-page="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
                         @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange" :page-sizes="page.pageSizes"
                         :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="退款操作" :visible.sync="dialogTableVisible" :append-to-body='isOk' width="30%">
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
        <el-button type="primary" @click="updateOrder">确定退款</el-button>
        <el-button type="danger" @click="cancelRefund">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { orderManageHeadSearch, orderManageTableHead } from '@/utils/data'
import { clearObj, setOperation, getYearMonthDayTime } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'
import { toFen } from '../../utils/public'

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
      formModules: orderManageHeadSearch,
      // tableHeader: orderManageTableHead,
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
      options: []
    }
  },
  mounted () {
    // let thisDay = getYearMonthDayTime()
    // orderManageHeadSearch[1].data = [thisDay.dayStr, thisDay.dayStr]
    this.rmList = setOperation('orderCarpool')
    this.$emit('getInfo', orderManageHeadSearch)
    this.$emit('getTable', orderManageTableHead)
    this.$emit('getPage', this.page)
    // let thisDay = getYearMonthDayTime()
    // orderManageHeadSearch[orderReportForms].data = [thisDay.dayStr, thisDay.dayStr]
    // // this.searchData['startTime'] = thisDay.dayStr + '' + ' 00:00:00'
    // // this.searchData['endTime'] = thisDay.dayStr + '' + ' 23:59:59'
    // this.$emit('getInfo', orderManageHeadSearch)
    this.getCompanyList()
    this.getTableData()
  },
  methods: {
    showDialog (val) {
      this.dialogTableVisible = true
      this.refundOrder.orderId = val.orderId
      this.refundOrder.payAmtYuan = val.payAmtYuan /* 总金额 */
      this.refundOrder.refundAmtYuan = val.refundAmtYuan /* 已退金额 */
      this.refundOrder.payAmt = val.payAmt /* 总金额 */
      this.refundOrder.refundAmt = val.refundAmt /* 已退金额 */
      this.refundOrder.cancelRemark = val.cancelRemark
    },
    getCompanyList () {
      net.apiGet(api.channel.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          let list = data.data
          for (var i = 0; i < list.length; i++) {
            this.options[i] = { label: list[i].channelName, value: list[i].channelId }
          }
          orderManageHeadSearch[(orderManageHeadSearch.length - 1)].option = this.options
        } else {
          help.E(data.msg)
        }
      })
    },
    checkKeydown (e, value) {
      this.checkValue = value
    },
    cancelRefund () {
      this.dialogTableVisible = false
    },
    handleSelectionChange (val) {
      this.checkScheduleList = val
    },
    checkSelectable (row) {
      return row.state == 1
    },
    updateOrder (e) {
      this.refundOrder.willWaitRefundAmtFen = toFen(this.refundOrder.willWaitRefundAmt)
      if ((this.refundOrder.willWaitRefundAmtFen + this.refundOrder.refundAmt) <= this.refundOrder.payAmt) {
        net.apiPost(api.carpoolOrder.refund, {
          refundAmt: this.refundOrder.willWaitRefundAmtFen,
          orderId: this.refundOrder.orderId,
          refundReason: this.refundOrder.cancelRemark
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
      } else {
        help.E('退款金额多了~~')
      }
    },
    // doClearObj() {
    //   this.$refs.searchForm.clearForm()
    //   this.page.pageNum = orderReportForms
    //   this.page.pageSize = 10
    //   clearObj(this.searchData)
    //   this.getTableData()
    // },
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      if (params) params.pageSize = this.page.pageSize
      net.apiGet(api.carpoolOrder.list, params).then(data => {
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
      str = api.carpoolOrder.exportOrder + '?' + str
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
