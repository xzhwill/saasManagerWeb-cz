<template>
  <div class="common-container">
    <!-- 搜索 -->
    <!-- divide -->
    <!--<div class="divide"></div>-->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary"
                   @click="create">新建接口加密配置</el-button>
        <!-- <el-button @click="groupDel"
                   type="danger"
                   :disabled="checkedRow.length==0">批量删除</el-button> -->
      </div>
      <div class="page-nav-btn-item fr">
        <!-- 刷新按钮 -->
        <!-- <el-button type="info" icon="el-icon-refresh" @click="refresh"></el-button> -->
        <!--<el-popover placement="left" ref="popover" trigger="manual">-->
        <!--<div class="page-check-list">-->
        <!--<el-checkbox-group class="checkbox-list-info" v-model="tableHeaderCheckList" >-->
        <!--<el-checkbox v-for="(item, index) in tableHeader" :key="index" :label="item.label">{{ item.label }}</el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</div>-->
        <!--</el-popover>-->
        <!--<el-button icon="el-icon-setting" type="info" v-popover:popover></el-button>-->
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info"
           v-if="tableHeaderCheckList.length !== 0">
        <table-body
          :tableHeaderCheckList="tableHeaderCheckList"
          @selectionChange="selectionChange"
          :tableHeader="tableHeader"
          :tableList="tableList">
          <!-- <el-table-column slot="header"
                           type="selection"
                           width="80"></el-table-column> -->
          <el-table-column slot="footer"
                           width="130px"
                           align="center"
                           label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue"
                      @click="modify(scope.row.id,scope.row)">修改</span>
                <span>
                  <span class="action-btn danger"
                        @click="forbidden(scope.row,'0')"
                        v-if="scope.row.state == '1'">禁用</span>
                  <span class="action-btn danger"
                        @click="forbidden(scope.row,'1')"
                        v-if="scope.row.state == '0'">启用</span>
                </span>
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
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import tableBody from '@/pages/common/tableComponent.vue'
import pageInfo from '@/pages/common/setPage.vue'
import { interfaceEncryptHeadSearch, interfaceEncryptTableHead } from '@/utils/data.js'
import { clearObj, Trim, setOperation } from '@/utils/public.js'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper.js'
import enums from '@/utils/enums'
export default {
  name: 'interfaceEncrypt',
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
      // tableHeader: interfaceEncryptTableHead,
      tableList: [],
      checkedRow: [],
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
      option: [],
    }
  },
  created() {

    // this.getTableData(this.page)
  },
  mounted() {
    this.$parent.doClearObj()
    this.$emit('getInfo', interfaceEncryptHeadSearch)
    this.$emit('getTable', interfaceEncryptTableHead)
    this.$emit('getPage', this.page)
    this.init()
  },
  methods: {
    init() {
      this.getAllList()
    },
    create() {
      this.$router.push('./addInterfaceEncrypt')
    },
    refresh() {
      this.getTableData(this.searchData)
    },
    initCheckList() {
      interfaceEncryptTableHead.forEach(item => {
        // 默认全选
        this.tableHeaderCheckList.push(item.label)
      })
    },
    getAllList() {
      net.apiGet(api.channel.option).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          let list = data.data.list
          for (var i = 0; i < list.length; i++) {
            this.option.push({ label: list[i].channelName, value: list[i].channelId })
          }
          interfaceEncryptHeadSearch[0].option = this.option
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
          net.apiPost(api.interfaceEncrypt.del, params).then(data => {
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
    forbidden(row, state) {
      let params = row
      params['state'] = state
      net.apiPost(api.interfaceEncrypt.update, params).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.getTableData(this.page)
        } else {
          help.E(data.msg.message)
        }
      })
    },
    modify(id, row) {
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
        name: 'addInterfaceEncrypt',
        query: { id: id }
      })
    },
    // doSearch() {
    //   this.searchData = []
    //   let formData = this.$refs.searchForm.getFormData()
    //   for (const key in formData) {
    //     if (key == 'addTime' && formData['addTime'].length === travelReportForms && formData['addTime'][0] != 'undefind') {
    //       // 创建时间
    //       this.searchData['addStartTime'] = formData['addTime'][0] + ' 00:00:00'
    //       this.searchData['addEndTime'] = formData['addTime'][orderReportForms] + ' 23:59:59'
    //     } else if (key == 'cityCode') {
    //       this.option.map((item, index) => {
    //         if (item.label == formData[key]) {
    //           this.searchData[key] = item.value
    //         }
    //       })
    //     } else if (key == 'state') {
    //       switch (formData[key]) {
    //         case '禁用':
    //           this.searchData[key] = 0
    //           break
    //         case '可用':
    //           this.searchData[key] = orderReportForms
    //           break
    //         default:
    //           break
    //       }
    //     } else if (key != 'addTime') {
    //       this.searchData[key] = Trim(formData[key])
    //     }
    //   }
    //   this.searchData['pageSize'] = this.page.pageSize
    //   this.searchData['pageNum'] = orderReportForms
    //   this.page.pageNum = orderReportForms
    //   this.getTableData(this.searchData)
    // },
    doClearObj() {
      this.$refs.searchForm.clearForm()
      this.page.pageNum = 1
      this.page.pageSize = 10
      clearObj(this.searchData)
      this.getTableData(this.page)
    },
    selectionChange(checkedArr) { // 批量删除数组变化
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
      net.apiGet(api.interfaceEncrypt.tableList, params).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg.message)
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
