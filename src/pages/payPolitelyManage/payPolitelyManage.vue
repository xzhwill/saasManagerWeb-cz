<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addpayPolitely')" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建活动</el-button>
        <el-button @click="groupDel" type="danger" :disabled="!checkedRow.length" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1">批量删除</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table stripe header-row-class-name="tableHeader" class="page-table-main" :data="tableList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable="checkboxDisabled" width="80" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1"></el-table-column>
          <el-table-column show-overflow-tooltip v-for="(item, index) in tableHeader" :key="index" :label="item.label"
            align="center" :prop="item.name" v-show="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用' }}</span>
              <span v-else>{{ scope.row[item.name]?scope.row[item.name]:"-" }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row)">修改</span>
                <span class="action-btn danger" v-if="rmList.indexOf(operateInfo.changeSate.operationId)> -1" @click="forbidden(scope.row)">
                  <span>{{ !+scope.row.state ? '启用' : '禁用'}}</span>
                </span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 15px;">
          <el-pagination background layout="total, prev, pager, next, jumper, sizes" @size-change="sizeChange" :page-size="page.pageSize"
            @current-change="currentChange" :current-page.sync="page.pageNum" :page-sizes="page.pageSizes" :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
// import { payPolitelyHeadSearch, payPolitelyTableHead } from '@/utils/data'
import { clearObj, Trim, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'payPolitelyManage',
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
      formModules: payPolitelyHeadSearch,
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
    payPolitelyHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = [];
      } else {
        item.data = '';
      }
    })
    this.$parent.doClearObj();
    this.$emit('getInfo', payPolitelyHeadSearch);
    this.$emit('getTable', payPolitelyTableHead);
    this.$emit('getPage', this.page);
    this.rmList = setOperation('payPolitelyManage');
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData);
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkGroupDriverIds = [];
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.payPolitelyId);
      })
      this.checkedRow = checkGroupDriverIds;
    },
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        net.apiPost(api.bus.del, { ids: this.checkedRow }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            help.S('删除成功');
            this.getTableData(this.page);
          } else {
            help.E(data.msg);
          }
        })
      }).catch(() => {})
    },
    forbidden (row) {
      let params = row;
      !+params.state ? params.state = 1 : params.state = 0;
      net.apiPost(api.bus.updatepayPolitely, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('修改成功');
          this.getTableData(this.searchData)
        } else {
          help.E(data.msg);
        }
      })
    },
    modify (row) { // 去详情页面进行修改
      let searchArr = [];
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {};
          obj[key] = this.searchData[key];
          searchArr.push(obj);
        }
      }
      sessionStorage.setItem('payPolitelySearch', JSON.stringify(searchArr));
      this.$router.push({
        name: 'addpayPolitely',
        query: { 
          id: row.payPolitelyId 
        }
      })
    },
    checkboxDisabled (row, index) {
      return true;
    },
    doSearch () {
      this.searchData = [];
      let formData = this.$refs.searchForm.getFormData();
      console.log(formData);
      for (const key in formData) {
        if (key == 'addTime' && formData['addTime'].length === 2 && formData['addTime'][0] != 'undefind') {
          // 创建时间
          this.searchData['addStartTime'] = formData['addTime'][0] + ' 00:00:00';
          this.searchData['addEndTime'] = formData['addTime'][1] + ' 23:59:59';
        } else if (key != 'addTime') {
          this.searchData[key] = Trim(formData[key].toString());
        }
      }
      this.searchData.pageSize = this.page.pageSize;
      this.searchData.pageNum = 1;
      this.page.pageNum = 1;
      sessionStorage.removeItem('payPolitelySearch');
      this.getTableData(this.searchData);
    },
    doClearObj () {
      this.$refs.searchForm.clearForm();
      this.page.pageNum = 1;
      this.page.pageSize = 10;
      payPolitelyHeadSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = [];
        } else {
          item.data = '';
        }
      })
      sessionStorage.removeItem('payPolitelySearch');
      clearObj(this.searchData);
      this.getTableData(this.page);
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1;
      this.searchData.pageNum = 1;
      this.searchData.pageSize = pageSize;
      this.page.pageSize = pageSize;
      this.getTableData(this.searchData);
    },
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum;
      this.getTableData(this.searchData);
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize;
      net.apiGet(api.bus.tableList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list;
          this.page.pageNum = data.data.page.pageNum;
          this.page.total = data.data.page.total;
          sessionStorage.removeItem('flag');
        } else {
          help.E(data.msg);
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