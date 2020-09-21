<template>
  <div class="common-container">
    <!-- 统计 -->
    <el-table stripe class="page-table-main table-info" :data="tableInfo">
      <el-table-column label="实际乘坐人数" align="center" prop="rideNumSum"></el-table-column>
      <el-table-column label="月票数量" align="center" prop="monthlyTicketNumSum"></el-table-column>
      <el-table-column label="次票数量" align="center" prop="thisTicketNumSum"></el-table-column>
      <el-table-column label="多次票数量" align="center" prop="multipleTicketsNumSum"></el-table-column>
      <el-table-column label="上座率（%）" align="center" prop="seatRateSum"></el-table-column>
      <el-table-column label="月票占比（%）" align="center" prop="monthlyRateSum"></el-table-column>
      <el-table-column label="次票占比（%）" align="center" prop="thisRateSum"></el-table-column>
      <el-table-column label="多次票占比（%）" align="center" prop="multipleRateSum"></el-table-column>
      <el-table-column label="月票应付（元）" align="center" prop="monthlyAmtSum"></el-table-column>
      <el-table-column label="次票应付（元）" align="center" prop="thisAmtSum"></el-table-column>
      <el-table-column label="多次票应付（元）" align="center" prop="multipleAmtSum"></el-table-column>
      <el-table-column label="代收金额" align="center" prop="collectionAmtSum"></el-table-column>
      <el-table-column label="应收平台服务费" align="center" prop="paasAmtSum"></el-table-column>
      <el-table-column label="应收渠道手续费" align="center" prop="channelAmtSum"></el-table-column>
      <el-table-column label="应结算金额" align="center" prop="settleAmtSum"></el-table-column>
    </el-table>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          header-row-class-name="tableHeader"
          class="page-table-main"
          :data="tableList">
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
              <span v-if="item.name === 'classType'">
                <span v-if="+scope.row.classType === 1">早班</span>
                <span v-if="+scope.row.classType === 2">晚班</span>
                <span v-if="+scope.row.classType === 3">循环班</span>
              </span>
              <span v-else-if="item.name === 'businessType'">
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{val.businessName}}</span>
              </span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 15px;">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :current-page.sync="page.pageNum"
            :page-sizes="page.pageSizes"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { dueListHeadSearch, dueListTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'payReportForms',
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
  components: { SearchForm },
  data () {
    return {
      tableInfo: [], // 统计数据
      all: {}, // 从后端拿到所有的数据
      formModules: dueListHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      businessTypeList: enums.BUSINESSTYPE1, // 业务类型
      operateInfo: enums.OPERATIONID // 判断状态（全局配置）
    }
  },
  mounted () {
    console.log(this.tableInfo, '***info')
    this.$parent.doClearObj()
    this.$emit('getInfo', dueListHeadSearch)
    this.$emit('getTable', dueListTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('payReportForms')
  },
  methods: {
    doClearObj () {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      dueListHeadSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = []
        } else {
          item.data = ''
        }
      })
      sessionStorage.removeItem('areaListSearch')
      clearObj(this.searchData)
      this.getTableData(this.page)
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.searchData.pageSize = pageSize
      this.page.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      if (params) {
        params.pageSize = this.page.pageSize
        if (params.supplyId) params.orzType = 1
      }
      net.apiGet(api.report.payList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.all = data.data.listSum
          this.tableInfo.push(data.data.listSum)
          let res = data.data.list
          this.tableList = res.list
          this.page.pageNum = res.page.pageNum
          this.page.pageSize = res.page.pageSize
          this.page.total = res.page.total
          sessionStorage.removeItem('flag')
        } else {
          help.E(data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .table-info {
    margin: 20px 0 40px;
  }
</style>
