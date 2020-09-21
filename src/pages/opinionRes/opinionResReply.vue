<template>
    <div class="opinion-ress">
        <div class="opinion-res">
            <span class="opinion-res-tit">反馈类型：</span>
            <span class="opinion-res-con">{{opinionResReply.typeName}}</span>
        </div>
        <div class="opinion-res">
            <span class="opinion-res-tit">城市：</span>
            <span class="opinion-res-con">{{opinionResReply.cityName?opinionResReply.cityName:'-'}}</span>
        </div>
        <div class="opinion-res">
            <span class="opinion-res-tit">机构：</span>
            <span class="opinion-res-con">{{opinionResReply.orzName?opinionResReply.orzName:"-"}}</span>
        </div>
        <div class="opinion-res-leng">
            <div class="res-leng-title">反馈内容：</div>
            <div class="res-leng-content">{{opinionResReply.content}}</div>
        </div>
        <div class="opinion-res-imgs-wrapper">
            <div style="float:left" class="opinion-res" v-show="opinionResReply.urlList && opinionResReply.urlList.length>0">
                <span class="opinion-res-tit">相关图片：</span>
            </div>
            <div class="opinion-res-imgs" v-for="(item, index) in opinionResReply.urlList" :key="index" v-show="opinionResReply.urlList && opinionResReply.urlList.length>0">
                <!-- <img v-for="(item, index) in opinionResReply.urlList" :key="index" :src="item" alt=""> -->
                <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="[item]"></el-image>
            </div>
        </div>
        <div class="opinion-res">
            <span class="opinion-res-tit">姓名：</span>
            <span class="opinion-res-con">{{opinionResReply.name}}</span>
        </div>
        <div class="opinion-res">
            <span class="opinion-res-tit">联系方式：</span>
            <span class="opinion-res-con">{{opinionResReply.phone}}</span>
        </div>
        <div class="opinion-res-group">
            <span class="res-group-tit">状态：</span>
            <el-radio-group v-model="disposeState" class="opinion-res-group">
                <el-radio :label="item.disposeState" v-for="item in disposeStateList" :key="item.disposeState">{{item.disposeStateName}}</el-radio>
            </el-radio-group>
        </div>
        <div class="opinion-res-group">
            <span class="group-textarea-tit">客服回复：</span>
            <el-input class="res-group-textarea" :rows="8" type="textarea" v-model="content" maxlength="200" placeholder="请输入您的回复内容（200个字以内）"></el-input>
        </div>
        <el-row class="btn-group" style="margin-bottom: 20px;margin-top: 40px">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="back">取消</el-button>
        </el-row>
    </div>
</template>

<script>
import help from '@/utils/helper'
import net from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'
import { checkedImage,timestampToTime } from '@/utils/public'

export default {
  data () {
    return {
      feedBackNo : this.$route.query.feedBackNo,
      opinionResReply:{},
      disposeState:"",
      content:"",
      disposeStateList:[
        {
            disposeState:0,
            disposeStateName:"未处理"
        },
        {
            disposeState:1,
            disposeStateName:"已处理"
        }
      ]
    }
  },
  mounted () {
      this.info()
  },
  methods: {
    info(){
        let feedBackNo=this.feedBackNo
        net.apiGet(api.feedback.info,{
            feedBackNo
        }).then(data => {
            if (data.code === enums.NET_SUCCESS) {
                console.log("data===",data)
                let datas=data.data;
                this.opinionResReply=datas;
                this.disposeState=this.opinionResReply.disposeState;
                if(this.opinionResReply.replyContent==null){
                    this.opinionResReply.replyContent="";
                }
                this.content=this.opinionResReply.replyContent;
            } else {
                help.E(data.msg);
            }
        })

    },
    
    save(){
        let content=this.content;
        let feedBackNo=this.feedBackNo;
        let disposeState=this.disposeState;
        net.apiPost(api.feedback.update,{
            content,
            feedBackNo,
            disposeState
        }).then(data => {
            if (data.code === enums.NET_SUCCESS) {
                help.S('保存成功');
                this.$router.back();
            } else {
                help.E(data.msg);
            }
        })
    },

    back () {
      this.$router.back();
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

.opinion-ress{
    font-size: 14px;
    color: #606266;
}

.opinion-res{
    height: 32px;
    line-height: 32px;
    margin-bottom: 5px;
}

.opinion-res span{
    display: inline-block;
}

.opinion-res .opinion-res-tit{
    padding-right: 20px;
    width: 100px;
    text-align: right;
}

.opinion-res .opinion-res-con{
    width: 400px;
}

.opinion-res-leng{
    overflow: hidden;
}

.opinion-res-leng div{
    float: left;
}

.res-leng-title{
    padding-right: 20px;
    width: 100px;
    text-align: right;
    line-height: 20px;
}

.res-leng-content{
    width: 400px;
    line-height: 20px;
}

.opinion-res-group{
    margin-bottom: 10px;
    overflow: hidden;
}

.opinion-res-group .res-group-tit{
    display: inline-block;
    padding-right: 20px;
    width: 100px;
    text-align: right;
    line-height: 20px;
}

.group-textarea-tit{
    float: left;
    padding-right: 20px;
    width: 100px;
    text-align: right;
    line-height: 20px;
}

.res-group-textarea{
    float: left;
    width: 300px;
}

textarea{
    resize: none;
}

.opinion-res-imgs-wrapper{
    overflow: hidden;
}

.opinion-res-imgs{
    padding-left: 10px;
    padding-bottom: 10px;
    float: left;
}

.opinion-res-imgs .el-image-viewer__canvas img{
    height: 500px;
}

.opinion-res-imgs .el-icon-circle-close{
    color: #fff;
}
</style>