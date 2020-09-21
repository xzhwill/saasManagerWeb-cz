<template>
  <div class="common-container">
    <div class="page-nav-btn fl">
      <el-button type="primary" @click="exportOrder()" :disabled="!+page.total">导出</el-button>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column width="110px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span style="color: red;" v-if="scope.row.payState === 1 ">未支付</span>
                <span
                  class="action-btn blue"
                  @click="showDialog(scope.row)"
                  v-if="scope.row.payState === 2 && (scope.row.payAmt >= scope.row.refundAmt)">行程退款</span>
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
              <span>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            :current-page="page.pageNum"
            background layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :page-sizes="page.pageSizes"
            :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
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
import { regularOrderHeadSearch, regularOrderTableHead } from '@/utils/data'
import { setOperation, clearObj } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'regularOrder',
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
      formModules: regularOrderHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      dialogTableVisible: false,
      isOk: true,
      scheduleList: []
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', regularOrderHeadSearch)
    this.$emit('getTable', regularOrderTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('commuteOrder')
  },
  methods: {
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
     * 获取列表数据
     * @param params
     */
    getTableData (params) {
      if (params) params.pageSize = this.page.pageSize
      net.apiGet(api.orderManage.regularOrderList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
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
        if (obj[key] === undefined) {} else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.orderManage.regularOrderOut + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + enums.OPERATIONID.export.operationId
      location.href = str
    }
  }
}
</script>

<style scoped lang="less">
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
