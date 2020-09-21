<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addActivity')">新建活动</el-button>
      </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column width="100px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="changeActivity(scope.row.bannerId)">修改</span>
                <span class="action-btn danger" @click="forbidden(scope.row)">
                  <span>{{ !+scope.row.state ? '启用' : '禁用' }}</span>
                </span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name === 'advertType'"><span>首页banner</span></span>
              <span v-else-if="item.name === 'businessType'">
                <span v-for="val in businessTypeList" v-if="scope.row[item.name] == val.businessId">{{val.businessName}}</span>
              </span>
              <span v-else-if="item.name === 'state'">
                <span>{{ !+scope.row.state ? '禁用' : '启用' }}</span>
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
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { activityHeadSearch, activityTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import request from '@/utils/request'
import api from '@/utils/api'
import helper from '@/utils/helper'
import enums from '@/utils/enums'

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
  data () {
    return {
      rmList: [],
      options: [],
      tableList: [],
      formModules: activityHeadSearch,
      operateInfo: enums.OPERATIONID,
      businessTypeList: enums.BUSINESSTYPE,
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      infoList: JSON.parse(sessionStorage.getItem('activityList'))
    }
  },
  components: { SearchForm },
  mounted () {
    // if (this.infoList && !this.infoList.length) {
    //   let searchDataArr = []
    //   this.infoList.forEach(item => {
    //     for (let key in item) {
    //       if (key === 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key === 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', activityHeadSearch)
    this.$emit('getTable', activityTableHead)
    this.$emit('getPage', this.page)
    this.rmList = setOperation('activityManage')
    this.getCompanyList()
  },
  methods: {
    /**
     * 改变每页的条数
     * @param pageSize：每页数量
     */
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    /**
     * 分页
     * @param pageNum：页码
     */
    currentChange (pageNum) {
      this.searchData['pageNum'] = pageNum
      this.getTableData(this.searchData)
    },
    /**
     * 获取表格数据
     * @param params：参数
     */
    getTableData (params) {
      if (params.startDate && params.startDate.length) {
        params.startTime = params.startDate[0]
        params.endTime = params.startDate[1]
        delete params.startDate
      }
      params.pageSize = this.page.pageSize
      request.apiGet(api.activity.list, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 点击修改
     * @param val：对应每条的ID
     */
    changeActivity (val) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('activityList', JSON.stringify(searchArr))
      this.$router.replace({
        name: 'addActivity',
        query: { id: val }
      })
    },
    /**
     * 点击禁止
     * @param row：对应每条的参数
     */
    forbidden (row) {
      let params = row
      if (+params.state === 1) {
        params.state = 0
      } else {
        params.state = 1
      }
      delete params.addTime
      delete params.updateTime
      request.apiPost(api.activity.forbidden, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          helper.S('修改成功')
          this.getTableData(this.searchData)
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 获取渠道列表
     */
    getCompanyList () {
      request.apiGet(api.channel.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          let list = data.data
          for (var i = 0; i < list.length; i++) {
            this.options[i] = {
              label: list[i].channelName,
              value: list[i].channelId
            }
          }
          activityHeadSearch[0].option = this.options
        } else {
          helper.E(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/style/set.less";
  @import "./activityManage.less";
</style>
