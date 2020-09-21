<template>
  <el-aside :width="isCollapse? '60px': '200px'">
    <!--<div class="logo"><img src="../../assets/images/logo-xiaoma.png"></div>-->
    <!--<img src="../../assets/images/openMenu.png" class="openMenu" alt="">-->
    <el-row class="tac">
      <el-col :span="24" class="el-col-h">
        <el-menu
          :collapse="isCollapse"
          class="menu-class"
          :default-active="defaultRoute"
          @open="handleOpen"
          @close="handleClose"
          active-text-color="#48C0CD"
          unique-opened
          router>
          <div v-for="(item,index) of menuList" :key="index">
            <keep-alive>
              <el-menu-item v-if="!item.menu.length" :key="item.sortBy" :index="item.menuName">
                <i class="el-icon-menu"></i>
                <img :src="item.icon"/>
                {{ item.menuName }}
              </el-menu-item>
              <el-submenu v-else :key="item.sortBy" :index="item.menuName">
                <template slot="title">
                  <!--<i class="el-icon-menu"></i>-->
                  <img v-if="item.icon" :src="item.icon" class="icon-menu" />
                  <img v-else src="../../assets/images/icon-userManager-unchoose.png" class="icon-menu" alt="">
                  <span>{{ item.menuName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="menuItem of item.menu" :index="menuItem.link" :key="menuItem.menuId" @click="sliderItemClick(menuItem)">{{ menuItem.menuName }}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </keep-alive>
          </div>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
export default({
  name: 'Aside',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    menuList () {
      return JSON.parse(sessionStorage.getItem('modules'))
    },
    defaultRoute () {
      return this.$route.path.replace('/', '')
    }
  },
  methods: {
    /**
     * 点击开启一级菜单
     * @param key
     * @param keyPath
     */
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    /**
     * 点击关闭一级菜单
     * @param key
     * @param keyPath
     */
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    sliderItemClick (item) {
      this.$emit('clickItem', item)
    }
  }
})
</script>

<style>
.el-aside{
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  overflow: auto;
  overflow-x: hidden;
  background: #1e232b;
  /*border-right: 1px solid #e5e5e5;*/
}
/*主体颜色和背景*/
.el-menu {
  border-right: none;
  background-color: #1E232B !important;
  color: #9DA3AC;
}
.el-submenu__title:hover {
  background: #010103 !important;
  color: rgba(72,192,205,1) !important;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background: #1e232b !important;
  color: rgba(72,192,205,1) !important;
}
/*子菜单的字体颜色*/
.el-menu-item{
  color: #9da3ac !important;
}
/*父菜单的字体颜色*/
.el-submenu .el-submenu__title{
  color: #9da3ac;
}
.link-item{
  display:block;
  width:100%;
  height:50px;
  color:#fff;
}
/*打开状态的父级背景色*/
.is-opened {
  background: #010103;
}
/*打开状态下的父菜单字体颜色*/
.is-opened .el-submenu__title {
  color: #fff;
}
/*打开状态下的子菜单背景颜色*/
.el-menu--inline {
  background: #010103;
}
/*父菜单悬停样式*/
.el-submenu__title:hover {
  background: #010103;
  color: rgba(72,192,205,1);
}
/*子菜单悬停样式*/
.el-menu-item:focus, .el-menu-item:hover {
  background: #1E232B;
  color: rgba(72,192,205,1);
}
.el-menu-item-group .is-active {
  border-left:2px solid #48C0CD;
  background: #1E232B;
}
/* icon-menu */
.icon-menu {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
</style>
