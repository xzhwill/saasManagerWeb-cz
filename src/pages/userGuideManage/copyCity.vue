<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="150px" :model="copyGuide" ref="copyCityListGuide" label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="新增指南的城市：" prop="cityCode">
        <el-select v-model="copyGuide.cityCode" @change="getChannelListByCity">
          <el-option v-for="item in cityList" :label="item.cityName" :key="item.cityCode" :value="item.cityCode"></el-option>
        </el-select>
      </el-form-item>
      <div v-for="(item, index) in channelList" :key="index" >
          <el-form-item label="渠道：">
            <span>{{item.channelName}}</span>
            <span class="copyCity">选择要复制的城市：</span>
            <el-select v-model="item.cityCodeOld" @change="getChannelListByCityHad(item,index)">
              <el-option v-for="item in cityListHad" :label="item.cityName" :key="item.cityCode" :value="item.cityCode"></el-option>
            </el-select>
            <span class="copyCity">选择要复制的渠道：</span>
            <el-select v-model="item.channelIdOld">
              <el-option v-for="channel in item.channelListHad" :label="channel.channelName" :key="channel.channelId" :value="channel.channelId"></el-option>
            </el-select>
            </el-form-item>
      </div>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="$router.go(-1)">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import help from '@/utils/helper'
import request from '@/utils/request'
import net from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '一键复制城市',
      copyGuide: {},
      cityList: [], // 左侧城市列表
      cityListHad: [], // 右侧 用户指南已有的城市列表
      channelList: [], // 左侧根据城市获取的渠道列表
      channelListHad: [] // 右侧根据城市获取已有的的渠道列表
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', [])
    this.getCityList()
    this.getCityListHad()
  },
  methods: {
    getCityList () { // 城市列表
      net.apiGet(api.city.option).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch((data) => {
        help.E(data.msg)
      })
    },
    getChannelListByCity () { // 根据城市获取已有的的渠道列表
      var param = {
        cityCode: this.copyGuide.cityCode
      }
      net.apiGet(api.city.channelCity, param).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.channelList = data.data
        } else {
          help.E(data.msg)
        }
      }).catch((data) => {
        help.E(data.msg)
      })
    },
    getCityListHad () { // 用户指南已有的城市列表
      net.apiGet(api.userGuide.cityOption).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          this.cityListHad = data.data
        }
      }).catch((data) => {
        help.E(data.msg)
      })
    },
    getChannelListByCityHad (item, index) { // 根据城市获取的渠道列表
      net.apiGet(api.userGuide.channelOptionBycity, { cityCode: item.cityCodeOld }).then(data => {
        if (data.msg && data.code === enums.NET_SUCCESS) {
          item['channelListHad'] = data.data
          this.$set(this.channelList, index, item)
        }
      }).catch((data) => {
        help.E(data.msg)
      })
    },
    save () {
      let flag = true
      if (!this.copyGuide.cityCode) return help.W('请先选择城市')
      if (!this.channelList.length) return help.W('所选的城市无渠道，请重新选择')
      let lis = []
      this.channelList.forEach((item) => {
        if (item.cityCodeOld && !item.channelIdOld) {
          flag = false
          return help.W('请选择城市下的渠道')
        } else if (item.cityCodeOld && item.channelIdOld) {
          lis.push({
            channelId: item.channelId,
            channelIdOld: item.channelIdOld,
            cityCodeOld: item.cityCodeOld
          })
        }
      })
      if (!lis.length) return help.W('请先选择要复制的城市和渠道')
      if (!flag) return false
      request.apiPost(api.userGuide.copy, {
        cityCode: this.copyGuide.cityCode,
        channelCityList: lis
      }).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('复制成功')
          this.$router.back()
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/style/common.css";
  @import "./copyCity.less";
</style>
