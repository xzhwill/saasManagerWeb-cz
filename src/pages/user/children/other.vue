<template>
  <div class="auth-main">
    <div class="auth-seach">
      <div class="auth-seach-item">
        <el-row>
          <el-col :span="4"><label class="label-tit">渠道UID：</label><el-input class="inp" placeholder="请输入渠道用户UID"></el-input></el-col>
          <el-col :span="4">
            <label class="label-tit">渠道类型：</label>
            <el-select class="inp" v-model="valuecCanal" placeholder="请选择">
              <el-option
                v-for="item in channeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4"><label class="label-tit">手机号：</label><el-input class="inp" placeholder="请输入手机号"></el-input></el-col>
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
          <el-col :span="8"><label class="label-tit">注册时间：</label>
            <el-date-picker class="inp-datatime"
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
            label="渠道UID"
            width="155">
          </el-table-column>
          <el-table-column
            prop="valuecCanal"
            label="渠道类型">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            width="180">
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
            prop="datatime"
            label="创建时间"
            sortable>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small">卡详情</el-button>
            </template>
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
import { otherUser } from '../../../utils/service'
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
      valueZc: '0',
      valuecCanal: '0',
      currentPage: 4
    }
  },
  computed: {
    ...mapState([
      'sexList',
      'licenList',
      'channeList'
    ])
  },
  mounted () {
    this.getOtherList(this.pageObj)
  },
  methods: {
    handleSizeChange (pageSize) {
      this.pageObj.pageNum = 1
      this.pageObj.pageSize = pageSize
      this.getOtherList(this.pageObj)
    },
    handleCurrentChange (pageNum) {
      this.pageObj.pageNum = pageNum
      this.getOtherList(this.pageObj)
    },
    getOtherList (params) { // 用户列表
      otherUser.otherUserList({
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
  width:140px;
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
.inp.el-select--mini{
  width:100px;
}
.el-range-editor--mini.el-input__inner{
  width: 330px;
}
</style>
