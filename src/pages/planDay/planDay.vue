<template>
  <div class="common-container">
    <!--<div class="page-nav-btn clearfix" v-if="rmList.indexOf(operateInfo.create.operationId) > -orderReportForms">
      <div class="page-nav-btn-item fl">
        <el-button plain type="primary" @click="exportExcel" :disabled="!+page.total">导出</el-button>
      </div>
    </div>-->
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            show-overflow-tooltip min-width="120px">
            <template slot-scope="scope">
              <span v-if="item.name === 'classType'">{{ +scope.row[item.name] === 1 ? '早班' : (+scope.row[item.name] === 2 ? '晚班' : '循环班') }}</span>
              <span v-else-if="item.name === 'businessType'" >
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{ val.businessName }}</span>
              </span>
              <span v-else-if="item.name === 'lineProperty'">{{ +scope.row[item.name] === 1 ? '固定时间发车' : '周期循环发车' }}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            background
            :current-page="page.pageNum"
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
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'
import { planDayHeadSearch, planDayTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'

export default {
  name: 'planDay',
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
      formModules: planDayHeadSearch,
      tableHeaderAdd: planDayTableHead,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      deleteInfo: {
        planNumber: []
      },
      options: [{label: '--请选择--', value: null}],
      rmList: [],
      operateInfo: enums.OPERATIONID,
      businessTypeList: enums.BUSINESSTYPE1 // 业务类型
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('planDayHeadSearch')
    // if (searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item) {
    //       if (key === 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key === 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       planDayHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           if (key == 'state') {
    //             if (item[key] == orderReportForms) {
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
    planDayHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', planDayHeadSearch)
    this.$emit('getTable', planDayTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('planDay')
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    initCheckList () {
      this.tableHeader = this.tableHeaderAdd
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
      if (params.orzId != '' && params.orzId !=undefined) {
        let val = params.orzId
        for (var i = 0; i < this.options.length; i++) {
          if (this.options[i].label == val) {
            params.orzId = this.options[i].value
          }
        }
      }
      params.pageSize = this.page.pageSize
      net.apiGet(api.plan.listDay, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    exportExcel () {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) {} else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.plan.export + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  }
}
</script>

<style lang="less" type="text/less">
@import "../../assets/style/set.less";
::-webkit-scrollbar-track-piece { //滚动条凹槽的颜色，还可以设置边框属性
  background-color:#f8f8f8;
}
::-webkit-scrollbar {//滚动条的宽度
  width:9px;
  height:9px;
}
::-webkit-scrollbar-thumb {//滚动条的设置
  background-color:#dddddd;
  background-clip:padding-box;
  min-height:28px;
}
::-webkit-scrollbar-thumb:hover {
  background-color:#bbb;
}
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
