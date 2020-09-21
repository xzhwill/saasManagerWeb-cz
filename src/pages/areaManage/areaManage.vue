<template>
  <div class="common-container">
    <div class="amap-page-container" style="position: relative;height: 100%;">
      <div id="amapContainer" style="width: 80.6%; height: 100%;"></div>
      <div class="setSite">
        <div>
          <!--<span>-->
          <!--选择线路：<el-select v-model="chooseList" filterable clearable placeholder="请选择" @change="selectLine">-->
          <!--<el-option-->
          <!--v-for="item in lineList"-->
          <!--:key="item.lineId"-->
          <!--:label="item.lineName"-->
          <!--:value="item.lineId">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</span>-->
          <span>
            选择修改服务区：
            <el-select v-model="selAreaList" filterable clearable placeholder="请选择" @change="selectArea">
              <el-option v-for="item in AreaListSelect" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
            </el-select>
          </span>
        </div>
      </div>
      <div class="addSideList">
        <el-tabs v-model="siteLine" tab-position="top" @tab-click="clearArr" :stretch='chooseModule' style="margin-top: 50px; margin-right: 10px">
          <el-tab-pane label="服务区" name="forth">
            <div class="addLine">
              <el-form label-width="120px" :rules="addAreaRules" :model="districtInfo" ref="districtInfo">
                <el-form-item label="服务区名称：" prop="areaName">
                  <el-input v-model="districtInfo.areaName" placeholder="请输入服务区名称"></el-input>
                </el-form-item>
                <el-form-item label="城市：" prop="cityCode">
                  <el-select v-model="districtInfo.cityCode">
                    <el-option v-for="(item,index) in cityList" :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否热门">
                  <el-select v-model="districtInfo.isHot">
                    <el-option :value="1" label="是"></el-option>
                    <el-option :value="0" label="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                  <el-select v-model="districtInfo.state">
                    <el-option :value="1" label="启用"></el-option>
                    <el-option :value="0" label="禁用"></el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item label="中心点经度：" class="common-form-item" prop="centerLongitude">-->
                <!--<el-input v-model="districtInfo.centerLongitude" placeholder="经度"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="中心点纬度：" class="common-form-item" prop="centerLatitude">-->
                <!--<el-input v-model="districtInfo.centerLatitude" placeholder="纬度"></el-input>-->
                <!--</el-form-item>-->
                <div style="border-bottom: 1px solid #dfdfdf;margin-bottom: 15px;"></div>
                <el-form label-width="100px" :model="boundaryInfo" ref="boundaryInfo">
                  <!--<el-form-item label="边界点名称：" prop="pointName" class="common-form-item">-->
                  <!--<el-input v-model="boundaryInfo.pointName" placeholder="边界点名称"></el-input>-->
                  <!--</el-form-item>-->
                  <el-form-item label="经度：" prop="longitude" class="common-form-item" style="display: none">
                    <el-input v-model="boundaryInfo.longitude" placeholder="经度"></el-input>
                  </el-form-item>
                  <el-form-item label="纬度：" prop="latitude" class="common-form-item" style="display: none">>
                    <el-input v-model="boundaryInfo.latitude" placeholder="纬度"></el-input>
                  </el-form-item>
                  <el-form-item style="margin-top: 20px;">
                    <el-button type="primary" @click="setBoundary">修改</el-button>
                    <el-button type="success" @click="closeBoundary">完成</el-button>
                  </el-form-item>
                  <el-form-item style="margin-top: 20px;">
                    <el-button type="primary" @click="saveBoundary">保存</el-button>
                    <el-button type="danger" @click="cancelDistrict">取消</el-button>
                  </el-form-item>
                </el-form>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--<div class="showSite" style="margin-top: 50px;padding-top: 10px;right: 290px;height: 200px;border-bottom: 1px solid #dfdfdf;">-->
      <!--<div style="text-align: center;margin-bottom: 15px;font-weight: bolder;font-size:18px;">站点详细信息</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import { clearObj, getCenterPoint } from '@/utils/public'
import { addAreaRules } from '@/utils/rules'
import AMap from 'AMap'

export default {
  data () {
    return {
      chooseList: [],
      selAreaList: [],
      chooseDistrict: '',
      lineList: [],
      siteLine: 'forth',
      action: false,
      allDistrict: [], // 从后端获取到所有的区域列表
      nowDistrict: [], // 修改服务区时除当前操作服务区外的其他区域
      districtInfo: {
        areaName: '',
        cityCode: '',
        state: 1,
        areaDetailList: [],
        centerLongitude: '',
        isHot: 0
      },
      cityList: [],
      boundaryInfo: {
        pointName: '',
        longitude: '',
        latitude: ''
      },
      boundaryArr: [],
      polygon: '',
      polyEditor: '',
      allPolygon: {},
      boundaryLnglat: [], // 当前操作的区域的经纬度集合
      changeBoundary: -1,
      addAreaRules: addAreaRules,
      chooseModule: true,
      map: '',
      center: [116.409097, 39.917989],
      isLocate: true,
      marker: new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
        position: []
      }),
      addPoint: {
        gpsX: '',
        gpsY: '',
        siteName: '',
        districtId: '',
        state: 1,
        siteOrgId: '',
        siteId: '',
        siteType: '1',
        siteImg: ''
      },
      isIn: false,
      fileList: [],
      siteArr: [],
      lineSiteInfo: [],
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
        image: require('../../assets/images/chargeSite.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      startAIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/start.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      endAIcon: new AMap.Icon({
        size: new AMap.Size(19, 33), // 图标尺寸
        image: require('../../assets/images/end.png'), // Icon的图像
        imageSize: new AMap.Size(19, 33)
      }),
      groupLine: {
        startName: '',
        endName: '',
        groupName: '',
        serviceAreaId: ''
      },
      groupList: '',
      groupPath: [],
      groupPoly: '',
      lineInfo: {
        lineId: '',
        groupId: '',
        startId: '',
        endId: '',
        weight: '',
        areaDetailList: [],
        lineName: '',
        state: 1
      },
      errInfo: {
        isLineOk: false,
        errorMsg: ''
      },
      startSiteArr: [],
      endSiteArr: [],
      startMarker: new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
        position: []
      }),
      endMarker: new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
        position: []
      }),
      startSite: [],
      endSite: [],
      wayPointArr: [],
      distanceArr: [0],
      fartherWay: '',
      driving: '',
      weightHad: false,
      isChange: false, // 是否点击选择修改服务区下拉框
      AreaListSelect: [], // 服务区下拉框
      isIntersect: false, // 区域是否相交
      allRelation: [] // 存放地图中所有的区域与当前所操作区域的关系（是否相交）
    }
  },
  inject: ['reload'],
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    setTimeout(() => {
      this.init()
    }, 500)
  },
  methods: {
    /**
     * 选择服务区
     * @param val：选择的服务区对应的ID
     */
    selectArea (val) {
      this.isChange = true
      if (val) {
        this.boundaryLnglat = []
        this.nowDistrict = []
        this.isIntersect = false
        this.AreaListSelect.forEach((item, index) => {
          if (item.areaId === val) {
            this.districtInfo.cityCode = item.cityCode
            this.districtInfo.state = item.state
            this.districtInfo.areaName = item.areaName
            this.districtInfo.areaDetailList = item.areaDetailList
            this.districtInfo.areaId = item.areaId
            // this.districtInfo.centerLatitude = item.centerLatitude
            // this.districtInfo.centerLongitude = item.centerLongitude
            let self = this
            if (item.areaDetailList.length) {
              item.areaDetailList.forEach(itx => {
                if (itx.areaId === val) self.boundaryLnglat.push([itx.longitude, itx.latitude])
              })
            }
            self.center = getCenterPoint(self.boundaryLnglat)
            self.map.remove(self.allPolygon[item.areaId])
            self.polygon = new AMap.Polygon({
              path: self.boundaryLnglat,
              fillColor: '#333', // 多边形填充颜色
              borderWeight: 1, // 线条宽度，默认为 orderReportForms
              fillOpacity: 0
            })
            self.map.add(self.polygon)
            // self.selfCenter(self.center)
            self.map.setCenter(self.center)
          } else {
            this.nowDistrict.push(item)
          }
        })
      }
    },
    /**
     * 初始化地图
     * @param path：路径
     */
    // selfCenter (path) {
    //   this.map.setCenter(path)
    // },
    clearArr () {
      this.wayPointArr = []
      clearObj(this.lineInfo)
      this.driving.clear()
    },
    /**
     * 初始化
     */
    init () {
      let _ = this
      this.map = new AMap.Map('amapContainer', { // 初始化地图
        zoom: 20,
        center: _.center,
        resizeEnable: true
      })
      if (this.isLocate) { // 获取当前位置
        this.map.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 2000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: 'LB'
          })
          _.map.addControl(geolocation)
          geolocation.getCurrentPosition()
        })
      }
      this.driving = new AMap.Driving({
        map: this.map,
        hideMarkers: true,
        policy: AMap.DrivingPolicy.LEAST_TIME,
        isOutline: true,
        outlineColor: 'black'
      })
      // 实时路况图层
      var trafficLayer = new AMap.TileLayer.Traffic({ zIndex: 10 })
      this.map.add(trafficLayer) // 添加图层到地图
      this.map.on('click', function (e) {
        let position = [e.lnglat.getLng(), e.lnglat.getLat()]
        _.setPoint(position)
      })
      this.drawAllBoundary()
      this.getCityCode()
    },
    /**
     * 获取城市列表
     */
    getCityCode () {
      request.apiGet(api.city.option).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch((data) => {
        helper.E(data.msg)
      })
    },
    /**
     * 显示新建站点信息
     * @param lnglat：经纬度
     */
    setPoint (lnglat) {
      if (this.addPoint.longitude || this.boundaryInfo.longitude) { // 判断地图上是否有点击点，如果有则置为Null
        this.marker.setMap(null)
        this.marker = null
      }
      if (this.siteLine === 'forth') { // 判断是否为创建服务区：服务区创建边界
        // 赋值点击点的经纬度
        this.boundaryInfo.longitude = lnglat[0]
        // self.districtInfo.centerLongitude = lnglat[0]
        // self.districtInfo.centerLatitude = lnglat[orderReportForms]
        this.boundaryInfo.latitude = lnglat[1]
        this.changeBoundary = -1
      } else {
        // 赋值点击点的经纬度
        this.addPoint.longitude = lnglat[0]
        this.addPoint.latitude = lnglat[1]
        this.addPoint.siteName = ''
      }
      // 在地图上展示点击点
      this.marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.payReportForms/markers/n/mark_b.png',
        position: lnglat
      })
      this.marker.setMap(this.map)
      this.addBoundary()
    },
    /**
     * 添加边界点
     */
    addBoundary () {
      let self = this
      let obj = {
        longitude: this.boundaryInfo.longitude.toString(),
        latitude: this.boundaryInfo.latitude.toString()
      }
      if (self.changeBoundary > -1) {
        self.boundaryArr.splice(self.changeBoundary, 1, obj)
        self.boundaryLnglat.splice(self.changeBoundary, 1, [obj.longitude, obj.latitude])
      } else {
        self.boundaryArr.push(obj)
        self.boundaryLnglat.push([obj.longitude, obj.latitude])
      }
      this.drawBoundary()
    },
    /**
     * 修改边界点
     */
    setBoundary () {
      if (this.boundaryLnglat.length < 2) return helper.W('请先选择区域')
      this.polyEditor = new AMap.PolyEditor(this.map, this.polygon)
      this.polyEditor.open()
    },
    /**
     * 点击完成区域的修改
     */
    closeBoundary () {
      let self = this
      if (self.polyEditor) self.polyEditor.close()
      if (!self.boundaryLnglat.length) return helper.W('请先选择或圈出区域')
      if (self.boundaryLnglat.length && self.boundaryLnglat.length < 3) return helper.W('目前所画不是区域')
      self.polygon = new AMap.Polygon({
        map: this.map,
        path: self.boundaryLnglat,
        fillColor: '#ccc', // 多边形填充颜色
        borderWeight: 1, // 线条宽度，默认为 orderReportForms
        fillOpacity: 0,
        draggable: true
      })
      self.isChange ? this.getAllRelate(this.nowDistrict, self.polygon) : this.getAllRelate(this.allDistrict, self.polygon) // 判断修改还是添加服务区
      if (self.isIntersect) return helper.E('区域与区域之间不可以相交、嵌套')
      let datas = self.polygon.getPath()
      this.boundaryArr = []
      datas.forEach((item, i) => {
        if (!this.isChange) if (Array.isArray(datas[i])) datas[i] = new AMap.LngLat(datas[i][0], datas[i][1])
        this.boundaryArr.push({
          latitude: (datas[i].lat).toString(),
          longitude: (datas[i].lng).toString()
        })
      })
      self.boundaryLnglat = []
      self.polygon = {}
    },
    /**
     * 画边界图
     */
    drawBoundary () {
      let self = this
      if (self.boundaryLnglat.length > 1) {
        self.map.remove(self.polygon)
        // self.map.add(self.polygon)
        self.polygon = new AMap.Polygon({
          map: this.map,
          path: self.boundaryLnglat,
          fillColor: '#ccc', // 多边形填充颜色
          borderWeight: 1, // 线条宽度，默认为 orderReportForms
          fillOpacity: 0,
          draggable: true
        })
        this.getAllRelate(this.allDistrict, self.polygon)
        // this.allRelation = []
        // this.allDistrict.forEach(val => {
        //   let path = []
        //   val.areaDetailList.forEach(item => path.push([item.longitude, item.latitude])) // 获取到地图中已有的区域的经纬度集合
        //   this.allPolygon[val.areaId] = new AMap.Polygon({
        //     fillOpacity: 0.5,
        //     path: path,
        //     bubble: true
        //   })
        //   this.allRelation.push(this.compute(this.allPolygon[val.areaId], self.polygon))
        // })
        // this.allRelation.forEach(item => { // 判断当前操作的区域最终与其它区域之间是否相交
        //   if (item) this.isIntersect = true
        // })
        self.map.add(self.polygon)
      }
      self.cancelBoundary()
    },
    /**
     * 判断两区域是否相交
     * @param polygon1
     * @param polygon2
     */
    compute (polygon1, polygon2) {
      var polygon1Path = polygon1.getPath()
      var polygon2Path = polygon2.getPath()
      var isRingInRing = AMap.GeometryUtil.isRingInRing(polygon2Path, polygon1Path) // 小圈是否在大圈内
      var doesRingRingIntersect = AMap.GeometryUtil.doesRingRingIntersect(polygon2Path, polygon1Path) // 两圈是否交叉
      return isRingInRing || doesRingRingIntersect
    },
    /**
     * 初始化boundaryInfo
     */
    cancelBoundary () {
      this.boundaryInfo.pointName = ''
      this.boundaryInfo.longitude = ''
      this.boundaryInfo.latitude = ''
      if (this.changeBoundary <= -1) { // 清除地图icon
        this.marker.setMap(null)
        this.marker = null
      }
    },
    /**
     * 删除边界点
     * @param index
     */
    deleteBoundary (index) {
      let self = this
      self.boundaryLnglat.splice(index, 1)
      self.boundaryArr.splice(index, 1)
      self.drawBoundary()
    },
    /**
     * 点击保存按钮
     */
    saveBoundary () {
      let self = this
      this.$refs['districtInfo'].validate((valid) => {
        if (valid) {
          if (this.isIntersect) return helper.E('区域与区域之间不可以相交、嵌套')
          let params = this.districtInfo
          this.boundaryArr.forEach((item, index) => {
            item.seq = index
          })
          self.districtInfo.areaDetailList = this.boundaryArr
          // this.districtInfo.centerLatitude = this.districtInfo.centerLatitude.toString()
          // this.districtInfo.centerLongitude = this.districtInfo.centerLongitude.toString()
          if (params.areaId) {
            params.areaDetailList.forEach(item => {
              for (let i = 0; i < params.areaDetailList.length; i++) {
                if (item.seq == params.areaDetailList[i].seq) {
                  item.pointId = params.areaDetailList[i].pointId
                  item.areaId = params.areaDetailList[i].areaId
                }
              }
              if (!item.pointId) {
                item.pointId = ''
                item.areaId = ''
              }
            })
          }
          if (!params.areaDetailList.length) return helper.E('未检测到服务区变更')
          request.apiPost(params.areaId ? api.area.update : api.area.create, params).then(res => {
            if (res.code === enums.NET_SUCCESS) {
              helper.S('服务区创建成功')
              this.selAreaList = ''
              this.isChange = false
              self.cancelDistrict()
              this.init()
            } else {
              helper.E(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 点击取消按钮
     */
    cancelDistrict () {
      this.isChange = false
      this.selAreaList = '' // 选择修改服务区选择框
      this.districtInfo.cityCode = '' // 城市选择框
      this.districtInfo.isHot = 0 // 是否热门选择框
      this.districtInfo.state = 1 // 状态选择框
      this.districtInfo.areaDetailList = []
      this.districtInfo.areaName = ''
      this.districtInfo.areaOrgId = ''
      this.boundaryArr = []
      this.init()
      this.map.remove(this.polygon)
      this.boundaryLnglat = []
      this.polygon = {}
      this.isIntersect = false
    },
    /**
     * 画服务区
     */
    drawAllBoundary () {
      request.apiGet(api.area.nopageList).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          if (data.data.length) {
            this.allDistrict = data.data
            this.AreaListSelect = data.data
            if (this.allDistrict.length > 0) {
              this.allDistrict.forEach(val => {
                let path = []
                val.areaDetailList.forEach(item => {
                  path.push([item.longitude, item.latitude])
                })
                this.allPolygon[val.areaId] = new AMap.Polygon({
                  fillOpacity: 0,
                  path: path,
                  bubble: true
                })
                this.map.add(this.allPolygon[val.areaId])
              })
            }
          }
        } else {
          helper.E(data.msg)
        }
      })
    },
    selectLine (val) { // 线路回显
      if (val) {
        for (let j = 0; j < this.lineSiteInfo.length; j++) {
          if (this.lineSiteInfo[j].lineId == val) {
            this.wayPointArr = []
            this.siteLine = 'second'
            this.lineInfo.lineId = this.lineSiteInfo[j].lineId
            this.lineInfo.lineName = this.lineSiteInfo[j].lineName
            this.lineInfo.weight = this.lineSiteInfo[j].weight
            this.lineInfo.areaDetailList = this.lineSiteInfo[j].areaDetailList
            for (let k = 0; k < this.lineInfo.areaDetailList.length; k++) {
              let position = new AMap.LngLat(this.lineInfo.areaDetailList[k].siteGps_x, this.lineInfo.areaDetailList[k].siteGps_y)
              if (k === 0) {
                this.startSite = position
              } else if (k === (this.lineInfo.areaDetailList.length - 1)) {
                this.endSite = position
              } else {
                this.wayPointArr.push(position)
              }
            }
          }
        }
        this.drivingLoad()
      } else {
        this.lineInfo.areaDetailList = []
        this.weight = 0
        this.siteLine = 'first'
      }
    },
    changeDistrict (val) {
      let self = this
      self.map.remove(self.polygon)
      self.allDistrict.forEach(item => {
        if (item.areaId === val) {
          item.districtArr.forEach(val2 => {
            self.boundaryLnglat.push([val2.longitude, val2.latitude])
          })
          self.polygon = new AMap.Polygon({
            fillOpacity: 0,
            path: self.boundaryLnglat,
            bubble: true
          })
          self.map.add(self.polygon)
        }
      })
    },
    showSite () {
      request.apiGet(api.site.showSite).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          let siteData = data.data
          let siteArr = []
          this.lineSiteInfo = siteData.lineSiteInfos
          for (let key in siteData.lineSiteInfos) {
            siteArr = [...siteArr, ...(siteData.lineSiteInfos[key].areaDetailList)]
          }
          /* 对象去重 */
          let siteObj = {}
          siteArr = siteArr.reduce((cur, next) => {
            siteObj[next.siteId] ? '' : siteObj[next.siteId] = true && cur.push(next)
            return cur
          }, [])
          siteArr = [...siteArr, ...siteData.aloneSiteInfos]
          this.siteArr = siteArr
          this.siteInfo()
        }
      })
    },
    changeGroup (val) {
      if (val) {
        this.startSiteArr = []
        for (let i = 0; i < this.groupList.length; i++) {
          if (this.groupList[i].groupId === val) {
            let nameArr = this.groupList[i].groupName.split('-')
            for (let j = 0; j < this.siteArr.length; j++) {
              if (nameArr.indexOf(this.siteArr[j].siteName) > -1) {
                this.startSiteArr.push(this.siteArr[j])
              }
            }
          }
        }
      }
    },
    changeStart (val) {
      if (val) {
        this.lineInfo.areaDetailList = []
        this.endSite = []
        this.endSiteArr = []
        let startSite = this.startSiteArr.find((value) => {
          return value.siteId === val
        })
        if (this.startSite) {
          this.startMarker.setMap(null)
          this.startMarker = null
        } else { }
        this.startSite = [startSite.siteGps_x, startSite.siteGps_y]
        this.startMarker = new AMap.Marker({
          map: this.map,
          icon: this.startAIcon,
          title: startSite.siteName,
          position: [startSite.siteGps_x, startSite.siteGps_y]
        })
        this.startMarker.setMap(this.map)
        this.lineInfo.areaDetailList.unshift(startSite)
        let startArr = []
        for (let item of this.startSiteArr.values()) {
          if (item.siteName === startSite.siteName) {
            startArr.push(item)
          } else {
            this.endSiteArr.push(item)
          }
        }
        this.startSiteArr = startArr
      }
    },
    clearStart () {
      this.startSiteArr = [...this.startSiteArr, ...this.endSiteArr]
      this.endSiteArr = []
      this.lineInfo.areaDetailList = []
      this.lineInfo.endId = ''
      this.showSite()
    },
    changeEnd (val) {
      let endSite = this.endSiteArr.find((value) => {
        return value.siteId === val
      })
      if (this.endSite) {
        this.endMarker.setMap(null)
        this.endMarker = null
      }
      this.endSite = [endSite.siteGps_x, endSite.siteGps_y]
      this.endMarker = new AMap.Marker({
        map: this.map,
        icon: this.endAIcon,
        title: endSite.siteName,
        position: [endSite.siteGps_x, endSite.siteGps_y]
      })
      this.endMarker.setMap(this.map)
      this.lineInfo.areaDetailList.push(endSite)
      this.drivingLoad()
    },
    checkoutLineWeight () { // 检测线路权重
      request.apiGet(api.line.checkWeight, { weight: this.lineInfo.weight }).then(data => {
        this.errInfo.isLineOk = true
        if (data.code === enums.NET_SUCCESS) {
          this.errInfo.errorMsg = '权重可以使用'
          this.weightHad = true
        } else {
          this.weightHad = false
          this.errInfo.errorMsg = '权重已重复'
        }
      })
    },
    drivingLoad (middleEnd) {
      let self = this
      AMap.plugin('AMap.Driving', function () {
        self.driving.clear()
        let startLngLat = self.startSite
        let endLngLat = self.endSite
        let waypoints = self.wayPointArr
        if (middleEnd) {
          self.driving.search(startLngLat, middleEnd, { waypoints: waypoints }, function (status, result) {
            self.distanceArr.push(result.routes[0].distance)
          })
        } else { }
        self.driving.search(startLngLat, endLngLat, { waypoints: waypoints }, function (status, result) {
          self.fartherWay = result.routes[0].distance
        })
      })
    },
    getAllRelate (allList, nowArea) { // 获取地图中已有的区域与当前操作区域的联系
      this.allRelation = []
      allList.forEach(val => {
        let path = []
        val.areaDetailList.forEach(item => path.push([item.longitude, item.latitude])) // 获取到地图中已有的区域的经纬度集合
        this.allPolygon[val.areaId] = new AMap.Polygon({
          fillOpacity: 0.5,
          path: path,
          bubble: true
        })
        this.allRelation.push(this.compute(this.allPolygon[val.areaId], nowArea))
      })
      this.isIntersect = this.allRelation.indexOf(true) > -1 // 判断当前操作的区域最终与其它区域之间是否相
    }
  }
}
</script>
<style scoped lang="scss">
  @import "./areaManage.less";
</style>
