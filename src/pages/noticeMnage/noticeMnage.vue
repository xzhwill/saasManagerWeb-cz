<template>
    <div class="common-container">
      <!--新建公告-->
      <div class="page-nav-btn clearfix">
        <div class="page-nav-btn-item fl">
          <el-button
            type="primary"
            @click="createdNotice"
          >新建公告</el-button>
        </div>
      </div>
      <!--表格+分页-->
      <div class="table-container">
        <div class="page-table-info" v-if="tableHeaderCheckList.length !== 0">
          <el-table header-row-class-name="tableHeader" class="page-table-main" :data="tableList" stripe>
            <el-table-column width="100px" align="center" label="操作">
              <template slot-scope="scope">
                <el-row class="action-btn-group">
                <span
                  class="action-btn blue"
                  @click="changeActivity(scope.row.itemId)"
                >修改</span>
                  <span class="action-btn danger" @click="forbidden(scope.row)">
                  <span>{{scope.row.state == 0 ? '启用' : '禁用'}}</span>
                </span>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.name != 'itemType' && item.name !='businessType' && item.name != 'state'">{{scope.row[item.name]}}</span>
                <span v-if="item.name == 'itemType'">
                <span v-if="scope.row['itemType'] == 1">广播活动</span>
                <span v-if="scope.row['itemType'] == 2">首页banner</span>
              </span>
                <span v-if="item.name == 'businessType'">
                <span v-if="scope.row['businessType'] == '1'">企业班车</span>
              </span>
                <span v-if="item.name == 'state'">
                <span v-if="scope.row['state'] == 0">禁用</span>
                <span v-if="scope.row['state'] == 1">启用</span>
              </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-page">
            <el-pagination
              :current-page.sync="page.pageNum"
              background
              layout="total, prev, pager, next, jumper, sizes"
              @size-change="sizeChange"
              :page-size="page.pageSize"
              @current-change="currentChange"
              :page-sizes="page.pageSizes"
              :total="page.total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SearchForm from "@/pages/common/SearchForm/SearchForm.vue";
import { noticeHeadSearch, noticeTableHead } from "@/utils/data.js";
import { clearObj, Trim, setOperation } from "@/utils/public.js";
import request from "@/utils/request";
import api from "@/utils/api";
import helper from "@/utils/helper.js";
import enums from "@/utils/enums";
export default {
  name: "noticeMnage",
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
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      }
    }
  },
  created () {},
  mounted () {},
  methods: {

  }
}
</script>

<style scoped>

</style>
