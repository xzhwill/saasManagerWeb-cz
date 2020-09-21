<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" v-if="rmList.indexOf(operateInfo.create.operationId) > -1" @click="$router.push('./addRole')">新建角色
        </el-button>
        <el-button
          @click="groupDel"
          v-if="rmList.indexOf(operateInfo.delete.operationId) > -1"
          type="danger"
          :disabled="!checkedRow.length">批量删除</el-button>
      </div>
      <!--<div class="page-nav-btn-item fr">
        &lt;!&ndash; 刷新按钮 &ndash;&gt;
        &lt;!&ndash; <el-button type="info" icon="el-icon-refresh" @click="refresh"></el-button> &ndash;&gt;
        <el-popover ref="popover" placement="left" trigger="click">
          <div class="page-check-list">
            <el-checkbox-group class="checkbox-list-info" v-model="tableHeaderCheckList">
              <el-checkbox v-for="(item, index) in tableHeader" :key="index" :label="item.label">{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-popover>
        <el-button icon="el-icon-setting" type="info" v-popover:popover></el-button>
      </div>-->
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body
          :tableHeaderCheckList="tableHeaderCheckList"
          @selectionChange="selectionChange"
          :tableHeader="tableHeader"
          :tableList="tableList">
          <el-table-column
            slot="header"
            type="selection"
            width="80"
            v-if="rmList.indexOf(operateInfo.change.operationId) > -1"></el-table-column>
          <el-table-column
            slot="footer"
            style="width:130px"
            align="center"
            label="操作"
            v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.roleId)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </table-body>
        <pageInfo v-bind:page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { roleManageHeadSearch, roleManageTableHead } from '@/utils/data'
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
      formModules: roleManageHeadSearch,
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
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('roleList')
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
    //       searchDataArr[key] = item[key]
    //       roleManageHeadSearch.forEach(val => {
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
    this.rmList = setOperation('roleManage')
    this.$emit('getInfo', roleManageHeadSearch)
    this.$emit('getTable', roleManageTableHead)
    this.$emit('getPage', this.page)
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
        net.apiPost(api.role.del, { roleIds: this.checkedRow }).then(data => {
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
    forbidden (row, state) {
      let params = row
      row.state = state
      net.apiPost(api.role.update, params).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.page)
        } else {
          help.E(data.msg.message)
        }
      })
    },
    modify (roleId) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('roleList', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addRole',
        query: { id: roleId }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkRoleIds = []
      checkedArr.forEach((item, index) => {
        checkRoleIds.push(item.roleId)
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
      net.apiGet(api.role.tableList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('roleFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg.message)
        }
      })
    }
  },
  components: {
    SearchForm,
    tableBody,
    pageInfo
  }
}
</script>

<style lang="less" scoped>
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
