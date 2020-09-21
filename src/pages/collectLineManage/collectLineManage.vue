<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push({name: 'addCollectLine'})">新建</el-button>
        <el-button type="danger" @click="del" :disabled="!checkedRow.length">批量删除</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" @selection-change="handleSelectionChange" :data="tableList" stripe>
          <el-table-column type="selection"  width="80"></el-table-column>
          <el-table-column width="80px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" disabled='true' @click="modify(scope.row.id)">修改</span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            align="center"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span>{{scope.row[item.name]}}<span v-if="item.name == 'runInterval'">分钟</span></span>
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
import { collectLineSearchHead, collectLineTableHead } from '@/utils/data'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'collectLine',
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
      cityList: [], // 获取所有渠道列表
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      operateInfo: enums.OPERATIONID,
      option: [],
      checkedRow: []
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', collectLineSearchHead)
    this.$emit('getTable', collectLineTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    modify (id) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      this.$router.push({ // 去详情页面进行修改
        name: 'addCollectLine',
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
    getTableData (params) { // 获取列表信息
      delete params.pageSizes
      params.pageSize = this.page.pageSize
      net.apiGet(api.lineGather.list, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkpadIds = []
      checkedArr.forEach((item) => {
        checkpadIds.push(item.id)
      })
      this.checkedRow = checkpadIds
    },
    del () {
      this.$confirm('此操作将永久删除该通知且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.lineGather.del, { idList: this.checkedRow }).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/set.less";
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
