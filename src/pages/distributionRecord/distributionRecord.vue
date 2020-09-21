<template>
  <div class="common-container">
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="distributionList" stripe :row-class-name="tableRowClassName">
          <!--<el-table-column width="180px" align="center" label="操作">-->
            <!--<template slot-scope="scope">-->
              <!--<el-row class="action-btn-group">-->
                <!--<span class="action-btn blue" @click="addTicketImg(scope.row.channelId)">修改</span>-->
                <!--<span class="action-btn danger" @click="stopUse(scope.row)">-->
                  <!--<span>{{scope.row.state == 0 ? '启用' : '禁用'}}</span>-->
								 <!--</span>-->
              <!--</el-row>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name !='state'">{{scope.row[item.name]}}</span>
              <span v-if="item.name == 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用'}}</span>
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
import { distributionRecordHeadSearch, distributionRecordTableHead } from '@/utils/data'

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
    // let searchData = sessionStorage.getItem('distributionRecordSearch')
    // if(sessionStorage.getItem('distributionRecordSearch')&& searchData){
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item){
    //       if(key == 'pageNum'){
    //         this.page.pageNum = item[key]
    //       } else if(key == 'pageSize'){
    //         this.page.pageSize = item[key]
    //       }
    //       distributionRecordHeadSearch.forEach(val => {
    //         if(val.name == key){
    //           if(key == 'state'){
    //             if(item[key] == orderReportForms){
    //               val.data = '启动'
    //             } else {
    //               val.data = '禁用'
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
    distributionRecordHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', distributionRecordHeadSearch)
    this.$emit('getTable', distributionRecordTableHead)
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
      request.apiGet(api.distribution.recordList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('distributionRecordFlag')
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
      this.searchData['pageNum'] = pageNum
      this.getTableData(this.searchData)
    }
  }
}
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
