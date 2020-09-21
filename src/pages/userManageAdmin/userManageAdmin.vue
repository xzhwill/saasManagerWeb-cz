<template>
  <div class="common-container">
    <!-- 搜索 -->
    <!--<div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-upload ref="upload" :on-change="readExcel" :http-request="upload" :limit="orderReportForms" :show-file-list="false"
          style="display:inline" :multiple="false" action v-if="rmList.indexOf(operateInfo.export.operationId)> -orderReportForms">
          <el-button type="primary" v-if="rmList.indexOf(operateInfo.export.operationId)> -orderReportForms">导入</el-button>
        </el-upload>
        <el-button type="primary" @click="exportExcel" :disabled="!+page.total">导出</el-button>
      </div>
    </div>-->
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe12
          @selection-change="handleSelectionChange"
          header-row-class-name="tableHeader"
          class="page-table-main"
          :data="tableList">
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用'}}</span>
              <span v-else-if="item.name === 'lastLoginClientType' && +scope.row[item.name] === 1">Android</span>
              <span v-else-if="item.name === 'lastLoginClientType' && +scope.row[item.name] === 2">IOS</span>
              <span v-else-if="item.name === 'lastLoginClientType' && +scope.row[item.name] === 3">微信小程序</span>
              <span v-else-if="item.name === 'lastLoginClientType' && +scope.row[item.name] === 4">支付宝小程序</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作"
            v-if="rmList.indexOf(operateInfo.changeSate.operationId) > -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <!-- <span class="action-btn blue" @click="modify(scope.row.userId,scope.row)">修改</span> -->
                <span class="action-btn danger" v-if="+scope.row.state === 1" @click="forbidden(scope.row.custId, 0)">禁用</span>
                <span class="action-btn blue" v-if="!+scope.row.state" @click="forbidden(scope.row.custId, 1)">启用</span>
              </el-row>
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
import { userManageHeadSearch, userManageTableHead } from '@/utils/data'
import { clearObj, setOperation, checkExcel } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'userManage',
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
      formModules: userManageHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', userManageHeadSearch)
    this.$emit('getTable', userManageTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('userManageAdmin')
    this.searchData.operationId = 1
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    initCheckList () {
      userManageTableHead.forEach(item => { // 默认全选
        this.tableHeaderCheckList.push(item.label)
      })
    },
    doClearObj () {
      this.$refs.searchForm.clearForm()
      clearObj(this.searchData)
      this.searchData.operationId = 1
      this.page.pageSize = 10
      this.searchData.pageNum = 1
      this.searchData.pageSize = 10
      this.getTableData(this.searchData)
    },
    handleSelectionChange (checkedArr) {
      // 批量删除数组变化
      let checkGroupActivityIds = []
      checkedArr.forEach((item, index) => {
        checkGroupActivityIds.push(item.activityId)
      })
      this.checkedRow = checkGroupActivityIds
    },
    readExcel (file) {
      let result = checkExcel(file, 3000)
      if (!result.isFlag) {
        help.E(result.errorMessage)
        this.$refs.upload.clearFiles()
      }
    },
    upload (file) {
      // 上传图片
      console.log(file.file)
      net.apiFile(api.user.import, 'file', file.file).then(data => {
        this.message = '导入中，请稍后。。。'
        this.loading = true
        setTimeout(() => {
          if (data.msg.code != enums.NET_SUCCESS) {
            help.E(data.msg.message)
            this.message = '导入失败'
          } else {
            if (data.data.data) {
              this.message =
                '导入失败，有' + data.data.data + '条异常数据，请前往导入失败数据中查看'
            } else {
              this.message = '导入成功'
            }
            this.getTableData(this.page)
          }
          setTimeout(() => {
            this.loading = false
            this.message = ''
          }, 2000)
        }, 1000)
        this.$refs.upload.clearFiles()
      })
    },
    exportExcel () {
      let params = this.searchData
      let obj = ({ ...params })
      delete obj['pageNum']
      delete obj['pageSize']
      let str = ''
      for (let key in obj) {
        if (obj[key] === undefined) { } else {
          str = str + key + '=' + obj[key] + '&'
        }
      }
      str = api.user.export + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    },
    forbidden (id, state) {
      let params = {
        custId: id,
        state: state
      }
      net.apiPost(api.user.forbidden, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.page.pageNum = pageNum
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      if (params.registerTime && params.registerTime.length) {
        params.registerStartTime = params.registerTime[0] + ' 00:00:00'
        params.registerEndTime = params.registerTime[1] + ' 23:59:59'
        delete params.registerTime
      }
      params.pageSize = this.page.pageSize
      net.apiGet(api.user.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
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
@import '../../assets/style/set.less';
/*.divide {*/
  /*background-color: #e5e5e5;*/
  /*height: 5px;*/
  /*width: 100%;*/
  /*margin-top: 10px;*/
  /*margin-bottom: 10px;*/
/*}*/
.el-table th,
.el-table .tableHeader {
  /*background-color: #e5e5e5;*/
  /*color: #333;*/
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
