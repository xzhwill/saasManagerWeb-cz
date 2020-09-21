<template>
  <div class="tab-nav-wrapper">
    <div class="nav-list">
      <el-tag
        closable
        class="nav-list-tag"
        v-for="(item, index) in list"
        :type="setTagType(item)"
        @click.native="tagClick(item)"
        size="medium"
        :disable-transitions=true
        :key="index"
        @close="deleteList(index)">{{ item.name }}</el-tag>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.checkList()
  },
  methods: {
    checkList () {
      if (localStorage.getItem('tabNavList')) this.list = JSON.parse(localStorage.getItem('tabNavList'))
    },
    tagClick (item) {
      this.$router.push(`/${item.path}`)
      this.$emit('tagClick', item)
    },
    setTagType (item) {
      if (item.path === this.$route.path.replace('/', '')) {
        return 'primary'
      } else {
        return 'info'
      }
    },
    addList (item) {
      const find = this.list.filter((obj) => obj.id === item.id)
      if (!find.length) {
        this.list.push(item)
        localStorage.setItem('tabNavList', JSON.stringify(this.list))
      }
    },
    deleteList (index) {
      this.list.splice(index, 1)
      if (!this.list.length) localStorage.removeItem('tabNavList')
      else localStorage.setItem('tabNavList', JSON.stringify(this.list))
    }
  }
}
</script>

<style>
.wrapper-nav-list{
  height: 33px;
  overflow: hidden;
  padding:0 20px;
  background: #e5e5e5;
}
.nav-list-tag{
  cursor: pointer;
}
.nav-list{
  margin-top: 10px;
}
</style>
