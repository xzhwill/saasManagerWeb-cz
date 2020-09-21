<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="120px" :model="cardCoupon" :rules="formRules" ref="addCardCoupon"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <!-- 选择机构 -->
      <el-form-item label="选择机构" prop="orzId">
        <el-select v-model="cardCoupon.orzId" @change="orzIdChange">
          <el-option v-for="(item, index) in orzIdList" :key="index" :label="item.orzName" :value="item.orzId"></el-option>
        </el-select>
      </el-form-item>
      <!-- 生效渠道 -->
      <el-form-item label="生效渠道" prop="channelIds">
        <el-checkbox-group v-model="cardCoupon.channelIds">
          <el-checkbox :label="item.channelId" v-for="item in channelTypeList" :key="item.channelId">{{item.channelName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 业务类型 -->
      <el-form-item label="业务类型" prop="businessTypes">
        <el-checkbox-group v-model="cardCoupon.businessTypes" @change="businessTypesChange">
          <el-checkbox :label="item.businessType" v-for="item in businessTypeList" :key="item.businessType">{{item.businessTypeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 券模板ID -->
      <el-form-item label="券模板ID" prop="templateId" class="common-form-item">
        <el-input v-model="cardCoupon.templateId" placeholder="请输入券模板ID"></el-input>
      </el-form-item>
      <!-- 券名称 -->
      <el-form-item label="券名称" prop="couponName" class="common-form-item">
        <el-input v-model="cardCoupon.couponName" maxlength="30" placeholder="请输入券名称"></el-input>
      </el-form-item>
      <!-- 购票类型限制 -->
      <el-form-item label="购票类型限制" prop="ticketTypes">
        <el-checkbox-group  v-model="cardCoupon.ticketTypes">
          <el-checkbox :label="item.ticketType" v-for="item in ticketTypeList" :key="item.ticketType">{{item.ticketTypeName}}</el-checkbox>
        </el-checkbox-group >
      </el-form-item>
      <!-- 班次限制 -->
      <el-form-item label="班次限制" prop="classRestrict">
        <el-radio-group v-model="cardCoupon.classRestrict" @change="classRestrictChange">
          <el-radio :label="item.limitId" v-for="item in limitTypeList" :key="item.limitId">{{item.limitName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 查询条件 -->
      <el-form-item label="查询条件" class="common-form-item" v-show="cardCoupon.classRestrict=='0'">
        <el-input name="lineOrClass" v-model="lineOrClassName" placeholder="请输入线路号或者班次名称"></el-input>
        <el-button type="primary" @click="lineOrClassSearch">搜索</el-button>
        <div>
          <el-table border ref="classLeft" style="margin-top: 20px;width: 400px; float:left" @selection-change="handleSelectionClassLeft"
              header-row-class-name="tableHeader" class="page-table-main el-table-cardcoupon" :data="classList" height="300">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column show-overflow-tooltip v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name">
              <template slot-scope="scope">{{scope.row[item.name]}}</template>
            </el-table-column>
          </el-table>
          <div class="el-transfer__buttons" style=" margin-top:80px;">
            <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleAdd(1)">
              <span> <i class="el-icon-arrow-right"></i></span>
            </button>
            <button type="button" class="el-button el-button--primary el-transfer__button" @click="handleRemove(1)">
              <span> <i class="el-icon-arrow-left"></i></span>
            </button>
          </div>
          <el-table  border ref="classRight" style="margin-top: 20px;width: 400px; float:right" @selection-change="handleSelectionClassRight"
              header-row-class-name="tableHeader" class="page-table-main el-table-cardcoupon" :data="classRight" height="300">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row[item.name]}}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <!-- 享受折上折 -->
      <el-form-item label="享受折上折" prop="isAdditionalDiscount">
        <el-radio-group v-model="cardCoupon.isAdditionalDiscount">
          <el-radio :label="item.discountId" v-for="item in discountList" :key="item.discountId">{{item.discountName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addCardCouponFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      formRules: addCardCouponFormRules,
      lineOrClass: '',
      allClassList: [], // 初始从后端拿到的所有的班次数据
      classList:[],//左侧菜单筛选后的总数据
      classRight: [], // 右侧菜单中的总数据（班次键值对）
      classRightAll: [], // 左侧菜单选中的值（班次键值对）
      classRightVal: [], // 右侧菜单选中的值（班次键值对）
      idsList1: [], // 左侧添加到右侧的ID数组（班次非键值对）
      classRightSelected: [], // 右侧选中的添加到左侧的ID数组（班次非键值对）
      // className:'',
      lineOrClassName:'',
      title: '添加卡券配置',
      labelWidth: '120px',
      channelTypeList: [],
      businessTypeList: enums.BUSINESSTYPE1,
      ticketTypeList:[],
      limitTypeList:[
        {
          limitName: '不限',
          limitId: 1
        }, 
        {
          limitName: '选择可用班次',
          limitId: 0
        }
      ],
      discountList:[
        {
          discountName: '是',
          discountId: 1
        },
        {
          discountName: '否',
          discountId: 0
        }
      ],
      orzIdList:[],
      searchVal:"1",
      cardCoupon: {
        'orzId':'',
        'channelIds':[],
        'businessTypes':[],
        'templateId':'',
        'couponName':'',
        'ticketTypes':[],
        'classRestrict':0,
        // 'noticeClassInfos':[],//这个字段本来是用来存班次id的 不过因为有scheduleIds了 回显时估计还是要处理一下
        'isAdditionalDiscount':1,
        'scheduleIds':[]
      },
      tableHeader: [
        {
          label: '线路号',
          name: 'lineId'
        }, 
        {
          label: '班次名称',
          name: 'className',
          fit: true
        },
        {
          label: '发车时间',
          name: 'startTime'
        }, 
      ],
      couponNo: this.$route.query.couponNo ? this.$route.query.couponNo : '', // 判断为修改还是添加页面
      updateFlag: true //判断为修改还是添加页面，一些框的禁选用
    }
  },
  mounted () {
    this.getCardCoupon();
  },
  methods: {
    orzIdChange(){
      this.getClassCouponOptionList(true);
    },
    businessTypesChange(){
      this.getClassCouponOptionList(true);
    },
    //机构
    getOptionList:function(){
      let params={};
      params.orzType = 1;
      request.apiGet(api.supply.optionList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let datas=data.data;
          this.orzIdList=datas;
          if (!this.couponNo) {//新增
            this.cardCoupon.orzId=this.orzIdList[0].orzId;
            this.getClassCouponOptionList();//班次
          } else{
            this.getClassCouponOptionList();//班次
          }
        } else {
          helper.E(data.msg)
        }
      })
    },
    lineOrClassSearch:function(){
      this.getClassCouponOptionList();//班次
    },
    //班次
    getClassCouponOptionList:function(reset){
      let params={};
      params.orzId=this.cardCoupon.orzId;
      params.lineIdOrClassName=this.lineOrClassName;
      params.businessTypes=this.cardCoupon.businessTypes;
      request.apiPost(api.couponConfig.classCouponOptionList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.allClassList=data.data;
          this.classList = data.data;
          if(reset){
            this.classRight=[]
            this.cardCoupon.scheduleIds=[];
          }
        } else {
          help.E(data.msg);
        }
      })
    },
    // 业务类型
    getbusinessType:function(){
      request.apiGet(api.commonUse.businessType, {}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let datas=data.data;
          this.businessTypeList=datas;
        } else {
          help.E(data.msg);
        }
      })
    },
    // 渠道查询
    getchannelType:function(){
      request.apiGet(api.commonUse.channelType, {}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let datas=data.data;
          this.channelTypeList=datas;
        } else {
          help.E(data.msg);
        }
      })
    },
    // 购票类型
    getticketType:function(){
      request.apiGet(api.commonUse.ticketType, {}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let datas=data.data;
          this.ticketTypeList=datas;
        } else {
          help.E(data.msg);
        }
      })
    },
    // 选择
    filterClass () {
      this.classList = this.allClassList.filter(item => {
        return item.className.indexOf(this.className) > -1;
      })
      this.$refs.filterClass.clearSelection();
      this.showCheckedRow();
    },
    // 将左侧选中的值添加到右侧列表 checkedArr：选中的值
    handleSelectionClassLeft (checkedArr) {
      this.classRightAll = checkedArr;
      this.idsList1 = [];
      checkedArr.forEach((item) => {
        this.idsList1.push(item.scheduleId);
      })
    },
    // 将右侧选中的值添加到左侧列表 checkedArr：选中的值
    handleSelectionClassRight (checkedArr) {
      this.classRightVal = checkedArr;
      this.classRightSelected = [];
      checkedArr.forEach((item) => {
        this.classRightSelected.push(item.scheduleId);
      })
    },
    // 获取班次列表
    getClassList (params) {
      request.apiGet(api.schedule.shiftsList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.allClassList = data.data;
          this.classList = data.data;
        }
      })
    },
     handleAdd (type) { // 往右侧增加数据 对右边进行去重
      if (type == 2) {
        this.rowLineRightAll.forEach(item => { // 将左侧选中的值添加到右侧（线路）
          this.rowLineRight.unshift(item);
        })
        let hash = {}
        this.rowLineRight = this.rowLineRight.reduce((item, next) => {
          if (!hash[next.lineId]) {
            hash[next.lineId] = true;
            item.push(next);
          }
          return item;
        }, [])
        this.listDuplicateRemoval(this.lineList, this.idsList2, 2);
      } else {
        this.classRightAll.forEach(item => { // 将左侧选中的值添加到右侧（班次）
          this.classRight.unshift(item);
        })
        let hash = {}
        this.classRight = this.classRight.reduce((item, next) => {
          if (!hash[next.scheduleId]) {
            hash[next.scheduleId] = true;
            item.push(next);
          }
          return item;
        }, [])
        this.listDuplicateRemoval(this.classList, this.idsList1, 1);
      }
    },
    handleRemove (type) {
      if (type == 2) {
        this.lineRightVal.forEach(item => { // 将右侧选中的值添加到左侧（线路）
          this.lineList.unshift(item);
        })
        let hash = {}
        this.lineList = this.lineList.reduce((item, next) => {
          if (!hash[next.lineId]) {
            hash[next.lineId] = true;
            item.push(next);
          }
          return item;
        }, [])
        this.listDuplicateRemoval(this.rowLineRight, this.rowLineRightSelected, 2);
      } else {
        this.classRightVal.forEach(item => { // 将右侧选中的值添加到左侧（班次）
          this.classList.unshift(item);
        })
        let hash = {};
        this.classList = this.classList.reduce((item, next) => {
          if (!hash[next.scheduleId]) {
            hash[next.scheduleId] = true;
            item.push(next);
          }
          return item;
        }, [])
        this.listDuplicateRemoval(this.classRight, this.classRightSelected, 1);
      }
    },
    listDuplicateRemoval (lis, li, type) { // 将左边选中的值添加到右侧后，对左侧进行去重操作（班次）
      if (type === 1) { // 班次
        lis.filter((item, index) => {
          if (li.indexOf(item.scheduleId) > -1) {
            lis.splice(index, 1);
            this.listDuplicateRemoval(lis, li, type);
          }
          return lis;
        })
      } else { // 线路
        lis.filter((item, index) => {
          if (li.indexOf(item.lineId) > -1) {
            lis.splice(index, 1);
            this.listDuplicateRemoval(lis, li, type);
          }
          return lis;
        })
      }
    },
    getCardCoupon () {
      this.getbusinessType();//业务类型
      this.getchannelType();//渠道查询
      this.getticketType();//购票类型
      if (this.couponNo) {//修改
        this.title = '修改卡券配置';
        request.apiGet(api.couponConfig.info, {
           couponNo:this.couponNo
         }).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              let datas=data.data;
              this.cardCoupon=datas;
              if(datas.classRestrict==0){//班次限制为0时存在选
                this.classRight=datas.couponScheduleInfos;
              }else{
                this.classRight=[];
              }
              this.getOptionList();//机构
            } else {
              help.E(data.msg);
            }
        })
      } else {//新增
        this.title = '添加卡券配置';
        this.getOptionList();//机构
      }
      
    },
    save () {
      this.$refs['addCardCoupon'].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      })
    },
    postData () {
      this.cardCoupon.scheduleIds=[];
      if(this.cardCoupon.classRestrict=="0"){
        if (this.classRight && this.classRight.length) {
          this.classRight.forEach((item) => {
            this.cardCoupon.scheduleIds.push(item.scheduleId);
          })
        }
        if(this.cardCoupon.scheduleIds.length==0){
          help.E("请选择一个班次");
          return false;
        }
      }
      let url="";
      if (this.couponNo) {//修改
        url=api.couponConfig.update;
      } else {//添加
        url=api.couponConfig.create;
      }
      request.apiPost(url , this.cardCoupon).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('flag', 'true');
          this.$router.back();
        } else {
          help.E(data.msg);
        }
      }).catch(() => {
        help.Echo('网络异常');
      })
    },
    back () {
      sessionStorage.setItem('flag', 'true');
      this.$router.back();
    },
    classRestrictChange(val){
      console.log("val===",val)
    }
  }
}
</script>

<style>
@import '../../assets/style/common.css';
.btn-group {
  text-align: center;
}

.el-upload--picture-card {
  border: none;
  width: 80px;
  height: 28px;
  line-height: 28px;
}

.showImage {
  display: flex;
  align-items: center;
}

.common-form-item .el-table-cardcoupon  .el-checkbox{
  margin-left: 0 !important;
}
</style>