<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push('./addComnParam')">新建公共参数</el-button>
      </div>
      <div class="page-nav-btn-item fr"></div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body
          :tableHeaderCheckList="tableHeaderCheckList"
          :tableHeader="tableHeader"
          :tableList="tableList">
          <el-table-column slot="header" width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row)">修改</span>
                <!-- <span>
                  <span
                    class="action-btn"
                    :class="!+scope.row.state ? 'blue' : 'danger'"
                    @click="forbidden(scope.row)">{{ !+scope.row.state ? '启用' : '禁用' }}</span>
                </span> -->
              </el-row>
            </template>
          </el-table-column>
        </table-body>
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
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { comnParamManageHeadSearch, comnParamManageTableHead } from '@/utils/data'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'comnParamManage',
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
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      deleteInfo: {
        comnParamNumber: []
      },
      rmList: [],
      option: []
    }
  },
  components: { tableBody, pageInfo },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', comnParamManageHeadSearch)
    this.$emit('getTable', comnParamManageTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    forbidden (row) {
      net.apiPost(api.comnParam.forbidden, {
        commonParamterId: row.id,
        state: +row.state === 1 ? 0 : 1
      }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify (row) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('comnParamList', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addComnParam',
        query: { id: row.id }
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
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      delete params.pageSizes
      params.pageSize = this.page.pageSize
      net.apiGet(api.comnParam.tableList, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('comnParamFlag')
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
