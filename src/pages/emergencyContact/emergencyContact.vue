<template>
<div class="common-container">
    <div class="page-nav-btn clearfix">
       <div class="page-nav-btn-item fl">
         <el-button type="primary" @click="$router.push({name: 'addEmergencyContact'})">新建运营人员</el-button>
         <el-button type="danger" @click="del" :disabled="!checkedRow.length">删除</el-button>
        </div>
    </div>
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" @selection-change="handleSelectionChange" class="page-table-main" :data="tableList" stripe :row-class-name="tableRowClassName">
          <el-table-column type="selection"  width="80"></el-table-column>
          <el-table-column width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" disabled='true' @click="modify(scope.row.staffId)">修改</span>
                <span class="action-btn danger" @click="forbidden(scope.row)">
                  <span>{{ !+scope.row.state ? '启用' : '禁用'}}</span>
                </span>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
           :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">
                <span v-if="+scope.row.state === 0">禁用</span>
                <span v-if="+scope.row.state === 1">启用</span>
              </span>
              <span v-else-if="item.name === 'staffCityInfoList'">
                <span v-if="+scope.row.staffCityInfoList[0].dutyType === 1">运营人员</span>
                <span v-if="+scope.row.staffCityInfoList[0].dutyType === 2">紧急联系人</span>
              </span>
              <span v-else>{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page">
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
import { emergencyContactSearch, emergencyContactTableHead } from '@/utils/data'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'carpoolingList',
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
      channelList: [], // 获取所有渠道列表
      tableList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      operateInfo: enums.OPERATIONID,
      option: [],
      checkedRow: []
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.$emit('getInfo', emergencyContactSearch)
    this.$emit('getTable', emergencyContactTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    /* 对表格创建下标 */
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    modify (id) { // 去详情页面进行修改
      this.$router.push({
        name: 'addEmergencyContact',
        query: { id: id }
      })
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
      delete params.pageSizes
      sessionStorage.removeItem('emergencyContactListFlag')
      params.pageSize = this.page.pageSize
      net.apiGet(api.staff.list, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          this.tableList.forEach(item => {
            let cityList = []
            let dutyType
            item.staffCityInfoList.forEach(val => {
              cityList.push(val.cityName)
              dutyType = val.dutyType
            })
            item.cityName = cityList.join(',')
            if (item.dutyType == '1') {
              item.dutyType = '运营人员'
            } else if (item.dutyType == '1') {
              item.dutyType = '紧急联系人'
            }
          })
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
    forbidden (row) {
      let params = {
        staffId: row.staffId,
        persionId: row.persionId,
        state: +row.state === 1 ? 0 : 1
      }
      net.apiPost(api.staff.forbidden, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          help.S('修改成功')
          this.tableList[row.index].state = params.state
        } else {
          help.E(data.msg)
        }
      })
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkpadIds = []
      checkedArr.forEach((item, index) => {
        checkpadIds.push(item.staffId)
      })
      this.checkedRow = checkpadIds
    },
    del () {
      this.$confirm('此操作将永久删除该通知且不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.staff.delete, { staffIdList: this.checkedRow }).then(data => {
          if (data.msg && data.code === enums.NET_SUCCESS) {
            help.S('删除成功')
            this.page.pageNum = 1
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
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
