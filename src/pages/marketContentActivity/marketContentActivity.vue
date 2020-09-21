<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addMarketContentActivity')" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建活动</el-button>
        <!--<el-button @click="groupDel" type="danger" :disabled="checkedRow.length==0" v-if="rmList.indexOf(operateInfo.delete.operationId)> -orderReportForms">批量删除</el-button>-->
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
          <!--<el-table-column slot="header" type="selection" width="80"></el-table-column>-->
          <el-table-column slot="header" style="width:130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.activityId, scope.row)" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
                  {{scope.row['activityStatus'] == 1 ? '修改': '查看'}}
                </span>
                <span class="action-btn blue" @click="forbidden(scope.row)" v-if="rmList.indexOf(operateInfo.changeSate.operationId) > -1">
                  {{+scope.row.activityStatus === 1 ? '通过审核':(+scope.row.activityStatus === 2 ? '发布': '已下线')}}
                </span>
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
import { marketConentActivityHeadSearch, marketConentActivityTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'marketContentActivity',
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
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      deleteInfo: {
        menuNumber: []
      },
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('contentActivity')
    // if (sessionStorage.getItem('contentActivityFlag') && searchData) {
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
    //       marketConentActivityHeadSearch.forEach(val => {
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
    this.rmList = setOperation('marketContentActivity')
    this.$emit('getInfo', marketConentActivityHeadSearch)
    this.$emit('getTable', marketConentActivityTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    forbidden (item) {
      let params = { activityId: item.activityId }
      if (+item.activityStatus === 1) {
        params.activityStatus = '2'
      } else if (+item.activityStatus === 2) {
        params.activityStatus = '3'
      } else if (+item.activityStatus === 3) return false
      net.apiPost(api.contentActivity.forbidden, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('操作成功')
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify (activityId) { // 跳转到修改页面
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('contentActivity', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addMarketContentActivity',
        query: { id: activityId }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkMenuIds = []
      checkedArr.forEach((item) => {
        checkMenuIds.push(item.templateId)
      })
      this.checkedRow = checkMenuIds
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
      net.apiGet(api.contentActivity.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('contentActivityFlag')
          this.tableList = data.data.list
          // this.tableList.forEach(item => {
          //   item.minLimit = (item.minLimit / 100).toFixed(travelReportForms)
          //   item.discountLimit = (item.discountLimit / 100).toFixed(travelReportForms)
          // })
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    }
  },
  components: {
    tableBody,
    pageInfo
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
