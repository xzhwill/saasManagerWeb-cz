<template>
    <div class="page-page">
        <el-pagination :current-page.sync="page.pageNum" background layout="total, prev, pager, next, jumper, sizes" @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange" :page-sizes="page.pageSizes" :total="page.total">
        </el-pagination>
    </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      default: () => {}
    },
    searchData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.page.pageSizes = enums.
    },
    sizeChange (pageSize) {
      this.$emit('changeSize', pageSize)
    },
    currentChange (pageNum) {
      this.$emit('changeCurrent', pageNum)
    }
  }
}
</script>

<!--<style>-->
<!--.wrapper-nav-list{-->
  <!--height: 33px;-->
  <!--overflow: hidden;-->
  <!--padding:0 20px;-->
  <!--background: #e5e5e5;-->
<!--}-->
<!--.nav-list-tag{-->
  <!--cursor: pointer;-->
<!--}-->
<!--.nav-list{-->
  <!--margin-top: 10px;-->
<!--}-->
<!--</style>-->
