<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="exportOrder" :disabled="!+page.total" v-if="rmList.indexOf(operateInfo.export.operationId) > -1">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
            :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name=='state'">
                <span v-if="scope.row['state'] == 0">无效</span>
                <span v-if="scope.row['state'] == 1">有效</span>
                <span v-if="scope.row['state'] == 2">预定</span>
                <span v-if="scope.row['state'] == 3">改签</span>
                <span v-if="scope.row['state'] == 4">退款</span>
                <span v-if="scope.row['state'] == 5">已过期</span>
                <span v-if="scope.row['state'] == 6">已完成</span>
              </span>
              <span v-if="item.name=='verification'">
                <span v-if="scope.row['verification'] == 0">否</span>
                <span v-if="scope.row['verification'] == 1">是</span>
              </span>
              <span v-if="item.name=='checkTicketState'">
                <span v-if="scope.row['checkTicketState'] == 0">未验票</span>
                <span v-if="scope.row['checkTicketState'] == 1">已验票</span>
              </span>
              <span v-if="item.name !='state' && item.name!='verification' && item.name !='checkTicketState'">{{scope.row[item.name]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination :current-page="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange"
            :page-sizes="page.pageSizes" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { commuteOrderHeadSearch, commuteOrderTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'commuteOrder',
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
      formModules: commuteOrderHeadSearch,
      // tableHeader: commuteOrderTableHead,
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
  mounted () {
    this.$emit('getInfo', commuteOrderHeadSearch)
    this.$emit('getTable', commuteOrderTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('commuteOrder')
    this.$parent.doClearObj()
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
      params.pageSize = this.page.pageSize
      net.apiGet(api.customerServiceManage.specialTableList, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    exportOrder () {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) { } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.specialOrder.export + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  },
  components: {
    SearchForm
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
