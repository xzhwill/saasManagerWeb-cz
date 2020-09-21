<template>
  <div class="common-container">
    <!-- 搜索 -->
    <div class="page-nav-btn clearfix">
      <div class="page-nav-btn-item fl">
        <el-button type="primary" @click="vouchersClick('1')">单用户发券</el-button>
        <el-button type="primary" @click="vouchersClick('2')">批量用户发券</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <div class="page-table-info" v-if="tableHeaderCheckList.length">
        <el-table stripe header-row-class-name="tableHeader" class="page-table-main" :data="tableList" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" :selectable="checkboxDisabled" width="80" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1"></el-table-column> -->
          <el-table-column show-overflow-tooltip v-for="(item, index) in tableHeader" :key="index" :label="item.label"
            align="center" :prop="item.name" v-show="tableHeaderCheckList.indexOf(item.label) !== -1">
            <template slot-scope="scope">
              <span v-if="item.name === 'state'">{{ !+scope.row[item.name] ? '禁用' : '启用' }}</span>
              <span v-else>{{ scope.row[item.name]?scope.row[item.name]:"-" }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" align="center" label="操作">
            <template slot-scope="scope">
              <el-row class="action-btn-group">
                <span class="action-btn blue" @click="modify(scope.row)">查看详情</span>
                <!-- <span class="action-btn danger" v-if="rmList.indexOf(operateInfo.changeSate.operationId)> -1" @click="forbidden(scope.row)">
                  <span>{{ !+scope.row.state ? '启用' : '禁用'}}</span>
                </span> -->
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-page" style="margin-top: 15px;">
          <el-pagination background layout="total, prev, pager, next, jumper, sizes" @size-change="sizeChange" :page-size="page.pageSize"
            @current-change="currentChange" :current-page.sync="page.pageNum" :page-sizes="page.pageSizes" :total="page.total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 单用户发券 -->
    <el-dialog :title="vouchersTitle" :visible.sync="vouchersVisible" width="500px" :modal-append-to-body='false'>
      <el-form label-width="130px" label-position="right" :rules="formRules" :model="vouchersMsg" ref="vouchersMsg">
        <!-- 选择渠道 -->
        <el-form-item label="选择渠道" prop="channelId">
          <el-radio-group v-model="vouchersMsg.channelId">
            <el-radio :label="item.channelId" v-for="item in channelTypeList" :key="item.channelId">{{item.channelName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 组合模板ID -->
        <el-form-item label="组合模板ID" prop="groupTemplateId" class="common-form-item">
          <el-input v-model="vouchersMsg.groupTemplateId" placeholder="请输入组合模板ID"></el-input>
        </el-form-item>
        <!-- 组合模板名称 -->
        <!-- <el-form-item label="组合模板名称" prop="groupTemplateName" class="common-form-item">
          <el-input v-model="vouchersMsg.groupTemplateName" placeholder="请输入组合模板名称"></el-input>
        </el-form-item> -->
        <!-- 用户手机号 -->
        <el-form-item label="用户手机号" prop="phone" class="common-form-item" v-show="typeStr=='1'">
          <el-input v-model="vouchersMsg.phone" placeholder="请输入用户手机号"></el-input>
        </el-form-item>
        <!-- 用户ID -->
        <el-form-item label="用户ID" prop="custUserId" class="common-form-item" v-show="typeStr=='1'">
          <el-input v-model="vouchersMsg.custUserId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <!-- 确认&&取消 -->
        <el-row class="btn-group" style="text-align:right">
          <el-button type="primary" @click="saveVouchers('1')">确认</el-button>
          <el-button type="info" @click="vouchersVisible = false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 批量用户发券 -->
    <el-dialog :title="vouchersTitle" :visible.sync="vouchersVisibleMore" width="500px" :modal-append-to-body='false'>
      <el-form label-width="130px" label-position="right" :rules="formRulesMore" :model="vouchersMsgMore" ref="vouchersMsgMore">
        <!-- 选择渠道 -->
        <el-form-item label="选择渠道" prop="channelId">
          <el-radio-group v-model="vouchersMsgMore.channelId">
            <el-radio :label="item.channelId" v-for="item in channelTypeList" :key="item.channelId">{{item.channelName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 组合模板ID -->
        <el-form-item label="组合模板ID" prop="groupTemplateId" class="common-form-item">
          <el-input v-model="vouchersMsgMore.groupTemplateId" placeholder="请输入组合模板ID"></el-input>
        </el-form-item>
        <!-- 组合模板名称 -->
        <!-- <el-form-item label="组合模板名称" prop="groupTemplateName" class="common-form-item">
          <el-input v-model="vouchersMsgMore.groupTemplateName" placeholder="请输入组合模板名称"></el-input>
        </el-form-item> -->
        <!-- 发券模板 -->
        <el-form-item label="发券模板" class="common-form-item">
          <el-button type="primary" @click="downModel()">点击下载发券模板</el-button>
        </el-form-item>
        <!-- 上传发券模板 -->
        <el-form-item label="上传发券模板" class="common-form-item common-form-item-upload">
          <el-button type="primary">点击上传发券模板</el-button><span style="margin-left: 10px">{{fileName}}</span>
          <el-upload class="upload-excel" ref="upload" :on-change="readExcel" :http-request="upload" :show-file-list="false"
            style="" :multiple="false" action>
          </el-upload>
          <div>文件格式只能支持xls,xlsx,文件大小不能超过3M</div>
        </el-form-item>
        <!-- 确认&&取消 -->
        <el-row class="btn-group" style="text-align:right">
          <el-button type="primary" @click="saveVouchers('2')">确认</el-button>
          <el-button type="info" @click="vouchersVisibleMore = false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { targetedCouponHeadSearch, targetedCouponTableHead } from '@/utils/data'
import { clearObj, Trim, setOperation,checkExcel,showDateStyle } from '@/utils/public'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper'
import enums from '@/utils/enums'

export default {
  name: 'targetedCouponManage',
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
      formModules: targetedCouponHeadSearch,
      formRules:{
        // groupTemplateName:{
        //   required: true,
        //   message: '请输入组合模板名称',
        //   trigger: 'blur'
        // },
        groupTemplateId: {
          required: true,
          message: '请输入组合模板ID',
          trigger: 'blur'
        },
        phone: {
          required: true,
          message: '请输入用户手机号',
          trigger: 'blur'
        },
        custUserId: {
          required: true,
          message: '请输入用户ID',
          trigger: 'blur'
        }
      },
      formRulesMore:{
        // groupTemplateName:{
        //   required: true,
        //   message: '请输入组合模板名称',
        //   trigger: 'blur'
        // },
        groupTemplateId: {
          required: true,
          message: '请输入组合模板ID',
          trigger: 'blur'
        }
      },
      vouchersMsgMore:{
        'groupTemplateId':'',
        'channelId':'',
        // 'groupTemplateName':'',
        'list':[]
      },
      vouchersVisibleMore:false,

      tableList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      orzIdList:[
        {
          orzName: '常州公交',
          orzId: '1'
        }, 
        {
          orzName: '西咸公交',
          orzId: '2'
        }
      ],
      rmList: [],
      operateInfo: enums.OPERATIONID,
      vouchersTitle:'单用户发券',
      typeStr:'1',//1单用户发券 2批量用户发券
      vouchersVisible:false,
      vouchersMsg:{
        'groupTemplateId':'',
        'channelId':'',
        // 'groupTemplateName':'',
        'phone':'',
        'custUserId':''
      },
      channelTypeList: [],
      fileName:""
    }
  },
  mounted () {
    targetedCouponHeadSearch.forEach(item => {
      if (Array.isArray(item.data)) {
        item.data = [];
      } else {
        item.data = '';
      }
    })
    this.$parent.doClearObj();
    this.$emit('getInfo', targetedCouponHeadSearch);
    this.$emit('getTable', targetedCouponTableHead);
    this.$emit('getPage', this.page);
    this.rmList = setOperation('targetedCouponManage');
  },
  methods: {
    readExcel (file) {
      let result = checkExcel(file, 3072)
      if (!result.isFlag) {
        help.E(result.errorMessage);
        this.$refs.upload.clearFiles();
      }
    },
    upload (file) {
      // 上传图片
      let fileName=file.file.name;//文件名称
      net.apiFile(api.commonUse.uploading, 'file', file.file,2).then(data => {
        setTimeout(() => {
          if (data.code == enums.NET_SUCCESS) {//导入成功
            help.S("上传导入成功");
            this.fileName=fileName;
            let datas=data.data;
            let list=[];
            for(let i=0;i<datas.length;i++){
              list.push({
                custUserId:datas[i].custUserId,
                phone:datas[i].phone
              })
            }
            this.vouchersMsgMore.list=list;
          }else{
            this.fileName="";
            help.E(data.msg);
          }
        },1000)
        this.$refs.upload.clearFiles()
      })
    },
    // 点击下载发券模板
    downModel(){
      let userInfo = JSON.parse(sessionStorage.getItem('login'))
      let token=userInfo.token
      let userId=userInfo.userId
      location.href=api.commonUse.download+"?token="+token+"&userId="+userId+"&operationId=3";
    },
    refresh () {
      this.getTableData(this.searchData);
    },
    handleSelectionChange (checkedArr) { // 批量删除数组变化
      let checkGroupDriverIds = [];
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.targetedCouponId);
      })
      this.checkedRow = checkGroupDriverIds;
    },
    // forbidden (row) {
    //   let params = row;
    //   !+params.state ? params.state = 1 : params.state = 0;
    //   net.apiPost(api.bus.updateTargetedCoupon, params).then(data => {
    //     if (data.code === enums.NET_SUCCESS) {
    //       help.S('修改成功');
    //       this.getTableData(this.searchData);
    //     } else {
    //       help.E(data.msg);
    //     }
    //   })
    // },
    modify (row) { // 详情页面
      this.$router.push({
        name: 'targetedCouponMsg',
        query: { 
          row: row 
        }
      })
    },
    checkboxDisabled (row, index) {
      return true;
    },
    doSearch () {
      this.searchData = [];
      let formData = this.$refs.searchForm.getFormData();
      for (const key in formData) {
        if (key == 'addTime' && formData['addTime'].length === 2 && formData['addTime'][0] != 'undefind') {
          // 创建时间
          this.searchData['addStartTime'] = formData['addTime'][0] + ' 00:00:00';
          this.searchData['addEndTime'] = formData['addTime'][1] + ' 23:59:59';
        } else if (key != 'addTime') {
          this.searchData[key] = Trim(formData[key].toString());
        }
      }
      this.searchData.pageSize = this.page.pageSize;
      this.searchData.pageNum = 1;
      this.page.pageNum = 1;
      this.getTableData(this.searchData);
    },
    doClearObj () {
      this.$refs.searchForm.clearForm();
      this.page.pageNum = 1;
      this.page.pageSize = 10;
      targetedCouponHeadSearch.forEach(item => {
        if (Array.isArray(item.data)) {
          item.data = [];
        } else {
          item.data = '';
        }
      })
      clearObj(this.searchData);
      this.getTableData(this.page);
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
      params.pageSize = this.page.pageSize;
      let isArray="";
      let paramsNot={};
      if(Array.isArray(params)){
        isArray=true;
        for(const key in params){
          paramsNot[key]=params[key];
        }
      }
      net.apiPost(api.sendCoupon.list, isArray?paramsNot:params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.tableList = data.data.list;
          this.page.pageNum = data.data.page.pageNum;
          this.page.total = data.data.page.total;
          for(let i=0;i<this.tableList.length;i++){
            this.tableList[i].sendTimeStr=showDateStyle(this.tableList[i].sendTime);
          }
        } else {
          help.E(data.msg);
        }
      })
    },
    // 发券
    vouchersClick(typeStr){
      this.typeStr=typeStr;
      if(typeStr=="1"){//单用户发券
        this.vouchersTitle="单用户发券";
        this.vouchersVisible=true;
      }else if(typeStr=="2"){//批量用户发券
        this.vouchersTitle="批量用户发券";
        this.vouchersVisibleMore=true;
      }
      this.clearVouchers(typeStr,"vouchersClick")
      this.getchannelType();
    },
    // 渠道查询
    getchannelType:function(){
      net.apiGet(api.commonUse.channelType, {}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let datas=data.data;
          this.channelTypeList=datas;
          if(this.typeStr=="1"){//单用户发券
            this.vouchersMsg.channelId=this.channelTypeList[0].channelId;
          }else if(this.typeStr=="2"){//批量用户发券
            this.vouchersMsgMore.channelId=this.channelTypeList[0].channelId;
          }
        } else {
          help.E(data.msg);
        }
      })
    },
    // 确认
    saveVouchers(typeStr){
      let formData = "";
      let url="";
      if(typeStr=="1"){//单用户发券
        formData=this.vouchersMsg
        url = api.sendCoupon.singleSendCoupon;
      }else if(typeStr=="2"){//批量用户发券
        formData=this.vouchersMsgMore;
        if(formData.list.length==0 && this.fileName==""){
          help.E("请上传模板文件")
          return false
        }
        url = api.sendCoupon.batchSendCoupon;
      }
      net.apiPost(url, formData).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('添加成功')
          this.clearVouchers(typeStr);
          this.getTableData(this.searchData);
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.E('网络异常')
      })
    },
    clearVouchers(typeStr,doStr){
      if(typeStr=="1"){//单用户发券
        if(!doStr){
          this.vouchersVisible=false;
        }
        this.vouchersMsg={
          'groupTemplateId':'',
          'channelId':'',
          // 'groupTemplateName':'',
          'phone':'',
          'custUserId':''
        }
      }else if(typeStr=="2"){//批量用户发券
        if(!doStr){
          this.vouchersVisibleMore=false;
        }
        this.fileName="";
        this.vouchersMsgMore={
          'groupTemplateId':'',
          'channelId':'',
          // 'groupTemplateName':'',
          'list':[]
        }
      }
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

.common-form-item-upload{
  position: relative;
}

.upload-excel{
  width: 128px;
  height: 32px;
  position: absolute;
  top: 0;
}

.upload-excel .el-upload{
  width: 100%;
  height: 100%;
}
</style>