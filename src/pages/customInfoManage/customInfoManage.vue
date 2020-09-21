<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <!--<el-button type="primary" @click="exportExcel" :disabled="!+page.total">导出</el-button>-->
        <!--<el-button plain type="primary" @click="showMap">热力图</el-button>-->
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          @selection-change="handleSelectionChange"
          header-row-class-name="tableHeader"
          class="page-table-main"
          :data="tableList">
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">{{scope.row[item.name]}}</template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            background
            :current-page="page.pageNum"
            layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :page-sizes="page.pageSizes"
            :total="page.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { customManageHeadSearch, customManageTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import help from '@/utils/helper'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'customInfoManage',
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
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      operateInfo: enums.OPERATIONID,
      rmList: []
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.rmList = setOperation('customInfoManage')
    this.$emit('getInfo', customManageHeadSearch)
    this.$emit('getTable', customManageTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkGroupCustomInfoIds = []
      checkedArr.forEach((item, index) => {
        checkGroupCustomInfoIds.push(item.customInfoId)
      })
      this.checkedRow = checkGroupCustomInfoIds
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
      delete params.pageSizes
      params.pageSize = this.page.pageSize
      net.apiGet(api.customInfo.list, params).then(data => {
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
    exportExcel () {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) {
        } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.customInfo.export + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  }
}
</script>

<style lang="less" type="text/less">
@import "../../assets/style/set.less";
.divide {
  background-color: #e5e5e5;
  height: 5px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-table th,
.el-table .tableHeader {
  /*background-color: #e5e5e5;*/
  /*color: #333;*/
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
.test{
  color:#eff3ff
//    #6baed6,
//    #3182bd,
//    #08519c,
// #eff3ff
//    #2c7bb6,
//    #abd9e9,
//    #ffffbf,
//    #fde468,
//    #d7191c,
}
</style>
