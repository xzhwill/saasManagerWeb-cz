<template>
  <div class="common-container">
    <div class="page-nav-btn fl">
      <el-button type="primary" @click="exportOrder()" :disabled="!+page.total">导出</el-button>
    </div>
   <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
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
              <span v-if="item.name === 'state'">
                <span v-if="!+scope.row.state">无效</span>
                <span v-if="+scope.row.state === 1">有效</span>
                <span v-if="+scope.row.state === 2">预定</span>
                <span v-if="+scope.row.state === 3">改签</span>
                <span v-if="+scope.row.state === 4">退款</span>
                <span v-if="+scope.row.state === 5">已过期</span>
                <span v-if="+scope.row.state === 6">已完成</span>
              </span>
              <span v-else-if="item.name === 'verification'">
                <span>{{ !+scope.row.verification ? '否' : '是' }}</span>
              </span>
              <span v-else-if="item.name === 'checkTicketState'">
                <span>{{ !+scope.row.checkTicketState ? '未验票' : '已验票' }}</span>
              </span>
              <span v-else>{{ scope.row[item.name] }}</span>
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
  </div>
</template>

<script>
import { busHeadSearch, busTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'regularTravel',
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
      formModules: busHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      isOk: true,
      rmList: [],
      operateInfo: enums.OPERATIONID,
      options: []
    }
  },
  beforeRouteUpdate (to, from, next) { // 解决从订单跳转过来后再点击行程的菜单 搜索条件会消失的问题
    next(false)
  },
  mounted () {
    this.$parent.doClearObj()
    if (this.$route.query.orderId) {
      busHeadSearch.forEach(item => {
        if (item.name === 'orderId') {
          item.data = this.$route.query.orderId
        }
      })
      this.searchData.orderId = this.$route.query.orderId
      setTimeout(() => {
        this.getTableData(this.searchData)
      }, 100)
    } else {
      busHeadSearch.forEach(item => {
        if (item.name === 'orderId') {
          item.data = ''
        }
      })
    }
    this.$emit('getInfo', busHeadSearch)
    this.$emit('getTable', busTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('commuteOrder')
  },
  methods: {
    checkKeydown (e, value) {
      this.checkValue = value
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
      if (params) params.pageSize = this.page.pageSize
      // if (this.$route.query.orderId) { // 如果从订单页过来
      //   busHeadSearch.forEach(item => {
      //     if (item.name === 'orderId') {
      //       console.log(item.data, '****item.data')
      //       if (!item.data) {
      //         params.orderId = this.$route.query.orderId
      //       }
      //     }
      //   })
      // }
      net.apiGet(api.customerServiceManage.shuttleItineraryInquiry, params).then(data => {
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
    exportOrder () {
      busHeadSearch.forEach(item => {
        if (item.name === 'orderId' && item.data) this.searchData.orderId = item.data
      })
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) {} else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.customerServiceManage.travelExport + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  },
  beforeRouteLeave (to, from, next) {
    busHeadSearch.forEach(item => {
      item.data = ''
      next()
    })
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
