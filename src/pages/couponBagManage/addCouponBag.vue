<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="120px" :model="couponBag" :rules="formRules" ref="addCouponBag"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <!-- 选择机构 -->
      <el-form-item label="选择机构" prop="orzId">
        <el-select v-model="couponBag.orzId" placeholder="请选择机构">
          <el-option v-for="(item, index) in orzIdList" :key="index" :label="item.orzName" :value="item.orzId" ></el-option>
        </el-select>
      </el-form-item>
      <!-- 礼包名称 -->
      <el-form-item label="礼包名称" prop="name" class="common-form-item">
        <el-input v-model="couponBag.name" maxlength="30" placeholder="请输入礼包名称"></el-input>
      </el-form-item>
      <!-- 活动时间 -->
      <el-form-item label="活动时间" prop="createTime">
        <el-date-picker class="w100" v-model="couponBag.createTime" type="datetimerange" :clearable="false" style="width: 350px; margin-right: 15px" 
          format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择活动时间">
        </el-date-picker>
      </el-form-item>
      <!-- 领取用户 -->
      <el-form-item label="领取用户" prop="userType">
        <el-radio-group v-model="couponBag.userType">
          <el-radio :label="item.userType" v-for="item in userTypeList" :key="item.userType">{{item.userName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 组合模板ID -->
      <el-form-item label="组合模板ID" prop="groupTemplateId" class="common-form-item">
        <span style="font-size: 14px;color: #606266">礼包内容：</span><el-input v-model="couponBag.groupTemplateId" placeholder="请输入组合模板ID"></el-input>
      </el-form-item>
      <!-- 活动规则 -->
      <el-form-item label="活动规则" prop="ruleContent">
        <el-input :rows="8" type="textarea" maxlength="500" v-model="couponBag.ruleContent" placeholder="请输入活动规则，用中文分号；进行换行"></el-input>
      </el-form-item>
      <!-- 活动页主视觉 -->
      <el-form-item label="活动页主视觉" prop="bannerUrl" class="common-form-item">
        <el-upload list-type="picture-card" :limit=1 :before-upload="beforeAvatarUpload" :file-list="photoFile" :http-request="uploadImage" :on-remove="removePhoto" action="''" :data="{ photoType:'static' }">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-row class="btn-group" style="margin-bottom: 20px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addCouponBagFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'
import { checkedImage,timestampToTime } from '@/utils/public'

export default {
  data () {
    return {
      formRules: addCouponBagFormRules,
      title: '添加优惠券礼包',
      labelWidth: '120px',
      orzIdList:[],
      photoFile:[],
      couponBag: {
        'orzId':'',
        'name':'',
        'effectiveDate':'',
        'expiryDate':'',
        'userType':1,
        'groupTemplateId':'',
        'ruleContent':'',
        'bannerUrl':''
      },
      userTypeList:[
        {
          userName: '新用户',
          userType: 1
        },
        {
          userName: '所有用户',
          userType: 2
        }
      ],
      activityNo: this.$route.query.activityNo ? this.$route.query.activityNo : '', // 判断为修改还是添加页面
      updateFlag: true, //判断为修改还是添加页面，一些框的禁选用
      url: api.common.upload, // 图片上传地址
    }
  },
  mounted () {
    this.$emit('getInfo', []);
    this.getCouponBagInfo();

    // window.clipboardData.setData("Text",clipBoardContent);
  },
  methods: {
    activityNoGet:function(){
      let params={};
      params.activityNo = this.activityNo;
      request.apiGet(api.giftPacksActivity.get, params).then(data => {
        console.log("data=====",data)
        if (data.code === enums.NET_SUCCESS) {
          let datas=data.data;
          datas.effectiveDate=timestampToTime(datas.effectiveDate);
          datas.expiryDate=timestampToTime(datas.expiryDate);
          this.couponBag={
            'orzId':datas.orzId,
            'name':datas.name,
            'createTime':[datas.effectiveDate,datas.expiryDate],
            'userType':datas.userType,
            'groupTemplateId':datas.groupTemplateId,
            'ruleContent':datas.ruleContent,
            'bannerUrl':datas.bannerUrl
          }
          this.photoFile=[
            {
              name:"bannerUrl",
              url:datas.bannerUrl
            }
          ]
        } else {
          helper.E(data.msg)
        }
      })
    },
    //机构
    getOptionList:function(){
      let params={};
      params.orzType = 1;
      request.apiGet(api.supply.optionList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let datas=data.data;
          this.orzIdList=datas;
          if (!this.activityNo) {//新增
            this.couponBag.orzId=this.orzIdList[0].orzId;
          }else{
            this.activityNoGet();
          }
        } else {
          helper.E(data.msg)
        }
      })
    },
    getCouponBagInfo () {
      if (this.activityNo) {
        this.title = '修改优惠券礼包';
      } else {
        this.title = '添加优惠券礼包';
      }
      this.getOptionList();
    },
    save () {
      this.$refs['addCouponBag'].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      })
    },
    postData () {
      if(this.couponBag.bannerUrl==""){
        help.E("请上传活动页主视觉");
        return false;
      }
      let url="";
      if (this.activityNo) {//修改
        url=api.giftPacksActivity.update;
        this.couponBag.activityNo=this.activityNo;
      } else {//添加
        url=api.giftPacksActivity.create;
      }
      // console.log("this.couponBag.createTime===",this.couponBag.createTime)
      this.couponBag.effectiveDate=this.couponBag.createTime[0];
      this.couponBag.expiryDate=this.couponBag.createTime[1];
      // return false
      request.apiPost(url, this.couponBag).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功');
          this.$router.back();
        } else {
          help.E(data.msg);
        }
      }).catch(() => {
        help.Echo('网络异常');
      })
    },
    back () {
      this.$router.back();
    },
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300);
      if (!result.isFlag) {
        this.$message.error(result.errorMessage);
      }
      return result.isFlag;
    },
    /* 上传图片方法 */
    uploadImage (file) {
      request.apiFile(this.url, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
          help.E("上传异常！");
        } else {
          help.S(data.msg);
          let url=data.data;
          this.couponBag.bannerUrl=url;
        }
      })
    },
    removePhoto (file) {
      this.couponBag.bannerUrl="";
    },
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
</style>