<template>
  <div class="common-container">
    <div class="amap-page-container" style="position: relative;height: 100%;">
      <div id="amapContainer" style="height: 100%;"></div>
    </div>
  </div>
</template>

<style  lang="less" type="text/less" >
@import '../../assets/style/set.less';
.searchMap {
  position: absolute;
  top: 0;
  height: 120px;
  z-index: 115;
  background: #fff;
  padding-top: 20px;
  width: 90%;
  border-bottom: 1px solid #dfdfdf;
}
.setSite {
  width: 100%;
  height: 50px;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dfdfdf;
  z-index: 116;
}
.setSite .el-input {
  width: 200px;
}
.setSite > span {
  margin-left: 20px;
  margin-right: 10px;
}
.setSite .el-button {
  margin-left: 20px;
  text-align: center;
}
.addSideList,
.showSite {
  position: absolute;
  right: 0;
  top: 0;
  width: 290px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #dfdfdf;
  z-index: 116;
}
.marker {
  color: #ff6600;
  padding: 4px 10px;
  border: 1px solid #fff;
  white-space: nowrap;
  font-size: 12px;
  font-family: '';
  background-color: #0066ff;
}
.rule-item {
  margin-bottom: 10px;
}
.el-upload--picture-card {
  border: none;
  width: 80px;
  height: 28px;
  line-height: 28px;
}
.showImage {
  display: flex;
  align-items: center;
}

.search-map {
  position: fixed;
  z-index: 9999;
  top: 200px;
  right: 340px;
}
</style>

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
        // orzId:''
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
        icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
        position: []
      }),
      circle: '', //  中心圆
      addPoint: {
        longitude: '',
        latitude: '',
        siteName: '',
        areaId: '',
        state: 1,
        siteId: '',
        siteSid: '',
        siteType: '1',
        siteImg: '',
        description: '',
        updateFlag: true,
        isNew: '',
        cityCode: '',
        orzId: ''

      },
      fileList: [],
      url: api.common.upload,
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
      siteArr: [],
      fileInfo: '',
      searchData: {
        lineType: '',
        siteSid: '',
        siteName: '',
        lineId: '',
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
      businessTypeList: enums.BUSINESSTYPE,
    }
  },
  methods: {
    // 选择触发开启定位
    handleSelectSearch() {
      let _this = this;
      for (let i = 0; i < _this.searchResults.length; i++) {
        if (_this.searchMapValue == _this.searchResults[i].value) {
          var lng = _this.searchResults[i].location.lng;
          var lat = _this.searchResults[i].location.lat;
          _this.map.setCenter([lng, lat]); //设置地图中心点
          var marker = new AMap.Marker({
            icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
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
    lineChange() {
      this.startSite = []
      this.endSite = []
      this.waypoints = []
      this.lineMarker.forEach((value, key, map) => {
        value.setIcon(this.normalAIcon)
      })
      this.driving.clear()
      this.getLine()
    },
    getLineList() {
        request
      .apiGet(api.line.optionList, { businessType: this.searchData.lineType })
      .then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.lineList = data.data
          this.searchData.lineId = ''
        } else {
          helper.E(data.msg)
        }
      })
    },
    getCityList() {
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityOptions = data.data
        } else {
          helper.E(data.msg)
        }
      })
    },
    getLine() {
      this.lineMarker.clear()
      let that = this
	  let lineId = this.$route.query.id
      request.apiGet(api.line.siteList, { lineId:lineId }).then(data => {
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
    changeType() {
      if (this.searchData.type == 1) {
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
    clearArr() {
      this.rmList = setOperation('mapManage')
      this.isLocate = true
      clearObj(this.searchData)
      this.init()
    },
    uploadImage(file) {
      request.apiFile(this.url, 'file', file.file).then(data => {
        if (data.code !== enums.NET_SUCCESS) {
          this.$refs.upload.clearFiles()
          helper.E(data.msg)
        } else {
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
          this.addPoint['siteImg'] = data.data
        }
      })
    },
    saveSite() { /* 创建站点 */
      let self = this
      this.$refs['addPoint'].validate((valid) => {
        if (valid) {
          for (let i = 0; i < enums.DISTRICT.length; i++) {
            if (this.addPoint.areaId == enums.DISTRICT[i].areaId) {
              this.addPoint.areaName = enums.DISTRICT[i].areaName
            } else { }
          }
          let params = this.addPoint
          let url = ''
          let message = ''
          params['longitude'] = params['longitude'].toString()
          params['latitude'] = params['latitude'].toString()
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
    init() { /* 初始化 */
      let self = this
      this.map = new AMap.Map('amapContainer', {
        zoom: 12,
        resizeEnable: true
      })
      this.map.on('dragend', function () {
        if (self.addPoint.longitude || self.region.longitude) {
          self.marker.setMap(null)
          self.marker = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
            position: []
          })
          self.addPoint.longitude = ''
          self.addPoint.latitude = ''
        } else { }
        self.siteArr.forEach(item => {
          let marker = ''
          let lineMarker = ''
          if (item.siteId) {
            marker = self.markers.get(item.siteId)
            lineMarker = self.lineMarker.get(item.siteId)
          } else if (item.areaId) {
            marker = self.markers.get(item.areaId)
            lineMarker = self.lineMarker.get(item.areaId)
          }
          if (marker) {
            marker.setMap(null)
            marker = null
          } else if (lineMarker) {
            lineMarker.setMap(null)
            lineMarker = null
          }
        })

        let center = self.map.getCenter()
        let data = {
          longitude: center.lng.toString(),
          latitude: center.lat.toString()
        }
        self.drawCircle(data)
        self.showSite(data)
      })
      this.map.getCity(function (info) {
        self.city = info.city
      })
      self.map.plugin('AMap.Scale', function () {
        self.map.addControl(new AMap.Scale())
      })
      if (self.isLocate) {
        self.map.plugin('AMap.Geolocation', function () {
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
          self.map.addControl(geolocation)
          geolocation.getCurrentPosition()
        })
        let center = self.map.getCenter()
        let data = {
          longitude: center.lng.toString(),
          latitude: center.lat.toString()
        }
        self.drawCircle(data)
        self.showSite(data)
      } else {
        let center = self.map.getCenter()
        let data = {
          longitude: center.lng.toString(),
          latitude: center.lat.toString()
        }
        self.drawCircle(data)
        self.showSite(data)
      }
      this.driving = new AMap.Driving({
        map: self.map,
        hideMarkers: true,
        outlineColor: 'red',
        showTraffic: false
      })

      this.map.on('click', function (e) {
        let position = [e.lnglat.getLng(), e.lnglat.getLat()]
        self.setPoint(position)
      })
      this.getLineList()
      this.getCityList()
    },
    // 选择城市的change
    changeCityCode(value) {
      let cityList = value;
      this.getDistrict(cityList);
    },
    // 机构名称 去掉
    getOrganizationList(cityList, orzId) {
      request.apiGet(api.orgnization.option, { orzType: 1, cityCode: cityList }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.orgnizationList = data.data
          if (orzId) {//有机构
            this.addPoint.orzId = orzId
          } else {//没机构
            this.addPoint.orzId = ""
          }
        } else {
          helper.E(data.msg)

        }
      })
    },
    getDistrict(cityCode) {
      request.apiGet(api.area.option,{cityCode:cityCode}).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.districtInfo = data.data
          this.districtInfo.push({ areaName: '请选择', areaId: '' })
          this.districtInfo.pop()
        } else {
          helper.E(data.msg)
        }
      })
    },
    setPoint(lnglat) { /* 显示新建站点信息 */
      let self = this
      if (this.addPoint.longitude || self.region.longitude) {
        this.marker.setMap(null)
        this.marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
          position: []
        })
      } else { }
      if (self.siteLine === 'second') {
        self.region.longitude = lnglat[0]
        self.region.latitude = lnglat[1]
      } else {
        this.addPoint.isNew = ''
        self.addPoint.longitude = lnglat[0]
        self.addPoint.latitude = lnglat[1]
        self.addPoint.siteName = ''
        self.addPoint.siteSid = ''
        self.addPoint.cityCode = ''
        self.addPoint.orzId = ''
        self.addPoint.areaId = ''
        self.addPoint.updateFlag = true
      }
      this.marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
        position: lnglat
      })
      this.marker.setMap(self.map)
    },
    doSearch() {
      if (this.searchData.type === 1) {
        if ((this.searchData.siteName == '' && this.searchData.siteSid == '')) {
          helper.E('输入搜索内容~')
          return
        } else if ((this.searchData.siteName == undefined && this.searchData.siteSid == undefined)) {
          helper.E('输入搜索内容~')
          return
        }
        this.isLocate = false
        let params = {
          siteName: this.searchData['siteName'],
          siteSid: this.searchData['siteSid']
        }
        request.apiGet(api.site.showSite, params).then(res => {
          if (res.code == enums.NET_SUCCESS) {
            let siteList = res.data
            if (siteList.length == 0) {
              helper.I('搜索站点不存在')
            } else {
              this.map.setCenter([siteList[0].longitude, siteList[0].latitude])
              let params = {
                longitude: siteList[0].longitude,
                latitude: siteList[0].latitude
              }
              this.drawCircle(params)
              this.showSite(params, siteList[0].siteId, params.siteName)
            }
          } else {
            helper.E(res.msg)
          }
        })
      } else if (this.searchData.type === 2) {
        this.lineChange()
      }
    },
    showSite(data, id, siteName) {
      let self = this
      self.siteArr = []
      self.searchData['noPage'] = 1
      let params = {
        noPage: 1,
        longitude: data.longitude,
        latitude: data.latitude
      }
      request.apiGet(api.site.showSite, params).then(data => {
        self.searchFlag = true
        if (data.code === enums.NET_SUCCESS) {
          self.siteArr = data.data
          if (!self.isLocate) {
            if (data.data.length > 0) {
              self.isLocate = false
              // self.center = [params.longitude, params.latitude]
            } else {
              self.isLocate = true
              helper.W('当前区域无站点~')
            }
          }
          self.siteInfo(id, siteName)
        }
      })
    },
    siteInfo(id, siteName) {
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
    setMarker(item, icon) {
      let marker
      let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })
      let draggable = true
      if (this.searchData.type === 2) {
        draggable = false
      }
      marker = new AMap.Marker({
        map: this.map,
        id: item.siteId == '' ? item.areaId : item.siteId,
        icon: icon,
        title: item.name,
        draggable: draggable,
        position: [item.longitude, item.latitude]
      })
      if (item.siteName) {
        marker.content = `<div><span>站点ID：</span>${item.siteSid}</div><div><span>站点名称：</span>${item.siteName}</div>`
      } else {
        marker.content = `<div><span>区域名称：</span>${item.areaName}</div>`
      }
      marker.on('click', (e) => {
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
            if (item.cityCode) {//有城市
              this.addPoint.cityCode = item.cityCode
              this.getDistrict(item.cityCode)
            } else {//如果没城市，那就没城市和机构
              this.addPoint.cityCode = ""
              this.addPoint.orzId = ""
              this.addPoint.areaId = ""
            }
            if (item.siteImg) {
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
            } else {
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
            }
            let obj = {}
            if (item.siteImg) {
              obj['url'] = item.siteImg
              this.fileList.push(obj)
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
            } else {
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
          if (item.cityCode) {//有城市
            this.region.cityCode = item.cityCode
          } else {//如果没城市
            this.region.cityCode = ""
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
              obj['url'] = item.siteImg
              this.fileList.push(obj)
              document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
            } else {
            }
          } else {
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
            this.region.cityCode = ""
          }
        }
      })
      return marker
    },
    drawCircle(center) {
      let self = this
      if (self.circle) {
        self.map.remove(self.circle)
      }
      self.circle = new AMap.Circle({
        map: self.map,
        center: [center.longitude, center.latitude], // 设置线覆盖物路径
        radius: 5000,
        strokeColor: '#3366FF', //  边框线颜色
        strokeOpacity: 0.3, //  边框线透明度
        strokeWeight: 3, // 边框线宽
        fillColor: '#FFA500', //  填充色
        fillOpacity: 0.35, // 填充透明度
        bubble: true
      })
      self.map.add(self.circle)
    },
    doClearObj() {
      clearObj(this.searchData)
      this.searchData['type'] = 1
    },
    cancelSite() { },
    beforeAvatarUpload(file) {
      let result = checkedImage(file, 500)
      if (!result.isFlag) {
        this.$message.error(result.errorMessage)
      }
      return result.isFlag
    },
    removeImage() {
      this.addPoint['siteImg'] = ''
      document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
    },
    getHight() {
      if (window.innerWidth > 1300) {
        this.searchFormClass = 'display:inline-block;margin-bottom:10px;'
        this.searchMapHeight = ''
        this.searchMapTop = ''
      } else {
        this.searchFormClass = 'display:block;margin-bottom:10px;'
        this.searchMapHeight = 'height:220px'
        this.searchMapTop = 'top:220px'
      }
    }
  },
  mounted() {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.init()
    this.lineChange()
  },
  created() {
    this.getHight()
    window.addEventListener('resize', this.getHight);
  },
  destroyed() {
    window.removeEventListener('resize', this.getHight)
  }
}
</script>
