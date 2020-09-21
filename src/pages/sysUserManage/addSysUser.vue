<template>
  <el-container style="display: flex; justify-content: flex-start;">
    <el-form enctype="multipart/form-data" label-width="100px" :model="sysUser" :rules="formRules" ref="addSysUser"
      label-position="right">
      <div class="form-section" style="margin-top: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="用户名" prop="username" class="common-form-item">
        <el-input v-model="sysUser.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="common-form-item">
        <el-input v-model="sysUser.password" :disabled="isDis" type="password" :maxlength="16"></el-input>
        <el-button type="primary" @click="isDis = false; sysUser.password = ''" v-if="!!uid">修改</el-button>
      </el-form-item>
      <el-form-item label="姓名" prop="chinesename" class="common-form-item">
        <el-input v-model="sysUser.chinesename"></el-input>
      </el-form-item>
      <el-form-item label="所属机构" prop="orzId" class="common-form-item">
        <el-select v-model="sysUser.orzId" @change="changeOrz">
          <el-option v-for="(item,index) in orzAllList" :key="index" :label="item.orzName" :value="item.orzId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio v-model="sysUser.state" :label="1">可用</el-radio>
        <el-radio v-model="sysUser.state" :label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label="选择城市">
        <el-transfer
          @change="checkedCityChanged"
          :button-texts="['移除', '添加']"
          :titles="['城市名称', '已选择']"
          v-model="sysUser.cityList"
          :data="cityList"></el-transfer>
      </el-form-item>
      <el-form-item label="选择需求侧机构" class="common-form-item" style="display: none;">
        <el-transfer
          @change="checkedOrzChangedD"
          :button-texts="['移除', '添加']"
          :titles="['需求侧机构名称', '已选择']"
          v-model="sysUser.demandList"
          :data="orzListD"></el-transfer>
      </el-form-item>
      <el-form-item label="选择供给侧机构" class="common-form-item">
        <el-transfer
          @change="checkedOrzChangedS"
          :button-texts="['移除', '添加']"
          :titles="['供给侧机构名称', '已选择']"
          v-model="sysUser.supplyList"
          :data="orzListS"></el-transfer>
      </el-form-item>
      <el-form-item label="选择角色" class="common-form-item">
        <el-transfer
          @change="checkedRoleChanged"
          :button-texts="['移除', '添加']"
          :titles="['角色名称', '已选择']"
          v-model="sysUser.roleList"
          :data="roleList"></el-transfer>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>
<script>
import { addSysUserFormRules } from '@/utils/rules'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'
import md5 from 'js-md5'

export default {
  data () {
    return {
      title: '添加系统用户',
      imageInfo: {
        iconType: '2'
      },
      orgList: [],
      cityList: [],
      checkedOrgList: [],
      labelWidth: '120px',
      sysUser: {
        demandList: [], // 需求侧机构
        supplyList: [], // 供给侧机构
        roleList: [], // 角色
        cityList: [], // 城市
        username: '',
        state: 1,
        password: '',
        orzId: '',
        orzName: '',
        chinesename: ''
      },
      verificationRule: false,
      formRules: addSysUserFormRules,
      orzList: [],
      roleList: [],
      orzAllList: [],
      orzListS: [],
      orzListD: [],
      isDis: true, // 是否可以修改密码
      uid: this.$route.query.userId ? this.$route.query.userId : '', // 判断为修改还是添加页面
      flag: true // 判断是否已对密码做了加密操作
    }
  },
  mounted () {
    this.getQueryParams() // 判断是否为修改状态 并调用详情接口
    this.getOrzRoleList()
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', [])
  },
  methods: {
    changeOrz (val) {
      this.orzAllList.forEach(item => {
        if (val === item.orzId) {
          this.sysUser.orzName = item.orzName
        }
      })
    },
    changeCity (val) {
      request.apiGet(api.organization.tableList, { curBizStat: '1', noPage: 1, cityCode: this.sysUser.cityCode }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orgList = data.data
        }
      })
    },
    getOrzRoleList () {
      request.apiGet(api.city.option, {}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let res = data.data
          res.forEach(item => {
            this.cityList.push({
              key: item.cityCode,
              label: item.cityName
            })
          })
        } else {
          help.E(data.msg)
        }
      })
      request.apiGet(api.orgnization.option, {}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orzAllList = data.data
        } else {
          help.E(data.msg)
        }
      })
      request.apiGet(api.role.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let res = data.data
          res.forEach(item => {
            this.roleList.push({
              key: item.roleId,
              label: item.roleName
            })
          })
        } else {
          help.E(data.msg)
        }
      })
    },
    getQueryParams () {
      if (this.uid) {
        this.isDis = true
        this.title = '修改系统用户'
        request.apiGet(api.sysUser.info, { userId: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.sysUser = data.data
            this.getOrzByCitys(1)
          } else {
            help.E(data.msg)
          }
        })
      } else {
        this.isDis = false
      }
    },
    checkedOrzChangedD (a, direction, moveArr) {
      if (direction === 'right') { // 添加渠道
        let flag = -1
        moveArr.forEach(item => {
          // 更新改变活动渠道配置内容
          for (let i = 0; i < this.orzListD.length; i++) {
            if (item == this.orzListD[i].key) {
              // 如果选择数组里存在该渠道id 则加入
              flag = i
            }
          }
          // flag == -orderReportForms ? "" : this.checkedOrzList.push(this.orzList[flag])
        })
      } else if (direction === 'left') {
        // 删除渠道
        moveArr.forEach((item) => {
          for (let i = 0; i < this.sysUser.demandList.length; i++) {
            if (item == this.sysUser.demandList[i].key) {
              this.sysUser.demandList.splice(i, 1)
            }
          }
        })
      }
    },
    checkedOrzChangedS (a, direction, moveArr) {
      if (direction === 'right') { // 添加渠道
        let flag = -1
        moveArr.forEach(item => {
          // 更新改变活动渠道配置内容
          for (let i = 0; i < this.orzListS.length; i++) {
            if (item == this.orzListS[i].key) {
              // 如果选择数组里存在该渠道id 则加入
              flag = i
            }
          }
        })
      } else if (direction === 'left') {
        // 删除渠道
        moveArr.forEach((item) => {
          for (let i = 0; i < this.sysUser.supplyList.length; i++) {
            if (item == this.sysUser.supplyList[i].key) {
              this.sysUser.supplyList.splice(i, 1)
            }
          }
        })
      }
    },
    checkedCityChanged (a, direction, moveArr) {
      if (direction === 'right') { // 添加城市
        let flag = -1
        moveArr.forEach(item => {
          // 更新改变活动渠道配置内容
          for (let i = 0; i < this.cityList.length; i++) {
            if (item == this.cityList[i].key) {
              // 如果选择数组里存在该渠道id 则加入
              flag = i
            }
          }
        })
        this.getOrzByCitys()
      } else if (direction === 'left') {
        // 删除城市
        moveArr.forEach((item) => {
          for (let i = 0; i < this.sysUser.cityList.length; i++) {
            if (item == this.sysUser.cityList[i].key) {
              this.sysUser.cityList.splice(i, 1)
            }
          }
        })
        this.getOrzByCitys()
      }
    },
    getOrzByCitys (type) {
      this.orzList = []
      if (type != 1) {
        this.sysUser.demandList = []
        this.sysUser.supplyList = []
      }
      if (this.sysUser.cityList.length) {
        request.apiGet(api.orgnization.option, { orzType: '2', cityList: this.sysUser.cityList.join(',') }).then(data => { // 需求侧
          this.orzListD = []
          if (data.code === enums.NET_SUCCESS) {
            data.data.forEach(item => {
              this.orzListD.push({
                key: item.orzId,
                label: item.orzName
              })
            })
          } else {
            help.E(data.msg)
          }
        })
        request.apiGet(api.orgnization.option, { orzType: '1', cityList: this.sysUser.cityList.join(',') }).then(data => { // 供给侧
          this.orzListS = []
          if (data.code === enums.NET_SUCCESS) {
            data.data.forEach(item => {
              this.orzListS.push({
                key: item.orzId,
                label: item.orzName
              })
            })
          } else {
            help.E(data.msg)
          }
        })
      }
    },
    checkedRoleChanged (a, direction, moveArr) {
      if (direction === 'right') { // 添加渠道
        let flag = -1
        moveArr.forEach(item => { // 更新改变活动渠道配置内容
          for (let i = 0; i < this.roleList.length; i++) {
            if (item == this.roleList[i].key) { // 如果选择数组里存在该渠道id 则加入
              flag = i
            }
          }
        })
      } else if (direction === 'left') {
        // 删除渠道
        moveArr.forEach((item) => {
          for (let i = 0; i < this.sysUser.roleList.length; i++) {
            if (item == this.sysUser.roleList[i].key) {
              this.sysUser.roleList.splice(i, 1)
            }
          }
        })
      }
    },
    save () {
      this.$refs['addSysUser'].validate((valid) => {
        if (valid) {
          let info = this.sysUser
          if (info.password.length < 6) return help.W('密码长度为6-16位') // 密码校验
          if (!info.cityList.length) return help.W('请选择城市')
          // if (!info.demandList.length) return help.W('请选择需求侧机构')
          if (!info.supplyList.length) return help.W('请选择供给侧机构')
          if (!info.roleList.length) return help.W('请选择角色')
          this.postData()
        }
      })
    },
    postData () {
      let params = this.sysUser
      if (this.flag) {
        if (this.uid) {
          if (!this.isDis) params.password = md5(params.password) // 点击了修改密码
        } else {
          params.password = md5(params.password)
        }
      }
      request.apiPost(this.uid ? api.sysUser.update : api.sysUser.add, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          this.flag = true
          sessionStorage.setItem('sysUserFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          this.flag = false
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('sysUserFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/style/common.css';
  @import "./addSysUser.less";
</style>
