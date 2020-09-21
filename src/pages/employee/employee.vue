<template>
  <div class="common-container">
    <div class="divide"></div>
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info"
           v-if="tableHeaderCheckList.length !== 0">
        <el-table header-row-class-name="tableHeader"
                  class="page-table-main"
                  :data="tableList"
                  border>
          <el-table-column v-for="(item, index) in tableHeader"
                           :key="index"
                           :label="item.label"
                           align="center"
                           :prop="item.name"
                           v-if="tableHeaderCheckList.indexOf(item.label) !== -1"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name!=='status'">{{scope.row[item.name]}}</span>
              <span v-if="item.name == 'status'">
                {{scope.row['status'] == 1? '启用' : '禁用'}}
              </span>
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
import { employeeHeadSearch, employeeTableHead } from '@/utils/data.js'
import { clearObj, Trim, setOperation } from '@/utils/public.js'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper.js'
import enums from '@/utils/enums'
import { toFen } from '../../utils/public'
export default {
  name: 'order',
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
    const isZero = (rule, value, callback) => {
      if (value != null && value != '') {
        cosnole.log(value)
        if (value <= 0) {
          callback(new Error('必须大于0~'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      formModules: employeeHeadSearch,
      // tableHeader: employeeTableHead,
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
    }
  },
  mounted() {
    this.$parent.doClearObj()
    this.$emit('getInfo', employeeHeadSearch)
    this.$emit('getTable', employeeTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
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
      net.apiGet(api.employee.tableList, params).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          // this.page.pageSize = data.data.page.pageSize
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg.message)
        }
      })
    },
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
