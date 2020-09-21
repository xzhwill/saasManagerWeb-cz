<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="payPolitely" :rules="formRules" ref="addPayPolitely" label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <!-- 活动信息 -->
      <div class="title">活动信息</div>
      <!-- 活动名称 -->
      <el-form-item label="活动名称" prop="payPolitelyName" class="common-form-item">
        <el-input v-model="payPolitely.payPolitelyName" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <!-- 业务类型 -->
      <el-form-item label="业务类型" prop="businessType">
        <el-radio-group v-model="payPolitely.businessType">
          <el-radio :label="item.businessId" v-for="item in businessTypeList" :key="item.businessId">{{item.businessName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 生效渠道 -->
      <el-form-item label="生效渠道">
        <el-radio-group v-model="payPolitely.channelId">
          <el-radio :label="item.channelId" v-for="item in channelTypeList" :key="item.channelId">{{item.channelName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 活动时间 -->
      <el-form-item label="活动时间" prop="createTime">
        <el-date-picker class="w100" v-model="payPolitely.createTime" type="daterange" :clearable="false" style="width: 240px; margin-right: 15px" 
          format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择活动时间">
        </el-date-picker>
      </el-form-item>
      <!-- 活动页面文案 -->
      <el-form-item label="活动页面文案" prop="webtex" class="common-form-item">
        <el-input v-model="payPolitely.webtex" placeholder="请输入活动页面文案"></el-input>
      </el-form-item>
      <!-- 优惠券金额展示 -->
      <el-form-item label="优惠券金额展示" prop="paytex" class="common-form-item">
        <el-input v-model="payPolitely.paytex" placeholder="请输入优惠券金额展示"></el-input>
      </el-form-item>
      <div class="title">参与条件</div>
      <!-- 消费方式-->
      <el-form-item label="消费方式">
        <el-radio-group v-model="payPolitely.sType">
          <el-radio :label="item.channelId" v-for="item in sTypeList" :key="item.channelId">{{item.channelName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 满足金额 -->
      <el-form-item label="满足金额" prop="paynum" class="common-form-item" v-show="payPolitely.sType=='1'">
        <el-input v-model="payPolitely.paynum" placeholder="请输入优惠券金额展示"></el-input>
      </el-form-item>
      <!-- 查询条件 -->
      <el-form-item label="查询条件" v-show="payPolitely.sType=='2'">
        <el-input name="lineOrClass" v-model="className" placeholder="请输入线路号或者班次名称" @input="filterClass"></el-input>
        <div>
          <el-table border ref="classLeft" style="margin-top: 20px;width: 300px; float:left" @selection-change="handleSelectionClassLeft"
              header-row-class-name="tableHeader" class="page-table-main" :data="classList" height="300">
            <el-table-column type="selection"  width="40"></el-table-column>
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
          <el-table border ref="classRight" style="margin-top: 20px;width: 300px; float:right" @selection-change="handleSelectionClassRight"
              header-row-class-name="tableHeader" class="page-table-main" :data="classRight" height="300">
            <el-table-column type="selection"  width="40"></el-table-column>
            <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row[item.name]}}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <div class="title">权益设置</div>
      <!-- 选择优惠券 -->
      <el-form-item label="选择优惠券" prop="payPolitelyName" class="common-form-item">
        <el-input v-model="payPolitely.moId" placeholder="请输入组合模板ID"></el-input>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addPayPolitelyFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      formRules: addPayPolitelyFormRules,
      lineOrClass: '',
      allClassList: [], // 初始从后端拿到的所有的班次数据
      classList:[],//左侧菜单筛选后的总数据
      classRight: [], // 右侧菜单中的总数据（班次键值对）
      classRightAll: [], // 左侧菜单选中的值（班次键值对）
      classRightVal: [], // 右侧菜单选中的值（班次键值对）
      idsList1: [], // 左侧添加到右侧的ID数组（班次非键值对）
      classRightSelected: [], // 右侧选中的添加到左侧的ID数组（班次非键值对）
      className:'',
      title: '添加活动信息',
      labelWidth: '120px',
      channelTypeList: [
        {
          channelName: '西宁微信小程序',
          channelId: '1'
        }, 
        {
          channelName: '西宁APP',
          channelId: '2'
        }
      ],
      sTypeList:[
        {
          channelName: '支付满足一定金额，可参与活动',
          channelId: '1'
        }, 
        {
          channelName: '购买指定班次可参与',
          channelId: '2'
        }
      ],
      businessTypeList: enums.BUSINESSTYPE1,
      searchVal:"1",
      payPolitely: {
        'payPolitelyName':'',
        'businessType':'1',
        'channelId':'1',
        'createTime':'',
        'webtex':'',
        'paytex':'',
        'sType':'1',
        'paynum':'',
        'scheduleIds':[],
        'moId':''
      },
      tableHeader: [
        {
          label: '班次号',
          name: 'scheduleId'
        }, 
        {
          label: '班次名称',
          name: 'className',
          fit: true
        },
        {
          label: '发车时间',
          name: 'scheduleId'
        }, 
      ],
      uid: this.$route.query.id ? this.$route.query.id : '', // 判断为修改还是添加页面
      updateFlag: true //判断为修改还是添加页面，一些框的禁选用
    }
  },
  mounted () {
    this.$emit('getInfo', []);
    this.getClassList({
      noticeType: '1',
      businessType: '1',
      effectiveTime: '',
      expiryTime: ''
    })
    this.classRight = this.payPolitely.noticeClassInfos;
  },
  methods: {
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
        let hash = {};
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
          return item
        }, [])
        this.listDuplicateRemoval(this.classList, this.idsList1, 1);
      }
    },
    handleRemove (type) {
      if (type == 2) {
        this.lineRightVal.forEach(item => { // 将右侧选中的值添加到左侧（线路）
          this.lineList.unshift(item);
        })
        let hash = {};
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
          return item
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
    getBusInfo () {
      if (this.uid) {
        // this.updateFlag = false
        this.title = '修改活动信息';
      } else {
        // this.updateFlag = true
      }
    },
    save () {
      this.$refs['addPayPolitely'].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      })
    },
    postData () {
      // 班次ID填入
      this.payPolitely.scheduleIds = [];
      if (+this.payPolitely.noticeType === 5) {
        if (this.rowLineRight && this.rowLineRight.length) {
          this.rowLineRight.forEach((item) => {
            this.payPolitely.scheduleIds.push(item.lineId);
          })
        }
      } else {
        if (this.classRight && this.classRight.length) {
          this.classRight.forEach((item) => {
            this.payPolitely.scheduleIds.push(item.scheduleId);
          })
        }
      }
      console.log(this.payPolitely)
    //   request.apiPost(this.uid ? api.bus.updateBus : api.bus.addBus, this.bus).then((data) => {
    //     if (data.code === enums.NET_SUCCESS) {
    //       help.S('保存成功');
    //       sessionStorage.setItem('flag', 'true');
    //       this.$router.back();
    //     } else {
    //       help.E(data.msg);
    //     }
    //   }).catch(() => {
    //     help.Echo('网络异常');
    //   })
    },
    back () {
      sessionStorage.setItem('flag', 'true');
      this.$router.back();
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

.title {
  text-align: left;
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
}
</style>