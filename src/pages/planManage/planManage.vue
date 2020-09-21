<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix"></div>
    <div class="table-container">
      <div class="page-table-info">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            show-overflow-tooltip
            min-width="120px">
            <template slot-scope="scope">
              <span v-if="item.name === 'classType'">{{ +scope.row[item.name] === 1 ? '早班' : +scope.row[item.name] === 2 ? '晚班' : '循环班'}}</span>
              <span v-else-if="item.name === 'businessType'" >
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{ val.businessName }}</span>
              </span>
              <span v-else-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用' }}</span>
              <span v-else-if="item.name === 'recentNoScheduleDate'">{{ scope.row[item.name] === '40001231' ? '已排完' : scope.row[item.name] }}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120px" align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row, '1')">修改</span>
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
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { planManageHeadSearch, planManageTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'planManage',
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
      formModules: planManageHeadSearch,
      tableHeaderAdd: planManageTableHead,
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
      rmList: [],
      operateInfo: enums.OPERATIONID,
      businessTypeList: enums.BUSINESSTYPE1 // 业务类型
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('planSearch')
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
    //       planManageHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           if (key === 'classType') {
    //             if (item[key] == orderReportForms) {
    //               val.data = '早班'
    //             } else {
    //               val.data = '晚班'
    //             }
    //           } else if (key === 'state') {
    //             if (item[key] == orderReportForms) {
    //               val.data = '启动'
    //             } else {
    //               val.data = '禁用'
    //             }
    //           } else {
    //             val.data = item[key]
    //           }
    //         } else if(key == 'startTime'&&val.name == 'addTime'){
    //           console.log(val)
    //           val.data.push(item['startTime'])
    //         } else if(key == 'endTime'&&val.name == 'addTime') {
    //           val.data.push(item['endTime'])
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    planManageHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', planManageHeadSearch)
    this.$emit('getTable', planManageTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('planManage')
    this.getOrzList()
  },
  methods: {
    /**
     * 获取供给侧机构列表
     */
    getOrzList () {
      planManageHeadSearch[0].option = []
      net.apiGet(api.orgnization.option, { orzType: 1 }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          if (data.data.length) {
            data.data.forEach((val) => {
              planManageHeadSearch[0].option.push({ label: val.orzName, value: val.orzId })
            })
          }
        } else {
          help.E(data.msg)
        }
      })
    },
    modify (row, type) { // 去详情页面进行修改
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('planSearch', JSON.stringify(searchArr))
      this.$router.push({
        name: 'addPlan',
        query: {
          type,
          clsType: row.classType,
          id: row.scheduleId
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
      this.page.pageNum = pageNum
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      if (params.effectiveTime && params.effectiveTime.length) {
        params.startTime = params.effectiveTime[0]
        params.endTime = params.effectiveTime[1]
        delete params.effectiveTime
      }
      params.pageSize = this.page.pageSize
      net.apiGet(api.plan.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('planFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
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
