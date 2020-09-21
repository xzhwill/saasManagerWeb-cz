<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addMarketCouponSingle')" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建单模板</el-button>
        <el-button @click="groupDel" type="danger" :disabled="!checkedRow.length" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1">批量删除</el-button>
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
          <el-table-column slot="header" type="selection" width="80"></el-table-column>
          <el-table-column slot="header" style="width:130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.templateId, scope.row)" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
                  {{scope.row['templateStatus'] == 1 ? '修改': '查看'}}
                </span>
                <span class="action-btn blue" @click="forbidden(scope.row)" v-if="rmList.indexOf(operateInfo.changeSate.operationId) > -1">
                  {{scope.row['templateStatus'] == 1 ? '上线':(scope.row['templateStatus'] == 2 ? '下线': '上线')}}
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
import { marketCouponSingleHeadSearch, marketCouponSingleTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'marketCouponSingle',
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
      formModules: marketCouponSingleHeadSearch,
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
    // let searchData = sessionStorage.getItem('marketCouponSingle')
    // if (sessionStorage.getItem('marketCouponSingleFlag') && searchData) {
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
    //       marketCouponSingleHeadSearch.forEach(val => {
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
    this.rmList = setOperation('marketCouponSingle')
    this.$emit('getInfo', marketCouponSingleHeadSearch)
    this.$emit('getTable', marketCouponSingleTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    forbidden (item) {
      let params = {
        templateId: item.templateId,
        state: '2'
      }
      if (item.templateStatus == '1') {
        params.state = '2'
      } else if (item.templateStatus == '2') {
        params.state = '3'
      } else {
        params.state = '2'
      }
      net.apiPost(api.couponSingle.forbidden, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.getTableData(this.page)
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
        net.apiPost(api.couponSingle.del, { templateIdList: this.checkedRow }).then(data => {
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
    modify (templateId) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('marketCouponSingle', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addMarketCouponSingle',
        query: { id: templateId }
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
      this.page.pageNum = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      net.apiGet(api.couponSingle.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('marketCouponSingleFlag')
          this.tableList = data.data.list
          this.tableList.forEach(item => {
            item.minLimit = (item.minLimit / 100).toFixed(2)
            item.discountLimit = (item.discountLimit / 100).toFixed(2)
          })
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
