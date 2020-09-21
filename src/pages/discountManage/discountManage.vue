<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addDiscount')">新建折扣</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.id, scope.row)">修改</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row['monthTicketType'] === 1&&item.name === 'monthTicketDiscount'">
                <span v-if="scope.row['monthTicketDiscount'] ">{{scope.row['monthTicketDiscount']}}折</span>
              </span>
              <span v-else-if="scope.row['monthTicketType'] === 2 && item.name === 'monthTicketDiscount'">
                <span v-if="scope.row['monthTicketAmt'] > 0">{{scope.row['monthTicketAmtYuan']}}元</span>
              </span>
              <span v-else-if="item.name === 'businessType'">
                <span v-for="(item,index) in businessList" :key="index">
                  <span v-if="scope.row.businessType == item.businessId">{{item.businessName}}</span>
                </span>
              </span>
              <span v-else-if="item.name === 'discountType'">
                <span>{{ +scope.row.discountType === 1 ? '次票折扣' : '月票折扣' }}</span>
              </span>
              <span v-else >{{ scope.row[item.name] }}</span>
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
import { discountManageHeadSearch, discountManageTableHead } from '@/utils/data'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'discountManage',
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
      formModules: discountManageHeadSearch,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      businessList: enums.BUSINESSTYPE1,
      options: [],
      rmList: []
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', discountManageHeadSearch)
    this.$emit('getTable', discountManageTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    forbidden (row, state) {
      let params = row
      row.state = state
      net.apiPost(api.discount.update, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData()
        } else {
          help.E(data.msg.message)
        }
      })
    },
    modify (id) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('discountList', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addDiscount',
        query: { id: id }
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
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      delete params.pageSizes
      params.pageSize = this.page.pageSize
      net.apiGet(api.discount.list, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('discountFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    getCompanyList () {
      net.apiGet(api.channel.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          let list = data.data.list
          console.log(data)
          for (var i = 0; i < list.length; i++) {
            this.options[i] = { label: list[i].channelName, value: list[i].channelId }
          }
          discountManageHeadSearch[discountManageHeadSearch.length - 2].option = this.options
        } else {
          help.E(data.msg.message)
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
