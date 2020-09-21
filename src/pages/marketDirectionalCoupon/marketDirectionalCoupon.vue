<!-- 活动列表 -->
<template>
  <div class="common-container">
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button @click="addCoupon(0)" type="primary">单用户补券</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
          <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.name == 'state'">{{scope.row[item.name] == 1 ? '送券成功' : '送券失败'}}</span>
              <span v-else>{{scope.row[item.name]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="page.pageSizes"
          :page-size=10
          :current-page="page.pageNum"
          layout="total,prev,pager,next,sizes,jumper"
          :total=page.total
          style="float: right;"
        ></el-pagination>
      </div>
    </div>
    <!-- 添加单用户 -->
    <!--:visible.sync="dialogTableVisible" :append-to-body='isOk'-->
    <el-dialog @close="couponFormDialogClose" title="单用户补券" :modal="false " :visible.sync="couponFormVisible" width="40%" class="dialogClass" :before-close="cancelAddCoupon">
      <el-form :model="couponData" ref="addCouponForm" :rules="compensateRules" label-width="120px" :label-position="labelPosition">
        <el-form-item class="common-form-item" :label-width="labelWidth" label="渠道名称：" prop="channelId">
          <el-select v-model="couponData.channelId" @change="changeChannel">
            <el-option v-for="(item, index) in channelList" :key="index" :value="item.channelId" :label="item.channelName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联活动名称：" class="common-form-item" prop="activityId">
          <el-select v-model="couponData.activityId">
            <el-option
              v-for="(item, index) in relationList"
              :key="index"
              :value="item.activityId"
              :label="item.activityName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户手机号：" class="common-form-item" prop="phone">
          <el-input v-model="couponData.phone" type="text" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定</el-button>
        <el-button @click="cancelAddCoupon">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="loading"
      width="50%"
      :center="true"
      :modal-append-to-body="false"
      :show-close="false">
      <div v-loading="loading"></div>
      <div style="text-align: center;margin:50px">{{ message }}</div>
    </el-dialog>
  </div>
</template>
<script>
import { presentCouponHeadSearch, presentCouponTableHead } from '@/utils/data'
import { setOperation } from '@/utils/public'
import { compensateRules } from '@/utils/rules'
import net from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import api from '@/utils/api'

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
      compensateRules: compensateRules,
      channelList: [], // 存放品牌商列表
      relationList: [],
      labelPosition: 'right',
      labelWidth: '120px',
      couponFormVisible: false,
      tableList: [],
      couponData: {
        phone: '',
        channelId: '',
        activityId: ''
      },
      loading: false,
      message: '',
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      }
    }
  },
  mounted () {
    this.$parent.doClearObj()
    this.rmList = setOperation('marketDirectionalCoupon')
    this.$emit('getInfo', presentCouponHeadSearch)
    this.$emit('getTable', presentCouponTableHead)
    this.$emit('getPage', this.page)
  },
  methods: {
    changeChannel (val) {
      net.apiGet(api.marketActivity.option, {channelId: val}).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.relationList = data.data
        } else {
          helper.E(data.msg)
        }
      })
    },
    getTableData (params) {
      params.pageSize = this.page.pageSize
      net.apiGet(api.present.list, params).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list
          if (this.tableList) this.page = data.data.page
        } else {
          helper.E(data.msg)
        }
      })
      net.apiGet(api.channel.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        } else {
          helper.E(data.msg)
        }
      })
    },
    handleSizeChange (pageSize) { /* 更换每页个数 */
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    handleCurrentChange (pageNum) { /* 设置跳转页 */
      this.page.pageNum = pageNum
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    // ======== 添加券 ========
    couponFormDialogClose () {
      // 添加券dialog关闭
      this.couponFormVisible = false
    },
    addCoupon () {
      this.couponFormVisible = true
    },
    submitUpload () {
      this.$refs['addCouponForm'].validate(valid => {
        if (valid) {
          let params = ''
          params = this.couponData
          this.$confirm('<div>你是否确认保存以下信息?</div><div class="del-content">请谨慎检查所有信息项。</div>', '提示', {
            dangerouslyUseHTMLString: true,
            cancelButtonClass: 'btn-custom-cancel',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            net.apiGet(api.present.presentCoupon, params).then(data => {
              if (data.code === enums.NET_SUCCESS) {
                helper.S('创建成功')
                this.couponFormVisible = false
                this.getTableData()
              } else {
                helper.E(data.msg)
              }
            })
          })
        }
      })
    },
    cancelAddCoupon () { // 点击取消
      this.$refs.addCouponForm.resetFields()
      this.couponFormVisible = false
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
  .modalSpan {
    color: #aaa;
  }
  .del-content{
    font-size: 12px;
    color: gray;
  }
  .el-dialog{
    z-index: 2000;
    box-shadow: 0px 0px 10px 0px rgba(7, 0, 2, 0.3) !important;
    background: #fff;
    border-radius: 10px;
  }
</style>
