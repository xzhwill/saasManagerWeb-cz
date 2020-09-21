<template>
  <div class="common-container">
    <!--<div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="exportExcel" :disabled="!tableList.length">导出</el-button>
      </div>
    </div>-->
    <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
      <el-table-column min-width="80px" align="center" label="操作">
        <template slot-scope="scope">
          <el-row class="action-btn-group">
            <span class="action-btn blue" @click="showDialog(scope.row)" v-if="+scope.row.status === 1 ">退款</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in tableHeader"
                       :key="index"
                       :label="item.label"
                       align="center"
                       :prop="item.name"
                       v-if="tableHeaderCheckList.indexOf(item.label) !== -1"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span
                v-if="item.name!=='codeType'&& item.name!=='businessType'&&item.name!=='verifyState'&&item. name!=='orderState' && item.name !='payState'">{{scope.row[item.name]}}</span>
          <span v-if="item.name == 'codeType'">
            <span v-if="scope.row['codeType'] == 101">支付宝付款码</span>
            <span v-if="scope.row['codeType'] == 102">微信付款码</span>
            <span v-if="scope.row['codeType'] == 103">云闪付付款码</span>
            <span v-if="scope.row['codeType'] == 104">翼支付付款码</span>
            <span v-if="scope.row['codeType'] == 105">一网通付款码</span>
            <span v-if="scope.row['codeType'] == 201">核销码</span>
            <span v-if="scope.row['codeType'] == 301">小码自发吗</span>
            <span v-if="scope.row['codeType'] == 401">金码</span>
          </span>
          <span v-if="item.name == 'businessType'">
            <span v-if="scope.row['businessType'] == 1">定制公交</span>
            <span v-if="scope.row['businessType'] == 2">出行专线</span>
            <span v-if="scope.row['businessType'] == 3">预约包车</span>
            <span v-if="scope.row['businessType'] == 4">拼团</span>
          </span>
          <span v-if="item.name == 'verifyState'">
            <span v-if="scope.row['verifyState'] == '0'">未核销</span>
            <span v-if="scope.row['verifyState'] == '1'">已核销</span>
            <span v-if="scope.row['verifyState'] == '2'">核销失败</span>
          </span>
          <span v-if="item.name == 'orderState'">
            <span v-if="scope.row['orderState'] == 1">待支付</span>
            <span v-if="scope.row['orderState'] == 2">已支付</span>
            <span v-if="scope.row['orderState'] == 3">手动取消</span>
            <span v-if="scope.row['orderState'] == 4">自动取消</span>
          </span>
          <span v-if="item.name == 'payState'">
            <span v-if="scope.row['payState'] == 1">已支付</span>
          </span>
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
    <el-dialog title="退款操作" :visible.sync="dialogTableVisible" :append-to-body='isOk' width="30%">
      <el-form v-model="refundOrder" label-position="right" label-width="120px" ref="orderRefund">
        <el-form-item label="用户支付金额：">
          <el-input v-model="refundOrder.payPriceYuan" disabled style="width: 200px;margin-right: 10px"></el-input>元
        </el-form-item>
        <el-form-item label="已退金额：">
          <el-input v-model="refundOrder.refundAmtYuan" disabled style="width: 200px;margin-right: 10px"></el-input>元
        </el-form-item>
        <el-form-item label="本次退款：">
          <el-input v-model="refundOrder.willWaitRefundAmt" @input="" type="number" style="width: 200px;margin-right: 10px"></el-input>元
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
import pageInfo from '@/pages/common/setPage.vue'
import { verificationCodeTranHeadSearchHead, verificationCodeTranTableHead } from '@/utils/data'
import { toFen, clearObj } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'verificationCodeTranOrder',
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
    return {
      isOk: true,
      formModules: verificationCodeTranHeadSearchHead,
      // tableHeader: verificationCodeTranTableHead,
      tableList: [],
      // tableHeaderCheckList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      // searchData: [],
      operateInfo: enums.OPERATIONID,
      cityList: [],
      busList: [],
      driverList: [],
      dialogTableVisible: false,
      refundOrder: {
        payPriceYuan: '',
        payPrice: '',
        orderId: '',
        refundAmtYuan: '',
        refundAmt: '',
        willWaitRefundAmt: 0,
        willWaitRefundAmtFen: '',
        cancelRemark: ''
      }
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', verificationCodeTranHeadSearchHead)
    this.$emit('getTable', verificationCodeTranTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    showDialog (val) {
      this.dialogTableVisible = true
      this.refundOrder.orderNo = val.orderNo
      this.refundOrder.payPriceYuan = val.payPriceYuan /* 总金额 */
      this.refundOrder.refundAmtYuan = val.refundAmtYuan /* 已退金额 */
      this.refundOrder.payPrice = val.payPrice /* 总金额 */
      this.refundOrder.refundAmt = val.refundAmt == undefined ? 0 : val.refundAmt /* 已退金额 */
      this.refundOrder.cancelRemark = val.cancelRemark
    },
    cancelRefund () {
      this.dialogTableVisible = false
    },
    updateOrder () {
      this.refundOrder.willWaitRefundAmtFen = toFen(this.refundOrder.willWaitRefundAmt)
      // if ((this.refundOrder.willWaitRefundAmtFen + this.refundOrder.refundAmt) === 0) {
      //   help.E('请输入退款金额')
      // } else {
      // console.log(this.refundOrder)
      if ((this.refundOrder.willWaitRefundAmtFen + this.refundOrder.refundAmt) <= this.refundOrder.payPrice) {
        net.apiPost(api.verificationCodeTran.refund, {
          waitRefundAmt: this.refundOrder.willWaitRefundAmtFen + '',
          orderNo: this.refundOrder.orderNo,
          cancelRemark: this.refundOrder.cancelRemark
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
        help.E('退款金额多了')
      }
      // }
    },
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
      params.pageSize = this.page.pageSize
      net.apiGet(api.verificationCodeTran.tableList, params).then(data => {
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
    exportExcel () {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) { } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.verificationCodeTran.export + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  },
  components: { pageInfo }
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
