<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="$router.push({ name: 'addUserGuide' })">新建用户指南</el-button>
        <el-button @click="groupDel" type="danger" :disabled="!checkedRow.length">批量删除</el-button>
        <el-button type="primary" @click="$router.push({ name: 'copyCity' })">一键复制</el-button>
      </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table
          stripe
          header-row-class-name="tableHeader"
          class="page-table-main"
          @selection-change="handleSelectionChange"
          :data="tableList">
          <el-table-column type="selection"  width="80"></el-table-column>
          <el-table-column width="80px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.id, scope.row)">修改</span>
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
              <span v-if="item.name === 'state'">{{ +scope.row.state === 1 ? '启用' : '禁用' }}</span>
              <span v-else-if="item.name === 'showMonth'">{{ +scope.row.showMonth === 1 ? '是' : '否' }}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 20px;">
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
import { userGuideManageHeadSearch, userGuideManageTableHead } from '@/utils/data'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'userGuideManage',
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
      formModules: userGuideManageHeadSearch,
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      pageNum: 1,
      deleteInfo: {
        userGuideNumber: []
      },
      operateInfo: enums.OPERATIONID,
      rmList: [],
      cityListArr: [],
      channelListArr: []
    }
  },
  components: {
    SearchForm
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', userGuideManageHeadSearch)
    this.$emit('getTable', userGuideManageTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    refresh () {
      this.getTableData(this.searchData)
    },
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        net.apiPost(api.userGuide.del, {
          guideIds: this.checkedRow,
          operationId: this.operateInfo.delete.operationId
        }).then(data => {
          if (data && (data.code === enums.NET_SUCCESS)) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.searchData.pageNum = 1
            this.getTableData({ ...this.page, ...this.searchData })
          } else {
            help.E(data.msg)
          }
        })
      })
    },
    modify (userGuideId, row) {
      console.log(userGuideId)
      console.log(row)
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('userGuideSearch', JSON.stringify(searchArr))
      // 去详情页面进行修改
      this.$router.push({
        name: 'addUserGuide',
        query: { id: userGuideId }
      })
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkpadIds = []
      checkedArr.forEach((item, index) => {
        checkpadIds.push(item.id)
      })
      this.checkedRow = checkpadIds
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.pageNum = pageNum
      this.searchData.pageNum = pageNum

      this.getTableData(this.searchData)
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      net.apiGet(api.userGuide.tableList, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('userGuideFlag')
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
  @import "./userGuideManage.less";
</style>
