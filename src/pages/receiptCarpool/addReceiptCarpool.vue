<template>
	<el-container style="display: flex;justify-content: flex-start">
		<el-form enctype="multipart/form-data" label-width="100px" style="width: 100%;" :inline="false" :model="carpool"
		 :rules="formRules" ref="addcarpool" label-position="right">
			<div class="form-section" style="font-size: 18px;margin-bottom: 15px;">
				<i class="el-icon-edit"></i>
				<label>{{title}}</label>
			</div>
			<div>
				<el-button class="search-form-toggle" :icon="show.showA ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="float: right"
				 round plain type="success" @click="toggle('showA')">{{show.showA?'收起':'展开'}}</el-button>
				<transition name="fade">
					<div class="showA" v-if="show.showA">
						<!-- 	<el-form-item prop="className" label="班次名称">
							<el-input v-model=" carpool.className" :readonly="carpool.updateFlag ? 'readonly':false"></el-input>
						</el-form-item> -->
						<el-form-item prop="cityCode" label="城市" class="common-form-item">
							<el-select v-model="carpool.cityCode" filterable @change="changeCity" :disabled="carpool.updateFlag ? 'readonly':false">
								<el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.cityCode"
								 :readonly="carpool.updateFlag ? 'readonly':false"></el-option>
							</el-select>
						</el-form-item>
				<!-- 		<el-form-item label="线路类型:" prop="businessType" class="common-form-item">
							<el-select v-model="carpool.businessType" filterable @change="changeBusinessType" :disabled="carpool.updateFlag ? 'readonly':false">
								<el-option v-for="(item, index) in businessTypeList " :key="index" :label="item.name" :value="item.businessType"></el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item prop="lineId" label="选择线路" class="common-form-item">
							<el-select v-model="carpool.lineId" filterable placeholder="请优先选择城市" @change="getLineSite" style="width:350px"
							 :disabled="carpool.updateFlag ? 'readonly':false">
								<el-option v-for="(item, index) in lineList" :key="index" :label="item.lineName" :value="item.lineId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="rideDate" label="乘车日期:">
							<el-date-picker v-model="carpool.rideDate" type="date"
							 placeholder="乘车日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>
						<el-form-item prop="startTime" label="发车时间:">
							<el-input v-model="carpool.startTime" placeholder="时间格式严格参照xx:xx"></el-input>
						</el-form-item>
						<el-form-item prop="upSiteId" label="上车站点" class="common-form-item">
							<el-select v-model="carpool.upSiteId" filterable placeholder="选择上车站点" style="width:350px" :disabled="carpool.updateFlag ? 'readonly':false">
								<el-option v-for="(item, index) in siteList" :disabled="item.siteType!=1 && item.siteType!=3" :key="index"
								 :label="item.siteName" :value="item.siteId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="downSiteId" label="下车站点" class="common-form-item">
							<el-select v-model="carpool.downSiteId" filterable placeholder="选择下车站点" style="width:350px" :disabled="carpool.updateFlag ? 'readonly':false">
								<el-option v-for="(item, index) in siteList" :disabled="item.siteType!=2&&item.siteType!=3" :key="index" :label="item.siteName"
								 :value="item.siteId"></el-option>
							</el-select>
						</el-form-item>
					</div>
				</transition>
			</div>
			<div class="divide"></div>
			<el-row class="btn-group" style="margin-top: 15px;text-align: center">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button type="info" @click="back">取消</el-button>
			</el-row>
		</el-form>
	</el-container>

</template>

<script>
	import help from '@/utils/helper.js'
	import request from '@/utils/request.js'
	import api from '@/utils/api.js'
	import enums from '@/utils/enums.js'
	import {
		addCarpoolFormRules
	} from '@/utils/rules.js'
	import {
		toFen,
		setTime,
		Trim
	} from '../../utils/public'
	export default {
		data() {
			return {
				show: {
					showA: true,
					showB: false,
				},
				title: '添加拼团',
				action: 0,
				labelWidth: '80px',
				carpool: {
					'carpoolName': '',
					'cityCode': '',
					'downSiteId': '',
					'lineId': '',
					'rideDate': '',
					'upSiteId': '',
					'startTime': '',
					'businessType': '',
				},
				siteList: [],
				lineList: [],
				busTypeList: [],
				siteTimeList: [],
				formRules: addCarpoolFormRules,
				cityList: [], // 城市列表
				// channelArrList: [], // 选择渠道列表
				// channelDateList: [], //  开放日期配置
				supplyList: [], //  供给侧列表
				// compList: [], //  需求侧列表
				businessTypeList: [{
						name: '定制公交',
						businessType: 1
					},
					{
						name: '专线',
						businessType: 2
					},
					{
						name: '拼车',
						businessType: 3
					},
					{
						name: '预约包车',
						businessType: 4
					},
					// {
					// 	name: '企业班车',
					// 	businessType: 5
					// },
					// {
					// 	name: '企业包车',
					// 	businessType: 6
					// },
				],
				lineProperty: ''
			}
		},
		mounted() {
			this.$emit('getInfo', [])
			this.init()
		},
		methods: {
			toggle(arg) {
				this.show[arg] = !this.show[arg];
			},
			init() {
				// this.getBaseList()
				this.getChannel()
				// this.getQueryParams()
			},
			getChannel() { //  获取渠道列表
				request.apiGet(api.city.option).then(data => {
					if (data && data.code === enums.NET_SUCCESS) {
						this.cityList = data.data
					} else {
						help.E(data.msg)
					}
				}).catch(() => {
					helpe.Echo('网络异常')
				})

				/* 需求侧列表 */
				// request.apiGet(api.comp.optionList).then(data => {
				//   if (data.msg && data.msg.code === enums.NET_SUCCESS) {
				//     this.compList = data.data.list
				//   } else {
				//     help.E(data.msg.message)
				//   }
				// }).catch(() => {
				//   help.Echo('网络异常')
				// })
			},
			changeCity() {
				this.carpool.lineId = ''
				this.carpool.supplyOrzId = ''
				this.carpool.orzName = ''
				this.carpool.businessType = ''
				this.getBaseList()
			},
			changeBusinessType() {
				this.carpool.lineId = ''
				let params = {
					cityCode: this.carpool.cityCode,
					orzId: this.carpool.supplyOrzId,
					businessType: 3
				}
				this.getLineList(params)
			},
			getLineList(params) {
				// 获取线路
				request
					.apiGet(api.line.optionList, params)
					.then(data => {
						if (data && data.code === enums.NET_SUCCESS) {
							this.lineList = data.data
						}
					})
			},
			getQueryParams() {
				let classId = this.$route.query.id
				if (classId != undefined) {
					this.action = 1
					this.title = '班次'
					this.classId = classId
					request
						.apiGet(api.carpool.info, {
							carpoolId: classId
						})
						.then(data => {
							if (data && data.code === enums.NET_SUCCESS) {

							}
						})
				}

			},
			changeBusType() {
				this.busTypeList.forEach(item => {
					if (item.busTypeId === this.carpool.busTypeId) {
						this.carpool.seatCount = item.seatCount
						this.carpool.seatMaxCount = item.seatMaxCount
					}
				})
			},
			getBaseList() {
				let params = {
					cityCode: this.carpool.cityCode
				}
				this.changeBusinessType()
				/* 供给侧列表 */
				request.apiGet(api.supply.optionList, params).then(data => {
					if (data && data.code === enums.NET_SUCCESS) {
						this.supplyList = data.data
					} else {
						help.E(data.msg)
					}
				}).catch(() => {
					help.Echo('网络异常')
				})
				// 获取车型
				request
					.apiGet(api.busType.optionList)
					.then(data => {
						if (data && data.code === enums.NET_SUCCESS) {
							this.busTypeList = data.data
						}
					})
			},
			changeTime(time) {
				if (time.length > 0) {
					this.carpool.dateRange = time
				}
			},
			getLineSite(val) {
				// 获取站点
				// this.lineList.forEach(item => { /* 获取线路 */
				// 	if (item.lineId === this.carpool.lineId) {
				// 		this.carpool.orzName = item.orzName
				// 		this.carpool.supplyId = '11'
				// 		this.carpool.supplyOrzId = item.orzName
				// 	}
				// })
				if (this.carpool.lineId != null) {
					let param = {
						lineId: this.carpool.lineId
					}
					/* 获取该线路的站点 */
					request.apiGet(api.line.siteList, param).then(data => {
						if (data && data.code === enums.NET_SUCCESS) {
							this.siteList = data.data
							let isFlag = false
							this.showTimeList = []
							let newTimeArr = []
							this.siteList.forEach((item, index) => {
								let obj = {
									siteSid: item.siteSid,
									siteId: item.siteId,
									siteTime: '',
									siteType: item.siteType
								}
								newTimeArr.push(obj)
								item['siteNum'] = index
							})
							for (let i = 0; i < newTimeArr.length; i++) {
								for (let j = 0; j < this.showTimeList.length; j++) {
									if (newTimeArr[i].siteId == this.showTimeList[j].siteId) {
										newTimeArr[i].siteTime = this.showTimeList[j].siteTime
										break
									} else {
										if (j == (this.showTimeList.length - 1)) {

										}
									}
								}
							}
							this.showTimeList = newTimeArr
						}
					})
				}
			},
			save() {
				this.$refs['addcarpool'].validate((valid) => {
					if (valid) {
						this.postData()
					} else {
						return false
					}
				})
			},
			postData() {
				let params = { ...this.carpool
				}
				let url = ''
				if (parseInt(this.action) === 1) {
					url = api.carpoolSupply.update
				} else {
					url = api.carpoolSupply.create
				}
				url = api.carpoolSupply.create
				request.apiPost(url, params).then((data) => {
					if (data.code === enums.NET_SUCCESS) {
						help.S('保存成功')
						sessionStorage.setItem('carpoolFlag', 'true')
						this.$router.back()
					} else {
						help.E(data.msg)
					}
				}).catch(() => {
					help.Echo('网络异常')
				})
			},
			back() {
				sessionStorage.setItem('carpoolFlag', 'true')
				this.$router.back()
			}
		}
	}
</script>

<style scoped>
	@import '../../assets/style/common.css';

	.el-form-item {
		width: 40%;
	}
</style>
