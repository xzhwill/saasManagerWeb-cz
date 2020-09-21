<template>
  <div class="common-container">
    <!--<div class="divide"></div>-->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" v-if="rmList.indexOf(operateInfo.create.operationId) > -1" @click="create">新建清除缓存配置
        </el-button>
        <el-button @click="groupDel" type="danger" :disabled="!checkedRow.length"
          v-if="rmList.indexOf(operateInfo.delete.operationId)> -1">批量删除</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList"
          @selection-change="selectionChange" stripe>
          <el-table-column type="selection" width="80" v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
          </el-table-column>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
            :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                v-if="item.name != 'cacheKeyType' &&item.name!='cacheType'&&item.name!='db'">{{scope.row[item.name]}}</span>
              <span v-if="item.name == 'cacheKeyType'">{{scope.row[item.name] == 1 ? '普通' : 'hash'}}</span>
              <span v-if="item.name == 'cacheType'">{{scope.row[item.name] == 1 ? 'redis' : ''}}</span>
              <span v-if="item.name == 'db' && scope.row[item.name] == 0">定制公交</span>
              <span v-if="item.name == 'db' && scope.row[item.name] == 1">专线</span>
              <span v-if="item.name == 'db' && scope.row[item.name] == 8">订单服务</span>
              <span v-if="item.name == 'db' && scope.row[item.name] == 3">公共服务</span>
            </template>
          </el-table-column>
          <el-table-column width="80px" align="center" label="操作"
            v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.id,scope.row)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 20px;">
          <el-pagination :current-page.sync="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange"
            :page-sizes="page.pageSizes" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { clearChacheHeadSearch, clearChacheTableHead } from '@/utils/data'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'clearChache',
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
      formModules: clearChacheHeadSearch,
      // tableHeader: clearChacheTableHead,
      channelList: [],
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      checkedRow: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', clearChacheHeadSearch)
    this.$emit('getTable', clearChacheTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    create() {
      this.$router.push('./addCache')
    },
    modify(id) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      // 去详情页面进行修改
      this.$router.push({
        name: 'addCache',
        query: { id: id }
      })
    },
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        net.apiPost(api.cache.delete, { ids: this.checkedRow }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => { })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkRoleIds = []
      checkedArr.forEach((item, index) => {
        checkRoleIds.push(item.id)
      })
      this.checkedRow = checkRoleIds
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
      params.pageSize = this.page.pageSize
      net.apiGet(api.cache.tableList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('channelFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
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
