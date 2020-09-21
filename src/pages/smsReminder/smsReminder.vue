<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addSmsReminder')" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">添加</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <!-- <div class="page-table-info" v-if="tableHeaderCheckList.length"> -->
      <div class="page-table-info">
        <el-table stripe header-row-class-name="tableHeader" class="page-table-main" :data="tableList">
          <!-- v-if="tableHeaderCheckList.indexOf(item.label) !== -1" -->
          <el-table-column show-overflow-tooltip v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name">
            <template slot-scope="scope">
              <span>{{ scope.row[item.name]?scope.row[item.name]:'-' }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="groupDel(scope.row)" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1">删除</span>
                <span class="action-btn blue" @click="modify(scope.row)" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">编辑</span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 15px;">
          <el-pagination background layout="total, prev, pager, next, jumper, sizes" @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange"
            :current-page.sync="page.pageNum" :page-sizes="page.pageSizes" :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { smsReminderHeadSearch, smsReminderTableHead } from '@/utils/data'
import { clearObj, Trim, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'smsReminder',
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
      formModules: smsReminderHeadSearch,
      tableList: [],
      checkedRow: [],
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
    smsReminderHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    this.$emit('getInfo', smsReminderHeadSearch) // 搜
    this.$emit('getTable', smsReminderTableHead)// 表格
    this.$emit('getPage', this.page)
    this.rmList = setOperation('smsReminder')
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    groupDel (row) {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        net.apiGet(api.smsReminder.delete, { id: row.id }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
    },
    modify (row) { // 去详情页面进行修改
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      this.$router.push({
        name: 'addSmsReminder',
        query: { id: row.id }
      })
    },
    doSearch () {
      this.searchData = []
      let formData = this.$refs.searchForm.getFormData()
      for (const key in formData) {
        if (key == 'addTime' && formData['addTime'].length === 2 && formData['addTime'][0] != 'undefind') {
          // 创建时间
          this.searchData['addStartTime'] = formData['addTime'][0] + ' 00:00:00'
          this.searchData['addEndTime'] = formData['addTime'][1] + ' 23:59:59'
        } else if (key != 'addTime') {
          this.searchData[key] = Trim(formData[key].toString())
        }
      }
      this.searchData.pageSize = this.page.pageSize
      this.searchData.pageNum = 1
      this.page.pageNum = 1
      this.getTableData(this.searchData)
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      smsReminderHeadSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = []
        } else {
          item.data = ''
        }
      })
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
      params.pageSize = this.page.pageSize
      net.apiGet(api.smsReminder.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
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
