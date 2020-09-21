<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" v-if="rmList.indexOf(operateInfo.create.operationId) > -1" @click="createdNewDiscount">新建机构</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe
          @selection-change="handleSelectionChange">
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
            :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name!=='orzType'&& item.name!=='state'">{{scope.row[item.name]}}</span>
              <span v-if="item.name == 'orzType'">
                {{scope.row['orzType'] === 1? '供给侧' : '需求侧'}}
              </span>
              <span v-if="item.name == 'state'">
                {{scope.row['state'] == 1? '启用' : '禁用'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作"
            v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.orzId)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <pageInfo v-bind:page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { orgnizationHeadSearch, orgnizationTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'orgnizationManage',
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
      formModules: orgnizationHeadSearch,
      // tableHeader: orgnizationTableHead,
      channelList: [],
      tableList: [],
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
    // let searchData = sessionStorage.getItem('orgnizationList')
    // if (sessionStorage.getItem('orgnizationFlag') && searchData) {
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
    //       orgnizationHeadSearch.forEach(val => {
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
    this.rmList = setOperation('orgnization')
    this.$emit('getInfo', orgnizationHeadSearch)
    this.$emit('getTable', orgnizationTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    createdNewDiscount () {
      this.$router.push('./addOrgnization')
    },
    refresh () {
      this.getTableData(this.searchData)
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
      sessionStorage.setItem('orgnizationList', JSON.stringify(searchArr))
      // 去详情页面进行修改
      this.$router.push({
        name: 'addOrgnization',
        query: { id: id }
      })
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      clearObj(this.searchData)
      this.getTableData()
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
    handleSelectionChange (checkedArr) {
      // 批量删除数组变化
      let checkGroupScheduleIds = []
      checkedArr.forEach((item, index) => {
        checkGroupScheduleIds.push(item.orzId)
      })
      this.checkedRow = checkGroupScheduleIds
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      net.apiGet(api.orgnization.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('orgnizationFlag')
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
