<template>
  <div class="common-container">
    <!--导出、统计-->
    <div class="page-nav-btn clearfix">
      <el-button type="primary" @click="exportOrder"> 导出</el-button>
      <ul class="statistics">
        <li>
          <span>实际成交票数：</span>
          <span>{{ all.successTicketNumSum ? all.successTicketNumSum : 0 }}</span>
        </li>
        <li>
          <span>月票数量：</span>
          <span>{{ all.monthTicketNumSum ? all.monthTicketNumSum : 0 }}</span>
        </li>
        <li>
          <span>次票数量：</span>
          <span>{{ all.oneTicketNumSum ? all.oneTicketNumSum : 0 }}</span>
        </li>
        <li>
          <span>多次票数量：</span>
          <span>{{ all.repeatedlyTicketNumSum ? all.repeatedlyTicketNumSum : 0 }}</span>
        </li>
      </ul>
    </div>
    <!-- table -->
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
              <span v-if="item.name === 'state'">
                <span v-if="+scope.row.state === 0">无效</span>
                <span v-if="+scope.row.state === 1">有效</span>
                <span v-if="+scope.row.state === 2">预定</span>
                <span v-if="+scope.row.state === 3">改签</span>
                <span v-if="+scope.row.state === 4">退款</span>
              </span>
              <span v-else-if="item.name === 'businessType'">
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{val.businessName}}</span>
              </span>
              <span v-else-if="item.name === 'scheduleType'">
                <span v-if="+scope.row.scheduleType === 1">早班</span>
                <span v-if="+scope.row.scheduleType === 2">晚班</span>
                <span v-if="+scope.row.scheduleType === 3">循环班</span>
              </span>
              <span v-else-if="item.name === 'ticketType'">
                <span v-if="+scope.row.ticketType === 1">日票</span>
                <span v-if="+scope.row.ticketType === 2">月票</span>
                <span v-if="+scope.row.ticketType === 3">多次票</span>
                <span v-if="+scope.row.ticketType === 4">通票</span>
              </span>
              <span v-else-if="item.name === 'checkTicketState'">
                <span v-if="+scope.row.checkTicketState === 0">未验票</span>
                <span v-if="+scope.row.checkTicketState === 1">已验票</span>
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
import { tripListHeadSearch, tripListTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'travelReportForms',
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
      all: {}, // 从后端拿到所有的数据
      formModules: tripListHeadSearch,
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
    this.$parent.doClearObj()
    this.$emit('getInfo', tripListHeadSearch)
    this.$emit('getTable', tripListTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('travelReportForms')
  },
  methods: {
    doClearObj () {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      tripListHeadSearch.forEach(item => {
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
      net.apiGet(api.report.travelList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.all = data.data
          let res = data.data.travelList
          this.tableList = res.list
          this.page.pageNum = res.page.pageNum
          this.page.pageSize = res.page.pageSize
          this.page.total = res.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    exportOrder () {
      let obj = { ...this.searchData }
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) { } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.report.travelOutput + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  }
}
</script>

<style scoped lang="less">
  .statistics {
    overflow: hidden;
    margin-top: 20px;
    li {
      float: left;
      color: #606266;
      font-size: 14px;
      span:nth-of-type(2) {
        display: inline-block;
        width: 100px;
      }
    }
  }
</style>
