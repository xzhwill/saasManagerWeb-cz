<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <!--v-if="rmList.indexOf(operateInfo.create.operationId) > -orderReportForms"-->
      <div class="page-nav-btn-item fl" >
        <el-button @click="addLine('', false)" type="primary">新建线路</el-button>
        <el-button type="primary" @click="exportExcel(1)" :disabled="!+page.total">导出</el-button>
        <!--<el-button type="primary" @click="exportExcel(2)" :disabled="!+page.total">导出线路明细</el-button>-->
      </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="lineList" stripe>
          <el-table-column width="220px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="addLine(scope.row.lineId, true)">复制线路</span>
                <span class="action-btn blue" @click="setShift(scope.row)">添加班次</span>
                <span class="action-btn blue" @click="addLine(scope.row.lineId, false)">修改</span>
                <span
                  :class="!+scope.row.operationType || +scope.row.operationType === 2 ? 'action-btn green' : 'action-btn danger'"
                  @click="stopUse(scope.row)">
                  <span>{{ !+scope.row.operationType || +scope.row.operationType === 2 ? '上线':'下线'}}</span>
                </span>
                <!--<span class="action-btn blue" @click="deleteLine(scope.row.lineId)">删除</span>-->
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1 && item.name === 'lineName'"
            width="180px">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" v-if="item.name === 'lineName'">
                <ul style="max-height: 300px;overflow: auto;"><span>{{ scope.row.siteNameList }}</span></ul>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.lineName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1 && item.name !== 'lineName'">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用' }}</span>
              <span v-else-if="item.name === 'isTicketToRide'">{{ scope.row[item.name] == 1 ? '不购票乘车' : '购票乘车' }}</span>
              <span v-else-if="item.name === 'classNature'">{{ scope.row[item.name] == 1 ? '预售' : '正常' }}</span>
              <span v-else-if="item.name === 'businessType'" >
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{ val.businessName }}</span>
              </span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            :current-page.sync="page.pageNum"
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
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { companyBusLineHeadSearch, companyBusLineTableHead } from '@/utils/data'

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
      formModules: companyBusLineHeadSearch,
      lineList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      checkedRow: [],
      rmList: [],
      operateInfo: enums.OPERATIONID,
      businessTypeList: enums.BUSINESSTYPE1 // 业务类型
    }
  },
  mounted () {
    companyBusLineHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    this.$emit('getInfo', companyBusLineHeadSearch)
    this.$emit('getTable', companyBusLineTableHead)
    this.$emit('getPage', this.page)
    this.getOrzIdList()
  },
  methods: {
    setShift (row) {
      this.$router.push({
        path: '/companyBusAddSchedule',
        query: {
          ...row,
          isLine: true // 判断是否是从线路页面进入班次页面的字段
        }
      })
    },
    getOrzIdList () {
      companyBusLineHeadSearch[6].option = []
      request.apiGet(api.supply.optionList, { orzType: 1 }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          data.data.forEach((val) => {
            companyBusLineHeadSearch[6].option.push(
              { label: val.orzName, value: val.orzId }
            )
          })
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      params.businessType = 5
      request.apiGet(api.line.getLine, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('lineFlag')
          this.lineList = data.data.list
          this.lineList.forEach(item => {
            // item.effectiveDate = setTime(item.effectiveDate)
            // item.expiryDate = setTime(item.expiryDate)
            if (item.roleList) {
              item.roleList = item.roleList.split(',')
            } else {}
          })
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          helper.E(data.msg)
        }
      })
    },
    copyLine (row) {
      let params = {
        lineNo: row.lineNo,
        newLineNo: ''
      }
      // this.$prompt('当前线路: ' + row.lineNo + ' ' + row.lineName, '提示', {
      //   confirmButtonText: '保存',
      //   cancelButtonText: '取消',
      //   inputPlaceholder: '请输入复制线路号'
      // }).then(({ value }) => {
      //   params.newLineNo = value
      //   request.apiPost(api.line.copyLine, params).then(data => {
      //     if (data && data.code === enums.NET_SUCCESS) {
      //       helper.S('复制成功')
      //       this.getTableData(this.page)
      //     } else {
      //       helper.E(data.msg)
      //     }
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '取消'
      //   })
      // })
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkLineIds = []
      checkedArr.forEach((item, index) => {
        checkLineIds.push(item.lineId)
      })
      this.checkedRow = checkLineIds
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
    stopUse (item) {
      // 1-上线，2-下线
      let state = 1
      if (item.operationType === 1) {
        state = 2
      }
      request.apiPost(api.line.publish, { operationType: state, lineId: item.lineId }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.getTableData(this.searchData)
          helper.S('操作成功')
        } else {
          helper.E(data.msg)
        }
      })
    },
    addLine (id, copy) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('lineSearch', JSON.stringify(searchArr))
      this.$router.push({
        name: 'companyBusAddLine',
        query: { id: id, copy: copy }
      })
    },
    deleteLine (id) {
      this.$confirm('此操作将永久删除该路线不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.apiPost(api.line.deleteLine, { lineIds: [id] }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            helper.E('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            helper.E(data.msg)
          }
        })
      }).catch(() => { })
    },
    exportExcel (type) {
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
      let apiStr
      +type === 1 ? apiStr = api.line.export : apiStr = api.line.exportDetail
      str = apiStr + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId + '&businessType=' + 5
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
