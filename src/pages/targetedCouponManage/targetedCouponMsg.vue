<template>
  <div class="common-container">
    <el-button type="primary" @click="back" style="margin-bottom:15px">返回定向发券</el-button>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table stripe header-row-class-name="tableHeader" class="page-table-main" :data="tableList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable="checkboxDisabled" width="80" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1"></el-table-column>
          <el-table-column show-overflow-tooltip v-for="(item, index) in tableHeader" :key="index" :label="item.label"
            align="center" :prop="item.name" v-show="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ scope.row[item.name]==0 ? '发券失败' : '发券成功' }}</span>
              <span v-else>{{ scope.row[item.name]?scope.row[item.name]:'-' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 15px;">
          <el-pagination background layout="total, prev, pager, next, jumper, sizes" @size-change="sizeChange" :page-size="page.pageSize"
            @current-change="currentChange" :current-page.sync="page.pageNum" :page-sizes="page.pageSizes" :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { targetedCouponMsgTableHead } from '@/utils/data'
import { clearObj, Trim, setOperation ,showDateStyle } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'targetedCouponMsg',
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
      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        // pageSizes: enums.PAGESIZES,
        total: 0
      },
      rmList: [],
      operateInfo: enums.OPERATIONID,
      row:{}
    }
  },
  mounted () {
    this.row=this.$route.query.row;
    this.$parent.doClearObj();
    this.$emit('getTable', targetedCouponMsgTableHead);
    this.$emit('getPage', this.page);
    this.rmList = setOperation('targetedCouponMsg');
  },
  methods: {
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkGroupDriverIds = [];
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.targetedCouponId);
      })
      this.checkedRow = checkGroupDriverIds;
    },
    refresh () {
      this.getTableData(this.searchData);
    },
    checkboxDisabled (row, index) {
      return true;
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1;
      this.searchData.pageNum = 1;
      this.searchData.pageSize = pageSize;
      this.page.pageSize = pageSize;
      this.getTableData(this.searchData);
    },
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum;
      this.getTableData(this.searchData);
    },
    getTableData (params) {
      console.log(params)
      params.operatorUserId=this.row.operatorUserId;
      params.channelId=this.row.channelId;
      params.groupTemplateId=this.row.groupTemplateId;
      params.sendTime= showDateStyle(this.row.sendTime);
      params.pageSize = this.page.pageSize;
      net.apiPost(api.sendCoupon.detail, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list;
          this.page.pageNum = data.data.page.pageNum;
          this.page.total = data.data.page.total;
          for(let i=0;i<this.tableList.length;i++){
            this.tableList[i].sendTimeStr=showDateStyle(this.tableList[i].sendTime)
            this.tableList[i].index=i+1
          }
        } else {
          help.E(data.msg);
        }
      })
    },
    back () {
      this.$router.back();
    }
  },
  components: {
    SearchForm
  }
}
</script>

<style lang="less" type="text/less">
@import '../../assets/style/set.less';
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