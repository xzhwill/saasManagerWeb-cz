<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button
          type="primary"
          @click="exportExcel"
          :disabled="!page.total">导出</el-button>
      </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body :tableHeaderCheckList="tableHeaderCheckList" :tableHeader="tableHeader" :tableList="tableList"></table-body>
        <pageInfo :page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { linePersonHeadSearch, linePersonTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'lineSolicitatePerson',
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
  components: {
    pageInfo,
    tableBody
  },
  data () {
    return {
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', linePersonHeadSearch)
    this.$emit('getTable', linePersonTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('lineSolicitatePerson')
  },
  methods: {
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
      net.apiGet(api.user.custgatherList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    exportExcel () {
      let obj = { ...this.searchData }
      delete obj['pageNum']
      delete obj['pageSize']
      let str = ''
      for (let key in obj) {
        if (obj[key] !== undefined) str += key + '=' + obj[key] + '&'
      }
      str = api.user.custgatherExport + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  }
}
</script>

<style lang="less" scoped></style>
