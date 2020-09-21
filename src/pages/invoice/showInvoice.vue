<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-header">
      <div class="page-search">
        <div class="page-search-btn">
          <el-button icon="el-icon-back" round plain type="primary" @click="back">返回</el-button>
        </div>
      </div>
    </div>
    <!-- divide -->
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length !== 0">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" border>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
            :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name != 'businessType'  && item.name !='orderState'">{{scope.row[item.name]}}</span>
              <span v-if="item.name=='orderState'">
                <span v-if="scope.row['orderState'] == 1">待支付</span>
                <span v-if="scope.row['orderState'] == 2">已支付</span>
                <span v-if="scope.row['orderState'] == 3">手动取消</span>
                <span v-if="scope.row['orderState'] == 4">自动取消</span>
              </span>
              <span v-if="item.name=='businessType'">
                <span v-if="scope.row['businessType'] == 1">定制公交</span>
                <span v-if="scope.row['businessType'] == 2">出行专线</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="page-page" style="margin-top: 20px;">
          <el-pagination :current-page.sync="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
            @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange"
            :page-sizes="page.pageSizes" :total="page.total">
          </el-pagination>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { invoiceOrderTableHead } from '@/utils/data.js'
import { clearObj, Trim, setOperation } from '@/utils/public.js'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper.js'
import enums from '@/utils/enums'
export default {
  name: 'invoice',
  data() {
    return {
      tableHeader: invoiceOrderTableHead,
      channelList: [],
      tableList: [],
      cityListArr: [],
      tableHeaderCheckList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      searchData: [],
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    this.getTableData(this.$route.query.invoiceId)
    this.initCheckList()
  },
  methods: {
    initCheckList () {
      invoiceOrderTableHead.forEach(item => {
        // 默认全选
        this.tableHeaderCheckList.push(item.label)
      })
    },
    sizeChange (pageSize) {
      this.searchData.pageSize = pageSize
      this.page.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange(pageNum) {
      this.searchData['pageNum'] = pageNum
      this.getTableData(this.searchData)
    },
    getTableData(invoiceId) {
      net.apiGet(api.invoice.info, { invoiceId: invoiceId }).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          // this.page.pageNum = data.data.page.pageNum
          // this.page.total = data.data.page.total
        } else {
          help.E(data.msg.message)
        }
      })
    },
    back() {
      sessionStorage.setItem('invoiceFlag', 'true')
      this.$router.back()
    }
  },
  components: {
    SearchForm
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
