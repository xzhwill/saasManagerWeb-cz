<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" v-if="rmList.indexOf(operateInfo.create.operationId) > -1" @click="createdNewSysUser">新建系统用户</el-button>
      </div>
      <div class="page-nav-btn-item fr">
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body :tableHeaderCheckList="tableHeaderCheckList" :tableHeader="tableHeader"
          @selectionChange="selectionChange" :tableList="tableList">
          <el-table-column slot="footer" min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.userId,scope.row)">修改</span>
                <!--<span>-->
                <!--<span class="action-btn danger" v-if="scope.row.state==orderReportForms" @click="forbidden(scope.row.userId,0)">禁用</span>-->
                <!--<span class="action-btn danger" v-if="scope.row.state==0" @click="forbidden(scope.row.userId,orderReportForms)">启用</span>-->
                <!--</span>-->
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
import { sysUserManageHeadSearch, sysUserManageTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'sysUserManage',
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
      formModules: sysUserManageHeadSearch,
      // tableHeader: sysUserManageTableHead,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      deleteInfo: {
        sysUserNumber: []
      },
      // searchData: [],
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('sysUserList')
    // if (sessionStorage.getItem('sysUserFlag') && searchData) {
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
    //       sysUserManageHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           val.data = item[key]
    //         }
    //       })
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    this.$parent.doClearObj()
    // this.getTableData(this.page)
    // }
    this.$emit('getInfo', sysUserManageHeadSearch)
    this.$emit('getTable', sysUserManageTableHead)
    this.$emit('getPage', this.page)
    // console.log(this)
    this.rmList = setOperation('sysUserManage')
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    createdNewSysUser () {
      this.$router.push('./addSysUser')
    },
    modify (userId, row) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('sysUserList', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addSysUser',
        query: { userId: userId }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkRoleIds = []
      checkedArr.forEach((item, index) => {
        checkRoleIds.push(item.userId)
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
      net.apiGet(api.sysUser.tableList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('sysUserFlag')
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
    SearchForm,
    tableBody,
    pageInfo
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
