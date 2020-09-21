<template>
  <div class="common-container">
    <div class="divide"></div>
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary"
                   @click="createdNewDiscount">新建渠道需求侧配置</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info"
           v-if="tableHeaderCheckList.length !== 0">
        <el-table header-row-class-name="tableHeader"
                  class="page-table-main"
                  :data="tableList"
                  @selection-change="selectionChange"
                  border>
          <el-table-column v-for="(item, index) in tableHeader"
                           :key="index"
                           :label="item.label"
                           align="center"
                           :prop="item.name"
                           v-if="tableHeaderCheckList.indexOf(item.label) !== -1"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name!=='state'&& item.name!=='encryptType'">{{scope.row[item.name]}}</span>
              <span v-if="item.name == 'state'">
                {{scope.row['state'] == 1? '启用' : '禁用'}}
              </span>
              <span v-if="item.name=='encryptType'">
                <span v-if="scope.row['encryptType'] == 1">RSA加密</span>
                <span v-if="scope.row['encryptType'] == 2">MD5加密</span>
                <span v-if="scope.row['encryptType'] == 3">SM2</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px"
                           align="center"
                           label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue"
                      @click="modify(scope.row.id,scope.row)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page"
             style="margin-top: 20px;">
          <el-pagination :current-page.sync="page.pageNum"
                         background
                         layout="total, prev, pager, next, jumper, sizes"
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
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { channelBusinessHeadSearch, channelBusinessTableHead } from '@/utils/data.js'
import { clearObj, Trim, setOperation } from '@/utils/public.js'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper.js'
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
  data() {
    return {
      formModules: channelBusinessHeadSearch,
      // tableHeader: channelBusinessTableHead,
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
  created() {

    // this.getTableData(this.page)
  },
  mounted() {
    this.$parent.doClearObj()
    this.$emit('getInfo', channelBusinessHeadSearch)
    this.$emit('getTable', channelBusinessTableHead)
    this.$emit('getPage', this.page)
    this.init()
  },
  methods: {
    init() {
      this.getAllList()
    },
    getAllList() {
      net.apiGet(api.city.option).then(data => { // 城市
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          let cityListArr = data.data.list
          channelBusinessHeadSearch[0].option = []
          cityListArr.map((item) => {
            channelBusinessHeadSearch[0].option.push({
              label: item.cityName,
              value: item.cityCode
            })
          })
        }
      }).catch((data) => {
        help.E(data.msg)
      })
      net.apiGet(api.channel.option).then(data => { // 渠道
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          let channelList = data.data.list
          channelBusinessHeadSearch[1].option = []
          channelList.map((item) => {
            channelBusinessHeadSearch[1].option.push({
              label: item.channelName,
              value: item.channelId
            })
          })
        }
      }).catch((data) => {
        help.E(data.msg)
      })
      net.apiGet(api.comnParam.compList).then(data => { // 需求侧
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          let channelList = data.data.list
          channelBusinessHeadSearch[2].option = []
          channelList.map((item) => {
            channelBusinessHeadSearch[2].option.push({
              label: item.name,
              value: item.tenantId
            })
          })
        }
      }).catch((data) => {
        help.E(data.msg)
      })
    },
    createdNewDiscount() {
      this.$router.push('./addChannelBusiness')
    },
    refresh() {
      this.getTableData(this.searchData)
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
        name: 'addChannelBusiness',
        query: { id: id }
      })
    },
    selectionChange(checkedArr) { // 批量删除数组变化
      let checkRoleIds = []
      checkedArr.forEach((item, index) => {
        checkRoleIds.push(item.channelId)
      })
      this.checkedRow = checkRoleIds
    },
    doClearObj() {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      clearObj(this.searchData)
      this.getTableData()
    },
    sizeChange(pageSize) {
      this.searchData['pageSize'] = pageSize
      this.page.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange(pageNum) {
      this.searchData['pageNum'] = pageNum
      this.getTableData(this.searchData)
    },
    getTableData(params) {
      net.apiGet(api.channelBusiness.list, params).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('channelFlag')
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg.message)
        }
      })
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
