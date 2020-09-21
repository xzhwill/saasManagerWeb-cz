<template>
  <el-container style="display: flex;justify-content: flex-start;margin-top: 15px;">
    <el-form
      enctype="multipart/form-data"
      label-width="100px"
      :model="role"
      ref="addRole"
      label-position="right"
      :rules="formRules">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="角色名称" prop="roleName" class="common-form-item">
        <el-input v-model="role.roleName" minlength="5"></el-input>
      </el-form-item>
      <el-form-item label="描述" class="common-form-item">
        <el-input v-model="role.description">
        </el-input>
      </el-form-item>
      <el-form-item prop="state" label="状态">
        <el-radio v-model="role.state" :label="1">可用</el-radio>
        <el-radio v-model="role.state" :label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item label=" 选择菜单">
        <el-tree
          ref="menuTree"
          :data="menuList"
          show-checkbox
          node-key="menuId"
          :default-checked-keys="checkArr"
          :props="defaultProps">
        </el-tree>
      </el-form-item>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import helper from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'
import { removeRepeatObj } from '@/utils/public'
import { roleManageAdd } from '@/utils/rules'

export default {
  data () {
    return {
      title: '添加角色',
      role: {
        state: 1,
        description: '',
        roleName: ''
      },
      menuList: [],
      checkArr: [],
      menu: [],
      defaultProps: {
        children: 'list',
        label: 'menuName'
      },
      formRules: roleManageAdd, // 必填项判断
      uid: this.$route.query.id ? this.$route.query.id : '' // 判断修改还是添加页面
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getMenuList()
  },
  methods: {
    getMenus () { // 获取选中的菜单
      let menuArr = this.$refs.menuTree.getCheckedNodes()
      let menuIds = []
      let allMenuIds = []
      menuArr.forEach(item => {
        if (!item.operation) {
          allMenuIds.push(item.menuId)
          menuIds.push({
            menuId: item.menuId,
            parentId: item.parentId,
            operationList: []
          })
        }
        if (item.parentId) {
          if (item.operation) {
            if (allMenuIds.indexOf(item.parentId) > -1) {
              menuIds.forEach(val3 => {
                if (val3.menuId == item.parentId) {
                  val3.operationList.push(item.operationId)
                }
              })
            } else {
              menuIds.push({
                menuId: item.parentId,
                parentId: item.grandPaId,
                operationList: [item.operationId]
              })
              allMenuIds.push(item.grandPaId)
              allMenuIds.push(item.parentId)
              menuIds.push({
                menuId: item.grandPaId,
                parentId: 0,
                operationList: []
              })
            }
          } else {
            menuIds.push({
              menuId: item.menuId,
              parentId: item.parentId,
              operationList: []
            })
          }
        }
      })
      return removeRepeatObj(menuIds, 'menuId')
    },
    getRoleInfo () {
      if (this.uid) {
        this.title = '修改角色信息'
        request.apiGet(api.role.info, { roleId: this.uid }).then(data => {
          if (data.code && data.code === enums.NET_SUCCESS) {
            let res = data.data
            this.role = res
            res.menuList.forEach(item => {
              if (item.parentId !== 0) {
                item.operationList.forEach(val => {
                  let id = val.moId + 10000
                  this.checkArr.push(id)
                })
              }
            })
            this.checkArr.sort(function (a, b) {
              return a - b
            })
            this.menuList = this.menu
          }
        })
      } else {
        this.menuList = this.menu
      }
    },
    getMenuList () { // 获取菜单
      request.apiGet(api.menu.menuList).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let res = data.data
          res.forEach(item => {
            item.list.forEach(val => {
              let list = []
              val.optionList.forEach(val2 => {
                let id = val2.id + 10000
                let obj = {
                  menuId: id,
                  operationId: val2.operationId,
                  menuName: val2.operationName,
                  parentId: val.menuId,
                  grandPaId: item.menuId,
                  operation: true
                }
                list.push(obj)
              })
              val.operation = false
              val.list = list
            })
          })
          this.menu = res
          this.getRoleInfo()
        } else {
          helper.E(data.msg.message)
        }
      })
    },
    save () {
      this.$refs['addRole'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      if (!this.getMenus().length) return helper.W('请先选择菜单')
      // let menuArr = this.$refs.menuTree.getCheckedNodes()
      // let menuIds = []
      // let allMenuIds = []
      // menuArr.forEach(item => {
      //   let obj = {
      //     menuId: item.menuId,
      //     parentId: item.parentId,
      //     operationList: []
      //   }
      //   if (!item.operation) {
      //     allMenuIds.push(obj.menuId)
      //     menuIds.push(obj)
      //   }
      //   if (item.parentId) {
      //     let obj = {
      //       menuId: item.parentId,
      //       parentId: 0
      //     }
      //     if (item.operation) {
      //       if (allMenuIds.indexOf(item.parentId) > -orderReportForms) {
      //         menuIds.forEach(val3 => {
      //           if (val3.menuId == item.parentId) {
      //             val3.operationList.push(item.operationId)
      //           } else { }
      //         })
      //       } else {
      //         menuIds.push({
      //           menuId: item.parentId,
      //           parentId: item.grandPaId,
      //           operationList: [item.operationId]
      //         })
      //         allMenuIds.push(item.grandPaId)
      //         allMenuIds.push(item.parentId)
      //         menuIds.push({
      //           menuId: item.grandPaId,
      //           parentId: 0,
      //           operationList: []
      //         })
      //       }
      //     } else {
      //       menuIds.push(obj)
      //     }
      //   }
      // })
      let params = this.role
      params.menuList = this.getMenus()
      request.apiPost(this.uid ? api.role.update : api.role.add, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          sessionStorage.setItem('roleFlag', 'true')
          helper.S('保存成功')
          this.$router.back()
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('roleFlag', 'true')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
  @import '../../assets/style/common.css';
  @import "./addRole.less";
</style>
