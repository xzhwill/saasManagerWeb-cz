<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form
      enctype="multipart/form-data"
      label-width="100px"
      :model="menu"
      :rules="formRules" ref="addMenu"
      label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="菜单名称" prop="menuName" class="common-form-item">
        <el-input v-model="menu.menuName" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="选择上级菜单" class="common-form-item">
        <el-select v-model="menu.parentId" filterable>
          <el-option v-for="(item, index) in parentList" :key="index" :label="item.menuName" :value="item.menuId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口地址" class="common-form-item">
        <el-input v-model="menu.path"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" class="common-form-item">
        <el-input v-model="menu.link"></el-input>
      </el-form-item>
      <el-form-item label="icon" class="common-form-item">
        <el-upload
          list-type="picture-card"
          :limit=1
          :before-upload="beforeAvatarUpload"
          :file-list="photoFile"
          :http-request="uploadImage"
          :on-remove="removePhoto"
          action="''"
          :data="{ type: 1 }">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="操作功能" class="common-form-item" style="width: 500px;position: relative">
        <el-checkbox-group v-model="checkBtn">
          <el-checkbox v-for="item in allBtn" :label="item.operationId" :key="item.operationId">{{item.operationName}}</el-checkbox>
        </el-checkbox-group>
        <div style="position: absolute;right: -180px;font-size: 12px;top: 0;color: red;">注：功能操作只针对子菜单有效</div>
      </el-form-item>
      <el-form-item class="common-form-item" label="排序" prop="seq">
        <el-input v-model="menu.seq" @blur="judgeInfo(menu.seq)"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="menu.state" :label="1">可用</el-radio>
        <el-radio v-model="menu.state" :label="0">禁用</el-radio>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { addMenuFormRules } from '@/utils/rules'
import { checkedImage } from '@/utils/public'
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '添加菜单',
      imageInfo: {
        iconType: '2'
      },
      allBtn: [],
      photoFile: [],
      action: 0,
      labelWidth: '120px',
      parentList: [],
      menu: {
        menuName: '',
        parentId: null,
        seq: '', // 排序
        link: '',
        icon: '',
        state: 1,
        path: '',
        checkBtn: []
      },
      checkBtn: [1],
      verificationRule: false,
      formRules: addMenuFormRules
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getOperation()
    this.getParentList()
    this.getMenuInfo()
  },
  methods: {
    judgeInfo (val) {
      if (isNaN(val)) {
        this.menu.seq = ''
        return help.E('请输入正确的序号')
      } else {
        this.menu.seq = (+val).toFixed()
      }
    },
    getOperation () {
      request.apiGet(api.operate.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.allBtn = data.data
        }
      })
    },
    getMenuInfo () {
      let menuId = this.$route.query.id
      if (menuId != undefined) {
        this.action = 1
        this.title = '修改菜单信息'
        request.apiGet(api.menu.info, {
          menuId: menuId
        }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.menu = (res)
            this.photoFile = []
            this.photoFile.push({ name: '2', url: res.icon })
            if (res.operationList.length) {
              this.checkBtn = []
              res.operationList.forEach(item => {
                this.checkBtn.push(item)
              })
            }
          }
        })
      }
    },
    getParentList () {
      request.apiGet(api.menu.parentList).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.parentList = data.data
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    save () {
      this.$refs['addMenu'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    uploadImage (file) {
      request.apiFile(api.common.upload, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
          help.E(data.msg)
        } else {
          this.photoFile.push({ name: '2', url: data.data })
        }
      })
    },
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 300)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    removePhoto (file) {
      let removeUrl = file.url
      this.photoFile.map((item, index) => {
        if (item.url == removeUrl) {
          this.photoFile.splice(index, 1)
        }
      })
    },
    postData () {
      let params = this.menu
      let url
      +this.action === 1 ? url = api.menu.update : url = api.menu.add
      console.log(this.photoFile)
      params.operationList = this.checkBtn
      if (this.photoFile.length) params.icon = this.photoFile[0].url
      // params.seq = parseInt(params.seq)
      request.apiPost(url, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('menuFlag', 'true')
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('menuFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
  @import '../../assets/style/common.css';
  @import "./addMenu.less";
</style>
