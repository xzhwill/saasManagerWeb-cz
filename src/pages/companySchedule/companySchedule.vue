<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl" v-if="rmList.indexOf(operateInfo.create.operationId)> -1">
        <el-button @click="$router.push('./companyBusAddSchedule')" type="primary">新建班次</el-button>
        <el-button :disabled="!+page.total" @click="exportExcel(1)" type="primary">导出</el-button>
        <!--  <el-button :disabled="!+page.total" @click="exportExcel(2)" type="primary">导出明细</el-button> -->
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          :data="tableList"
          @selection-change="handleSelectionChange"
          class="page-table-main"
          header-row-class-name="tableHeader">
          <el-table-column align="center" label="操作" width="200px">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row, true)">复制班次</span>
                <span @click="modify(scope.row, false)" class="action-btn blue">修改</span>
                <!--  <span
                  @click="forbiddenSchedule(scope.row)"
                  class="action-btn danger">{{ +scope.row.state === 1 ? '禁用':'启用' }}</span>-->
                <span
                  @click="upLineSchedule(scope.row)"
                  :class="!+scope.row.operationType || +scope.row.operationType === 2 ? 'action-btn green' : 'action-btn danger'">
                  {{ !+scope.row.operationType || +scope.row.operationType === 2 ? '上线':'下线' }}
                </span>
                <span class="action-btn green" @click="normal(scope.row.scheduleId, '1')" v-if="+scope.row.classNature === 1">发布</span>
                <!-- <span @click="deleteSchedule(scope.row.scheduleId)" class="action-btn danger">删除</span>-->
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            :key="index"
            :label="item.label"
            :prop="item.name"
            align="center"
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'classType'">{{ +scope.row[item.name] === 1 ? '早班':(+scope.row[item.name] === 2 ? '晚班' : '循环班') }}</span>
              <span v-else-if="item.name === 'priceYuan'">{{ scope.row[item.name] }}</span>
              <span v-else-if="item.name === 'seatType'">{{ +scope.row[item.name] === 1 ? '是' : (!+scope.row[item.name] ? '否' : '') }}</span>
              <span v-else-if="item.name === 'state'">{{ +scope.row[item.name] === 1 ? '启用' : (!+scope.row[item.name] ? '禁用' : '') }}</span>
              <span v-else-if="item.name === 'classNature'">{{ +scope.row[item.name] === 1 ? '预售' :(+scope.row[item.name] === 2 ? '正常' : '') }}</span>
              <span v-else-if="item.name ==='workingCirculate'">
                <span v-if="+scope.row.workingCirculate === 1">工作日</span>
                <span v-if="+scope.row.workingCirculate === 2">节假日</span>
                <span v-if="+scope.row.workingCirculate === 3">不限</span>
                <span v-if="+scope.row.workingCirculate === 4">指定日期</span>
              </span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            background
            :current-page.sync="page.pageNum"
            :page-size="page.pageSize"
            :page-sizes="page.pageSizes"
            :total="page.total"
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="total, prev, pager, next, jumper, sizes"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { companyBusScheduleHeadSearch, companyBusScheduleTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import help from '@/utils/helper'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  name: 'scheduleManage',
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
      formModules: companyBusScheduleHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
      cityList: [],
      instructor: []
    }
  },
  components: { SearchForm },
  mounted () {
    // let searchData = sessionStorage.getItem('scheduleSearch')
    // if (searchData) {
    //   let searchDataArr = []
    //   JSON.parse(searchData).forEach(item => {
    //     for (let key in item) {
    //       if (key === 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key === 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       companyBusScheduleHeadSearch.forEach(val => {
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
    companyBusScheduleHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', companyBusScheduleHeadSearch, 'line')
    this.$emit('getTable', companyBusScheduleTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('schedulingManage')
  },
  methods: {
    forbiddenSchedule (row) {
      net.apiPost(api.schedule.forbidden, {
        scheduleId: row.scheduleId,
        state: +row.state === 1 ? 0 : 1,
        startTime: row.effectiveDate,
        endTime: row.expiryDate
      }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.getTableData(this.searchData)
        } else {
          help.E(data.msg)
        }
      })
    },
    normal (id, type) {
      if (+type === 1) {
        this.$confirm('此操作将正式发布为正常班次且仅可操作一次, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          net.apiPost(api.schedule.normal, {
            scheduleId: id,
            classNature: '2'
          }).then(data => {
            if (data && data.code === enums.NET_SUCCESS) {
              this.getTableData(this.searchData)
            } else {
              help.E(data.msg)
            }
          })
        }).catch(() => {})
      }
    },
    deleteSchedule (e) {
      this.$confirm('此操作将删除此班次, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.schedule.delete, {
          scheduleIds: [e]
        }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            this.searchData.pageNum = 1
            this.page.pageNum = 1
            this.getTableData(this.searchData)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
    },
    upLineSchedule (row) {
      net.apiPost(api.schedule.publish, {
        operationType: !+row.operationType || +row.operationType === 2 ? 1 : 2,
        scheduleId: row.scheduleId
      }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.getTableData(this.searchData)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify (row, copy) {
      // 去详情页面进行修改
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('scheduleSearch', JSON.stringify(searchArr))
      this.$router.push({
        name: 'companyBusAddSchedule',
        query: { id: row.scheduleId, copy: copy }
      })
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkGroupScheduleIds = []
      checkedArr.forEach((item, index) => {
        checkGroupScheduleIds.push(item.id)
      })
      this.checkedRow = checkGroupScheduleIds
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
      params.pageSize = this.page.pageSize
      params.businessType = 5
      net.apiGet(api.schedule.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('scheduleFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    copyLine (row) {
      let params = {
        lineNo: row.lineNo,
        newLineNo: ''
      }
      this.$prompt('当前线路: ' + row.lineNo + ' ' + row.lineName, '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入复制线路号'
      }).then(({ value }) => {
        params.newLineNo = value
        request.apiPost(api.line.copyLine, params).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            helper.S('复制成功')
            this.getTableData(this.page)
          } else {
            helper.E(data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    },
    exportExcel (type) {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) {
        } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      let apiStr
      if (type === 1) {
        apiStr = api.schedule.export
      } else {
        apiStr = api.schedule.exportDetail
      }
      str = apiStr + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId + '&businessType=' + 5
      location.href = str
    }
  }
}
</script>

<style lang="less" scoped>
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

.zs {
  color: darkmagenta;
}
</style>
