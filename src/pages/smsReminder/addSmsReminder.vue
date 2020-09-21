<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="smsReminder" :rules="formRules" ref="addSmsReminder"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="城市" prop="cityCode">
        <el-select v-model="smsReminder.cityCode">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构" prop="orzId">
        <el-select v-model="smsReminder.orzId">
          <el-option v-for="item in orzList" :label="item.orzName" :key="item.orzId" :value="item.orzId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type" class="common-form-item">
        <el-select v-model="smsReminder.type">
          <el-option v-for="item in typeList" :label="item.typeName" :key="item.type" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone" class="common-form-item">
        <el-input v-model="smsReminder.phone" minlength="5"></el-input>
      </el-form-item>
      <el-form-item prop="remark" class="common-form-item" label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" :maxlength="20" v-model="smsReminder.remark"
          placeholder=""></el-input>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addSmsReminderFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加短信提醒',
      labelWidth: '120px',
      smsReminder: {
        'cityCode': '',
        'id': '',
        'orzId': '',
        'phone': '',
        'remark': '',
        'type': ''
      },
      typeList:[
        {
          typeName:"包车下单后通知",
          type:1
        }
      ],
      formRules: addSmsReminderFormRules,
      orzList: [],
      cityList: [],
      eqpList: [],
      id: this.$route.query.id ? this.$route.query.id : '' // 判断为修改还是添加页面
    }
  },
  mounted () {
    // this.$emit('getInfo', [])
    this.getOtherList();
    this.getSmsReminderInfo();//修改短信提醒
  },
  methods: {
    getSmsReminderInfo () {
      if (this.id) {
        this.title = '修改短信提醒';
        request.apiGet(api.smsReminder.info, {
          id: this.id
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.smsReminder = data.data;
            // 城市列表 && 机构列表
            this.getOtherList();
          } else {
            help.E(data.msg);
          }
        })
      }
    },
    getOtherList () {
      request.apiGet(api.city.option).then(data => { // 城市
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data;
        } else {
          help.E(data.msg);
        }
      })
      let params = {};
      params.orzType = 1;
      request.apiGet(api.supply.optionList, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orzList=data.data;
        } else {
          helper.E(data.msg);
        }
      })
    },
    save () {
      this.$refs['addSmsReminder'].validate((valid) => {
        if (valid) {
          this.postData();
        } else {
          return false;
        }
      })
    },
    postData () {
      /**手机校验正则*/
      let phonereg = /^[1][0-9]{10}$/;
      let phoneValue = this.smsReminder.phone;
      if (!phonereg.test(parseInt(phoneValue))) {
        help.E("手机号格式错误");
        return false;
      }
      request.apiPost(this.id ? api.smsReminder.update : api.smsReminder.create, this.smsReminder).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功');
          this.$router.back();
        } else {
          help.E(data.msg);
        }
      }).catch(() => {
        help.E('网络异常');
      })
    },
    back () {
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

textarea {
  resize:none !important;
}
</style>
