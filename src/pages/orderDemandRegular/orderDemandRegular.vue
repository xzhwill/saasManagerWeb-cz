<template>
  <div class="common-container">
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
              <span v-if="item.name === 'businessType'">
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{val.businessName}}</span>
              </span>
              <span v-else-if="item.name === 'scheduleType'">
                <span v-if="+scope.row.scheduleType === 1">早班</span>
                <span v-if="+scope.row.scheduleType === 2">晚班</span>
                <span v-if="+scope.row.scheduleType === 3">循环班</span>
              </span>
              <span v-else-if="item.name === 'state'">
                <span v-if="+scope.row.state === 1">待支付</span>
                <span v-if="+scope.row.state === 2">待派车</span>
                <span v-if="+scope.row.state === 3">待出行</span>
                <span v-if="+scope.row.state === 4">出行中</span>
                <span v-if="+scope.row.state === 5">已完成</span>
                <span v-if="+scope.row.state === 6">自动取消</span>
                <span v-if="+scope.row.state === 7">前台退款</span>
                <span v-if="+scope.row.state === 8">后台退款</span>
              </span>
              <span v-else-if="item.name === 'ticketType'">
                <span v-if="+scope.row.ticketType === 1">日票</span>
                <span v-if="+scope.row.ticketType === 2">月票</span>
                <span v-if="+scope.row.ticketType === 3">多次票</span>
                <span v-if="+scope.row.ticketType === 4">通票</span>
              </span>
              <span v-else-if="item.name === 'payChannelId'">
                <span v-if="+scope.row.payChannelId === 0">自主账户</span>
                <span v-if="+scope.row.payChannelId === 1">支付宝</span>
                <span v-if="+scope.row.payChannelId === 2">微信</span>
                <span v-if="+scope.row.payChannelId === 3">金码账户</span>
                <span v-if="+scope.row.payChannelId === 9">企业账户</span>
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
import { shuttleDemandHeadSearch, shuttleDemandListTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'orderDemandRegular',
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
      formModules: shuttleDemandHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      businessTypeList: enums.BUSINESSTYPE2, // 业务类型
      operateInfo: enums.OPERATIONID // 判断状态（全局配置）
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', shuttleDemandHeadSearch)
    this.$emit('getTable', shuttleDemandListTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('orderReportForms')
  },
  methods: {
    doClearObj () {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      shuttleDemandHeadSearch.forEach(item => {
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
      if (params) params.pageSize = this.page.pageSize
      net.apiGet(api.shuttleBusiness.demandSheet, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
          sessionStorage.removeItem('flag')
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
      str = api.report.orderOutput + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  }
}
</script>

<style scoped lang="less">

</style>
