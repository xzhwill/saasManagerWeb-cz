<template>
  <div class="page-page">
    <el-pagination
      background
      :current-page="page.pageNum"
      layout="total, prev, pager, next, jumper, sizes"
      :total="$store.state.total"
      :page-size="page.pageSize"
      :page-sizes="page.pageSizes"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Pagination',
  props: {
    page: {
      type: Object
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['total'])
  },
  methods: {
    sizeChange (size) {
      this.page.pageNum = 1
      this.page.pageSize = size
      this.$emit('size-change', size)
    },
    currentChange (num) {
      this.page.pageNum = num
      this.$emit('current-change', num)
    }
  }
}
</script>

<style></style>
