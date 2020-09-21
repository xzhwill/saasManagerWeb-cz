<template>
  <div class="common-container">
    <div class="page-nav-btn fl">
      <el-button type="primary" @click="exportOrder()" :disabled="!+page.total">导出</el-button>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe show-summary :summary-method="getSummaries">
          <el-table-column
            show-overflow-tooltip
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
  </div>
</template>

<script>
import { commuteStatisticsHeadSearch, commuteStatisticsTableHead } from '@/utils/data'
import { setOperation, getYearMonthDayTime } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'commuteScheduleStatistics',
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
      formModules: commuteStatisticsHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      totalData: {}
    }
  },
  mounted () {
    this.$parent.doClearObj()
    let thisDay = getYearMonthDayTime()
    commuteStatisticsHeadSearch[0].data = [thisDay.dayStr, thisDay.dayStr]
    // this.searchData.rideDateStart = thisDay.year + thisDay.month + thisDay.day
    // this.searchData.rideDateEnd = thisDay.year + thisDay.month + thisDay.day
    // this.getTableData(this.searchData)
    this.$emit('getInfo', commuteStatisticsHeadSearch)
    this.$emit('getTable', commuteStatisticsTableHead)
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
      console.log('sizeChange')
      this.getTableData(this.searchData)
    },
    /**
     * 分页
     * @param pageNum
     */
    currentChange (pageNum) {
      console.log('currentChange')
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    /**
     * 获取列表数据
     * @param params
     */
    getTableData (params) {
      if (params) params.pageSize = this.page.pageSize
      net.apiGet(api.orderManage.commuteScheduleStatisticsList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
          this.getDataTotal()
        } else {
          help.E(data.msg)
        }
      })
    },
    /**
     * 获取列表总计数据
     * @param params
     */
    getDataTotal() {
      let that = this;
       let params = {
        rideDateStart: that.searchData.rideDateStart,	
        rideDateEnd: that.searchData.rideDateEnd
      }
      params.lineNo = that.searchData.lineNo ? that.searchData.lineNo : null;
      params.scheduleName = that.searchData.scheduleName ? that.searchData.scheduleName : null;
      params.lineName = that.searchData.lineName ? that.searchData.lineName : null;

      net.apiGet(api.orderManage.commuteScheduleStatisticsCount, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.totalData = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    
    getSummaries(param) {
      let that = this;
      const { columns, data } = param;
      const sums = [];     
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '共计';
          return;
        }
        switch (index) {
          case 6:
              sums[index] = that.totalData.seatMaxCount;
              break;
          case 7:
              sums[index] = that.totalData.soldOutTicketNum;
              break;
          case 8:
              sums[index] = that.totalData.thisTicketNum;
              break;
          case 9:
              sums[index] = that.totalData.thisTicketAmt;
              break;
          case 10:
              sums[index] = that.totalData.monthlyTicketNum;
              break;
          case 11:
              sums[index] = that.totalData.monthlyTicketAmt;
              break;
          case 12:
              sums[index] = that.totalData.totalAmt;
              break;
          case 13:
              sums[index] = that.totalData.seatRate;
              break;
          default:
              sums[index] = '';
        } 
      });
      return sums;
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
      str = api.orderManage.commuteScheduleStatisticsOut + '?' + str
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
