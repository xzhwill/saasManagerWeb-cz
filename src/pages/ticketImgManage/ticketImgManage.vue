  <template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button @click="addTicketImg()" type="primary">新建票面</el-button>
      </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="ticketImgList" stripe>
          <el-table-column width="180px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="addTicketImg(scope.row.displayId)">修改</span>
                <span class="action-btn danger" @click="stopUse(scope.row)">
                  <span>{{ +scope.row.state ? '禁用' : '启用' }}</span>
                </span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tableHeader"
            :key="index"
            :label="item.label"
            :prop="item.name"
            v-if="tableHeaderCheckList.indexOf(item.label) !== -1"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用'}}</span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
          <el-pagination
            :current-page.sync="page.pageNum"
            background layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange"
            :page-size="page.pageSize"
            @current-change="currentChange"
            :page-sizes="page.pageSizes"
            :total="page.total">
          </el-pagination>
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
import { ticketImgHeadSearch, ticketImgTableHead } from '@/utils/data'

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
      ticketImgList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      checkedRow: [],
      rmList: []
    }
  },
  mounted () {
    // let searchData = sessionStorage.getItem('ticketImgSearch')
    // if(searchData){
    //   searchData = (JSON.parse(searchData))
    //   let searchDataArr = []
    //   searchData.forEach(item => {
    //     for (let key in item){
    //       if(key == 'pageNum'){
    //         this.page.pageNum = item[key]
    //       } else if(key == 'pageSize'){
    //         this.page.pageSize = item[key]
    //       }
    //       ticketImgHeadSearch.forEach(val => {
    //         if(val.name == key){
    //           if(key == 'state'){
    //             if(item[key] == orderReportForms){
    //               val.data = '启动'
    //             } else {
    //               val.data = '禁用'
    //             }
    //           } else {
    //             val.data = item[key]
    //           }
    //         }
    //       })
    //       searchDataArr[key] = item[key]
    //     }
    //   })
    //   this.getTableData(searchDataArr)
    // } else {
    ticketImgHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = []
      } else {
        item.data = ''
      }
    })
    this.$parent.doClearObj()
    // }
    this.$emit('getInfo', ticketImgHeadSearch, 'line')
    this.$emit('getTable', ticketImgTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    getTableData (params) {
      delete params.pageSizes
      params.pageSize = this.page.pageSize
      request.apiGet(api.ticketDisplay.list, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.ticketImgList = data.data.list
          this.ticketImgList.forEach(item => {
            if (item.channelNameList) item.channelNameList = item.channelNameList.join(',')
            if (item.cityNameList && item.cityNameList.length) item.cityNameList = item.cityNameList.join(',')
            // let businessLits = []
            // if (item.businessTypeList && item.businessTypeList.length) {
            //   item.businessTypeList.forEach(items => {
            //     enums.LINEBUSINESS.forEach(val => {
            //       if (items === val.businessId) {
            //         businessLits.push(val.businessName)
            //       }
            //     })
            //   })
            //   item.businessTypeList = businessLits.join(',')
            // }
          })
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          helper.E(data.msg)
        }
      })
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkLineIds = []
      checkedArr.forEach((item, index) => {
        checkLineIds.push(item.lineId)
      })
      this.checkedRow = checkLineIds
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
    stopUse (item) {
      request.apiPost(api.ticketDisplay.forbidden, {
        state: !+item.state ? '1' : '0',
        id: item.displayId
      }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.getTableData(this.searchData)
          helper.S('操作成功')
        } else {
          helper.E(data.msg)
        }
      })
    },
    addTicketImg (id) {
      let searchArr = []
      for (let key in this.searchData) {
        if (this.searchData) {
          let obj = {}
          obj[key] = this.searchData[key]
          searchArr.push(obj)
        }
      }
      sessionStorage.setItem('ticketImgSearch', JSON.stringify(searchArr))
      this.$router.push({
        name: 'addTicketImg',
        query: { id: id }
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
