<template>
  <div>
    <!-- 搜索 -->
    <!-- divide -->
    <div class="contain">
      <div class="row">
        <div class="tip">手机号：</div>
        <el-input v-model="phone"
                  placeholder="请输入手机号"
                  style="width:200px"></el-input>
        <el-button type="primary"
                   class="btn"
                   @click="getCode">查询</el-button>
      </div>
      <div class="row bottom">
        <div class="code">{{code}}</div>
        <div class="msg">{{addTime}}</div>
      </div>
    </div>
    <!-- table -->
  </div>
</template>
<script>
import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import net from '@/utils/request'
import api from '@/utils/api'
import help from '@/utils/helper.js'
import enums from '@/utils/enums'
import { toFen } from '../../utils/public'
export default {
  name: 'order',
  props: {
    searchData: {
      type: Array,
      required: true
    },
    tableHeaderCheckList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      phone: '',
      code: '',
      addTime: ''
    }
  },
  mounted() {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', this.page)
    this.init()
  },
  methods: {
    init() {
    },
    getCode() {
      net.apiGet(api.smscode.info, { phone: this.phone }).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          if (data.data.smsCode != '') {
            this.code = data.data.smsCode
            this.addTime = '生成时间：' + data.data.addTime
          } else {
            this.addTime = '未查询到该手机号的验证码'
            this.code = ''
          }
        } else {
          help.E(data.msg.message)
        }
      })
    },
  }
}
</script>

<style lang="less" type="text/less">
@import '../../assets/style/set.less';
.contain {
  width: 600px;
  height: 30px;
  line-height: 30px;
}
.row {
  display: flex;
}
.bottom {
  line-height: 80px;
  margin: 60px 0 0 60px;
}
.tip {
  width: 60px;
}
.btn {
  margin-left: 16px;
}
.code {
  font-size: 30px;
  letter-spacing: 14px;
}
.msg {
  width: 180px;
  margin-left: 30px;
}
</style>
