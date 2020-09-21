<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">
        <el-button @click="addLine()" type="primary" >新建通票</el-button>
      </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          header-row-class-name="tableHeader"
          class="page-table-main"
          :data="lineList"
          v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
          <el-table-column width="180px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="addLine(scope.row.ticketId)">修改</span>
                <span class="action-btn danger" @click="stopUse(scope.row)">
									<span>{{ !+scope.row.state ? '启用' : '禁用'}}</span>
								</span>
              </el-row>
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
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用'}}</span>
              <span v-else-if="item.name === 'verificationType'">{{ !+scope.row[item.name] ? '单日次数' : '总次数'}}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            background
            :current-page.sync="page.pageNum"
            layout="total, prev, pager, next, jumper, sizes"
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
import { throughTicketSearch, throughTicketTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'

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
      formModules: throughTicketSearch,
      lineList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      checkedRow: [],
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('throughTicketSearch')
    // if (sessionStorage.getItem('lineFlag') && searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item){
    //       if(key == 'pageNum'){
    //         this.page.pageNum = item[key]
    //       } else if(key == 'pageSize'){
    //         this.page.pageSize = item[key]
    //       }
    //       throughTicketSearch.forEach(val => {
    //         if(val.name == key){
    //           if(key == 'state'){
    //             if(item[key] == orderReportForms){
    //               val.data = '启动'
    //             } else {
    //               val.data = '禁用'
    //             }
    //           }else {
    //             val.data = item[key]
    //           }
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    throughTicketSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', throughTicketSearch)
    this.$emit('getTable', throughTicketTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('throughTicketManage')
  },
  methods: {
    // initCheckList () {
    //   throughTicketTableHead.forEach(item => {
    //     // 默认全选
    //     this.tableHeaderCheckList.push(item.label)
    //   })
    // },
    getTableData (params) {
      if (params.verificationType !== undefined) {
        if (params.verificationType === '单日次数') {
          params.verificationType = '1'
        } else {
          params.verificationType = '2'
        }
      }
      params.supplyId = params.orzId
      params.pageSize = this.page.pageSize
      request.apiGet(api.throughTicket.tableList, params).then(data => {
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
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkticketIds = []
      checkedArr.forEach((item, index) => {
        checkticketIds.push(item.ticketId)
      })
      this.checkedRow = checkticketIds
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
      let state = 0
      if (item.state === 0) {
        state = 1
      }
      request.apiPost(api.throughTicket.forbidden, {state: state, ticketId: item.ticketId }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.getTableData(this.searchData)
          helper.S('操作成功')
        } else {
          helper.E(data.msg)
        }
      })
    },
    addLine (id) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('throughTicketSearch', JSON.stringify(searchArr))
      this.$router.push({
        name: 'addThroughTicket',
        query: { id: id }
      })
    },
    deleteLine (id) {
      this.$confirm('此操作将永久删除该路线不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.apiPost(api.throughTicket.deleteTicket, { ticketIds: [id] }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            helper.E('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            helper.E(data.msg)
          }
        })
      }).catch(() => {})
    },
    exportExcel (type) {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) {} else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      let apiStr
      if (type === 1) {
        apiStr = api.line.export
      } else {
        apiStr = api.line.exportDetail
      }
      str = apiStr + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token
      location.href = str
    }
  },
  components: {
    SearchForm
  }
}
</script>
<style lang="less" type="text/less">
@import "../../assets/style/set.less";
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
