<template>
  <div class="common-container">
    <!-- 搜索 -->
    <!-- divide -->
    <!--<div class="divide"></div>-->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addBusType')" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建车辆类型</el-button>
        <!--<el-button
          @click="groupDel"
          type="danger"
          :disabled="!checkedRow.length"
          v-if="rmList.indexOf(operateInfo.delete.operationId) > -orderReportForms">批量删除</el-button>-->
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          border
          header-row-class-name="tableHeader"
          class="page-table-main"
          :data="tableList"
          @selection-change="selectionChange">
          <!--<el-table-column type="selection" width="80" v-if="rmList.indexOf(operateInfo.delete.operationId) > -orderReportForms"></el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'mileageCount'">{{ scope.row[item.name] }}公里</span>
              <span v-else-if="item.name === 'state'">{{ !+scope.row.state ? '禁用' : '启用'}}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.busTypeId)" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">修改</span>
                <span class="action-btn danger" @click="forbidden(scope.row)" v-if="rmList.indexOf(operateInfo.changeSate.operationId) > -1">
                  <span>{{ !+scope.row.state ? '启用' : '禁用'}}</span>
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
            :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { busTypeManageHeadSearch, busTypeManageTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'busManage',
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
      orzArr: [],
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
    // let searchData = sessionStorage.getItem('busTypeSearch')
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
    //       searchDataArr[key] = item[key]
    //       busTypeManageHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           val.data = item[key]
    //         }
    //       })
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', busTypeManageHeadSearch)
    this.$emit('getTable', busTypeManageTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('busTypeManage')
  },
  methods: {
    /**
     * 批量删除
     */
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.busType.del, { ids: this.checkedRow }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.getTableData()
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
    },
    forbidden (row) {
      let params = { busTypeId: row.busTypeId }
      if (row.state === 1) {
        params.state = 0
      } else {
        params.state = 1
      }
      net.apiPost(api.bus.forbidden, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify  (busTypeId) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('busTypeSearch', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addBusType',
        query: { id: busTypeId }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkRoleIds = []
      checkedArr.forEach((item, index) => {
        checkRoleIds.push(item.busTypeId)
      })
      this.checkedRow = checkRoleIds
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
      net.apiGet(api.busType.tableList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('busTypeFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" type="text/less">
@import '../../assets/style/set.less';
.divide {
  background-color: #e5e5e5;
  height: 5px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-table th,
.el-table .tableHeader {
  background-color: #e5e5e5;
  color: #333;
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
