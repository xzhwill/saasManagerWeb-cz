<template>
  <div class="common-container">
    <!--新建公告-->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addBroadcast')">新建广播</el-button>
      </div>
    </div>
    <!--表格+分页-->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" :row-class-name="tableRowClassName" stripe>
          <el-table-column width="150px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="changeBroadcast(scope.row)">修改</span>
                <span class="action-btn danger" @click="forbidden(scope.row)">
                  <span>{{ !+scope.row.state ? '启用' : '禁用'}}</span>
                </span>
                <span class="action-btn danger" @click="deleteList(scope.row)">
                  <span>删除</span>
                </span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">
                <span>{{ !+scope.row.state ? '禁用' : '启用' }}</span>
              </span>
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
            :total="page.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { broadcastHeadSearch, broadcastTableHead } from '@/utils/data'
import request from '@/utils/request'
import api from '@/utils/api'
import helper from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'broadcastManage',
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
      options: [],
      businessTypeList: enums.BUSINESSTYPE,
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      }
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', broadcastHeadSearch)
    this.$emit('getTable', broadcastTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
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
    forbidden (item) { // 启用/禁用
      let params = {
        broadcastId: item.broadcastId,
        state: +item.state === 1 ? '0' : '1'
      }
      request.apiPost(api.broadcast.forbidden, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList[item.index].state = params.state
        } else {
          helper.E(data.msg)
        }
      })
    },
    deleteList (item) { // 删除广播
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        request.apiPost(api.broadcast.delete, { broadcastId: item.broadcastId }).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            helper.S('删除成功')
            this.page.pageNum = 1
            this.searchData.pageNum = 1
            this.getTableData(this.searchData)
          } else {
            helper.E(data.msg)
          }
        })
      }).catch(() => { })
    },
    getTableData (params) { // 获取tableList
      delete params.pageSizes
      params.pageSize = this.page.pageSize
      request.apiGet(api.broadcast.list, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.tableList.forEach(item => {
            let businessType = JSON.stringify(item.businessTypes)
            let businessTypeStr = []
            enums.BUSINESSTYPE.forEach(val => {
              if (businessType.indexOf(val.businessId) > -1) {
                businessTypeStr.push(val.businessName)
              }
            })
            item.businessTypeStr = businessTypeStr.join(',')
          })
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          helper.E(data.msg)
        }
      })
    },
    changeBroadcast (val) {
      this.$router.replace({
        name: 'addBroadcast',
        query: { id: val.broadcastId }
      })
    }
  }
}
</script>

<style scoped>
</style>
