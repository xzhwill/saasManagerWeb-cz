<template>
	<div class="common-container">
		<!-- table -->
		<div class="page-nav-btn clearfix">
			<div class="page-nav-btn-item fl" v-if="rmList.indexOf(operateInfo.create.operationId) > -1">
				<el-button @click="addCarpool()" type="primary">新建拼团</el-button>
			</div>
		</div>
		<div class="table-container">
			<div class="page-table-info" v-if="tableHeaderCheckList.length !== 0">
				<el-table @selection-change="handleSelectionChange" header-row-class-name="tableHeader" class="page-table-main"
				 :data="tableList" stripe>
					<el-table-column min-width="130px" align="center" label="操作" v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
						<template slot-scope="scope">
							<el-row class="action-btn-group" v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
								<span class="action-btn blue" v-if="(scope.row.state=='2'|| scope.row.state=='3')&&scope.row.openState!='1'"
								 @click="openCarpool(scope.row)">开启拼团</span>
								<span class="action-btn blue" v-if="scope.row.state=='1'" @click="modify(scope.row)">分配供给侧</span>
								<span class="action-btn blue" v-if="scope.row.openState=='1'&&(scope.row.state=='2'|| scope.row.state=='3')"
								 @click="dispatchingCar(scope.row)" style="width: 50px;">派车</span>
								 	<span class="action-btn blue"
								  @click="lineDetail(scope.row)">线路详情</span>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center" :prop="item.name"
					 v-if="tableHeaderCheckList.indexOf(item.label) !== -1" show-overflow-tooltip>
						<template slot-scope="scope">
							<span v-if="item.name=='carpoolType'">
								<span v-if="scope.row['carpoolType'] == 1">APP发起</span>
								<span v-if="scope.row['carpoolType'] == 2">后台发起</span>
							</span>
							<span v-if="item.name=='state'">
								<span v-if="scope.row['state'] == 1">待分配</span>
								<span v-if="scope.row['state'] == 2">待排班</span>
								<span v-if="scope.row['state'] == 3">已排班</span>
								<span v-if="scope.row['state'] == 4">已取消</span>
							</span>
							<span v-if="item.name != 'carpoolType' && item.name != 'state'">{{scope.row[item.name]}}</span>
						</template>
					</el-table-column>
					<el-table-column min-width="130px" align="center" label="取消拼团">
						<template slot-scope="scope">
							<el-row class="action-btn-group" v-if="rmList.indexOf(operateInfo.change.operationId)> -1">
								<span class="action-btn danger" @click="cancelCarpool(scope.row)">取消</span>
							</el-row>
						</template>
					</el-table-column>
				</el-table>
				<div class="page-page">
					<el-pagination :current-page.sync="page.pageNum" background layout="total, prev, pager, next, jumper, sizes"
					 @size-change="sizeChange" :page-size="page.pageSize" @current-change="currentChange" :page-sizes="page.pageSizes"
					 :total="page.total">
					</el-pagination>
				</div>
			</div>
		</div>
		<el-dialog title="派车操作" :visible.sync="dialogTableVisible" :append-to-body='isOk' width="50%">
			<el-form label-position="right" label-width="120px" ref="orderRefund">
				<el-form label-width="140px" class="demo-dynamic" style="margin-left: 0">
					<el-form-item class="box" v-for="(item,idx) in allDatas" :key="idx">
						<el-form-item label="">
							<el-select @change="isGroupChange(item.busId,idx,2,item.driverId,item.busTypeId,item.busTypeId)" v-model="item.busTypeId"
							 placeholder="请先选择车型">
								<el-option label="请先选择车型" :value="''"></el-option>
								<el-option v-for="(val,idx) in busTypeList" :value="val.busTypeId" :key="idx" :disabled="val.disabled" :label="val.busTypeName+'('+val.seatCount+'坐)'"></el-option>
							</el-select>
							<el-select @change="isGroupChange(item.busId,idx,0,item.driverId,item.busTypeId)" v-model="item.busId"
							 placeholder="请选择车辆">
								<el-option label="请选择车辆" :value="''"></el-option>
								<el-option v-for="(val,idx) in item.busInfoList" :value="val.busId" :key="idx" :disabled="val.disabled" :label="val.busNumber"></el-option>
							</el-select>
							<el-select @change="isGroupChange(item.busId,idx,1,item.driverId,item.busTypeId)" v-model="item.driverId"
							 placeholder="请选择司机">
								<el-option label="请选择司机" :value="''"></el-option>
								<el-option v-for="(val,idx) in item.driverList" :value="val.driverId" :key="idx" :disabled="val.disabled"
								 :label="val.driverName"></el-option>
							</el-select>
							<el-button style="margin-left:10px" type="warning" plain v-if="idx>0" @click.prevent="removeDriver(idx,'all')"
							 icon="el-icon-remove" class="btn"></el-button>
						</el-form-item>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" plain @click.prevent="addDriver('all')" icon="el-icon-circle-plus" class="btn"></el-button>
					</el-form-item>
					</el-form-item>
				</el-form>
			</el-form>
			<div style="text-align: center">
				<el-button type="primary" @click="updateOrder">确定</el-button>
				<el-button type="danger" @click="cancelRefund">取消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="分配供给侧" :visible.sync="dialogOrzTableVisible" :append-to-body='isOk' width="50%">
			<el-form label-position="right" label-width="120px" ref="orderRefund">
				<el-form-item label="供给侧机构">
					<el-form label-width="140px" class="demo-dynamic" style="margin-left: 0">
						<el-select v-model="orzId" placeholder="请选择">
							<el-option label="无" :value="''"></el-option>
							<el-option v-for="(val,idx) in orzList" :value="val.orzId" :key="idx" :disabled="val.disabled" :label="val.orzName"></el-option>
						</el-select>
					</el-form>
				</el-form-item>
			</el-form>
			<div style="text-align: center">
				<el-button type="primary" @click="assignOrz">确定</el-button>
				<el-button type="danger" @click="cancelOrz">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import SearchForm from '@/pages/common/SearchForm/SearchForm.vue'
import { receiptCarpoolManageHeadSearch, receiptCarpoolManageTableHead } from '@/utils/data.js'
import { clearObj, Trim, timestampToTime } from '@/utils/public.js'
import net from '@/utils/request'
import help from '@/utils/helper.js'
import api from '@/utils/api'
import enums from '@/utils/enums'
import { setOperation } from '../../utils/public'
export default {
  name: 'cityManage',
	  props: {
	  searchData: {
	    type: Array,
	    required: true
	  },
	  tableHeaderCheckList: {
	    type: Array,
	    required: true
	  },
	  tableHeader: {
	    type: Array,
	    required: true
	  }
	},
  data() {
    return {
      formModules: receiptCarpoolManageHeadSearch,
      // tableHeader: receiptCarpoolManageTableHead,
      tableList: [],
    //  tableHeaderCheckList: [],
      checkedRow: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: enums.PAGESIZES,
        total: 0
      },
      action: 0,
     // searchData: [],
      rmList: [],
      operateInfo: enums.OPERATIONID,
      allDatas: [
				{
					busId:'',
					busTypeId:'',
					driverId:'',
				}
			],
      isChange: false,
      busInfoList: [],
      driverList: [],
      arrLength: 2,
      allDataList: [],
      prizeOptionList: [],
      dialogTableVisible: false,
			dialogOrzTableVisible:false,
      isOk: true,
      changeArr: [],
      orderId: '',
			orzList:[],
			orzId:'',
			busTypeList:[],
			cityCode:'',
			carpoolNumber:''
    }
  },
  created() {

  },
  mounted() {
		let searchData = sessionStorage.getItem('carpoolSearch')
		if (sessionStorage.getItem('ticketPriceFlag') && searchData) {
		  searchData = (JSON.parse(searchData))
		  let searchDataArr = []
		  searchData.forEach(item => {
		    for (let key in item) {
		      if (key == 'pageNum') {
		        this.page.pageNum = item[key]
		      } else if (key == 'pageSize') {
		        this.page.pageSize = item[key]
		      }
		      receiptCarpoolManageHeadSearch.forEach(val => {
		        if (val.name == key) {
		          if (key == 'state') {
		            if (item[key] == 0) {
		              val.data = '禁用'
		            } else {
		              val.data = '启用'
		            }
		          } else {
		            val.data = item[key]
		          }
		        } else if (key == 'addStartTime' && val.name == 'addTime') {
		          val.data.push(item['addStartTime'])
		        } else if (key == 'addEndTime' && val.name == 'addTime') {
		          val.data.push(item['addEndTime'])
		        }
		      })
		      searchDataArr[key] = item[key]
		    }
		  })
		  this.getTableData(searchDataArr)
		} else {
		  receiptCarpoolManageHeadSearch.forEach(item => {
		    if (Array.isArray(item.data)) {
		      item.data = []
		    } else {
		      item.data = ''
		    }
		  })
		  this.$parent.doClearObj()
		  // this.getTableData(this.page)
		}
	  this.$emit('getInfo', receiptCarpoolManageHeadSearch)
		this.$emit('getTable',receiptCarpoolManageTableHead)
		this.$emit('getPage', this.page)
    this.rmList = setOperation('receiptCarpool')
    this.init()
  },
  methods: {
    init() {
      //this.initCheckList()
			this.getOrzList()
			this.getBusTypeList()
    },
    isGroupChange(val, idx, type, isDriverId,busTypeId) {
      let busIdArr = []
      let driverIdArr = []
      // this.isChange = true
      this.allDatas.map((item) => {
        if (item.busId != '') {
          busIdArr.push(item.busId)
        }
        if (item.driverId != '') {
          driverIdArr.push(item.driverId)
        }
      })
			  this.allDatas.forEach((item, index) => {
			  for (let i = 0; i < item.busInfoList.length; i++) {
			    if (busIdArr.indexOf((item.busInfoList[i].busId)) > -1) {
			      item.busInfoList[i].disabled = true
			    } else {
			      item.busInfoList[i].disabled = false
			    }
			  }
			  for (let j = 0; j < item.driverList.length; j++) {
			    if (driverIdArr.indexOf((item.driverList[j].driverId)) > -1) {
			      item.driverList[j].disabled = true
			    } else {
			      item.driverList[j].disabled = false
			    }
			  }
			})
      if (type == 0) {
        if (this.busInfoList) {
          this.busInfoList.map((item, index) => {
            if (item.busId == val) {
              this.allDatas[idx].driverId = item.frequencyDriverId
              this.allDatas[idx].busNumber = item.busNumber
							this.allDatas[idx].busNo = item.busNo
            }
            if (val == '') {
              this.allDatas[idx].driverId = ''
              this.allDatas[idx].busNumber = ''
							this.allDatas[idx].busNo = ''
            }
          })
        }
      } else if(type==1) {
        this.driverList.map((item, index) => {
          if (item.driverId == val) {
            this.allDatas[idx].driverId = item.driverId
            this.allDatas[idx].busNumber = item.busNumber
          }
          if (isDriverId == '') {
            this.allDatas[idx].busId = ''
            this.allDatas[idx].busNumber = ''
          }
        })
      }else{
				 this.busTypeList.map((item, index) => {
				  if (item.busTypeId == busTypeId) {
			 	 this.allDatas[idx].seatCount = item.seatCount
				 this.allDatas[idx].seatMaxCount = item.seatMaxCount
				  }
				  if (busTypeId == '') {
				    this.allDatas[idx].seatCount = ''
				    this.allDatas[idx].seatMaxCount = ''
				  }
				})
				this.changeBusType(busTypeId)
			}
    },
    cancelRefund() {
      this.dialogTableVisible = false
    },
		changeBusType(e){
				net.apiGet(api.bus.optionList, {
							 supplyId: this.supplyId,
						 }).then(data => {
			  if (data && data.code === enums.NET_SUCCESS) {
					this.busInfoList=data.data
					   this.allDatas.forEach(item => {
							 if(item.busInfoList ==undefined){
								item.busInfoList=[...data.data]
							 }
					})
					net.apiGet(api.driver.optionList, {
									 supplyId: this.supplyId,
								 }).then(data => {
					  if (data && data.code === enums.NET_SUCCESS) {
							this.driverList=data.data
							this.allDatas.forEach(item => {
								if(item.driverList==undefined){
									item.driverList=[...data.data]
								}
							})
						 this.dialogTableVisible = true
					  } else {
					    help.E(data.msg)
					  }
					})
			  } else {
			    help.E(data.msg)
			  }
			})
		},
    dispatchingCar(row) {
			this.carpoolId = row.carpoolId
			this.supplyId=row.supplyId
			this.alreadyCarpoolNum=row.alreadyCarpoolNum
			net.apiGet(api.carpoolSupply.list, {
							 carpoolId: this.carpoolId,
						 }).then(data => {
			  if (data && data.code === enums.NET_SUCCESS) {
					var data = data.data
					if(data!=undefined && data.length>0){
						this.allDatas=[]
					   data.forEach(item => {
					 		 let allData ={
					 						busId:item.busId,
					 						busTypeId:item.busTypeId,
					 						driverId:item.driverId,
											busNo:item.busNo,
											seatCount:item.seatCount,
											seatMaxCount:item.seatMaxCount,
											busNumber:item.busNumber,
					 						}
					 		this.allDatas.push(allData)
					})
						this.changeBusType(data.busTypeId)
					}else{
			      this.allDatas=[{
						busId:'',
						busTypeId:'',
						driverId:'',
						busNo:'',
						seatCount:'',
						seatMaxCount:'',
						busNumber:'',
						}]
					}
			  } else {
			    help.E(data.msg)
			  }
			})
		},
		assignOrz(){
			if(this.carpoolId){
			net.apiPost(api.carpoolSupply.assign, {
							 carpoolId: this.carpoolId,
							 supplyId:this.orzId
						 }).then(data => {
			  if (data && data.code === enums.NET_SUCCESS) {
					this.dialogOrzTableVisible=false
					this.getTableData(this.searchData)
			  } else {
			    help.E(data.msg)
			  }
			})
			}
		},
		cancelOrz(){
			this.dialogTableVisible=false;
		},
    updateOrder() {
      let params = {
        carpoolId: this.carpoolId,
				alreadyCarpoolNum: this.alreadyCarpoolNum,
				dispatchList: this.allDatas
      }
      let url = ''
       url = api.carpoolSupply.dispatch
      net.apiPost(url, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          help.S('派车成功~')
          this.getTableData(this.searchData)
          this.dialogTableVisible = false
          clearObj(this.refundOrder)
        } else {
          help.E(data.msg)
        }
      })
    },
		addCarpool(id){
			 let searchArr = []
			for (let key in this.searchData) {
			  if (this.searchData) {
			    let obj = {}
			    obj[key] = this.searchData[key]
			    searchArr.push(obj)
			  }
			}
			sessionStorage.setItem('carpoolSearch', JSON.stringify(searchArr))
			this.$router.push({
			  name: 'addReceiptCarpool',
			  query: { id: id }
			})
		},
    modify(row) { // 去详情页面进行修改
      if (row.carpoolId) {
        this.carpoolId = row.carpoolId
				 this.dialogOrzTableVisible=true
      }
    },
     getOrzList() {
				net.apiGet(api.supply.optionList, {
					orzType: 1,
				}).then(data => {
					if (data.code === enums.NET_SUCCESS) {
						this.orzList = data.data
					} else {
						help.E(data.msg)
					}
				})
			},
			getBusTypeList() {
				net.apiGet(api.busType.optionList).then(data => {
					if (data && data.code === enums.NET_SUCCESS) {
						this.busTypeList = data.data
					} else {
						help.E(data.msg)
					}
				})
			},
    refresh() {
      this.getTableData(this.searchData)
    },
    initCheckList() {
      receiptCarpoolManageTableHead.forEach(item => {
        // 默认全选
        this.tableHeaderCheckList.push(item.label)
      })
    },
    handleSelectionChange (checkedArr) {
      // 批量删除数组变化
      let checkGroupDriverIds = []
      checkedArr.forEach((item, index) => {
        checkGroupDriverIds.push(item.driverId)
      })
      this.checkedRow = checkGroupDriverIds
    },
    sizeChange (pageSize) {
      this.page.pageNum = 1
      this.searchData.pageNum = 1
      this.page.pageSize = pageSize
      this.searchData.pageSize = pageSize
      this.getTableData(this.searchData)
    },
    currentChange (pageNum) {
      this.searchData.pageNum = pageNum
      this.getTableData(this.searchData)
    },
    cancelCarpool (e) {
      this.$confirm('此操作将删除该拼团, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.carpoolSupply.cancel, { carpoolId: e.carpoolId }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            help.E('删除成功')
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
    },
    openCarpool (e) {
      this.$confirm('此操作将开启该拼团, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        net.apiPost(api.carpoolSupply.open, { carpoolId: e.carpoolId }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            help.E('开启成功')
            this.getTableData(this.page)
          } else {
            help.E(data.msg)
          }
        })
      }).catch(() => {})
    },
    getTableData (params) {
      if (params && params.carpoolState != undefined) {
        if (params.carpoolState === '待分配') {
          params.state = 1
        } else if (params.carpoolState === '待排班') {
          params.state = 2
        } else if (params.carpoolState === '已排班') {
          params.state = 3
        } else if (params.carpoolState === '已取消') {
          params.state = 4
        }
      }
      if (params && params.carpoolType != undefined) {
        if (params.carpoolType === 'APP发起') {
          params.carpoolType = 1
        } else if (params.carpoolType === '后台发起') {
          params.carpoolType = 2
        }
      }
      params.pageSize = this.page.pageSize
      net.apiGet(api.carpoolSupply.tableList, params).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          sessionStorage.removeItem('ElectronicFlag')
          this.tableList = data.data.list
          if (this.tableList) {
            this.tableList.forEach((item, index) => {
              // let str = []
              // if (item.busList.length > 0) {
              //   for (let i = 0; i < item.busList.length; i++) {
              //     str.push(item.busList[i].busNumber)
              //   }
              // } else {
              //   str = []
              // }
              // this.tableList[index].busList = str.join(',')
            })
          }
          this.page.pageNum = data.data.page.pageNum
          this.page.total = data.data.page.total
        } else {
          help.E(data.msg)
        }
      })
    },
		addDriver(e) {
		  this.allDatas.push({
		    'busId': '',
		    'driverId': '',
		    'busNumber': '',
		    'busTypeId': '',
		    'busTypeName': '',
		    'travelId': '',
		    'busInfoList': [...this.busInfoList],
		    'driverList': [...this.driverList]
		  })
		  let busIdArr = []
		  let driverIdArr = []
		  // this.isChange = true
		  this.allDatas.map((item) => {
		    if (item.busId != '') {
		      busIdArr.push(item.busId)
		    }
		    if (item.driverId != '') {
		      driverIdArr.push(item.driverId)
		    }
		  })
		  this.allDatas.forEach((item, index) => {
		    for (let i = 0; i < item.busInfoList.length; i++) {
		      if (busIdArr.indexOf((this.busInfoList[i].busId)) > -1) {
		        item.busInfoList[i].disabled = true
		      } else {
		        item.busInfoList[i].disabled = false
		      }
		    }
		    for (let j = 0; j < item.driverList.length; j++) {
		      if (driverIdArr.indexOf((item.driverList[j].driverId)) > -1) {
		        item.driverList[j].disabled = true
		      } else {
		        item.driverList[j].disabled = false
		      }
		    }
		  })
		},
		removeDriver(idx, params) {
		  if (params == 'all') {
		    if (this.allDatas.length > 1) {
		      this.allDatas.splice(idx, 1)
		    } else {
		      help.E('不能再删除了！')
		    }
		  }
		},
		lineDetail(e){
				 let searchArr = []
			for (let key in this.searchData) {
			  if (this.searchData) {
			    let obj = {}
			    obj[key] = this.searchData[key]
			    searchArr.push(obj)
			  }
			}
			sessionStorage.setItem('carpoolSearch', JSON.stringify(searchArr))
			this.$router.push({
			  name: 'lineDetailMap',
			  query: { id: e.lineId }
			})
		}
  },
  components: {
    SearchForm
  }
}
</script>

<style lang="less" type="text/less">
	@import '../../assets/style/set.less';
.el-table th,
.el-table .tableHeader {
  text-align: center;
  font-size: 14px;
}
.detail-btn {
  color: #409eff;
  cursor: pointer;
}
.disabled {
  color: lightgray;
}
.el-table th,
.el-table .tableHeader {
  text-align: center;
  font-size: 14px;
}
.detail-btn {
  color: #409eff;
  cursor: pointer;
}
.disabled {
  color: lightgray;
}
</style>
