<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button plain type="primary" @click="exportOrder" :disabled="!+page.total">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" border>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
							<span v-if="item.name === 'businessType'">
								<span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{ val.businessName }}</span>
							</span>
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
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { gatherDayLineHeadSearch, gatherDayLineTableHead } from '@/utils/data'
import { clearObj, setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'order',
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
    const isZero = (rule, value, callback) => {
      if (value != null && value != '') {
        console.log(value)
        if (value <= 0) {
          callback(new Error('必须大于0~'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      formModules: gatherDayLineHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
      options: [],
      businessTypeList: enums.BUSINESSTYPE // 业务类型
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.rmList = setOperation('gatherDayLine')
    this.$emit('getInfo', gatherDayLineHeadSearch)
    this.$emit('getTable', gatherDayLineTableHead)
    this.$emit('getPage', this.page)
    this.getCompanyList()
  },
  methods: {
    getCompanyList () {
      net.apiGet(api.channel.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          let list = data.data
          for (var i = 0; i < list.length; i++) {
            this.options[i] = { label: list[i].channelName, value: list[i].channelId }
          }
          gatherDayLineHeadSearch[(gatherDayLineHeadSearch.length - 1)].option = this.options
        } else {
          help.E(data.msg)
        }
      })
    },
    refresh () {
      this.getTableData(this.searchData)
    },
    initCheckList () {
      gatherDayLineTableHead.forEach(item => {
        // 默认全选
        this.tableHeaderCheckList.push(item.label)
      })
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      clearObj(this.searchData)
      this.getTableData()
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
      net.apiGet(api.gatherDayLine.list, params).then(data => {
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
    exportOrder () {
      let obj = { ...this.searchData }
      delete obj.pageNum
      delete obj.pageSize
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) { } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.gatherDayLine.export + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  },
  components: {
    SearchForm
  }
}
</script>

<style lang="less" type="text/less">
	@import '../../assets/style/set.less';
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
