<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addClassNotice')">新建公告</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          header-row-class-name="tableHeader"
          class="page-table-main"
          :data="tableList"
          :row-class-name="tableRowClassName">
          <el-table-column width="150px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group" style="display: flex;align-items: center;">
                <span class="action-btn blue" @click="modify(scope.row.classNoticeId,scope.row)">修改</span>
                <span class="action-btn danger" @click="del(scope.row.classNoticeId)">删除</span>
                <span @click="updateState(scope.row)" class="action-btn blue">{{ +scope.row.state === 1 ? '禁用' : '启用' }}</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name === 'noticeType'">
                <span v-if="+scope.row.noticeType === 1">班次公告</span>
                <span v-if="+scope.row.noticeType === 2">乘车日历页折扣描述</span>
                <span v-if="+scope.row.noticeType === 3">购票成功通知</span>
                <span v-if="+scope.row.noticeType === 4">发车提醒通知</span>
                <span v-if="+scope.row.noticeType === 5">线路公告</span>
              </span>
              <span v-else-if="item.name === 'businessType'">
                <span v-for="val in businessTypesList" v-if="scope.row.businessType == val.businessId">{{ val.businessName }}</span>
              </span>
              <span v-else-if="item.name === 'state'">{{ +scope.row.state === 1? '启用' : '禁用' }}</span>
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
            :total="page.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { classNoticeHeadSearch, classNoticeTableHead } from '@/utils/data'
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
      formModules: classNoticeHeadSearch,
      channelList: [], // 获取所有渠道列表
      tableList: [],
      businessTypesList: enums.BUSINESSTYPE1,
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      }
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('classNoticeList')
    // if (sessionStorage.getItem('classNoticeFlag') && searchData) {
    //   searchData = JSON.parse(searchData)
    //   let searchDataArr = []
    //   searchData.forEach(item => {
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
    this.$emit('getInfo', classNoticeHeadSearch, 'line')
    this.$emit('getTable', classNoticeTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    /* 对表格创建下标 */
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
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
      sessionStorage.setItem('classNoticeList', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addClassNotice',
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
      net.apiGet(api.classNotice.tableList, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    del (id) {
      this.$confirm('此操作将永久删除该券且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.classNotice.del, { noticeId: id }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
    },
    updateState (row) {
      let params = {}
      if (+row.state === 1) {
        params = { state: 0, classNoticeId: row.classNoticeId }
      } else {
        params = { state: 1, classNoticeId: row.classNoticeId }
      }
      net.apiPost(api.classNotice.forbidden, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          help.S('操作成功')
          this.tableList[row.index].state = params.state
        } else {
          help.E(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" type="text/less">
@import "../../assets/style/set.less";
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
