<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix" style="margin-top: 15px;">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addOperate')">新建按钮功能</el-button>
        <el-button
          @click="groupDel"
          v-if="rmList.indexOf(operateInfo.delete.operationId) > -1"
          type="danger"
          :disabled="!checkedRow.length">批量删除</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body
          :tableHeaderCheckList="tableHeaderCheckList"
          @selectionChange="selectionChange"
          :tableHeader="tableHeader"
          :tableList="tableList">
          <el-table-column v-if="rmList.indexOf(operateInfo.delete.operationId)> -1" slot="header" type="selection"
            width="80"></el-table-column>
          <el-table-column v-if="rmList.indexOf(operateInfo.change.operationId)> -1" slot="footer" style="width:130px"
            align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.operationId)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </table-body>
        <pageInfo :page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { operateManageHeadSearch, operateManageTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'roleManage',
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
      formModules: operateManageHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      deleteInfo: {
        roleNumber: []
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
      operateList: JSON.parse(sessionStorage.getItem('operateList')),
      operateFlag: sessionStorage.getItem('operateFlag')
    }
  },
  components: {
    tableBody,
    pageInfo
  },
  mounted () {
    // if (this.operateFlag && this.operateList && this.operateList.length) {
    //   let searchDataArr = []
    //   this.operateList.forEach(item => {
    //     for (let key in item) {
    //       if (key === 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key === 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    this.$parent.doClearObj()
    // }
    this.rmList = setOperation('operateManage')
    this.$emit('getInfo', operateManageHeadSearch)
    this.$emit('getTable', operateManageTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        net.apiPost(api.operate.del, { operationIds: this.checkedRow }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            help.E(data.message)
          }
        })
      }).catch(() => {})
    },
    modify (id) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('operateList', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addOperate',
        query: { id: id }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkRoleIds = []
      checkedArr.forEach((item) => {
        checkRoleIds.push(item.operationId)
      })
      this.checkedRow = checkRoleIds
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
      net.apiGet(api.operate.tableList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let res = data.data
          sessionStorage.removeItem('operateFlag')
          this.tableList = res.list
          this.page.pageNum = res.page.pageNum
          this.page.pageSize = res.page.pageSize
          this.page.total = res.page.total
        } else {
          help.E(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/style/set.less';
  @import "./operateManage.less";
</style>
