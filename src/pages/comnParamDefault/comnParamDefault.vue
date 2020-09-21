<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary"
                   @click="createList">配置默认公参列表</el-button>
        <el-button type="primary"
                   @click="showDialog">增加城市公共参数</el-button>
        <el-button @click="groupDel"
                   type="danger"
                   :disabled="checkedRow.length==0">批量删除</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info"
           v-if="tableHeaderCheckList.length !== 0">
        <table-body v-bind:tableHeaderCheckList="tableHeaderCheckList"
                    @selectionChange="selectionChange"
                    v-bind:tableHeader="tableHeader"
                    v-bind:tableList="tableList">
          <el-table-column slot="header" type="selection" width="80"></el-table-column>
          <el-table-column slot="footer"
                           width="130px"
                           align="center"
                           label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue"
                      @click="createParam(scope.row)">修改</span>
              </el-row>
            </template>
          </el-table-column>
        </table-body>
        <div class="page-page">
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
    <el-dialog title="增加城市公共参数"
               :visible.sync="dialogTableVisible"
               :append-to-body='isOk'
               width="30%">
      <el-form :rules="createCityRules"
               v-model="createCity"
               label-position="right"
               label-width="120px"
               ref="orderRefund">
        <el-form-item label="所属城市"
                      prop="cityCode">
          <el-select v-model="createCity.cityCode">
            <el-option v-for="(item, index) in cityList "
                       :key="index"
                       :label="item.cityName"
                       :value="item.cityCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary"
                   @click="saveCity">确定</el-button>
        <el-button type="danger"
                   @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { comnParamManageDefaultHeadSearch, comnParamDefaultTableHead } from '@/utils/data.js'
import { clearObj, Trim, setOperation } from '@/utils/public.js'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper.js'
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
  data() {
    return {
      formModules: comnParamManageDefaultHeadSearch,
      // tableHeader: comnParamDefaultTableHead,
      tableList: [],
      cityList: [],
      // tableHeaderCheckList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      dialogTableVisible: false,
      isOk: true,
      deleteInfo: {
        comnParamNumber: []
      },
      createCity: {
        cityCode: "",
        businessType: '0'
      },
      createCityRules: {

      },
      option: []
    }
  },
  created () {
    this.init()
  },
  mounted () {
    let searchData = sessionStorage.getItem('comnParamList')
    if (searchData) {
      searchData = (JSON.parse(searchData))
      let searchDataArr = []
      searchData.forEach(item => {
        for (let key in item) {
          if (key == 'pageNum') {
            this.page.pageNum = item[key]
          } else if (key == 'pageSize') {
            this.page.pageSize = item[key]
          }
          searchDataArr[key] = item[key]
        }
      })
      this.getTableData(searchDataArr)
    } else {
      this.$parent.doClearObj()
      // this.getTableData(this.page)
    }
    this.$emit('getInfo', comnParamManageDefaultHeadSearch)
    this.$emit('getTable',comnParamDefaultTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    init () {
      // this.initCheckList()
      this.getAllCityList()
    },
    createParam(row) {
      this.$router.push({
        name: 'addComnParamDefault',
        query: { id: row.id }
      })
    },
    showDialog() {
      this.dialogTableVisible = true
    },
    cancel() {
      this.dialogTableVisible = false
    },
    saveCity() {
      if (this.createCity.cityCode == '') {
        help.E('请选择城市')
        return
      }
      net.apiPost(api.parameterCity.createCity, this.createCity).then((data) => {
        if (data.msg.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          this.dialogTableVisible = false
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    createList() {
      this.$router.push('./addComnParamDefaultList')
    },
    getAllCityList() {
      net.apiGet(api.city.option).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          let list = data.data.list
          this.cityList = list
        } else {
          help.E(data.msg.message)
        }
      })
    },
    groupDel() {
      this.$confirm('此操作将永久删除且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 单条删除
          let params = {
            id: this.checkedRow
          }
          net.apiPost(api.parameterCity.del, params).then(data => {
            if (data.msg && data.msg.code === enums.NET_SUCCESS) {
              help.S('删除成功')
              this.getTableData(this.page)
            } else {
              help.E(data.msg.message)
            }
          })
        })
        .catch(() => { })
    },
    selectionChange(checkedArr) { // 批量删除数组变化
      console.log(checkedArr)
      let checkComnParamIds = []
      checkedArr.forEach((item, index) => {
        checkComnParamIds.push(item.id)
      })
      this.checkedRow = checkComnParamIds
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.searchData['pageSize'] = pageSize
      this.getTableData(this.searchData)
    },
    currentChange(pageNum) {
      this.searchData['pageNum'] = pageNum
      this.getTableData(this.searchData)
    },
    getTableData(params) {
      net.apiGet(api.parameterCity.tableList, params).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('comnParamFlag')
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
