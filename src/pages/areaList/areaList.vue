<template>
  <div class="common-container">
    <!-- 搜索 -->
    <!-- divide -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl" >
        <el-button @click="groupDel" type="danger" :disabled="!checkedRow.length" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1"> 批量删除</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          header-row-class-name="tableHeader"
          class="page-table-main"
          :data="tableList"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable="checkboxDisabled" width="80"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用'}}</span>
              <span v-else-if="item.name === 'isHot'">{{ !+scope.row[item.name] ? '否' : '是'}}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span
                  class="action-btn danger"
                  v-if="rmList.indexOf(operateInfo.changeSate.operationId) > -1"
                  @click="forbidden(scope.row)">
                  <span>{{ !+scope.row.state ? '启用' : '禁用' }}</span>
                </span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 15px;">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :current-page.sync="page.pageNum"
            :page-sizes="page.pageSizes"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { areaListHeadSearch, areaListTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'areaList',
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
      formModules: areaListHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      deleteInfo: {
        areaListNumber: []
      },
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('areaListSearch')
    // if (searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item) {
    //       if (key === 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key === 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       areaListHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           val.data = item[key]
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    areaListHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', areaListHeadSearch)
    this.$emit('getTable', areaListTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('areaList')
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkGroupDriverIds = []
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.areaId)
      })
      this.checkedRow = checkGroupDriverIds
    },
    groupDel () { // 单条删除
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.area.delete, { ids: this.checkedRow }).then(data => {
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
    forbidden (row) {
      net.apiPost(api.area.forbidden, {
        areaId: row.areaId,
        state: +row.state === 1 ? 0 : 1
      }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.searchData)
        } else {
          help.E(data.msg)
        }
      })
    },
    checkboxDisabled (row, index) {
      // 状态为1和3的时候不可删除  orderReportForms-启用 payReportForms-禁用
      // if (row.templateStat == orderReportForms) {
      //   return false
      // }
      return true
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      areaListHeadSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = []
        } else {
          item.data = ''
        }
      })
      sessionStorage.removeItem('areaListSearch')
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
      net.apiGet(api.area.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
          sessionStorage.removeItem('flag')
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
