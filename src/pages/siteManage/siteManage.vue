<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button
          type="primary"
          @click="exportExcel"
          :disabled="!page.total"
          v-if="rmList.indexOf(operateInfo.export.operationId)> -1">导出</el-button>
      </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="groupList" stripe>
          <el-table-column width="80px" align="center" label="操作" v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row)">修改</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1 && item.name !=='siteList'">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用'}}</span>
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
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { siteHeadSearch, siteTableHead } from '@/utils/data'
import { Trim, setOperation } from '@/utils/public'

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
  components: {
    SearchForm
  },
  data () {
    return {
      bodyUp: true,
      groupList: [],
      formModules: siteHeadSearch,
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      dialogVisible: false,
      busList: [],
      checkedBusList: [],
      binDingGroupId: '',
      rmList: [],
      option: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    this.$emit('getInfo', siteHeadSearch)
    this.$emit('getTable', siteTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('siteManage')
    this.$parent.doClearObj()
  },
  methods: {
    /**
     * 获取列表数据
     * @param params：参数
     */
    getTableData (params) {
      params.pageSize = this.page.pageSize
      request.apiGet(api.site.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.groupList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 修改
     * @param row：参数信息
     */
    modify (row) {
      this.$prompt('站点名称：' + row.siteName + '\n' + '站点ID：' + row.siteSid + '\n', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入新ID'
      }).then(({ value }) => {
        let pms = { ...row }
        pms.siteSid = Trim(value)
        request.apiPost(api.site.updateSite, pms).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            helper.S('修改成功')
            this.getTableData(this.searchData)
          } else {
            helper.E(data.msg)
          }
        })
      })
    },
    /**
     * 分页
     * @param pageNum：页码
     */
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    /**
     * 改变每页展示的条数
     * @param pageSize：每页展示多少条
     */
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    /**
     * 导出
     */
    exportExcel () {
      let obj = { ...this.searchData }
      delete obj['pageNum']
      delete obj['pageSize']
      let str = ''
      for (let key in obj) {
        if (obj[key] !== undefined) str += key + '=' + obj[key] + '&'
      }
      str = api.site.export + '?' + str
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      str = str + 'userId=' + userInfo.userId + '&token=' + userInfo.token + '&operationId=' + this.operateInfo.export.operationId
      location.href = str
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../assets/style/set.less';
  @import "./siteManage.less";
</style>
