<template>
  <!--input-->
  <el-input style="width: 150px;margin-right: 15px;" v-if="formItem.formType === 'input'" v-model.trim="data"
    :placeholder="formItem.message || ''" :disabled="formItem.disabled || false" @change="handleChange">
  </el-input>
  <!--textarea-->
  <el-input v-else-if="formItem.formType === 'number'" v-model.trim="data" type="number"
    :placeholder="formItem.message || ''" :disabled="formItem.disabled || false" :autosize="{ minRows: 3 }"
    @change="handleChange">
  </el-input>
  <!--select-->
  <el-select style="width: 150px; margin-right: 15px;" class="w100" v-else-if="formItem.formType === 'select'"
    v-model="data" :placeholder="formItem.message || ''" :disabled="formItem.disabled || false" filterable
    @change="handleChange">
    <el-option v-for="(item, index) in formItem.option" :key="index" :label="item[selectProps]"
      :value="item[selectProps]"></el-option>
  </el-select>
  <el-select style="width: 150px;margin-right: 15px;" class="w100" v-else-if="formItem.formType === 'selectVal'"
    v-model="data" :placeholder="formItem.message || ''" :disabled="formItem.disabled || false" filterable
    @change="handleChange">
    <el-option v-for="(item, index) in formItem.option" :key="index" :label="item[selectProps]"
      :value="item['value'].toString()"></el-option>
  </el-select>
  <!--cascader-->
  <el-cascader style="width: 150px;margin-right: 15px;" class="w100" v-else-if="formItem.formType === 'cascader'"
    v-model="data" :placeholder="formItem.message || ''" :disabled="formItem.disabled || false"
    :options="formItem.option ? formItem.option : []" :props="cascaderProps" filterable @change="handleChange">
  </el-cascader>
  <!--datetime-->
  <el-date-picker
    class="w100"
    v-else-if="formItem.formType === 'daterange'"
    v-model="data"
    type="daterange"
    :clearable="false"
    style="width: 240px; margin-right: 15px"
    @change="handleChange"
    format="yyyy-MM-dd"
    value-format="yyyy-MM-dd"
    :disabled="formItem.disabled || false"
    :placeholder="formItem.message || ''">
  </el-date-picker>
  <!--dateMonth-->
  <el-date-picker class="w100" v-else-if="formItem.formType === 'dateMonth'" v-model="data" type="daterange"
    :clearable="false" style="width: 150px;margin-right: 15px" @change="handleChange" format="yyyy-MM"
    value-format="yyyy-MM" :disabled="formItem.disabled || false" :placeholder="formItem.message || ''">
  </el-date-picker>
  <el-date-picker
    class="w100"
    v-else-if="formItem.formType === 'monthrange'"
    v-model="data"
    type="monthrange"
    :clearable="false"
    style="width: 150px;margin-right: 15px"
    @change="handleChange"
    format="yyyy-MM"
    value-format="yyyy-MM"
    :disabled="formItem.disabled || false"
    :placeholder="formItem.message || ''"></el-date-picker>
  <el-date-picker v-else-if="formItem.formType === 'startMonth'" class="w100" v-model="data" :clearable="false"
    style="width: 150px;margin-right: 15px" @change="handleChange" :disabled="formItem.disabled || false"
    :placeholder="formItem.message || ''" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择月">
  </el-date-picker>
  <el-date-picker v-else-if="formItem.formType === 'endMonth'" class="w100" v-model="data" :clearable="false"
    style="width: 150px;margin-right: 15px" @change="handleChange" format="yyyy-MM" value-format="yyyy-MM"
    :disabled="formItem.disabled || false" :placeholder="formItem.message || ''" type="month" placeholder="选择月">
  </el-date-picker>
	 <el-date-picker v-else-if="formItem.formType === 'date'" class="w100" v-model="data" :clearable="false"
	  style="width: 150px;margin-right: 15px" @change="handleChange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
	  :disabled="formItem.disabled || false"  type="date" placeholder="选择日期">
	</el-date-picker>
  <!--datetimerange-->
  <el-date-picker style="width: 150px;margin-right: 15px;" class="w100"
    v-else-if="formItem.formType === 'datetimerange'" v-model="data" type="datetimerange" unlink-panels
    :clearable="false" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="~"
    @change="handleChange" start-placeholder="开始日期" end-placeholder="结束日期">
  </el-date-picker>
  <el-time-picker class="w100" v-else-if="formItem.formType === 'timerange'" v-model="data" type="timerange"
    unlink-panels :clearable="false" format="HH:mm" value-format="HH:mm" is-range range-separator="~"
    style="width: 150px;margin-right: 15px" @change="handleChange" start-placeholder="开始时间" end-placeholder="结束时间">
  </el-time-picker>
</template>

<script>
export default {
  props: {
    formItem: {
      type: Object,
      default: () => { }
    },
    value: {
      type: null,
      required: true
    }
  },
  computed: {
    cascaderProps () {
      if (this.formItem.defaultProps) {
        return this.formItem.defaultProps
      } else {
        return {
          label: 'label',
          children: 'children',
          value: 'value'
        }
      }
    },
    selectProps () {
      if (this.formItem.defaultProps) {
        return this.formItem.defaultProps
      } else {
        return 'label'
      }
    },
    selectValue () {
      if (this.formItem.defaultProps) {
        return this.formItem.defaultProps
      } else {
        return 'value'
      }
    }
  },
  data () {
    return {
      data: ''
    }
  },
  mounted () {
    this.onReady()
  },
  methods: {
    onReady () {
      if (this.formItem.data) {
        this.data = this.formItem.data
      }
    },
    handleChange (val) {
      this.$emit('input', val)
    },
    clearData () {
      this.data = Array.isArray(this.data) ? [] : ''
    },
    setValue (val) {
      this.data = val
    }
  },
  watch: {
    data (val) {
      this.$emit('input', val)
    },
    formItem (newVal, oldVal) {
      console.log('new')
      console.log(newVal)
      this.formItem = newVal
    }
  }
}
</script>
