<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addTicket')" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建票价</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table @selection-change="handleSelectionChange" header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <!--<el-table-column type="selection" :selectable="checkboxDisabled" width="80"></el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ +scope.row[item.name] === 1 ? '启用' : '禁用'}}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.ticketId)">修改</span>
                <span class="action-btn blue" @click="modify(scope.row.ticketId, '0')">查看</span>
                <span class="action-btn danger" @click="stopUse(scope.row)">
									<span>{{ !+scope.row.state ? '启用' : '禁用'}}</span>
								</span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            background
            :current-page.sync="page.pageNum"
            layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :page-sizes="page.pageSizes"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { ticketManageHeadSearch, ticketManageTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import help from '@/utils/helper'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'cityManage',
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
      formModules: ticketManageHeadSearch,
      // tableHeader: ticketManageTableHead,
      tableList: [],
      // tableHeaderCheckList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      // searchData: [],
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('ticketPriceList')
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
    //       ticketManageHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           if (key == 'state') {
    //             if (item[key] == 0) {
    //               val.data = '禁用'
    //             } else {
    //               val.data = '启用'
    //             }
    //           } else {
    //             val.data = item[key]
    //           }
    //         } else if (key == 'addStartTime' && val.name == 'addTime') {
    //           val.data.push(item['addStartTime'])
    //         } else if (key == 'addEndTime' && val.name == 'addTime') {
    //           val.data.push(item['addEndTime'])
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    ticketManageHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
		this.$emit('getInfo', ticketManageHeadSearch)
		this.$emit('getTable', ticketManageTableHead)
		this.$emit('getPage', this.page)
    this.rmList = setOperation('ticketPriceManage')
  },
  methods: {
    modify (id, status) { // 去详情页面进行修改
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('ticketPriceList', JSON.stringify(searchArr))
      this.$router.push({
        name: 'addTicket',
        query: { id: id, status: status }
      })
    },
    stopUse (item) {
      let state
      +item.state === 1 ? state = '0' : state = '1'
      net.apiPost(api.charteredTicket.forbidden, { state: state, ticketId: item.ticketId }).then(data => {
        if (data.code && data.code === enums.NET_SUCCESS) {
          if (this.searchData.pageNum == undefined) {
            this.searchData.pageSize = this.page.pageSize
            this.searchData.pageNum = 1
            this.page.pageNum = 1
          }
          this.getTableData(this.searchData)
          help.S('操作成功')
        } else {
          help.E(data.msg)
        }
      })
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkGroupDriverIds = []
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.driverId)
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
      // if (params == undefined || params.pageSize == undefined) {
      //   params = {
      //     pageNum: orderReportForms,
      //     pageSize: 10
      //   }
      // }
      params.pageSize = this.page.pageSize
      net.apiGet(api.charteredTicket.tableList, params).then(data => {
        if (data.code && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('ticketPriceFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
          this.tableList.map((item, index) => {
            this.tableList[index].goBackUnitPrice = item.goBackUnitPrice + '元 /' + item.goBackUnitMileage + 'KM'
            this.tableList[index].oneWayUnitPrice = item.oneWayUnitPrice + '元 /' + item.oneWayUnitMileage + 'KM'
          })
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
