<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
        <el-button type="primary" :disabled="!checkedRow.length" @click="dialogMonthVisible = true">月票开放时间设置</el-button>
        <el-button @click="dialogTimeVisible = true" type="danger" :disabled="!checkedRow.length">次票开放时间设置</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          header-row-class-name="tableHeader"
          @selection-change="handleSelectionChange"
          class="page-table-main"
          :data="tableList">
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'isForceUpdate'">{{ !+scope.row[item.name] ? '否' : '是' }}</span>
              <span v-else-if="item.name === 'updateTime'">{{ timestampToTime(scope.row[item.name]) }}</span>
              <span v-else-if="item.name === 'classType'">{{ +scope.row[item.name] === 1 ? '早班' : +scope.row[item.name] === 2 ? '晚班' : '循环班' }}</span>
              <span v-else-if="item.name === 'secondarySellType'">
                <span v-if="+scope.row.secondarySellType === 1">按天</span>
                <span v-if="+scope.row.secondarySellType === 2">按周</span>
                <span v-if="+scope.row.secondarySellType === 3">按月</span>
              </span>
              <span v-else-if="item.name === 'secondaryTicketSellDay' && scope.row['secondaryTicketSellDay']">{{scope.row[item.name]}}天</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="月票时间设置" :visible.sync="dialogMonthVisible" width="500px" :modal-append-to-body='false'>
          <el-form enctype="multipart/form-data" label-width="130px" label-position="right" :model="formMonthData" ref="formMonthData">
            <el-form-item class="common-form-item" label="开放日期：" prop="monthTicketSellDay">
              <el-input
                type="number"
                v-model="formMonthData.monthTicketSellDay"
                min="1"
                max="31"
                oninput="if (value > 31) value = ''; if (value.length > 2) value = value.slice(0, 2); if (value < 1) value = ''"></el-input>
            </el-form-item>
            <el-form-item class="common-form-item" label="开放时间：" prop="monthTicketSellTime">
              <el-time-select
                v-model="formMonthData.monthTicketSellTime"
                :picker-options="{ start: '00:00', step: '00:15', end: '23:30' }"
                placeholder="选择时间"></el-time-select>
            </el-form-item>
            <el-row class="btn-group" style="text-align:right">
              <el-button type="primary" @click="saveMonthGroup">确认</el-button>
              <el-button type="info" @click="dialogMonthVisible = false">取消</el-button>
            </el-row>
          </el-form>
        </el-dialog>
        <el-dialog title="次票时间设置" :visible.sync="dialogTimeVisible" width="600px" :modal-append-to-body='false'>
          <el-form enctype="multipart/form-data" label-width="170px" label-position="right" :model="formTimeData" ref="formTimeData">
            <el-form-item class="common-form-item" label="开放日期：" prop="nextMonthSecondarySellDate">
              <el-input
                type="number"
                v-model="formTimeData.nextMonthSecondarySellDate "
                min="1"
                max="31"
                oninput="if (value > 31) value = ''; if (value.length > 2) value = value.slice(0, 2); if (value < 1) value = ''"></el-input>
            </el-form-item>
            <el-form-item class="common-form-item" label="开放购买时间：" prop="secondaryTicketSellTime">
              <el-time-select
                v-model="formTimeData.secondaryTicketSellTime"
                :picker-options="{ start: '00:00', step: '00:15', end: '23:30' }"
                placeholder="选择时间"></el-time-select>
            </el-form-item>
            <el-form-item label="开放类型" prop="secondarySellType">
              <el-select v-model="formTimeData.secondarySellType">
                <el-option label="按天" :value="parseInt(1)"></el-option>
                <!--<el-option label="按周" :value="parseInt(travelReportForms)"></el-option>-->
                <el-option label="按月" :value="parseInt(3)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提前购买天数：" prop="secondaryTicketSellDay" v-if="+formTimeData.secondarySellType !== 3">
              <el-input
                type="number"
                placeholder="请输入提前购买天数"
                style="width:77%"
                v-model="formTimeData.secondaryTicketSellDay"
                oninput="if (value < 0) value = ''"></el-input>
            </el-form-item>
            <el-form-item label="提前购买天数：" v-else>
              <el-input
                disabled
                type="number"
                placeholder="请输入提前购买天数"
                style="width:77%"
                v-model="formTimeData.secondaryTicketSellDay"
                oninput="if (value < 0) value = ''"></el-input>
            </el-form-item>
            <el-row class="btn-group" style="text-align:right">
              <el-button type="primary" @click="saveTimeGroup">确认</el-button>
              <el-button type="info" @click="dialogTimeVisible = false">取消</el-button>
            </el-row>
          </el-form>
        </el-dialog>
        <div class="page-page">
          <el-pagination :current-page="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange"
            :page-sizes="page.pageSizes" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { ticketOpeningHeadSearch, ticketOpeningTableHead } from '@/utils/data'
import { timestampToTime, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'clientVersionManage',
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
      formModules: ticketOpeningHeadSearch,
      timestampToTime: timestampToTime,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      dialogMonthVisible: false,
      dialogTimeVisible: false,
      openDate: '',
      openTime: '',
      formMonthData: {
        monthTicketSellDay: '',
        monthTicketSellTime: ''
      },
      formTimeData: {
        secondaryTicketSellTime: '',
        secondaryTicketSellDay: '',
        secondarySellType: 1
      },
      // searchData: [],
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    this.$parent.doClearObj()
		this.$emit('getInfo', ticketOpeningHeadSearch)
		this.$emit('getTable', ticketOpeningTableHead)
		this.$emit('getPage', this.page)
    this.rmList = setOperation('ticketOpening')
    this.getAllChannel()
  },
  methods: {
    // refresh() {
    //   this.getTableData(this.searchData)
    // },
    // initCheckList() {
    //   ticketOpeningTableHead.forEach(item => {
    //     // 默认全选
    //     this.tableHeaderCheckList.push(item.label)
    //   })
    // },
    // doSearch() {
    //   this.searchData = []
    //   let formData = this.$refs.searchForm.getFormData()
    //   for (const key in formData) {
    //     if (key == 'classType') {
    //       switch (formData[key]) {
    //         case '早班':
    //           this.searchData[key] = 'orderReportForms'
    //           break
    //         case '晚班':
    //           this.searchData[key] = 'travelReportForms'
    //           break
    //         default:
    //           break
    //       }
    //     } else if (key == 'channelId') {
    //       this.channelList.map((item, index) => {
    //         if (item.channelName == formData[key]) {
    //           this.searchData[key] = item.channelId
    //         }
    //       })
    //     } else {
    //       this.searchData[key] = Trim(formData[key])
    //     }
    //   }
    //   this.searchData['pageSize'] = this.page.pageSize
    //   this.searchData['pageNum'] = orderReportForms
    //   this.page.pageNum = orderReportForms
    //   this.getTableData(this.searchData)
    // },
    // doClearObj() {
    //   this.$refs.searchForm.clearForm()
    //   this.page.pageNum = orderReportForms
    //   this.page.pageSize = 10
    //   clearObj(this.searchData)
    //   this.getTableData(this.page)
    // },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let ids = []
      checkedArr.forEach((item, index) => {
        ids.push(item.scheduleId)
      })
      this.checkedRow = ids
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
      net.apiGet(api.TicketOpening.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    saveMonthGroup () { // 保存月票时间设置
      this.$refs['formMonthData'].validate((valid) => {
        if (valid) {
          this.formMonthData.scheduleIds = this.checkedRow
          net.apiPost(api.TicketOpening.ticketMonthSet, this.formMonthData).then(data => {
            if (data && data.code === enums.NET_SUCCESS) {
              this.dialogMonthVisible = false
              this.getTableData(this.searchData)
            } else {
              help.E(data.msg)
            }
          })
        }
      })
    },
    saveTimeGroup () { // 保存月票时间设置
      this.$refs['formTimeData'].validate((valid) => {
        if (valid) {
          if (this.formTimeData.secondarySellType === 3) {
            delete this.formTimeData.secondaryTicketSellDay
          } else {
            this.formTimeData.secondaryTicketSellDay = parseInt(this.formTimeData.secondaryTicketSellDay, 10)
          }
          this.formTimeData.nextMonthSecondarySellDate = parseInt(this.formTimeData.nextMonthSecondarySellDate, 10)
          this.formTimeData.scheduleIds = this.checkedRow
          net.apiPost(api.TicketOpening.ticketDarySet, this.formTimeData).then(data => {
            if (data && data.code === enums.NET_SUCCESS) {
              this.dialogTimeVisible = false
              this.getTableData(this.searchData)
            } else {
              help.E(data.msg)
            }
          })
        }
      })
    }
    // getAllChannel () { // 获取所有渠道
    //   net.apiGet(api.supply.optionList, { orzType: 1 }).then(data => {
    //     if (data && data.code === enums.NET_SUCCESS) {
    //       ticketOpeningHeadSearch[ticketOpeningHeadSearch.length - 1].option = []
    //       this.channelList = data.data
    //       data.data.map((item, index) => {
    //         ticketOpeningHeadSearch[ticketOpeningHeadSearch.length - 1].option.push({ label: item.orzName, value: item.orzId })
    //       })
    //     } else {
    //       help.E(data.msg)
    //     }
    //   })
    // }
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
