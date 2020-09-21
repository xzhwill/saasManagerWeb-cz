<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="createdNewChannel" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">新建渠道</el-button>
        <!-- <el-button @click="groupDel" type="danger" :disabled="checkedRow.length==0">批量删除</el-button> -->
      </div>
      <div class="page-nav-btn-item fr">
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body v-bind:tableHeaderCheckList="tableHeaderCheckList" @selectionChange="selectionChange"
          v-bind:tableHeader="tableHeader" v-bind:tableList="tableList">
          <el-table-column slot="footer" style="width:130px" align="center" label="操作"
            v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.id)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </table-body>
        <pageInfo v-bind:page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { channelManageHeadSearch, channelManageTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'channelManage',
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
      formModules: channelManageHeadSearch,
      // tableHeader: channelManageTableHead,
      tableList: [],
      // tableHeaderCheckList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      deleteInfo: {
        channelNumber: []
      },
      rmList: [],
      // searchData: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('channelList')
    // if (sessionStorage.getItem('channelFlag') && searchData) {
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item) {
    //       if (key == 'pageNum') {
    //         this.page.pageNum = item[key]
    //       } else if (key == 'pageSize') {
    //         this.page.pageSize = item[key]
    //       }
    //       searchDataArr[key] = item[key]
    //       channelManageHeadSearch.forEach(val => {
    //         if (val.name == key) {
    //           val.data = item[key]
    //         }
    //       })
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    this.$parent.doClearObj()
    // this.getTableData(this.page)
    // }
    this.rmList = setOperation('channel')
    this.$emit('getInfo', channelManageHeadSearch)
    this.$emit('getTable', channelManageTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    createdNewChannel() {
      this.$router.push('./addChannel')
    },
    groupDel () {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 单条删除
        net.apiPost(api.channel.del, { channelIds: this.checkedRow }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => { })
    },
    forbidden (row, state) {
      let params = row
      row.state = state
      net.apiPost(api.channel.update, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.page)
        } else {
          help.E(data.msg)
        }
      })
    },
    modify(channelId) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('channelList', JSON.stringify(searchArr))
      // 去详情页面进行修改
      this.$router.push({
        name: 'addChannel',
        query: { id: channelId }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkChannelIds = []
      checkedArr.forEach((item, index) => {
        checkChannelIds.push(item.channelId)
      })
      this.checkedRow = checkChannelIds
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
      net.apiGet(api.channel.list, params).then(data => {
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
  },
  components: {
    SearchForm,
    tableBody,
    pageInfo
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
