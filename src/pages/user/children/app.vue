<template>
  <div class="auth-main">
    <el-form ref="form" label-width="130px">
      <div class="seach-top">
        <div class="search-form-top">
          <el-form-item label="APP UID：">
            <el-input placeholder="请输入APP UID"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input placeholder="请输入手机号"></el-input>
          </el-form-item>
          <div class="el-form-button">
            <el-button type="primary">搜索</el-button>
            <el-button type="danger">清空</el-button>
            <el-button type="success" :icon="visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="toggle">{{ visible ? '收起': '展开' }}</el-button>
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="visible" class="search-form-cont">
            <el-form-item label="昵称：">
              <el-input placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="QQ UID：">
              <el-input placeholder="请输入渠道UID"></el-input>
            </el-form-item>
            <el-form-item label="微信 UID：">
              <el-input placeholder="请输入微信UID"></el-input>
            </el-form-item>
            <el-form-item label="支付宝 UID：">
              <el-input placeholder="请输入支付宝UID"></el-input>
            </el-form-item>
            <el-form-item label="性别：">
              <el-select class="inp-sex" v-model="valueSex" placeholder="请选择">
                <el-option
                  v-for="item in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户：">
              <el-select class="inp-sex" v-model="valueComon" placeholder="请选择">
                <el-option
                  v-for="item in comonList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册时间：">
              <el-date-picker class="inp-datatime"
                v-model="valueTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
               >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="证件类型：">
              <el-select class="inp-sex" v-model="valueZc" placeholder="请选择">
                <el-option
                  v-for="item in licenList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码：">
              <el-input placeholder="请输入证件号码"></el-input>
            </el-form-item>
            <el-form-item label="姓名：">
              <el-input placeholder="请输入手机号"></el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </div>
    </el-form>
    <div class="table-main">
      <div class="table-top">
        <!-- <span class="fl"><el-button type="primary">导出</el-button></span> -->
        <span class="fr">
          <el-button type="info" icon="el-icon-refresh" @click="getAppList()"></el-button>
          <el-popover
            placement="left"
            width="600"
            trigger="click">
            <div class="el-checkbox-item" v-for="(item, index) of tableMenu" :key="index">
              <el-checkbox :name="item.prop" v-model="item.isShow">{{item.label}}</el-checkbox>
            </div>
              <el-button slot="reference" type="info" icon="el-icon-setting"></el-button>
          </el-popover>
        </span>
      </div>
      <div class="table-body">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :default-sort = "{prop: 'datatime', order: 'descending'}">
          <el-table-column v-for="(item, index) of tableMenu" :key="index" v-if="item.isShow"
            :type="item.type"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.sortable">
          </el-table-column>

          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openMsgBox('1')">卡详情</el-button>
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
import { appUser } from '../../../utils/service'
import { mapState } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      tableData: [],
      tableMenu: {
        idItem: {
          isShow: true,
          prop: 'idlist',
          label: '序号',
          type: '',
          width: '60'
        },
        appItem: {
          isShow: true,
          prop: 'appuid',
          label: 'APP UID',
          type: '',
          width: '155'
        },
        phoneItem: {
          isShow: true,
          prop: 'phone',
          label: '手机号',
          type: '',
          width: ''
        },
        nameItem: {
          isShow: true,
          prop: 'name',
          label: '昵称',
          type: '',
          width: '85'
        },
        qqItem: {
          isShow: true,
          prop: 'qquid',
          label: 'QQ UID',
          type: '',
          width: ''
        },
        wxItem: {
          isShow: true,
          prop: 'wxuid',
          label: '微信UID',
          type: '',
          width: ''
        },
        aliItem: {
          isShow: true,
          prop: 'aliuid',
          label: '支付宝UID',
          type: '',
          width: ''
        },
        commoItem: {
          isShow: true,
          prop: 'comon',
          label: '商户',
          type: '',
          width: ''
        },
        dataItem: {
          isShow: true,
          prop: 'datatime',
          label: '注册时间',
          type: '',
          width: '',
          sortable: true
        },
        identypeItem: {
          isShow: true,
          prop: 'identype',
          label: '证件类型',
          type: '',
          width: ''
        },
        idenNumItem: {
          isShow: true,
          prop: 'idenumber',
          label: '证件号码',
          type: '',
          width: ''
        },
        unameItem: {
          isShow: true,
          prop: 'uname',
          label: '姓名',
          type: '',
          width: ''
        },
        sexItem: {
          isShow: true,
          prop: 'sex',
          label: '性别',
          type: '',
          width: ''
        },
        phoneTypeItem: {
          isShow: true,
          prop: 'phonetype',
          label: '手机型号',
          type: '',
          width: ''
        }
      },
      pageObj: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      valueTime: ['', ''],
      valueSex: '0',
      valueComon: '0',
      valueZc: '0',
      visible: false
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
    this.getAppList(this.pageObj)
  },
  methods: {
    handleSizeChange (pageSize) {
      this.pageObj.pageNum = 1
      this.pageObj.pageSize = pageSize
      this.getAppList(this.pageObj)
    },
    handleCurrentChange (pageNum) {
      this.pageObj.pageNum = pageNum
      this.getAppList(this.pageObj)
    },
    getAppList (params) {
      params = params ? params : this.pageObj
      appUser.appUserList({
        params,
        cb: (data, page) => {
          this.tableData = data.list
          this.pageObj = { pageNum: 2, pageSize: 20, total: 120 }
        }
      })
    },
    toggle () {
      this.visible = !this.visible
    },
    openMsgBox (res) {
      let resHtml = `<table class="resTable">
        <thead>
          <tr>
            <th>卡名称</th>
            <th>卡类型</th>
            <th>领卡时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>金玛卡${res}</td>
            <td>后付+充值</td>
            <td>2018-03-22 12:32</td>
          </tr>
          <tr>
            <td>支付宝卡</td>
            <td>充值</td>
            <td>2018-05-10 09:15</td>
          </tr>
        </tbody>
      </table>`
      this.$alert(resHtml, '卡详情', {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false
      })
    }
  }
}
</script>

<style scoped>
.el-form-item, .el-form-button{
  width:32%;
  display: inline-block;
}
.el-form-button{
  text-align: right;
}
.seach-top{
  border-bottom:#e5e5e5 1px solid;
  padding: 20px 0;
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

.resTable{
  width: 100%;
  border: 1px solid #ccc;
}
.resTable td{
  border: 1px solid #ccc;
  text-align: center;
  height: 30px;
}
.resTable th{
  border: 1px solid #ccc;
  text-align: center;
  height: 30px;
}
.el-select{
  width: 100%;
}
.el-range-editor--small.el-input__inner{
  width: 100%;
}
.el-checkbox-item{
  display: inline-block;
  margin-left: 15px;
}
</style>
