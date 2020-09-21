<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" v-if="rmList.indexOf(operateInfo.create.operationId) > -1" @click="createdNewDiscount">新建城市</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <table-body
          :tableHeaderCheckList="tableHeaderCheckList"
          @selectionChange="selectionChange"
          :tableHeader="tableHeader"
          :tableList="tableList">
          <!-- <el-table-column slot="header" type="selection" width="80"></el-table-column> -->
          <el-table-column slot="footer" style="width:130px" align="center" label="操作"
            v-if="rmList.indexOf(operateInfo.change.operationId) > -1">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row.cityCode,scope.row)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </table-body>
        <pageInfo :page="page" ref="pageInfo" @changeSize="sizeChange" @changeCurrent="currentChange"></pageInfo>
      </div>
    </div>
  </div>
</template>
<script>
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { cityHeadSearch, cityTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'cityManage',
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
      formModules: cityHeadSearch,
      // tableHeader: cityTableHead,
      channelList: [],
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
    // let searchData = sessionStorage.getItem('cityList')
    // if (sessionStorage.getItem('cityFlag') && searchData) {
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
    //       cityHeadSearch.forEach(val => {
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
    this.rmList = setOperation('cityManage')
    this.$emit('getInfo', cityHeadSearch)
    this.$emit('getTable', cityTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    createdNewDiscount () {
      this.$router.push('./addCity')
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
      sessionStorage.setItem('cityList', JSON.stringify(searchArr))
      this.$router.push({ // 去详情页面进行修改
        name: 'addCity',
        query: { id: id }
      })
    },
    selectionChange (checkedArr) { // 批量删除数组变化
      let checkMenuIds = []
      checkedArr.forEach((item, index) => {
        checkMenuIds.push(item.cityCode)
      })
      this.checkedRow = checkMenuIds
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.searchData.pageSize = pageSize
      this.page.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.searchDatapageNum = pageNum
      this.getTableData(this.searchData)
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      net.apiGet(api.city.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('cityFlag')
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
