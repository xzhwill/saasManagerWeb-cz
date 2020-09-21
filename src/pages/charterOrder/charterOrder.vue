<template>
  <div class="common-container">
    <!-- 搜索 -->
    <!-- divide -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="exportOrder" :disabled="page.total==0"
          v-if="rmList.indexOf(operateInfo.export.operationId) > -1">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length !== 0">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList">
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
            :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name=='travelType'">
                <span v-if="scope.row['travelType'] == 1">单程</span>
                <span v-if="scope.row['travelType'] == 2">全天</span>
                <span v-if="scope.row['travelType'] == 3">往返</span>
                <span v-if="scope.row['travelType'] == 4">半天</span>
              </span>
              <span v-if="item.name=='completeState'">
                <span v-if="scope.row['completeState'] == 0">未完成</span>
                <span v-if="scope.row['completeState'] == 1">已完成</span>
              </span>
              <span v-if="item.name !='travelType' && item.name!='completeState'">{{scope.row[item.name]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class=" page-page">
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
import { charterOrderHeadSearch, charterOrderTableHead } from '@/utils/data.js'
import { clearObj, Trim, setOperation, getYearMonthDayTime } from '@/utils/public.js'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper.js'
import enums from '@/utils/enums'
import { toFen } from '../../utils/public'
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
  data() {
    return {
      formModules: charterOrderHeadSearch,
      // tableHeader: charterOrderTableHead,
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
    this.$parent.doClearObj()
    this.$emit('getInfo', charterOrderHeadSearch)
    this.$emit('getTable', charterOrderTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('commuteOrder')
  },
  methods: {
    checkKeydown (e, value) {
      this.checkValue = value
    },
    // init() {
    //   this.getTableData(this.searchData)
    // },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.searchData['pageSize'] = pageSize
      this.getTableData(this.searchData)
    },
    currentChange(pageNum) {
      this.searchData['pageNum'] = pageNum
      this.getTableData(this.searchData)
    },
    getTableData(params) {
      net.apiGet(api.charterOrder.tableList, params).then(data => {
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
    exportOrder() {
      let params = this.searchData
      let obj = ({ ...params })
      delete obj['pageNum']
      delete obj['pageSize']
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) { } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.charterOrder.export + '?' + str
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
