<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push({ name: 'addPhone' })">添加客服电话</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table stripe header-row-class-name="tableHeader" class="page-table-main" :data="tableList">
          <el-table-column width="220px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="$router.push({ name: 'addPhone', query: { id: scope.row.id } })">修改</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span>{{ scope.row[item.name] }}</span>
            </template>
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
            :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { charterNoticeHeadSearch, charterNoticeTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'charterNotice',
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
      formModules: charterNoticeHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: []
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', charterNoticeHeadSearch)
    this.$emit('getTable', charterNoticeTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('userManageAdmin')
    this.searchData.operationId = 1
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      clearObj(this.searchData)
      this.searchData.operationId = 1
      this.page.pageSize = 10
      this.searchData.pageNum = 1
      this.searchData.pageSize = 10
      this.getTableData(this.searchData)
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.page.pageNum = pageNum
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      net.apiGet(api.serviceTelManage.list, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    }
  },
  components: {
    SearchForm
  }
}
</script>

<style scoped lang="less">
  @import '../../assets/style/set.less';
</style>
