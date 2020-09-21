<template>
  <div class="common-container">
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table @selection-change="handleSelectionChange" header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column min-width="130px" align="center" label="操作" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
                <span
                  class="action-btn blue"
                  v-if="+scope.row.travelState === 1 && +scope.row.orderState === 2"
                  @click="modify(scope.row)">分配供给侧</span>
                <span
                  class="action-btn blue"
                  v-if="(+scope.row.travelState === 2 || +scope.row.travelState === 3) && +scope.row.orderState === 2"
                  @click="dispatchingCar(scope.row)">派车</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="160px"
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'charterType'">
                <span v-if="+scope.row.charterType === 1">单程</span>
                <span v-if="+scope.row.charterType === 2">全天</span>
                <span v-if="+scope.row.charterType === 3">往返</span>
                <span v-if="+scope.row.charterType === 4">半天</span>
              </span>
              <span v-else-if="item.name === 'parentState'">
                <span v-if="+scope.row.parentState === 1">待支付</span>
                <span v-if="+scope.row.parentState === 2">待派车</span>
                <span v-if="+scope.row.parentState === 3">待出行</span>
                <span v-if="+scope.row.parentState === 4">出行中</span>
                <span v-if="+scope.row.parentState === 5">已完成</span>
                <span v-if="+scope.row.parentState === 6">自动取消</span>
                <span v-if="+scope.row.parentState === 7">前台退款</span>
                <span v-if="+scope.row.parentState === 8">后台退款</span>
              </span>
              <span v-else-if="item.name === 'orderType'">
                <span v-if="+scope.row.orderType === 1">个人</span>
                <span v-if="+scope.row.orderType === 2">企业</span>
              </span>
              <span v-else>{{ scope.row[item.name] }}</span>
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
    <el-dialog title="派车操作" :visible.sync="dialogTableVisible" :append-to-body='isOk' width="50%" :before-close="handleClose">
      <el-form label-position="right" label-width="120px" ref="orderRefund">
        <el-form label-width="140px" class="demo-dynamic" style="margin-left: 0">
          <el-form-item :label="'车型:'+busTypeName"></el-form-item>
          <el-form-item class="box" v-for="(item,idx) in dispatchList" :key="idx">
            <el-form-item label="">
              <el-select @change="isGroupChange(item.busId, idx, 0, item.driverId)" v-model="item.busId" placeholder="请选择车辆">
                <el-option label="请选择车辆" :value="''"></el-option>
                <el-option v-for="(val,idx) in busInfoList" :value="val.busId" :key="idx" :disabled="val.disabled" :label="val.busNumber"></el-option>
              </el-select>
              <el-select @change="isGroupChange(item.busId, idx, 1, item.driverId)" v-model="item.driverId" placeholder="请选择司机">
                <el-option label="请选择司机" :value="''"></el-option>
                <el-option v-for="(val,idx) in driverList" :value="val.driverId" :key="idx" :disabled="val.disabled" :label="val.driverName"></el-option>
              </el-select>
              <el-button style="margin-left:10px" type="warning" plain v-if="idx > 0" @click.prevent="removeDriver(idx, 'all')" icon="el-icon-remove" class="btn"></el-button>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click.prevent="addDriver('all')" icon="el-icon-circle-plus" class="btn"></el-button>
          </el-form-item>
        </el-form>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="updateOrder">确定</el-button>
        <el-button type="danger" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配供给侧" :visible.sync="dialogOrzTableVisible" :append-to-body='isOk' width="50%">
      <el-form label-position="right" label-width="120px" ref="orderRefund">
        <el-form-item label="供给侧机构">
          <el-form label-width="140px" class="demo-dynamic" style="margin-left: 0">
            <el-select v-model="orzId" placeholder="请选择">
              <el-option label="无" :value="''"></el-option>
              <el-option v-for="(val,idx) in orzList" :value="val.orzId" :key="idx" :disabled="val.disabled" :label="val.orzName"></el-option>
            </el-select>
          </el-form>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="assignOrz">确定</el-button>
        <el-button type="danger" @click="dialogOrzTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { receiptManageHeadSearch, receiptManageTableHead } from '@/utils/data'
import { clearObj, timestampToTime } from '@/utils/public'
import net from '@/utils/request'
import help from '@/utils/helper'
import api from '@/utils/api'
import enums from '@/utils/enums'
import { setOperation } from '../../utils/public'

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
      formModules: receiptManageHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      action: 0,
      rmList: [],
      operateInfo: enums.OPERATIONID,
      allDatas: [],
      dispatchList: [{
        'busId': '',
        'driverId': '',
        'busNumber': '',
        'busTypeId': '',
        'busTypeName': '',
        'travelId': '',
        'busInfoList': [],
        'driverList': []
      }],
      isChange: false,
      busInfoList: [],
      driverList: [],
      busTypeName: '',
      arrLength: 2,
      allDataList: [],
      prizeOptionList: [],
      dialogTableVisible: false,
      dialogOrzTableVisible: false,
      isOk: true,
      changeArr: [],
      orderId: '',
      orzList: [],
      orzId: '',
      busTypeId: '',
      travelId: ''
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('receiptList')
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
    //       receiptManageHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           if (key === 'state') {
    //             if (!item[key] === 0) {
    //               val.data = '禁用'
    //             } else {
    //               val.data = '启用'
    //             }
    //           } else {
    //             val.data = item[key]
    //           }
    //         } else if (key === 'addStartTime' && val.name === 'addTime') {
    //           val.data.push(item['addStartTime'])
    //         } else if (key === 'addEndTime' && val.name === 'addTime') {
    //           val.data.push(item['addEndTime'])
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   console.log(searchDataArr, '******searchDataArr')
    //   this.getTableData(searchDataArr)
    // } else {
    receiptManageHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', receiptManageHeadSearch)
    this.$emit('getTable', receiptManageTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('receipt')
  },
  methods: {
    handleClose  () {
      this.dispatchList = [{
        busId: '',
        driverId: '',
        busNumber: '',
        busTypeId: '',
        busTypeName: '',
        travelId: '',
        busInfoList: [],
        driverList: []
      }]
      this.dialogTableVisible = false
    },
    isGroupChange (val, idx, type, isDriverId) {
      let busIdArr = []
      let driverIdArr = []
      // this.isChange = true
      this.dispatchList.map((item) => {
        if (item.busId != '') {
          busIdArr.push(item.busId)
        }
        if (item.driverId != '') {
          driverIdArr.push(item.driverId)
        }
      })
      this.dispatchList.forEach((item, index) => {
        for (let i = 0; i < this.busInfoList.length; i++) {
          if (busIdArr.indexOf((this.busInfoList[i].busId)) > -1) {
            item.busInfoList[i].disabled = true
          } else {
            item.busInfoList[i].disabled = false
          }
        }
        for (let j = 0; j < item.driverList.length; j++) {
          if (driverIdArr.indexOf((item.driverList[j].driverId)) > -1) {
            item.driverList[j].disabled = true
          } else {
            item.driverList[j].disabled = false
          }
        }
      })
      if (type == 0) {
        if (this.dispatchList[idx].busInfoList) {
          this.busInfoList.map((item, index) => {
            if (item.busId == val) {
              this.dispatchList[idx].driverId = item.frequencyDriverId
              this.dispatchList[idx].busNumber = item.busNumber
              this.dispatchList[idx].busNo = item.busNo
            }
            if (val == '') {
              this.dispatchList[idx].driverId = ''
              this.dispatchList[idx].busNumber = ''
              this.dispatchList[idx].busNo = ''
            }
          })
        }
      } else {
        this.driverList.map((item, index) => {
          if (item.driverId == val) {
            this.dispatchList[idx].driverId = item.driverId
            this.dispatchList[idx].busNumber = item.busNumber
          }
          if (isDriverId == '') {
            this.dispatchList[idx].busId = ''
            this.dispatchList[idx].busNumber = ''
          }
        })
      }
    },
    dispatchingCar (row) {
      this.orderId = row.orderId
      if (this.orderId) {
        net.apiGet(api.charterSupply.dispatchList, { orderId: this.orderId }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            var allData = data.data
            this.dialogTableVisible = true
            this.allDatas = []
            this.action = 0
            this.travelId = allData.travelId
            this.busTypeId = allData.busTypeId
            this.busInfoList = allData.busList
            this.driverList = allData.driverList
            this.dispatchList[0].busInfoList = [...allData.busList]
            this.dispatchList[0].driverList = [...allData.driverList]
            this.busTypeName = allData.busTypeName
            if (allData.dispatchList.length) {
              this.dispatchList = []
              let busIdArr = []
              let driverIdArr = []
              allData.dispatchList.forEach((item, index) => {
                busIdArr.push(item.busId)
                driverIdArr.push(item.driverId)
                this.dispatchList.push({
                  'busId': item.busId,
                  'driverId': item.driverId,
                  'busNumber': '',
                  'busTypeId': '',
                  'busTypeName': '',
                  'travelId': '',
                  'busInfoList': [...this.busInfoList],
                  'driverList': [...this.driverList]
                })
              })
              this.dispatchList.forEach((item, index) => {
                for (let i = 0; i < this.busInfoList.length; i++) {
                  if (busIdArr.indexOf((this.busInfoList[i].busId)) > -1) {
                    item.busInfoList[i].disabled = true
                  } else {
                    item.busInfoList[i].disabled = false
                  }
                }
                for (let j = 0; j < item.driverList.length; j++) {
                  if (driverIdArr.indexOf((item.driverList[j].driverId)) > -1) {
                    item.driverList[j].disabled = true
                  } else {
                    item.driverList[j].disabled = false
                  }
                }
              })
            }
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    assignOrz () {
      if (this.orzId) {
        net.apiPost(api.charterSupply.assign, {
          orderId: this.orderId,
          supplyId: this.orzId
        }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            this.dialogOrzTableVisible = false
            this.getTableData(this.searchData)
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    updateOrder () {
      let flag = true
      this.dispatchList.forEach((item) => {
        if (!item.busId || !item.driverId) {
          flag = false
          return help.W('必填项不能为空')
        }
      })
      if (!flag) return false
      net.apiPost(api.charterSupply.dispatch, {
        orderId: this.orderId,
        busTypeId: this.busTypeId,
        travelId: this.travelId,
        dispatchList: this.dispatchList
      }).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.page.pageNum = 1
          this.searchData.pageNum = 1
          this.getTableData(this.searchData)
          this.dialogTableVisible = false
          this.dialogOrzTableVisible = false
          this.handleClose()
          clearObj(this.refundOrder)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify (row) { // 去详情页面进行修改
      if (row.orderId) {
        this.getOrzList(row.cityCode)
        this.orderId = row.orderId
        this.dialogOrzTableVisible = true
      }
    },
    getOrzList (cityCode) {
      net.apiGet(api.supply.optionList, {
        orzType: 1,
        cityCode: cityCode
      }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orzList = data.data
        } else {
          help.E(data.msg)
        }
      })
    },
    handleSelectionChange (checkedArr) {
      // 批量删除数组变化
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
      if (params && params.travelState != undefined) {
        if (params.travelState === '未匹配') {
          params.travelState = 1
        } else if (params.travelState === '已匹配') {
          params.travelState = 2
        } else if (params.travelState === '已派车') {
          params.travelState = 3
        }
      }
      if (params && params.charterType !== undefined) {
        if (params.charterType === '按趟') {
          params.charterType = 1
        } else if (params.charterType === '按天') {
          params.charterType = 2
        }
      }
      params.pageSize = this.page.pageSize
      net.apiGet(api.charterSupply.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('ElectronicFlag')
          this.tableList = data.data.list
          if (this.tableList) {
            this.tableList.forEach((item, index) => {
              item.orderTime = timestampToTime(item.orderTime)
              item.startTime = timestampToTime(item.startTime)
              if (item.payAmt != '' && item.payAmt != 0) {
                item.payAmt = item.payAmt / 100
              }
              this.tableList[index].busList = item.busNumberList
            })
          }
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    addDriver (e) {
      this.dispatchList.push({
        'busId': '',
        'driverId': '',
        'busNumber': '',
        'busTypeId': '',
        'busTypeName': '',
        'travelId': '',
        'busInfoList': [...this.busInfoList],
        'driverList': [...this.driverList]
      })
      let busIdArr = []
      let driverIdArr = []
      // this.isChange = true
      this.dispatchList.map((item) => {
        if (item.busId != '') {
          busIdArr.push(item.busId)
        }
        if (item.driverId != '') {
          driverIdArr.push(item.driverId)
        }
      })
      this.dispatchList.forEach((item, index) => {
        for (let i = 0; i < this.busInfoList.length; i++) {
          if (busIdArr.indexOf((this.busInfoList[i].busId)) > -1) {
            item.busInfoList[i].disabled = true
          } else {
            item.busInfoList[i].disabled = false
          }
        }
        for (let j = 0; j < item.driverList.length; j++) {
          if (driverIdArr.indexOf((item.driverList[j].driverId)) > -1) {
            item.driverList[j].disabled = true
          } else {
            item.driverList[j].disabled = false
          }
        }
      })
    },
    removeDriver (idx, params) {
      if (params === 'all') {
        if (this.dispatchList.length > 1) {
          this.dispatchList.splice(idx, 1)
        } else {
          help.E('不能再删除了！')
        }
      }
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
