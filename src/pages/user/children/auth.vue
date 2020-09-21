<template>
  <div class="auth-main">
    <div class="auth-seach">
      <div class="auth-seach-item">
        <el-row>
          <el-col :span="4"><label class="label-tit">用户UID：</label><el-input class="inp" placeholder="请输入用户UID"></el-input></el-col>
          <el-col :span="4"><label class="label-tit">姓名：</label><el-input class="inp" placeholder="请输入姓名"></el-input></el-col>
          <el-col :span="4">
            <label class="label-tit">性别：</label>
            <el-select class="inp" v-model="valueSex" placeholder="请选择">
              <el-option
                v-for="item in sexList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <label class="label-tit">证件类型：</label>
            <el-select class="inp" v-model="valueZc" placeholder="请选择">
              <el-option
                v-for="item in licenList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary">搜索</el-button>
            <el-button type="info">清空</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="auth-seach-item">
        <el-row>
          <el-col :span="6"><label class="label-tit">证件号码：</label><el-input class="inp-iden" placeholder="请输入证件号码"></el-input></el-col>
          <el-col :span="6"><label class="label-tit">手机号：</label><el-input class="inp" placeholder="请输入手机号"></el-input></el-col>
          <el-col :span="12"><label class="label-tit">创建时间：</label>
            <el-date-picker
              v-model="valueTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
             >
            </el-date-picker>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="line"></div>
    <div class="table-main">
      <div class="table-top">
        <span class="fl"><el-button type="primary">导出</el-button></span>
        <span class="fr">
          <el-button type="info" icon="el-icon-refresh"></el-button>
          <el-button type="info" icon="el-icon-setting"></el-button>
        </span>
      </div>
      <div class="table-body">
        <el-table
          :data="tableData"

          border
          style="width: 100%">
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            prop="uid"
            label="用户UID"
            width="155">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="85">
          </el-table-column>
          <el-table-column
            prop="identype"
            label="证件类型">
          </el-table-column>
          <el-table-column
            prop="idenumber"
            label="证件号码">
          </el-table-column>
          <el-table-column
            prop="iphone"
            label="手机号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="datatime"
            label="创建时间"
            sortable>
          </el-table-column>
        </el-table>
        <el-pagination class="page-main"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pageObj.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pageObj.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { authUser } from '../../../utils/service'
import { mapState } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      tableData: [],
      pageObj: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      valueTime: ['', ''],
      valueSex: '0',
      valueZc: '0'
    }
  },
  computed: {
    ...mapState([
      'sexList',
      'comonList',
      'licenList'
    ])
  },
  mounted () {
    this.getAuthList(this.pageObj)
  },
  methods: {
    handleSizeChange (pageSize) {
      // console.log(`每页 ${val} 条`)
      this.pageObj.pageNum = 1
      this.pageObj.pageSize = pageSize
      this.getAuthList(this.pageObj)
    },
    handleCurrentChange (pageNum) {
      // console.log(`当前页: ${val}`)
      this.pageObj.pageNum = pageNum
      this.getAuthList(this.pageObj)
    },
    getAuthList (params) { // 用户列表
      authUser.authUserList({
        params,
        cb: (data, page) => {
          this.tableData = data.list
          this.pageObj = { pageNum: 2, pageSize: 20, total: 120 }
        }
      })
    }
  }
}
</script>

<style>
.auth-seach{
  border-bottom:#e5e5e5 1px solid;
}
.inp{
  width:120px;
}
.inp-iden{
  width:160px;
}
.auth-seach-item{
  margin-bottom:15px;
}
.auth-seach{
  padding:15px;
}
.table-main{
  padding: 0 15px;
}
.table-top{
  width:100%;
  height:30px;
  margin-top:30px;
}
.el-table thead th{
  background: #f5f5f5;
}
.table-body{
  margin-top:10px;
}
.page-main{
  text-align: center;
  margin:30px auto;
}
</style>
