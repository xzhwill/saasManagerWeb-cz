<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addMarketActivity')" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建活动</el-button>
        <!--<el-button @click="groupDel" type="danger" :disabled="checkedRow.length==0" v-if="rmList.indexOf(operateInfo.delete.operationId)> -orderReportForms">批量删除</el-button>-->
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
          <!--<el-table-column slot="header" type="selection" width="80"></el-table-column>-->
          <el-table-column slot="header" style="width:130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span
                  class="action-btn blue"
                  @click="modify(scope.row.activityId, scope.row)"
                  v-if="rmList.indexOf(operateInfo.change.operationId) > -1">{{ scope.row['activityStatus'] == 1 ? '修改': '查看' }}</span>
                <span
                  class="action-btn blue"
                  @click="forbidden(scope.row)"
                  v-if="rmList.indexOf(operateInfo.changeSate.operationId) > -1">
                  {{ scope.row['activityStatus'] == 1 ? '通过审核':(scope.row['activityStatus'] == 2 ? '发布': (scope.row['activityStatus'] == 3 ? '下线': '发布'))}}
                </span>
                <span
                  class="action-btn blue"
                  @click="createCoupon(scope.row.activityId, 1)"
                  v-if="rmList.indexOf(operateInfo.createCoupon.operationId)> -1 && scope.row['activityStatus'] == 2 && (scope.row['couponStatus'] == 1||scope.row['couponStatus'] == 4)">生券</span>
                <span
                  class="action-btn blue"
                  @click="selloutFlagCoupon(scope.row)"
                  v-if="rmList.indexOf(operateInfo.createCoupon.operationId)> -1 && scope.row['selloutFlag'] == '0' && scope.row['activityStatus'] != 1">售罄</span>
                <span
                  class="action-btn blue"
                  @click="showAppendCoupon(scope.row)"
                  v-if="rmList.indexOf(operateInfo.createCoupon.operationId)> -1 && (scope.row['couponStatus'] == 3) && scope.row['selloutFlag'] == '1'">补券</span>
              </el-row>
            </template>
          </el-table-column>
        </table-body>
        <pageInfo :page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
        <el-dialog title="补券" :visible.sync="couponVisible" :before-close="closeLayer">
          <el-form :model="createCouponInfo" :rules="rules" ref="ruleForm">
            <el-form-item :label="createCouponInfo.activityType == '1' ? '选择老人券' : '选择优惠券'" prop="templateId1">
              <el-select placeholder="请选择模板" v-model="createCouponInfo.templateId1" style="margin-right: 10px;" disabled>
                <el-option v-for="item in templateList" :label="item.templateName" :key="item.templateId" :value="item.templateId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="券的数量：" prop="launchQuantity1">
              <el-input style="width: 200px;" type="number" v-model="createCouponInfo.launchQuantity1" placeholder="券的投放量" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="选择新人券" prop="templateId2" v-if="createCouponInfo.activityType == '1'">
              <el-select placeholder="请选择模板" v-model="createCouponInfo.templateId2" style="margin-right: 10px;" disabled>
                <el-option v-for="item in templateList" :label="item.templateName" :key="item.templateId" :value="item.templateId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="券的数量：" prop="launchQuantity2" v-if="createCouponInfo.activityType == '1'">
              <el-input style="width: 200px;" type="number" v-model="createCouponInfo.launchQuantity2" placeholder="券的投放量" maxlength="10"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeLayer">取 消</el-button>
            <el-button type="primary" @click="appendCoupon">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { marketActivityHeadSearch, marketActivityTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'marketActivity',
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
    var isValidateInteger = (rule, value, callback) => {
      if (value != null && value != '') {
        if (!(value % 1 === 0 && value > 0)) {
          callback(new Error('请输入正整数!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      couponVisible: false, // 补券弹窗
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
      createCouponInfo: {
        activityId: '',
        activityType: '1',
        templateId1: '',
        launchQuantity1: '',
        templateId2: '',
        launchQuantity2: ''
      },
      templateList: [],
      rules: {
        launchQuantity1: [
          { required: true, message: '请输入补券数量', trigger: 'blur' },
          { validator: isValidateInteger, trigger: 'blur' }
        ],
        launchQuantity2: [
          { required: true, message: '请输入补券数量', trigger: 'blur' },
          { validator: isValidateInteger, trigger: 'blur' }
        ]
      },
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  components: {
    tableBody,
    pageInfo
  },
  mounted () {
    // let searchData = sessionStorage.getItem('marketActivity')
    // if (sessionStorage.getItem('marketActivityFlag') && searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item) {
    //       if (key === 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key === 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       searchDataArr[key] = item[key]
    //       marketActivityHeadSearch.forEach(val => {
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
    this.rmList = setOperation('marketActivity')
    this.$emit('getInfo', marketActivityHeadSearch)
    this.$emit('getTable', marketActivityTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    closeLayer () {
      this.couponVisible = false
      this.createCouponInfo.launchQuantity1 = ''
      this.createCouponInfo.launchQuantity2 = ''
    },
    refresh () {
      this.getTableData(this.searchData)
    },
    forbidden (item) {
      let params = {
        activityId: item.activityId,
        activityStatus: '2'
      }
      if (item.activityStatus == '1') {
        params.activityStatus = '2'
      } else if (item.activityStatus == '2') {
        params.activityStatus = '3'
      } else {
        params.activityStatus = '2'
      }
      if (params.activityStatus == '3') { //  发布前提为生券完成
        if (item.couponStatus != '3') { // 未生券或生券中或生券失败
          help.W('未生券~~')
          return
        } else { // 生券成功

        }
      } else {}
      net.apiPost(api.marketActivity.forbidden, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    selloutFlagCoupon (item) {
      net.apiPost(api.marketActivity.sellOut, {activityId: item.activityId}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    createCoupon (activityId) {
      net.apiPost(api.marketActivity.createCoupon, { activityId: activityId }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    /* 展示补券信息 */
    showAppendCoupon (item) {
      this.couponVisible = true
      if (item.templateId2 != '' || item.templateId2 != null || item.templateId2 != undefined) {
        this.createCouponInfo.activityType = '1'
      }
      net.apiGet(api.couponSingle.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          console.log(data, '***orderReportForms')
          this.templateList = data.data
          net.apiGet(api.couponGroup.option).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              console.log(data, '***travelReportForms')
              this.templateList = [...this.templateList, ...data.data]
            } else {
              help.E(data.msg)
            }
          })
        } else {
          help.E(data.msg)
        }
      })
      this.createCouponInfo.activityId = item.activityId
      this.createCouponInfo.templateId1 = item.templateId1
      this.createCouponInfo.templateId2 = item.templateId2
    },
    appendCoupon () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            activityId: this.createCouponInfo.activityId,
            appendQuantityList: [],
            templateList: []
          }
          if (this.createCouponInfo.activityType == '1') {
            params.templateList = [this.createCouponInfo.templateId1,this.createCouponInfo.templateId2]
            params.appendQuantityList = [this.createCouponInfo.launchQuantity1,this.createCouponInfo.launchQuantity2]
          } else {
            params.templateList = [this.createCouponInfo.templateId1]
            params.appendQuantityList = [this.createCouponInfo.launchQuantity1]
          }
          net.apiPost(api.marketActivity.appendCoupon, params).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              this.couponVisible = false
              this.getTableData(this.page)
            } else {
              help.E(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    modify (activityId) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('marketActivity', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addMarketActivity',
        query: { id: activityId }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkMenuIds = []
      checkedArr.forEach((item) => {
        checkMenuIds.push(item.activityId)
      })
      this.checkedRow = checkMenuIds
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
      net.apiGet(api.marketActivity.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('marketActivityFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
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
