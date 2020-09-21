<template>
  <el-form :label-position="labelPosition"
           :size="size"
           :model="formData"
           :rules="rules"
           ref="ruleForm">
    <el-form-item class="page-form-item" v-for="(item, index) in formModules" :key="index" :prop="item.name" :label="`${item.label}：`" v-if="item.formType">
      <async-form-item :formItem="item" v-model="formData[item.name]" ref="childrenForm"></async-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
import AsyncFormItem from './AsyncFormItem'

export default {
  components: {
    AsyncFormItem
  },
  props: {
    labelWidth: {
      type: String,
      default: '100px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    statusIcon: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    formModules: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      formData: {}
    }
  },
  computed: {
    // 构造表单rule
    rules () {
      const obj = {}
      this.formModules.forEach((item) => {
        obj[item.name] = []
        obj[item.name].push({
          required: item.required,
          message: item.message || '未知错误'
        })
      })
      return obj
    }
  },
  methods: {
    clearForm () { // 重制表单
      for (const key in this.formData) {
        this.formData[key] = null
      }
      this.$refs.childrenForm.forEach((item) => { // 清空formItem值
        item.clearData()
      })
      this.$refs.ruleForm.resetFields()
    },
    getFormData () { // 获得表单数据
      const childrenFormList = this.$refs.childrenForm
      for (let i = 0; i < childrenFormList.length; i++) {
        const childrenForm = childrenFormList[i]
        const key = childrenForm.formItem.name
        const data = childrenForm.data
        this.formData[key] = data
      }
      return this.formData
    },
    setFormData (formData) { // 写入表单数据
      this.clearForm() // 处理多次表单填充数据 清理一次在写入
      const childrenFormList = this.$refs.childrenForm
      for (let i = 0; i < childrenFormList.length; i++) {
        const childrenForm = childrenFormList[i]
        if (formData[childrenForm.formItem.name]) {
          childrenForm.setValue(formData[childrenForm.formItem.name])
          this.formData[childrenForm.formItem.name] = formData[childrenForm.formItem.name]
        }
      }
    },
    validateForm (cb) { // 回调表单验证
      this.$refs.ruleForm.validate(function (valid) {
        cb(valid)
      })
    }
  }
}
</script>

<style lang="less" type="text/less">
</style>

