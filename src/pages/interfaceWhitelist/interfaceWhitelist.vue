<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-header">
      <div class="page-search">
        <search-form
          label-width="120px"
          :formModules="formModules"
          ref="searchForm"
          v-if="formModules.length">
          <div class="page-search-btn">
            <el-button icon="el-icon-search" round plain type="primary" @click="doSearch">查询</el-button>
            <el-button icon="el-icon-delete" round plain type="danger" @click="doClearObj">清空</el-button>
          </div>
        </search-form>
      </div>
    </div>
    <!-- divide -->
    <div class="divide"></div>
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="createdNewRole">新建白名单</el-button>
        <el-button @click="groupDel" type="danger" :disabled="checkedRow.length==0">批量删除</el-button>
      </div>
      <div class="page-nav-btn-item fr">
        <el-popover ref="popover" placement="left" trigger="click">
          <div class="page-check-list">
            <el-checkbox-group class="checkbox-list-info" v-model="tableHeaderCheckList">
              <el-checkbox
                v-for="(item, index) in tableHeader"
                :key="index"
                :label="item.label"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-popover>
        <el-button icon="el-icon-setting" type="info" v-popover:popover></el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length !== 0">
        <table-body
          :tableHeaderCheckList="tableHeaderCheckList"
          @selectionChange="selectionChange"
          :tableHeader="tableHeader"
          :tableList="tableList">
          <el-table-column slot="header" type="selection" width="80"></el-table-column>
          <el-table-column slot="footer" style="width:130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.id)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </table-body>
        <pageInfo
          :page="page"
          ref="pageInfo"
          @changeSize="sizeChange"
          @changeCurrent="currentChange"
        ></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { interfaceWhitelistSearch, interfaceWhitelistTableHead } from '@/utils/data'
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
      formModules: interfaceWhitelistSearch,
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
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    let searchData = sessionStorage.getItem('interfaceWhitelist')
    if (sessionStorage.getItem('interfaceWhiteFlag') && searchData) {
      searchData = (JSON.parse(searchData))
      let searchDataArr = []
      searchData.forEach(item => {
        for (let key in item) {
          if (key === 'pageNum') {
            this.page.pageNum = item[key]
          } else if (key === 'pageSize') {
            this.page.pageSize = item[key]
          }
          searchDataArr[key] = item[key]
        }
      })
      this.getTableData(searchDataArr)
    } else {
      this.$parent.doClearObj()
    }
    this.$emit('getInfo', interfaceWhitelistSearch)
    this.$emit('getTable', interfaceWhitelistTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    createdNewRole () {
      this.$router.push({ name: 'addInterfaceWhitelist' })
    },
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.interfaceWhitelist.del, { ids: this.checkedRow }).then(data => {
          if (data.msg && data.msg.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.getTableData(this.page)
          } else {
            help.E(data.msg.message)
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
      sessionStorage.setItem('interfaceWhitelist', JSON.stringify(searchArr))
      // 去详情页面进行修改
      this.$router.push({
        name: 'addInterfaceWhitelist',
        query: { id: id }
      })
    },
    selectionChange (checkedArr) {
      // 批量删除数组变化
      let checkRoleIds = []
      checkedArr.forEach(item => {
        checkRoleIds.push(item.id);
      });
      this.checkedRow = checkRoleIds;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.searchData["pageSize"] = pageSize;
      this.getTableData(this.searchData);
    },
    currentChange(pageNum) {
      this.searchData["pageNum"] = pageNum;
      this.getTableData(this.searchData);
    },
    getTableData(params) {
      net.apiGet(api.interfaceWhitelist.tableList, params).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('interfaceWhiteFlag')
          this.tableList = data.data.list;
          this.page.pageNum = data.data.page.pageNum;
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total;
        } else {
          help.E(data.msg.message);
        }
      });
    }
  },
  components: {
    tableBody,
    pageInfo
  }
};
</script>

<style lang="less" type="text/less">
@import "../../assets/style/set.less";
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
