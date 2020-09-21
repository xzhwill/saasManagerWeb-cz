<template>
	<el-container style="display: flex;justify-content: flex-start">
		<el-form :label-width="labelWidth" :model="ticketForm" style="width: 100%;" :inline="true" :rules="formRules" ref="ticketForm">
			<div class="form-section" style="margin-bottom: 20px;width:100%;">
				<i class="el-icon-edit"></i>
				<label>{{title}}</label>
			</div>
			<el-form-item label="通票名称" prop='ticketName' class="common-form-item">
				<el-input v-model="ticketForm.ticketName">
				</el-input>
			</el-form-item>
			<el-form-item label="选择标签:" prop="labels" class="common-form-item">
				<div style="border:1px solid #DCDFE6; display:flex;width:350px;padding:4px; margin-bottom:4px;" v-if="selectedTag.length > 0">
					<draggable v-model="selectedTag">
						<el-tag v-for="(item,index) in selectedTag" :key="item.labelId" closable effect="dark" style="margin:0 8px;"
						 @close="closeTag(index)" type="warning">
							{{ item.labelName}}
						</el-tag>
					</draggable>
				</div>
				<div>
					<el-button type="primary" @click="tagAllVisible = true">所有标签</el-button>
					<el-button type="primary" @click="newTagVisible = true">添加新标签</el-button>
					<el-button type="primary" @click="showTagChecked">保存</el-button>
				</div>
			</el-form-item>
			<!-- 	<el-form-item label="选择城市" prop='cityList' class="common-form-item" style='width: 2000px;'>
				<el-checkbox :indeterminate="isCityIndeterminate" v-model="checkCityAll" @change="handleCheckAllChange">全选</el-checkbox>
				<div style="margin: 15px 0;"></div>
				<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
					<el-checkbox v-for="city in cityList" :label="city" :key="city.cityCode">{{city.cityName}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="选择机构" prop='orzList' class="common-form-item" style='width: 2000px;'>
				<el-checkbox :indeterminate="isOrzIndeterminate" v-model="checkOrzAll" @change="handleCheckOrzAllChange">全选</el-checkbox>
				<div style="margin: 15px 0;"></div>
				<el-checkbox-group v-model="checkedOrzs" @change="handleCheckedOrzsChange">
					<el-checkbox v-for="orz in orzList" :label="orz" :key="orz.cityCode">{{orz.orzName}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item> -->
			<el-form-item label="折扣价" prop='price' class="common-form-item">
				<el-input style="width:150px" v-model="ticketForm.price" type="number">
				</el-input>
			</el-form-item>
			<el-form-item label="原价" prop='showPrice' class="common-form-item">
				<el-input style="width:150px" v-model="ticketForm.showPrice" type="number">
				</el-input>
			</el-form-item>
			<el-form-item label="有效天数" prop='effectiveDays' class="common-form-item">
				<el-input style="width:150px" v-model="ticketForm.effectiveDays" type="number">
				</el-input>
			</el-form-item>
			<el-form-item label="售票数量" prop='sellNum' class="common-form-item">
				<el-input style="width:150px" v-model="ticketForm.sellNum" type="number">
				</el-input>
			</el-form-item>

			<el-form-item label="车票类型">
				<el-radio v-model="ticketForm.verificationType" :label="parseInt(1)">单日核销次数</el-radio>
				<el-radio v-model="ticketForm.verificationType" :label="parseInt(2)" @change='ticketTypeChange'>总核销次数</el-radio>
			</el-form-item>
			<el-form-item label="核销次数限制" prop='verificationNum' class="common-form-item">
				<el-input style="width:150px" v-model="ticketForm.verificationNum" type="number">
				</el-input>
			</el-form-item>
			<el-form-item prop="dateRange" label="有效期" style="width: 3020px;">
				<el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" @change="changeTime"
				 format="yyyy-MM-dd" value-format="yyyy-MM-dd" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="票面上传">
				<el-upload class="upload" :action="uploadUrl" :on-success="uploadSuccess" :on-error="uploadOnError" :beforeUpload="beforeAvatarUpload"
				 multiple :limit="1" :file-list="fileList" list-type="picture">
					<el-button size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M,仅能上传一张图片，如需替换，请先将图片删除再添加</div>
				</el-upload>
			</el-form-item>
			<el-form-item label="线路:" prop="lineList" class="common-form-item" style="width: 3020px;">
				<el-button type="primary" @click="showDialog">选择线路</el-button>
				<el-table :data="ticketForm.lineList" stripe border style="margin-top: 15px;width: 861px;" :header-cell-style="getRowClass">
					<el-table-column property="businessTypeName" label="业务类型" width="100"></el-table-column>
					<el-table-column property="lineName" label="线路名称" width="100"></el-table-column>
					<el-table-column property="lineNo" label="线路号" width="100"></el-table-column>
					<el-table-column property="linePropertyName" label="线路类型" width="80"></el-table-column>
					<el-table-column property="cityName" label="城市" width="100"></el-table-column>
					<el-table-column property="orzName" label="机构" width="150"></el-table-column>
					<el-table-column label="操作" width="120">
						<template slot-scope="scope">
							<el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">移除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>

			<el-dialog title="添加线路" :visible.sync="dialogTableVisible" :append-to-body='isOk' :inline="true">
				<el-select v-model="checkCityAll" @change="handleCheckAllChange" multiple placeholder="城市" style="margin-bottom: 5px;width: 100px;margin-left: 30px;">
					<el-option v-for="(city, index) in cityList" :key="index" :label="city.cityName" :value="city.cityCode"></el-option>
				</el-select>
				<!-- 		<el-select v-model="checkCityAll" @change="handleCheckAllChange" multiple placeholder="城市" style="margin-bottom: 5px;width: 100px;margin-left: 30px;">
					<el-option v-for="(city, index) in cityList" :key="index" :label="city.cityName" :value="city.cityCode"></el-option>
				</el-select> -->
				<el-select v-model="checkedOrzs" @change="handleCheckedOrzsChange" multiple placeholder="需求侧" style="margin-bottom: 5px;min-width: 100px;">
					<el-option v-for="(item, index) in orzList" :key="index" :label="item.orzName" :value="item.orzId"></el-option>
				</el-select>
				<el-select v-model="searchData.businessType" filterable placeholder="业务类型" style="margin-bottom: 15px;width: 100px;">
					<el-option v-for="(item, index) in businessTypeList " :key="index" :label="item.name" :value="item.businessType"></el-option>
				</el-select>
				<el-input placeholder="线路名称" class="input-with-select" v-model="searchData.lineName" style="margin-bottom: 15px;width: 100px;">
				</el-input>
				<el-input placeholder="线路号" class="input-with-select" v-model="searchData.lineNo" style="margin-bottom: 15px;width: 100px;">
				</el-input>
				<el-select v-model="searchData.lineProperty" filterable placeholder="线路类型" style="margin-bottom: 15px;width: 100px;">
					<el-option label="固定" value="1"></el-option>
					<el-option label="循环" value="2"></el-option>
				</el-select>
				<el-button icon="el-icon-search" round plain type="primary" @click="doSearch" style="margin-left: 30px;margin-bottom: 5px;">查询</el-button>
				<el-button icon="el-icon-delete" round plain type="danger" @click="doClearObj" style="margin-bottom: 5px;">清空</el-button>
				<el-table ref="lineArr" tooltip-effect="dark" :data="lineArr" height="250" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column property="businessTypeName" label="业务类型" width="100"></el-table-column>
					<el-table-column property="lineName" label="线路名称" width="100"></el-table-column>
					<el-table-column property="lineNo" label="线路号" width="100"></el-table-column>
					<el-table-column property="linePropertyName" label="线路类型" width="80"></el-table-column>
					<el-table-column property="cityName" label="城市" width="100"></el-table-column>
					<el-table-column property="orzName" label="机构" width="150"></el-table-column>
				</el-table>
				<div style="display: flex;justify-content: center;">
					<el-pagination width='100%' @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size=pageSize
					 layout="total, prev, pager, next" :total=totalCount>
					</el-pagination>
				</div>
				<div>
					<el-button style='margin-left:90%;margin-top: 20px;' type="primary" @click="saveCheckoutLine()">确定</el-button>
				</div>
			</el-dialog>
			<el-form-item label="描述" prop="description">
				<el-input type="textarea" v-model="ticketForm.description" style='width: 400px;'></el-input>
			</el-form-item>
			<el-form-item prop="isRefund" label="是否可退款" style='width: 2000px;'>
				<el-radio v-model="ticketForm.isRefund" :label="1">是</el-radio>
				<el-radio v-model="ticketForm.isRefund" :label="0">否</el-radio>
			</el-form-item>
			<el-form-item prop="state" label="是否启用">
				<el-radio v-model="ticketForm.state" :label="1">是</el-radio>
				<el-radio v-model="ticketForm.state" :label="0">否</el-radio>
			</el-form-item>
			<el-row class="btn-group" style="margin-top: 15px;text-align: center">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button type="info" @click="back">取消</el-button>
			</el-row>
		</el-form>
		<el-dialog title="选择标签" :visible.sync="tagAllVisible">
			<el-tag v-for="(item,index) in labelList" :key="item.labelId" :effect="item.checked ? 'dark':'plain'" style="margin:0 8px;"
			 @click="clickTag(index)" type="warning" @close="closeTag(index)">
				{{ item.labelName +'('+item.seq +")"}}
			</el-tag>
			<div>
				<el-button type="primary" @click="chooseTag" style="margin-top:10px;">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="添加新标签" :visible.sync="newTagVisible">
			<el-form v-model="newLabel" label-position="right" label-width="120px" ref="addTag">
				<el-form-item label="标签序号">
					<el-input v-model="newLabel.seq" style="width: 200px;margin-right: 10px"></el-input>
				</el-form-item>
				<el-form-item label="标签名称">
					<el-input v-model="newLabel.labelName" style="width: 200px;margin-right: 10px"></el-input>
					<div style="maegin-left:10px;color:red;display:inline;">最大为4位</div>
				</el-form-item>
				<el-row class="btn-group">
					<el-button type="primary" @click="saveTag">保存标签</el-button>
				</el-row>
			</el-form>
			<div>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
	import {
		thoughTicketRules
	} from '@/utils/rules.js'
	import request from '@/utils/request.js'
	import api from '@/utils/api.js'
	import help from '@/utils/helper.js'
	import enums from '@/utils/enums.js'
	import XLSX from 'xlsx'
	import draggable from 'vuedraggable'
	import {
		toTime,
		timestampToTime
	} from '@/utils/public.js'
	export default {
		data() {
			return {
				clearTime: false,
				title: '通票配置',
				action: 0,
				labelWidth: '180px',
				ticketForm: {
					ticketName: '',
					labelList: [],
					price: '',
					showPrice: '',
					verificationNum: '',
					sellNum: '',
					verificationType: 1,
					siteArr: [],
					description: '',
					lineList: [],
					deleteLineList: [],
					ticketImg: '',
					effectiveDays: '',
					isRefund: 0,
					state: 0,
					labels: []
				},
				selectedTag: [],
				cityList: [],
				checkedCities: [],
				checkCityAll: false,
				isCityIndeterminate: false,
				orzList: [],
				checkedOrzs: [],
				checkOrzAll: false,
				isOrzIndeterminate: false,
				lineArr: [],
				dialogTableVisible: false,
				searchData: {
					lineName: '',
					businessType: '',
					lineNo: '',
					cityCode: '',
					orzId: '',
					lineProperty: '',
					dateRange: []
				},
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
				pageNum: 1,
				pageSize: 10,
				totalCount: 0,
				currentPage: 1,
				dateRange: [],
				formRules: thoughTicketRules,
				fileList: [],
				uploadUrl: api.common.upload,
				isOk: true,
				checkoutLineArr: [],
				labelList: [{
						labelId: '1',
						labelName: '标签一',
						checked: false
					},
					{
						labelId: '2',
						labelName: '标签二',
						checked: false
					},
					{
						labelId: '3',
						labelName: '标签三',
						checked: false
					},
					{
						labelId: '4',
						labelName: '标签四',
						checked: false
					},
					{
						labelId: '5',
						labelName: '标签五',
						checked: false
					},
					{
						labelId: '6',
						labelName: '标签六',
						checked: false
					}
				],
				newLabel: {
					labelName: '',
					seq: ''
				},
				selectedTag: [],
				newTagVisible: false, // 新增标签页面
				tagAllVisible: false, // 所有标签页面

				index: 1,
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.$emit('getInfo', [])
				this.getAllLabel()
				this.getAllCityList()
				this.getQueryParams()
			},
			getAllCityList() {
				request.apiGet(api.city.option).then(data => {
					if (data && data.code === enums.NET_SUCCESS) {
						this.cityList = data.data
					} else {
						help.E(data.msg)
					}
				})
			},
			clickTag(index) { // 选择标签
				this.labelList[index].checked = !this.labelList[index].checked
			},
			showTagChecked() {
				console.log(this.selectedTag)
			},
			closeTag(index) { // 关闭选中的标签
				let labelId = this.selectedTag[index].labelId
				this.selectedTag.splice(index, 1);
				this.labelList.forEach((label) => {
					if (label.labelId == labelId) {
						label.checked = false
					}
				})
			},
			chooseTag() { // 确认选择标签
				let tmp = []
				this.labelList.forEach((tag) => {
					if (tag.checked) {
						tmp.push({
							labelId: tag.labelId,
							labelName: tag.labelName
						})
					}
				})
				if (tmp.length > 5) {
					help.E('最多可选择5个标签')
				} else {
					this.selectedTag = []
					this.selectedTag = tmp
					this.tagAllVisible = false
				}
			},
			saveTag() { // 保存新建标签
				let that = this
				if (that.newLabel.labelName == '') {
					help.E('请输入标签名称')
					return
				}
				if (that.newLabel.labelName.length > 4) {
					help.E('标签名称最大为4位')
					return
				}
				if (that.newLabel.seq == '') {
					help.E('请输入标签序号')
					return
				}
				request.apiPost(api.label.create, this.newLabel).then(data => {
					if (data.code === enums.NET_SUCCESS) {
						help.S('创建成功~')
						that.getAllLabel()
						that.newTagVisible = false
					} else {
						help.E(data.msg)
					}
				})

			},
			getAllLabel() {
				request.apiGet(api.label.option).then(data => {
					if (data && data.code === enums.NET_SUCCESS) {
						this.labelList = data.data
					} else {
						help.E(data.msg)
					}
				}).catch(() => {
					help.Echo('网络异常')
				})
			},
			beforeAvatarUpload(file) {
				var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
				const extension = testmsg === 'jpg'
				const extension2 = testmsg === 'png'
				const isLt2M = file.size / 1024 / 1024 < 1
				if (!extension && !extension2) {
					this.$message({
						message: '上传文件只能是 jpg、png格式!',
						type: 'warning'
					});
				}
				if (!isLt2M) {
					this.$message({
						message: '上传文件大小不能超过 1MB!',
						type: 'warning'
					});
				}
				return extension || extension2 && isLt2M
			},
			uploadSuccess(file) {
				if (file && file.code === enums.NET_SUCCESS) {
					this.ticketForm.ticketImg = file.data
				} else {
					help.E(file.msg)
					this.fileList = []
				}
			},
			uploadOnError(err) {
				help.E(err.data)
			},
			handleCheckAllChange(val) {
				this.checkedOrzs = []
				this.orzList = []
				this.checkedCities = val ? val : [];
				this.isCityIndeterminate = false;
				if (this.checkedCities.length == 0) {
					this.checkedOrzs = []
					this.orzList = []
					return
				}
				let citys = '';
				for (var i = 0; i < this.checkedCities.length; i++) {
					var city = this.checkedCities[i]
					if (i == 0) {
						citys = city;
					} else {
						citys = citys + ',' + city;
					}
				}
				this.getOrzList(citys)
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkCityAll = checkedCount === this.cityList.length;
				this.isCityIndeterminate = checkedCount > 0 && checkedCount < this.cityList.length;
				if (this.checkedCities.length == 0) {
					this.checkedOrzs = []
					this.orzList = []
					return
				}
				let citys = '';
				for (var i = 0; i < this.checkedCities.length; i++) {
					var city = this.checkedCities[i]
					if (i == 0) {
						citys = city.cityCode;
					} else {
						citys = citys + ',' + city.cityCode;
					}
				}
				this.getOrzList(citys)
			},
			handleCheckOrzAllChange(val) {
				this.checkedOrzs = val ? val : [];
				this.isOrzIndeterminate = false;
				if (this.checkedOrzs.length > 0) {
					var checkedOrzs = ''
					for (var i = 0; i < this.checkedOrzs.length; i++) {
						if (i == 0) {
							checkedOrzs = this.checkedOrzs[0].orzId
						} else {
							checkedOrzs = checkedOrzs + ',' + this.checkedOrzs[i].orzId
						}
					}
					let params = {
						supplyIds: checkedOrzs,
						state: 1,
						pageNum: 1,
						pageSize: 10,
					}
					this.getLineList(params)
				}
			},
			handleCheckedOrzsChange(value) {
				let checkedCount = value.length;
				this.checkOrzAll = checkedCount === this.orzList.length;
				this.isOrzIndeterminate = checkedCount > 0 && checkedCount < this.orzList.length;
				if (this.checkedOrzs.length > 0) {
					var checkedOrzs = ''
					for (var i = 0; i < this.checkedOrzs.length; i++) {
						if (i == 0) {
							checkedOrzs = this.checkedOrzs[0]
						} else {
							checkedOrzs = checkedOrzs + ',' + this.checkedOrzs[i]
						}
					}
					let params = {
						supplyIds: checkedOrzs,
						state: 1,
						pageNum: 1,
						pageSize: 10,
					}
					this.getLineList(params)
				}
			},
			getOrzList(citys) {
				request.apiGet(api.supply.optionList, {
					cityList: citys,
					orzType: 1,
				}).then(data => {
					if (data.code === enums.NET_SUCCESS) {
						this.orzList = data.data
					} else {
						help.E(data.msg)
					}
				})
			},
			ticketTypeChange() {
				this.ticketForm.businessType = ''
			},
			showDialog() {
				this.dialogTableVisible = true
				if (this.$refs.lineArr != null) {
					this.$refs.lineArr.clearSelection()
				}
				this.showSiteArr = this.lineArr
			},
			getLineList(params) {
				// 获取线路
				request
					.apiGet(api.line.getLine, params)
					.then(data => {
						if (data && data.code === enums.NET_SUCCESS) {
							this.lineArr = data.data.list
							for (let i = 0; i < this.lineArr.length; i++) {
								var item = this.lineArr[i]
								item.businessTypeName = this.businessTypeList[item.businessType - 1].name
								item.linePropertyName = item.lineProperty == 1 ? '固定' : '循环'
							}
							var page = data.data.page
							this.total = 1
							this.totalCount = page.total
							this.currentPage = page.pageNum
						}
					})
			},
			doSearch() {
				let params = this.searchData
				params.pageNum = 1
				params.pageSize = 10
				params.state = 1
				if (params.cityCode == undefined || params.cityCode == '') {
					if (this.checkedOrzs.length > 0) {
						var checkedOrzs = ''
						for (var i = 0; i < this.checkedOrzs.length; i++) {
							if (i == 0) {
								checkedOrzs = this.checkedOrzs[0]
							} else {
								checkedOrzs = checkedOrzs + ',' + this.checkedOrzs[i]
							}
						}
						params.supplyIds = checkedOrzs
					}
				}

				this.getLineList(params)
			},
			doClearObj() {
				this.checkCityAll = []
				this.checkedOrzs = []
				this.orzList = []
				this.searchData = []
				this.lineArr = []
				this.handleCheckOrzAllChange(true)
			},
			handleCurrentChange(val) {
				let params = this.searchData
				params.pageNum = val
				params.pageSize = 10
				params.state = 1
				this.dialogTableVisible = true
				this.getLineList(params)
			},
			changeTime(time) {
				if (time.length > 0) {
					this.ticketForm.dateRange = time
				}
			},
			handleSelectionChange(val) {
				this.checkoutLineArr = val
			},
			getRowClass({
				row,
				column,
				rowIndex
			}) {
				if (rowIndex == 0) {
					return 'background:#FAFAFA'
				} else {
					return ''
				}
			},
			deleteRow(ind, item) {
				this.ticketForm.deleteLineList.push(item.lineId)
				this.ticketForm.lineList.splice(ind, 1)
			},
			saveCheckoutLine() {
				if (this.checkoutLineArr.length !== 0) {
					let str = ''
					this.ticketForm.lineList.forEach(item => {
						this.checkoutSiteArr.forEach(val => {
							if (val.lineId === item.lineId) {
								str = str + '，' + val.lineName
							} else {}
						})
					})
					if (str !== '') {
						help.E(str + '线路已存在')
					} else {
						this.ticketForm.lineList = [...this.ticketForm.lineList, ...this.checkoutLineArr]
						this.dialogTableVisible = false
					}
				} else {
					this.ticketForm.lineList = this.checkoutLineArr
					this.dialogTableVisible = false
				}
			},
			save() {
				this.$refs['ticketForm'].validate(valid => {
					if (valid) {
						let params = {}
						let url = ''
						params = { ...this.ticketForm
						}
						if (this.dateRange == null || this.dateRange.length == 0) {
							help.E('请选择生效时间')
							return
						}
						if (params.ticketImg == '') {
							help.E('请选择票面')
							return
						}
						params.effectiveDate = this.dateRange[0]
						params.expiryDate = this.dateRange[1]
						params.effectiveDays = parseInt(params.effectiveDays)
						params.price = Math.round(parseFloat(params.price) * 100)
						params.showPrice = Math.round(parseFloat(params.showPrice) * 100)
						params.sellNum = parseInt(params.sellNum)
						params.isRefund = parseInt(params.isRefund)
						params.state = parseInt(params.state)
						params.verificationNum = parseInt(params.verificationNum)
						params.verificationType = parseInt(params.verificationType)
						if (this.selectedTag.length > 0) {
							params['labelList'] = this.selectedTag
						}
						if (parseInt(this.action) === 1) {
							url = api.throughTicket.update
						} else {
							url = api.throughTicket.create
						}
						request
							.apiPost(url, params)
							.then(data => {
								if (data.code === enums.NET_SUCCESS) {
									sessionStorage.setItem('returnRuleConfiguration', 'true')
									help.S('保存成功')
									this.$router.back()
								} else {
									help.E(data.msg)
								}
							})
							.catch(() => {
								help.Echo('网络异常')
							})
					} else {
						return false
					}
				})
			},
			back() {
				sessionStorage.setItem('returnRuleConfiguration', 'true')
				this.$router.back()
			},
			getQueryParams() {
				let ticketId = this.$route.query.id
				if (ticketId != undefined) {
					this.action = 1
					this.ticketId =
						request
						.apiGet(api.throughTicket.info, {
							ticketId: ticketId
						})
						.then(data => {
							if (data && data.code === enums.NET_SUCCESS) {
								var ticketData = data.data
								this.ticketForm = data.data
								this.ticketForm.price = ticketData.priceYuan
								this.ticketForm.showPrice = ticketData.showPriceYuan
								this.dateRange.push(ticketData.effectiveDate)
								this.dateRange.push(ticketData.expiryDate)
								this.lineArr = data.data.lineList
								if (ticketData.ticketImg) {
									this.fileList = [{
										name: ticketData.ticketImg,
										url: ticketData.ticketImg
									}]
								}
								for (let i = 0; i < this.lineArr.length; i++) {
									var item = this.lineArr[i]
									item.businessTypeName = this.businessTypeList[item.businessType - 1].name
									item.linePropertyName = item.lineProperty == 1 ? '固定' : '循环'
								}
								if (ticketData.labelList.length > 0) { // 当有选择的标签时
									this.selectedTag = this.ticketForm.labelList
									this.labelList.forEach((label) => { // 所有标签和返回标签比较
										ticketData.labelList.forEach((item) => { // 反显标签
											if (label.labelId == item.labelId) {
												label['checked'] = true
											}
										})
									})
								}
							}
						})
				}
			},
		}
	}
</script>

<style>
	@import "../../assets/style/common.css";

	.btn-group {
		text-align: center;
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

	.refundBox {
		display: flex;
		height: 32px;
		margin-bottom: 10px
	}

	.line {
		width: 30px;
		height: 1px;
		border-top: 1px solid #ddd;
		margin: 0 10px;
		margin-top: 16px;
	}
</style>
