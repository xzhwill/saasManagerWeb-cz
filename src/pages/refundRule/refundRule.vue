<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">
        <el-button type="primary" @click="$router.push('./addReturnRuleConfiguration')">新建退款规则</el-button>
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
              <span v-if="item.name != 'state' && item.name !='businessType' && item.name !='changeType' && item.name !='cycleType' && item.name !='ticketType'">{{scope.row[item.name]}}</span>
              <span v-if="item.name === 'state'">{{scope.row['state'] == 1? '启用' : '禁用'}}</span>
              <span v-if="item.name === 'changeType'">
								<span v-if="scope.row['changeType'] == 1">改签</span>
								<span v-if="scope.row['changeType'] == 2">退票</span>
							</span>
              <span v-if="item.name === 'cycleType'">
								<span v-if="scope.row['cycleType'] == 1">固定</span>
								<span v-if="scope.row['cycleType'] == 2">循环</span>
							</span>
              <span v-if="item.name === 'ticketType'">
								<span v-if="scope.row['ticketType'] == 1">普通票</span>
								<span v-if="scope.row['ticketType'] == 2">通票</span>
							</span>
              <span v-else-if="item.name === 'businessType'" >
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{val.businessName}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" v-if="rmList.indexOf(operateInfo.create.operationId)> -1" @click="modify(scope.row.ruleId,scope.row)">修改</span>
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
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { returnRuleConfigurationSearch, returnRuleConfigurationTableHead } from '@/utils/data'
import { clearObj, Trim, setOperation } from '@/utils/public'
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
      formModules: returnRuleConfigurationSearch,
      channelList: [], // 获取所有渠道列表
      tableList: [],
      option: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
      businessTypeList: enums.BUSINESSTYPE
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('returnRuleConfigurationSearch')
    // if (searchData) {
    //   let searchDataArr = []
    //   JSON.parse(searchData).forEach(item => {
    //     for (let key in item) {
    //       if (key === 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key === 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       returnRuleConfigurationSearch.forEach(val => {
    //         if (val.name == key) {
    //           if (key === 'giveType') {
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
    returnRuleConfigurationSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
		this.$emit('getInfo', returnRuleConfigurationSearch)
		this.$emit('getTable', returnRuleConfigurationTableHead)
		this.$emit('getPage', this.page)
    this.rmList = setOperation('refundRule')
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    initCheckList () {
      returnRuleConfigurationTableHead.forEach(item => { // 默认全选
        this.tableHeaderCheckList.push(item.label)
      })
    },
    forbidden (row) {
      let params = { ruleId: row.ruleId, state: +row.state === 1 ? 0 : 1 }
      delete params.addTime
      delete params.updateTime
      net.apiPost(api.refundRule.forbidden, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.searchData)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify (id, row) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('returnRuleConfigurationSearch', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addReturnRuleConfiguration',
        query: { id: id }
      })
    },
    delBtnShow (activityStatus, couponStatus) {
      if (activityStatus == '1' && (couponStatus == '1' || couponStatus == '3' || couponStatus == '4')) return true
      return false
    },
    doSearch () {
      this.searchData = []
      let formData = this.$refs.searchForm.getFormData()
      for (const key in formData) {
        if (key === 'cityCode') {
          this.option.map((item, index) => {
            if (item.label == formData[key]) {
              this.searchData[key] = item.value
            }
          })
        } else {
          if (key === 'state') {
            if (formData[key] === '禁用') {
              this.searchData[key] = 0
            } else {
              this.searchData[key] = 1
            }
          } else {
            this.searchData[key] = Trim(formData[key])
          }
        }
      }
      this.searchData.pageSize = this.page.pageSize
      this.searchData.pageNum = 1
      this.page.pageNum = 1
      sessionStorage.removeItem('returnRuleConfigurationSearch')
      this.getTableData(this.searchData)
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      returnRuleConfigurationSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = []
        } else {
          item.data = ''
        }
      })
      sessionStorage.removeItem('returnRuleConfigurationSearch')
      this.page.pageNum = 1
      this.page.pageSize = 10
      clearObj(this.searchData)
      this.getTableData()
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
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      // if (params == undefined || params.pageNum == undefined) {
      //   params = {
      //     pageNum: orderReportForms,
      //     pageSize: 10
      //   }
      // }
      if (params.cityCode != undefined) {
        this.option.map((item, index) => {
          if (item.label == params.cityCode) {
            params.cityCode = item.value
          }
        })
      }
      net.apiGet(api.refundRule.tableList, {
        ...params,
        ...this.page
      }).then(data => {
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
