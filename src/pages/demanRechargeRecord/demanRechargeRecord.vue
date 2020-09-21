<template>
  <div class="common-container">
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="distributionList" stripe :row-class-name="tableRowClassName">
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name == 'tradeChannel'">{{scope.row[item.name] == 1 ? '支付宝' : (scope.row[item.name] == 2 ? '微信' : '银行转账')}}</span>
              <span v-else-if="item.name == 'expendType'">{{scope.row[item.name] == 1 ? '企业班车' : '企业包车'}}</span>
              <span v-else-if="item.name == 'state'">{{scope.row[item.name] == 1 ? '未支付' : (scope.row[item.name] == 2 ? '付款成功' : (scope.row[item.name] == 3 ? '充值失败' :'充值成功'))}}</span>
              <span v-else >{{scope.row[item.name]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination :current-page.sync="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
                         @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange" :page-sizes="page.pageSizes"
                         :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import { demanRechargeRecordHeadSearch, demanRechargeRecordTableHead } from '@/utils/data'

export default {
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
      distributionList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      checkedRow: [],
      rmList: []
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('demanRechargeRecordHeadSearch')
    // if (sessionStorage.getItem('demanRechargeRecordHeadSearch')&& searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item){
    //       if(key == 'pageNum'){
    //         this.page.pageNum = item[key]
    //       } else if(key == 'pageSize'){
    //         this.page.pageSize = item[key]
    //       }
    //       demanRechargeRecordHeadSearch.forEach(val => {
    //         if (val.name == key){
    //           if (key == 'state') {
    //             if (item[key] == orderReportForms) {
    //               val.data = '未支付'
    //             } else if (item[key] == travelReportForms) {
    //               val.data = '已支付'
    //             } else if (item[key] == payReportForms) {
    //               val.data = '充值失败'
    //             } else if (item[key] == 4) {
    //               val.data = '充值成功'
    //             }
    //           } else {
    //             val.data = item[key]
    //           }
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    demanRechargeRecordHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // this.getTableData(this.page)
    // }
    this.$emit('getInfo', demanRechargeRecordHeadSearch)
    this.$emit('getTable',demanRechargeRecordTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    /* 对表格创建下标 */
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    getTableData (params) {
      delete params.pageSizes
      params.pageSize = this.page.pageSize
      request.apiGet(api.demanRechargeRecord.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('demanRechargeRecordFlag')
          this.distributionList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          helper.E(data.msg)
        }
      })
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
    }
  }
}
</script>
<style lang="less" type="text/less">
  @import "../../assets/style/set.less";
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
