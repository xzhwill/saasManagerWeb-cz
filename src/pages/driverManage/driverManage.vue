<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button
          type="primary"
          @click="$router.push('./addDriver')"
          v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建司机</el-button>
        <el-button
          @click="groupDel"
          type="danger"
          :disabled="!checkedRow.length"
          v-if="rmList.indexOf(operateInfo.delete.operationId) > -1">批量删除</el-button>
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
          <el-table-column type="selection" width="80" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1"></el-table-column>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
            :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ scope.row[item.name] === 1 ? '启用' : '禁用' }}</span>
              <span v-else-if="item.name === 'sex'">{{ scope.row[item.name] === 1 ? '男' : '女' }}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span
                  class="action-btn blue"
                  v-if="rmList.indexOf(operateInfo.change.operationId) > -1"
                  @click="modify(scope.row)">修改</span>
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
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { driverManageHeadSearch, driverManageTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import help from '@/utils/helper'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'driverManage',
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
      formModules: driverManageHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
      orzArr: []
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('driverSearch')
    // if (searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item) {
    //       if (key == 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key == 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       driverManageHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           val.data = item[key]
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    this.$parent.doClearObj()
    // }
    this.rmList = setOperation('driverManage')
    this.$emit('getInfo', driverManageHeadSearch)
    this.$emit('getTable', driverManageTableHead)
    this.$emit('getPage', this.page)
    // this.getOrzList()
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    forbidden (row) {
      let params = row
      if (params.state === 1) {
        params.state = 0
      } else {
        params.state = 1
      }
      delete params.addTime
      delete params.updateTime
      net.apiPost(api.driver.updateDriver, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.searchData)
        } else {
          help.E(data.msg)
        }
      })
    },
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        net.apiPost(api.driver.delDriver, { ids: this.checkedRow }).then(data => {
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
    // getOrzList () { //  获取供给侧机构列表
    //   net.apiGet(api.orgnization.option, { orzType: 1 }).then(data => {
    //     if (data.code === enums.NET_SUCCESS) {
    //       data.data.forEach((val) => {
    //         driverManageHeadSearch[3].option.push({ label: val.orzName, value: val.orzId })
    //       })
    //     } else {
    //       help.E(data.msg)
    //     }
    //   })
    // },
    modify (row) { // 去详情页面进行修改
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('driverSearch', JSON.stringify(searchArr))
      this.$router.push({
        name: 'addDriver',
        query: { id: row.driverId }
      })
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      clearObj(this.searchData)
      // this.searchData['operationId'] = orderReportForms
      driverManageHeadSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = []
        } else {
          item.data = ''
        }
      })
      sessionStorage.removeItem('driverSearch')
      this.page.pageSize = 10
      this.searchData['pageNum'] = 1
      this.searchData['pageSize'] = 10
      this.getTableData(this.searchData)
    },
    handleSelectionChange (checkedArr) {
      // 批量删除数组变化
      let checkGroupDriverIds = []
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.driverId)
      })
      this.checkedRow = checkGroupDriverIds
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
      net.apiGet(api.driver.tableList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('driverFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
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
/*.divide {*/
  /*background-color: #e5e5e5;*/
  /*height: 5px;*/
  /*width: 100%;*/
  /*margin-top: 10px;*/
  /*margin-bottom: 10px;*/
/*}*/
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
</style>
