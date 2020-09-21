<template>
  <div class="common-container">
    <div class="search-map" :style="searchMapTop">
      <!--<el-autocomplete
        style="width: 180px"
        v-model="searchMapValue"
        :fetch-suggestions="querySearch"
        placeholder="请输入关键字"
        :trigger-on-focus="false"
        @select="handleSelectSearch"></el-autocomplete>-->
    </div>
    <div class="amap-page-container" style="position: relative;height: 100%;">
      <div class="searchMap" :style="searchMapHeight">
        <el-form v-model="searchData">
          <el-form-item label="" :style="searchFormClass">
            <el-radio v-model="searchData.type" :label="1" style="width: 20px;" @change="changeType">站点ID </el-radio>
            <el-input v-model.trim="searchData.siteSid" style="width: 120px;margin-left:50px;" placeholder="请输入站点ID">
            </el-input>
            <el-input v-model.trim="searchData.siteName" style="width: 160px;" placeholder="请输入站点名称"></el-input>
          </el-form-item>
          <el-form-item label="" style="display:inline-block;margin-bottom:10px;">
            <el-radio v-model="searchData.type" :label="2" style="width: 40px;" @change="changeType">线路ID</el-radio>
            <el-select v-model="searchData.lineType" filterable style="width: 100px;" @change="getLineList">
              <el-option
                v-for="(item, index) in businessTypeList "
                :key="index"
                :label="item.businessName"
                :value="item.businessId"></el-option>
            </el-select>
            <el-select v-model="searchData.lineId" filterable @change="lineChange" style="margin-left:0px;">
              <el-option
                v-for="(item, index) in lineList "
                :key="index"
                :label="item.lineNo+' '+item.lineName"
                :value="item.lineId"></el-option>
            </el-select>
          </el-form-item>
          <p></p>
          <el-form-item style="display: inline-block; margin-left: 15px;">
            <el-button type="primary" round @click="doSearch" v-if="searchFlag">搜索</el-button>
            <el-button type="danger" round @click="clearArr">清除</el-button>
          </el-form-item>
        </el-form>
        <el-autocomplete
          class="search-ipt"
          v-model="searchMapValue"
          :fetch-suggestions="querySearch"
          placeholder="请输入关键字"
          :trigger-on-focus="false"
          @select="handleSelectSearch"></el-autocomplete>
      </div>
      <div id="amapContainer" style="width: 81%; height: 100%;"></div>
      <div class="addSideList">
        <el-tabs v-model="siteLine" tab-position="top" :stretch='chooseModule'>
          <el-tab-pane label="站点规划" name="first">
            <div class="addSite">
              <el-form ref="addPoint" :model="addPoint" label-width="100px" :rules="addPointRules">
                <el-form-item label="城市:" prop="cityCode">
                  <el-select v-model="addPoint.cityCode" placeholder="请选择" @change="getDistrict(addPoint.cityCode)">
                    <el-option v-for="item in cityOptions" :key="item.cityCode" :label="item.cityName" :value="item.cityCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择区域:" prop="areaId">
                  <el-select v-model="addPoint.areaId" placeholder="请选择">
                    <el-option v-for="item in districtInfo" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="站点ID:" prop="siteSid">
                  <el-input v-model.trim="addPoint.siteSid" />
                </el-form-item>
                <el-form-item label="经度:" prop="longitude">
                  <el-input v-model.trim="addPoint.longitude" />
                </el-form-item>
                <el-form-item label="纬度:" prop="latitude">
                  <el-input v-model.trim="addPoint.latitude" />
                </el-form-item>
                <el-form-item label="站点名称:" prop="siteName">
                  <el-input v-model.trim="addPoint.siteName" :maxLength="20"/>
                </el-form-item>
                <el-form-item label="站点图片:">
                  <el-upload
                    list-type="picture-card"
                    class="showImage"
                    :limit=1
                    :before-upload="beforeAvatarUpload"
                    :file-list="fileList"
                    :http-request="uploadImage"
                    :on-remove="removeImage"
                    action="''"
                    ref="upload">
                    <el-button type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="站点描述:">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="addPoint.description" :maxLength="20"></el-input>
                </el-form-item>
                <el-form-item label="站点状态:">
                  <el-select v-model="addPoint.state">
                    <el-option :value='0' label="禁用"></el-option>
                    <el-option :value='1' label="启用"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveSite">保存</el-button>
                  <el-button type="danger" @click="cancelSite">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import { clearObj, checkedImage, setOperation } from '@/utils/public'
import { addPointFormRules } from '@/utils/rules'
import AMap from 'AMap'

export default {
  data () {
    return {
      // 地图相关
      searchMapValue: '',
      city: '',
      searchResults: [],
      region: {
        longitude: '',
        latitude: '',
        areaName: '',
        state: '',
        areaId: '',
        cityCode: ''
      },
      searchFlag: false,
      addPointRules: addPointFormRules,
      districtArr: [],
      siteLine: 'first',
      districtInfo: [{ areaName: '请选择', areaId: '' }],
      cityOptions: [],
      chooseModule: true,
      map: '',
      marker: new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: []
      }),
      circle: '', //  中心圆
      addPoint: {
        longitude: '',
        latitude: '',
        siteName: '', // 站点名称
        areaId: '',
        state: 1, // 站点状态
        siteId: '',
        siteSid: '',
        siteType: '1',
        siteImg: '',
        description: '', // 站点描述
        updateFlag: true,
        isNew: '',
        cityCode: '',
        orzId: ''

      },
      fileList: [], // 站点图片
      imageText: enums.IMAGEACTIVITYTEXT,
      normalAIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/normalSite.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      forbiddenAIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/forbiddenSite.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      chargeAIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/1.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      lineIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/iconLine.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      lineSIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/iconStart.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      lineEIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/iconEnd.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      showSiteInfo: {
        name: '',
        longitude: '',
        latitude: '',
        id: '',
        state: '',
        areaId: '',
        siteImg: '',
        description: '',
        text: '',
        isDistrict: false
      },
      siteArr: [], // 获取到当前搜索的所有站点
      fileInfo: '',
      searchData: {
        lineType: '', // 判断站点还是线路：orderReportForms、站点；travelReportForms：线路
        siteSid: '',
        siteName: '', // 站点名称
        lineId: '', // 站点ID
        type: 1
      },
      center: [116.409097, 39.917989],
      isLocate: true,
      rmList: [],
      operateInfo: enums.OPERATIONID,
      lineList: [],
      specialList: [],
      CarpoolingList: [],
      startSite: [],
      endSite: [],
      waypoints: [],
      driving: '',
      markers: new Map(),
      lineMarker: new Map(),
      orgnizationList: [],
      searchFormClass: {},
      businessTypeList: enums.BUSINESSTYPE1
    }
  },
  created () {
    this.getHight()
    window.addEventListener('resize', this.getHight)
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    setTimeout(() => {
      this.init()
    }, 500)
  },
  methods: {
    /**
     * 选择触发开启定位（地图位置搜索）
     */
    handleSelectSearch () {
      let _this = this
      for (let i = 0; i < _this.searchResults.length; i++) {
        if (_this.searchMapValue == _this.searchResults[i].value) {
          var lng = _this.searchResults[i].location.lng
          var lat = _this.searchResults[i].location.lat
          _this.map.setCenter([lng, lat]) // 设置地图中心点
          var marker = new AMap.Marker({
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            position: [lng, lat],
            offset: new AMap.Pixel(-13, -30)
          })
          marker.setMap(_this.map)
          let data = {
            longitude: lng,
            latitude: lat
          }
          _this.drawCircle(data)
          _this.showSite(data)
        }
      }
    },
    /**
     * 填地址触发
     * @param queryString
     * @param cb
     */
    querySearch (queryString, cb) {
      let _ = this
      AMap.plugin('AMap.Autocomplete', function () {
        var autoComplete = new AMap.Autocomplete({ city: _.city })
        autoComplete.search(queryString, function (status, result) {
          if (status === 'complete') { // 搜索成功时，result即是对应的匹配数据
            let tips = result.tips
            let results = []
            for (let i = 0; i < tips.length; i++) {
              results.push({
                value: tips[i].name,
                location: tips[i].location
              })
            }
            cb(results)
            _.searchResults = results
          }
        })
      })
    },
    /**
     * 更换线路
     */
    lineChange () {
      this.startSite = []
      this.endSite = []
      this.waypoints = []
      this.lineMarker.forEach((value, key, map) => {
        value.setIcon(this.normalAIcon)
      })
      this.driving.clear()
      this.getLine()
    },
    /**
     * 获取线路列表
     */
    getLineList () {
      if (this.searchData.type === 2) {
        request.apiGet(api.line.optionList, { businessType: this.searchData.lineType }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.lineList = data.data
            this.searchData.lineId = ''
          } else {
            helper.E(data.msg)
          }
        })
      }
    },
    /**
     * 获取城市列表
     */
    getCityList () {
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityOptions = data.data
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 获取线路
     * @returns {boolean|void|*}
     */
    getLine () {
      this.lineMarker.clear()
      let that = this
      if (!this.searchData.lineId) return helper.E('请选择线路ID')
      request.apiGet(api.line.siteList, { lineId: this.searchData.lineId }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let position
          let marker
          let icon
          for (let i = 0; i < data.data.length; i++) {
            var item = data.data[i]
            marker = that.setMarker(item, '')
            this.lineMarker.set(item.siteId, marker)
            position = new AMap.LngLat(item.longitude, item.latitude)
            if (item.siteType === 1) {
              icon = this.lineSIcon
            } else if (item.siteType === 2) {
              icon = this.lineEIcon
            } else {
              icon = this.lineIcon
            }
            marker.setIcon(icon)
            if (i === 0) {
              that.startSite = position
            } else if (i === (data.data.length - 1)) {
              that.endSite = position
              setTimeout(() => {
                AMap.plugin('AMap.Driving', function () {
                  that.driving.search(that.startSite, that.endSite, {
                    waypoints: that.waypoints
                  }, function (status, result) {
                    if (status === 'complete') {
                    } else {
                      helper.E('获取驾车数据失败：' + result)
                    }
                  })
                })
              }, 1000)
            } else {
              that.waypoints.push(position)
            }
          }
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 切换线选择路和站点
     */
    changeType () {
      if (+this.searchData.type === 1) {
        this.driving.clear()// 清线
        this.lineMarker.forEach((value, key, map) => {
          value.setIcon(this.normalAIcon)
        })
        this.markers.forEach((value, key, map) => {
          value.setDraggable(true)
        })
        this.searchData.lineId = ''
      } else {
        this.lineMarker.clear()
        this.markers.forEach((value, key, map) => {
          value.setDraggable(false)
        })
      }
    },
    /**
     * 点击清除按钮
     */
    clearArr () {
      this.rmList = setOperation('mapManage')
      this.isLocate = true
      clearObj(this.searchData)
      this.searchData.type = 1
      this.init()
    },
    /**
     * 上传站点图片
     * @param file
     */
    uploadImage (file) {
      request.apiFile(api.common.upload, 'file', file.file).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
          this.addPoint['siteImg'] = data.data
        } else {
          this.$refs.upload.clearFiles()
          helper.E(data.msg)
        }
      })
    },
    /**
     * 点击保存按钮，创建站点
     */
    saveSite () {
      let self = this
      this.$refs['addPoint'].validate((valid) => {
        if (valid) {
          for (let i = 0; i < enums.DISTRICT.length; i++) {
            if (this.addPoint.areaId == enums.DISTRICT[i].areaId) {
              this.addPoint.areaName = enums.DISTRICT[i].areaName
            }
          }
          let params = this.addPoint
          let url = ''
          let message = ''
          // console.log(typeof params.longitude, '*****params.longitude', typeof params.latitude)
          // return
          params.longitude = params.longitude.toString()
          params.latitude = params.latitude.toString()
          if (this.addPoint.isNew === 'old') {
            url = api.site.updateSite
            message = '修改成功'
          } else {
            url = api.site.createSite
            message = '创建成功'
          }
          request.apiPost(url, params).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              helper.S(message)
              self.map.setCenter([params.longitude, params.latitude])
              if (this.addPoint.isNew === 'old') {
                this.map.remove(this.marker)
              } else {
              }
              this.isLocate = false
              this.init()
            } else {
              helper.E(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 初始化
     */
    init () {
      let _ = this
      this.map = new AMap.Map('amapContainer', {
        zoom: 12,
        resizeEnable: true
      })
      this.map.on('dragend', function () {
        if (_.addPoint.longitude || _.region.longitude) {
          _.marker.setMap(null)
          _.marker = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: []
          })
          _.addPoint.longitude = ''
          _.addPoint.latitude = ''
        }
        _.siteArr.forEach(item => {
          let marker = ''
          let lineMarker = ''
          if (item.siteId) {
            marker = _.markers.get(item.siteId)
            lineMarker = _.lineMarker.get(item.siteId)
          } else if (item.areaId) {
            marker = _.markers.get(item.areaId)
            lineMarker = _.lineMarker.get(item.areaId)
          }
          if (marker) {
            marker.setMap(null)
            marker = null
          } else if (lineMarker) {
            lineMarker.setMap(null)
            lineMarker = null
          }
        })

        let center = _.map.getCenter()
        let data = {
          longitude: center.lng.toString(),
          latitude: center.lat.toString()
        }
        _.drawCircle(data)
        _.showSite(data)
      })
      this.map.getCity(function (info) {
        _.city = info.city
      })
      _.map.plugin('AMap.Scale', function () {
        _.map.addControl(new AMap.Scale())
      })
      if (_.isLocate) {
        _.map.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 2000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            // zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: 'RB'
          })
          _.map.addControl(geolocation)
          geolocation.getCurrentPosition()
        })
        let center = _.map.getCenter()
        let data = {
          longitude: center.lng.toString(),
          latitude: center.lat.toString()
        }
        _.drawCircle(data)
        _.showSite(data)
      } else {
        let center = _.map.getCenter()
        let data = {
          longitude: center.lng.toString(),
          latitude: center.lat.toString()
        }
        _.drawCircle(data)
        _.showSite(data)
      }
      this.driving = new AMap.Driving({
        map: _.map,
        hideMarkers: true,
        outlineColor: 'red',
        showTraffic: false
      })

      this.map.on('click', function (e) {
        let position = [e.lnglat.getLng(), e.lnglat.getLat()]
        _.setPoint(position)
      })
      this.getLineList()
      this.getCityList()
    },
    /**
     * 机构名称 去掉
     * @param cityList
     * @param orzId
     */
    getOrganizationList (cityList, orzId) {
      request.apiGet(api.orgnization.option, { orzType: 1, cityCode: cityList }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orgnizationList = data.data
          if (orzId) { // 有机构
            this.addPoint.orzId = orzId
          } else { // 没机构
            this.addPoint.orzId = ''
          }
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 选择城市（填写站点区域）
     * @param cityCode
     */
    getDistrict (cityCode) {
      request.apiGet(api.area.option, { cityCode: cityCode }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.districtInfo = data.data
          this.districtInfo.push({ areaName: '请选择', areaId: '' })
          this.districtInfo.pop()
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 点击地图打新的站点
     * @param lnglat
     */
    setPoint (lnglat) {
      // this.map.remove(this.marker)
      this.marker.setMap(null)
      if (this.addPoint.longitude || this.region.longitude) {
        this.marker.setMap(null)
        this.marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: []
        })
      }
      if (this.siteLine === 'second') {
        this.region.longitude = lnglat[0]
        this.region.latitude = lnglat[1]
      } else {
        this.clearAllInfo()
        this.addPoint.longitude = lnglat[0]
        this.addPoint.latitude = lnglat[1]
      }
      this.marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: lnglat
      })
      this.siteArr.forEach(item => {
        let marker = ''
        let lineMarker = ''
        if (item.siteId) {
          marker = this.markers.get(item.siteId)
          lineMarker = this.lineMarker.get(item.siteId)
        } else if (item.areaId) {
          marker = this.markers.get(item.areaId)
          lineMarker = this.lineMarker.get(item.areaId)
        }
        if (marker) {
          marker.setMap(null)
          marker = null
        } else if (lineMarker) {
          lineMarker.setMap(null)
          lineMarker = null
        }
      })
      this.drawCircle({
        longitude: lnglat[0],
        latitude: lnglat[1]
      })
      this.showSite({
        longitude: lnglat[0],
        latitude: lnglat[1]
      })
      this.marker.setMap(this.map)
    },
    /**
     * 搜索
     * @returns {*}
     */
    doSearch () {
      // this.init()
      if (+this.searchData.type === 1) { // 站点ID
        if ((!this.searchData.siteName && !this.searchData.siteSid)) return helper.E('输入搜索内容')
        // if ((this.searchData.siteName == undefined && this.searchData.siteSid == undefined)) return helper.E('输入搜索内容')
        this.isLocate = false
        this.siteArr = []
        request.apiGet(api.site.showSite, {
          siteName: this.searchData.siteName,
          siteSid: this.searchData.siteSid
        }).then(res => {
          if (res.code === enums.NET_SUCCESS) {
            let lis = res.data
            if (lis.length) {
              this.siteArr = lis
              this.drawCircle({
                longitude: lis[0].longitude,
                latitude: lis[0].latitude
              })
              this.siteInfo(lis[0].siteId, this.searchData.siteName) // 打站点标志
              this.map.setCenter([lis[0].longitude, lis[0].latitude]) // 设置当前搜索站点在黄圈圈中心点位置
              // this.showSite({ // 展示所有站点
              //   siteName: this.searchData.siteName,
              //   siteSid: this.searchData.siteSid
              // }, lis[0].siteId, this.searchData.siteName)
              // lis.forEach(item => {
              //   this.siteInfo(item.siteId, item.siteName)
              // })
            } else {
              helper.I('搜索站点不存在')
            }
          } else {
            helper.E(res.msg)
          }
        })
      } else {
        this.lineChange()
      }
    },
    /**
     * 显示站点
     * @param data
     * @param id
     * @param siteName
     */
    showSite (data, id, siteName) {
      this.siteArr = []
      this.searchData.noPage = 1
      request.apiGet(api.site.showSite, {
        noPage: 1,
        longitude: data.longitude,
        latitude: data.latitude
      }).then(data => {
        this.searchFlag = true
        if (data.code === enums.NET_SUCCESS) {
          this.siteArr = data.data
          if (!this.isLocate) {
            this.isLocate = !data.data.length
            !data.data.length && helper.W('当前区域无站点')
          }
          this.siteInfo(id, siteName)
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 站点信息
     * @param id
     * @param siteName
     */
    siteInfo (id, siteName) {
      this.siteArr.forEach(item => {
        let icon = ''
        if (item.siteName) {
          this.showSiteInfo.id = item.siteSid
          this.showSiteInfo.areaId = item.areaId
          this.showSiteInfo.name = item.siteName
          this.showSiteInfo.latitude = item.latitude
          this.showSiteInfo.longitude = item.longitude
          this.showSiteInfo.state = item.state
          this.showSiteInfo.siteImg = item.siteImg
          this.showSiteInfo.description = item.description
          this.showSiteInfo.isDistrict = false
        } else {
          this.showSiteInfo.id = item.areaId
          this.showSiteInfo.name = item.areaName
          this.showSiteInfo.latitude = item.latitude
          this.showSiteInfo.longitude = item.longitude
          this.showSiteInfo.state = item.state
          this.showSiteInfo.isDistrict = true
        }
        if (id == item.siteId || this.showSiteInfo.name == siteName) {
          icon = this.lineIcon
        } else if (this.showSiteInfo.state == 0 && !this.showSiteInfo.isDistrict) {
          icon = this.forbiddenAIcon
        } else if (this.showSiteInfo.state != 0 && !this.showSiteInfo.isDistrict) {
          icon = this.normalAIcon
        }
        if (this.showSiteInfo.isDistrict && this.showSiteInfo.state != 0) {
          icon = this.chargeAIcon
        } else if (this.showSiteInfo.isDistrict && this.showSiteInfo.state == 0) {
          icon = this.forbiddenAIcon
        }
        this.marker = this.setMarker(item, icon)
        if (item.siteId) {
          this.markers.set(item.siteId, this.marker)
        } else if (item.areaId) {
          this.markers.set(item.areaId, this.marker)
        }
      })
    },
    /**
     * 设置标记
     * @param item
     * @param icon
     * @returns {AMap.Marker}
     */
    setMarker (item, icon) {
      let marker
      let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })
      marker = new AMap.Marker({
        map: this.map,
        id: !item.siteId ? item.areaId : item.siteId,
        icon: icon,
        title: item.name,
        draggable: !(this.searchData.type === 2),
        position: [item.longitude, item.latitude]
      })
      let con
      if (item.siteName) {
        con = `<div><span>站点ID：</span>${item.siteSid}</div><div><span>站点名称：</span>${item.siteName}</div>`
      } else {
        con = `<div><span>区域名称：</span>${item.areaName}</div>`
      }
      marker.content = con
      marker.on('click', (e) => {
        console.log(e.target.getPosition(), '***')
        if (this.siteLine === 'first') {
          this.addPoint.updateFlag = false
          this.addPoint.isNew = 'old'
          if (item.siteName) {
            this.fileList = []
            this.addPoint.longitude = item.longitude
            this.addPoint.latitude = item.latitude
            this.addPoint.siteName = item.siteName
            this.addPoint.areaId = item.areaId
            this.addPoint.description = item.description
            this.addPoint.siteId = item.siteId
            this.addPoint.siteSid = item.siteSid
            this.addPoint.state = item.state
            this.addPoint.siteImg = item.siteImg
            if (item.cityCode) { // 有城市
              this.addPoint.cityCode = item.cityCode
              this.getDistrict(item.cityCode)
            } else { // 如果没城市，那就没城市和机构
              this.addPoint.cityCode = ''
              this.addPoint.orzId = ''
              this.addPoint.areaId = ''
            }
            if (item.siteImg) {
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
            } else {
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
            }
            let obj = {}
            if (item.siteImg) {
              obj.url = item.siteImg
              this.fileList.push(obj)
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
            }
          }
        } else {
          this.addPoint.updateFlag = true
          this.region.siteId = ''
          this.region.longitude = item.longitude
          this.region.latitude = item.latitude
          this.region.areaName = item.areaName
          this.region.areaId = item.areaId
          this.region.state = item.state
          if (item.cityCode) { // 有城市
            this.region.cityCode = item.cityCode
          } else { // 如果没城市
            this.region.cityCode = ''
          }
        }
        infoWindow.setContent(e.target.content)
        infoWindow.open(this.map, e.target.getPosition())
      })

      marker.on('dragend', (e) => {
        if (this.siteLine === 'first') {
          this.addPoint.updateFlag = false
          this.addPoint.isNew = 'old'
          if (item.siteName) {
            this.fileList = []
            this.addPoint.longitude = e.lnglat.lng
            this.addPoint.latitude = e.lnglat.lat
            this.addPoint.siteName = item.siteName
            this.addPoint.areaId = item.areaId
            this.addPoint.description = item.description
            this.addPoint.siteId = item.siteId
            this.addPoint.siteSid = item.siteSid
            this.addPoint.state = item.state
            this.addPoint.siteImg = item.siteImg
            this.addPoint.cityCode = item.cityCode
            if (item.siteImg) {
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
            } else {
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
            }
            let obj = {}
            if (item.siteImg) {
              obj.url = item.siteImg
              this.fileList.push(obj)
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
            }
          }
        } else {
          this.addPoint.updateFlag = true
          this.region.siteId = ''
          this.region.longitude = e.lnglat.lng
          this.region.latitude = e.lnglat.lat
          this.region.areaName = item.areaName
          this.region.areaId = item.areaId
          this.region.state = item.state
          if (item.cityCode) { // 有城市
            this.region.cityCode = item.cityCode
          } else { // 如果没城市
            this.region.cityCode = ''
          }
        }
      })
      return marker
    },
    /**
     * 画橙色大圈圈
     * @param center
     */
    drawCircle (center) {
      if (this.circle) this.map.remove(this.circle)
      let _ = this
      this.circle = new AMap.Circle({
        map: _.map,
        center: [center.longitude, center.latitude], // 设置线覆盖物路径
        radius: 5000,
        strokeColor: '#3366ff', //  边框线颜色
        strokeOpacity: 0.3, //  边框线透明度
        strokeWeight: 3, // 边框线宽
        fillColor: '#ffa500', //  填充色
        fillOpacity: 0.35, // 填充透明度
        bubble: true
      })
      this.map.add(this.circle)
    },
    /**
     * 点击取消按钮
     */
    cancelSite () {
      this.clearAllInfo()
      this.addPoint.longitude = ''
      this.addPoint.latitude = ''
    },
    /**
     * 上传站点图片前的判断
     * @param file
     * @returns {*}
     */
    beforeAvatarUpload (file) {
      let result = checkedImage(file, 500)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    /**
     * 移除图片
     */
    removeImage () {
      this.addPoint.siteImg = ''
      document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
    },
    /**
     * 获取系统高度  做判断
     */
    getHight () {
      if (window.innerWidth > 1300) {
        this.searchFormClass = 'display:inline-block;margin-bottom:10px;'
        this.searchMapHeight = ''
        this.searchMapTop = ''
      } else {
        this.searchFormClass = 'display:block;margin-bottom:10px;'
        this.searchMapHeight = 'height:220px'
        this.searchMapTop = 'top:220px'
      }
    },
    /**
     * 清空所有的信息
     */
    clearAllInfo () {
      this.fileList = []
      this.removeImage()
      this.addPoint.description = ''
      this.addPoint.state = 1
      this.addPoint.isNew = ''
      this.addPoint.siteName = ''
      this.addPoint.siteSid = ''
      this.addPoint.cityCode = ''
      this.addPoint.orzId = ''
      this.addPoint.areaId = ''
      this.addPoint.updateFlag = true
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.getHight)
  }
}
</script>

<style  lang="less" scoped>
  @import '../../assets/style/set.less';
  @import "./mapManage.less";
</style>
