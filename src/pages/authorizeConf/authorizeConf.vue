<template>
  <div class="common-container">
    <!-- 搜索 -->
    <!-- divide -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">
        <el-button type="primary" @click="createdNewDriver">新建授权配置</el-button>
        <!--<el-button @click="groupDel" type="danger" :disabled="checkedRow.length==0">批量删除</el-button>-->
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table @selection-change="handleSelectionChange" header-row-class-name="tableHeader" class="page-table-main"
          :data="tableList" border>
          <!--<el-table-column type="selection"  width="80"></el-table-column>-->
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
            :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                v-if="item.name != 'cacheKeyType' &&item.name!='cacheType'&&item.name!='db'">{{scope.row[item.name]}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作"
            v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.id,scope.row)">修改</span>
                <!-- <span class="action-btn danger" :class="{disabled : scope.row.status != orderReportForms}" @click="del(scope.row.busId,scope.row)">禁用</span> -->
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination :current-page.sync="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange"
            :page-sizes="page.pageSizes" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { authorizeConfHeadSearch, authorizeConfTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import help from '@/utils/helper'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'clearCache',
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
      formModules: [],
      // tableHeader: authorizeConfTableHead,
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
    // let searchData = sessionStorage.getItem('authorizeConfList')
    // if (sessionStorage.getItem('cacheFlag') && searchData) {
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
    //       authorizeConfHeadSearch.forEach(val => {
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
    this.rmList = setOperation('authorizeConf')
    this.$emit('getInfo', authorizeConfHeadSearch)
    this.$emit('getTable', authorizeConfTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    refresh() {
      this.getTableData(this.searchData)
    },
    createdNewDriver() {
      this.$router.push('./addAuthor')
    },
    modify(id, row) { // 去详情页面进行修改
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      // sessionStorage.setItem('cacheSearch', JSON.stringify(searchArr))
      this.$router.push({
        name: 'addAuthor',
        query: { id: id }
      })
    },
    doClearObj() {
      this.$refs.searchForm.clearForm()
      clearObj(this.searchData)
      // this.searchData['operationId'] = orderReportForms
      cacheHeadSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = []
        } else {
          item.data = ''
        }
      })
      // sessionStorage.removeItem('cacheSearch')
      this.page.pageSize = 10
      this.searchData['pageNum'] = 1
      this.searchData['pageSize'] = 10
      this.getTableData(this.searchData)
    },
    handleSelectionChange (checkedArr) {
      // 批量删除数组变化
      let checkGroupDriverIds = []
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.id)
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
      net.apiGet(api.auth.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('authorizeConf')
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
