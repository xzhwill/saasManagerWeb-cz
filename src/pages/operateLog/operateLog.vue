<template>
  <div class="common-container">
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body :tableHeaderCheckList="tableHeaderCheckList" :tableHeader="tableHeader" :tableList="tableList"></table-body>
        <pageInfo :page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { operateLogHeadSearch, operateLogTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
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
      formModules: operateLogHeadSearch,
      // tableHeader: operateLogTableHead,
      tableList: [],
      tableListTotal: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      option: [],
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', operateLogHeadSearch)
    this.$emit('getTable', operateLogTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('operateLog')
  },
  methods: {
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      net.apiGet(api.operationLog.tableList, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.tableListTotal = data.data.statisticList
          this.page.pageNum = data.data.page.pageNum
          this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    }
  },
  components: {
    SearchForm,
    pageInfo,
    tableBody
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
