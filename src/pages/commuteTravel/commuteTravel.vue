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
import { commuteTravelHeadSearch, commuteTravelTableHead } from '@/utils/data'
import { setOperation, getYearMonthDayTime } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'commuteTravel',
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
      formModules: commuteTravelHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: []
    }
  },
  mounted () {
    this.$parent.doClearObj()
    let thisDay = getYearMonthDayTime() // 初始化默认时间展示
    commuteTravelHeadSearch[3].data = [thisDay.dayStr, thisDay.dayStr]
    // this.searchData.rideDateStart = thisDay.year + thisDay.month + thisDay.day
    // this.searchData.rideDateEnd = thisDay.year + thisDay.month + thisDay.day
    // this.getTableData(this.searchData)
    this.$emit('getInfo', commuteTravelHeadSearch)
    this.$emit('getTable', commuteTravelTableHead)
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
     * 获取列表数据
     * @param params
     */
    getTableData (params) {
      if (params) params.pageSize = this.page.pageSize
      net.apiGet(api.orderManage.commuteTravelDetailList, params).then(data => {
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
      str = api.orderManage.commuteTravelDetailOut + '?' + str
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
