<template>
  <div class="common-container">
    <!-- divide -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">
        <el-button type="primary" @click="$router.push('./addCharteredUpShelf')">包车商品新增</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ +scope.row.state === 1 ? '启用' : '禁用'}}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" v-if="rmList.indexOf(operateInfo.change.operationId)> -1" @click="modify(scope.row)">修改</span>
                <span class="action-btn danger" v-if="rmList.indexOf(operateInfo.changeSate.operationId)> -1" @click="forbidden(scope.row)">
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
            :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { charteredUpShelfSearch, charteredUpShelfTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'returnRuleConfiguration',
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
      formModules: charteredUpShelfSearch,
      // tableHeader: charteredUpShelfTableHead,
      channelList: [], // 获取所有渠道列表
      tableList: [],
      option: [],
      busTypeList: [],
      // tableHeaderCheckList: [],
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
    // let searchData = sessionStorage.getItem('charteredUpShelfSearch')
    // if (sessionStorage.getItem('charteredUpShelfTableHead') && searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item) {
    //       if (key == 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key == 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       charteredUpShelfSearch.forEach(val => {
    //         if (val.name == key) {
    //           if (key == 'giveType') {
    //             if (item[key] == orderReportForms) {
    //               val.data = '全部用户'
    //             } else if (item[key] == travelReportForms) {
    //               val.data = '指定用户'
    //             } else {
    //               val.data = '导入用户'
    //             }
    //           } else {
    //             val.data = item[key]
    //           }
    //         } else if (key == 'startTime' && val.name == 'addTime') {
    //           val.data.push(item['startTime'])
    //         } else if (key == 'endTime' && val.name == 'addTime') {
    //           val.data.push(item['endTime'])
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    charteredUpShelfSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
	  this.$emit('getInfo', charteredUpShelfSearch)
	  this.$emit('getTable', charteredUpShelfTableHead)
	  this.$emit('getPage', this.page)
    this.rmList = setOperation('charteredUpShelf')
    this.getAllCityList()
    this.getBusTypeList()
  },
  methods: {
    getAllCityList () {
      net.apiGet(api.city.option, { noPage: 1 }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          let list = data.data
          for (var i = 0; i < list.length; i++) {
            this.option.push({ label: list[i].cityName, value: list[i].cityCode })
          }
          charteredUpShelfSearch[0].option = this.option
        } else {
          help.E(data.msg)
        }
      })
    },
    getBusTypeList () {
      net.apiGet(api.busType.optionList, { noPage: 1 }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          let list = data.data
          for (var i = 0; i < list.length; i++) {
            this.busTypeList.push({ label: list[i].busTypeName, value: list[i].busTypeId })
          }
          charteredUpShelfSearch[2].option = this.busTypeList
        } else {
          help.E(data.msg)
        }
      })
    },
    forbidden (row) {
      let params = { updatesId: row.updatesId, state: +row.state === 1 ? 0 : 1 }
      delete params.addTime
      delete params.updateTime
      net.apiPost(api.charteredUpShelf.forbidden, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.searchData)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify (row) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('charteredUpShelfSearch', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addCharteredUpShelf',
        query: { id: row.updatesId }
      })
    },
    delBtnShow (activityStatus, couponStatus) {
      if (+activityStatus === 1 && (+couponStatus === 1 || +couponStatus === 3 || +couponStatus === 4)) return true
      return false
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
    getTableData (params) {
      // if (params === undefined || params.pageNum === undefined) {
      //   params = {
      //     pageNum: orderReportForms,
      //     pageSize: 10
      //   }
      // } else {
      if (params.cityCode != undefined) {
        this.option.map((item, index) => {
          if (item.label == params.cityCode) {
            params.cityCode = item.value
          }
        })
      }
      // }
      params.pageSize = this.page.pageSize
      net.apiGet(api.charteredUpShelf.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('returnRuleConfiguration')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    }
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
