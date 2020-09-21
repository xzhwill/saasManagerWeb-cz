<template>
  <div class="search-form" :class="{ 'search-collapse-active': visible }">
    <el-form :label-position="labelPosition" :size="size" :model="formData" :rules="rules" ref="ruleForm">
      <!--表单标题-->
      <div class="search-form-list search-form-list-header" style="display: flex;">
        <el-form-item v-for="(item, index) in modulesHeaderList" :key="index" :prop="item.name"
          :label="`${item.label}：`" v-if="item.formType" style="display: flex;">
          <async-form-item :formItem="item" v-model="formData[item.name]" ref="childrenForm"></async-form-item>
        </el-form-item>
        <div class="search-form-tip-list">
          <div class="search-form-tip-list-main">
            <slot></slot>
          </div>
        </div>
      </div>
      <!--表单下拉-->
      <el-collapse-transition>
        <div v-show="visible" class="search-form-list" style="display: flex; flex-flow: wrap;">
          <el-form-item v-for="(item, index) in modulesBodyList" :key="index" :prop="item.name"
            :label="`${item.label}：`" v-if="item.formType" style="display: flex;">
            <async-form-item :formItem="item" v-model="formData[item.name]" ref="childrenForm"></async-form-item>
          </el-form-item>
        </div>
      </el-collapse-transition>
    </el-form>
  </div>
</template>

<script>
import AsyncFormItem from '../AsyncForm/AsyncFormItem'
import { getYearMonthDayTime, getYearMonthTime } from '../../../utils/public'

export default {
  components: { AsyncFormItem },
  props: {
    labelWidth: {
      type: String,
      default: '160px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    size: {
      type: String,
      default: 'small'
    },
    formModules: {
      type: Array,
      default: () => []
    },
    splitIndex: {
      type: Number,
      default: 2
    },
    headerPR: {
      type: Number,
      default: 200
    },
    visible: {
      type: Boolean
    }
  },
  computed: {
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
  data () {
    return {
      formData: {},
      modulesHeaderList: [],
      modulesBodyList: []
    }
  },
  watch: {
    visible (boolean) {
      this.$emit('change', boolean)
    },
    formModules (newVal, oldVal) {
      this.modulesHeaderList = []
      this.modulesBodyList = []
      this.formatModules(this.splitIndex)
    }
  },
  mounted () {
    this.formatModules(this.splitIndex)
  },
  methods: {
    formatModules (index) {
      for (let i = 0; i < this.formModules.length; i++) {
        if (i <= index) this.modulesHeaderList.push(this.formModules[i])
        else this.modulesBodyList.push(this.formModules[i])
      }
    },
    clearForm () { // 重制表单
      let thisDay = getYearMonthDayTime()
      let thisMon = getYearMonthTime()
      if (this.$refs.childrenForm != undefined) {
        this.$refs.childrenForm.forEach(item => {
          if (item.formItem.hasTime) {
            if (item.formItem.hasTime === 'typeDay') {
              item.formItem.data = [thisDay.dayStr, thisDay.dayStr]
              item.data = [thisDay.dayStr, thisDay.dayStr]
              // this.formData.customeDetailTime = [thisDay.dayStr, thisDay.dayStr]
            } else if (item.formItem.hasTime === 'typeMon') {
              item.formItem.data = [thisMon.dayStr + '-01', thisMon.dayStr + '-' + thisMon.days]
              item.data = [thisMon.dayStr + '-01', thisMon.dayStr + '-' + thisMon.days]
              // this.formData.workDates = [thisMon.dayStr + '-01', thisMon.dayStr + '-' + thisMon.days]
            }
          } else {
            for (const key in this.formData) {
              if (key !== 'customeDetailTime' || key !== 'workDates') {
                this.formData[key] = null
              }
            }
            item.clearData()
          }
        })
      }
      this.$refs.ruleForm.resetFields()
    },
    clearFormNoDate () { // 重制表单但不保存日期
      for (const key in this.formData) {
        if (key.indexOf('date')) {

        } else {
          this.formData[key] = null
        }
      }
      this.$refs.childrenForm.forEach(item => {
        if (item.formItem.formType === 'daterange') {
        } else {
          item.clearData()
        }
      })
    },
    getFormData () { // 获得表单数据
      const formatFormData = {}
      for (const key in this.formData) {
        if (this.formData[key] !== '' && this.formData[key] !== 'null' && this.formData[key] !== 'undefined' && this.formData[key] !== undefined) {
          if (Array.isArray(this.formData[key])) {
            formatFormData[key] = this.formData[key]
          } else {
            formatFormData[key] = this.formData[key]
          }
        }
      }
      return formatFormData
    }
  }
}
</script>
