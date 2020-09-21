<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="100px" :model="planForm"  ref="form" label-position="right">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <el-form-item label="日期" prop="workDate" class="common-form-item" >
        <el-input v-model="workDate" readonly style="width:210px"></el-input>
      </el-form-item>
        <el-form label-width="100px" class="demo-dynamic">
              <div v-for="(item ,index) in addGroup.planList" :key="index" style="display:flex;justify-content: flex-start;">
                      <el-form-item prop="busId" label="车辆" >
                        <el-select v-model="item.busId" filterable @change="isGroupChange" >
                          <el-option
                            v-for="(val, index) in busList"
                            :key="index"
                            :label="val.busNumber"
                            :value="val.busId"
                            :disabled="val.disabled"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="driverId" label="司机" >
                        <el-select v-model="item.driverId" filterable @change="isGroupChange" >
                          <el-option
                            v-for="(value, index) in driverList"
                            :key="index"
                            :label="value.driverName"
                            :value="value.driverId"
                            :disabled="value.disabled"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                <el-button @click.prevent="removeDomain(index)" style="height:33px;margin-left:30px">删除</el-button>
              </div>
              <el-form-item>
                <el-button @click="addDomain">添加</el-button>
              </el-form-item>
            </el-form>
      <el-row class="btn-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="$router.back()">取消</el-button>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import help from '@/utils/helper'
import request from '@/utils/request'
import api from '@/utils/api'
import enums from '@/utils/enums'

export default {
  data () {
    return {
      title: '排班',
      labelWidth: '120px',
      workDate: '',
      planForm: {
        workDate: ''
      },
      driverList: [],
      busList: [],
      index: 1,
      addGroup: {
        planList: [{
          driverId: '',
          busId: ''
        }]
      },
      uid: this.$route.query.busTypeId ? this.$route.query.busTypeId : '' // 判断是否有车型ID
    }
  },
  mounted () {
    this.getBusTypeInfo()
    this.getOptionList()
  },
  methods: {
    getBusTypeInfo () {
      if (this.uid) {
        // this.title = '修改车型信息'
        request.apiGet(api.busType.busTypeInfo, {
          busTypeId: this.uid
        }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            this.busType = data.data
          }
        })
      }
    },
    getOptionList () { //
      this.planForm=JSON.parse(this.$route.query.scheduleFrom)
      this.planForm.scheduleId = this.$route.query.scheduleId
      this.workDate=this.$route.query.workDate
      this.planForm.workDate = Number.parseInt(this.$route.query.workDate.replace(/-/g, ""))
      this.planForm.busTypeId=this.$route.query.busTypeId
      this.planForm.id=this.$route.query.id
      let workDate=this.planForm.workDate
      // this.planList.workDate.split("-").map((item,index)=>{
      //   workDate+=item
      // })
      console.log(this.planForm)
        // 获取所有车辆司机
        request.apiGet(api.driver.optionList, { workDate: workDate,  scheduleId : this.planForm.scheduleId,supplyId:this.$route.query.supplyId}).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            this.driverList = data.data;
          }
        });
        request
          .apiGet(api.bus.optionList, {
            workDate: workDate,
            busTypeId: this.planForm.busTypeId,
            scheduleId : this.planForm.scheduleId,
            supplyId:this.$route.query.supplyId
          }).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              this.busList = data.data;
            }
          });
          //回显
        setTimeout(() => {
          request.apiGet(api.plan.cycle, {
              scheduleId : this.planForm.scheduleId,
              workDate: workDate,
            }).then(data => {
              if (data && data.code === enums.NET_SUCCESS) {
                this.addGroup.planList=data.data
                  this.addGroup.planList.map((item, index) => {
                    for (var i = 0; i < this.busList.length; i++) {
                      if (item.busId == this.busList[i].busId) {
                        this.busList[i].disabled = true
                        console.log(this.busList[i])
                      }
                    }
                  })
                  this.addGroup.planList.map((item, index) => {
                    for (var j = 0; j < this.driverList.length; j++) {
                      if (item.driverId == this.driverList[j].driverId) {
                        this.driverList[j].disabled = true
                        console.log(this.driverList[j])
                      }
                    }
                  })
              }
            })
        }, 500);
    },
    // getQueryParams () {
    //   let busId = this.$route.query.id
    //   if (busId != undefined) {
    //     this.title = '修改车辆信息'
    //     this.busId = busId
    //     request
    //       .apiGet(api.busType.busInfo, { busId: busId })
    //       .then(data => {
    //         if (data.msg && data.msg.code === enums.NET_SUCCESS) {
    //           this.bus = data.data.list[0]
    //           let res = data.data.list[0]// 回显
    //           this.bus.busNumber = res.busNumber
    //           this.bus.busTypeNo = res.busTypeNo
    //           this.bus.eqpId = res.eqpId
    //           this.bus.seatCapacity = res.seatCapacity
    //           this.bus.padNo = res.padNo
    //           this.bus.state = parseInt(res.state)
    //         }
    //       })
    //   }
    // },
    removeDomain (idx) {
      // if (this.index > orderReportForms) {
        this.index--
        let driverId = this.addGroup.planList[idx].driverId
        this.addGroup.planList.splice(idx, 1)
        this.addGroup.planList.forEach(item => {
          for (let i = 0; i < this.driverList.length; i++) {
            if (this.driverList[i].driverId === item.driverId) {
              this.driverList[i].disabled = true
            } else if (driverId === this.driverList[i].driverId) {
              this.driverList[i].disabled = false
            }
          }
        })
      // } else {
      //   help.E('不能再删除了！')
      // }
    },
    addDomain () {
      this.index++
      // this.addGroup.planList.forEach(item => {
      //   for (let i = 0; i < this.driverList.length; i++) {
      //     if (this.driverList[i].driverId === item.driverId) {
      //       item.disabled = true
      //     }
      //   }
      // })
      this.addGroup.planList.push({
        driverId:'',
        busId:''
      })
    },
    isGroupChange () {
      let planDriverArr = []
      let planBusArr = []
      this.addGroup.planList.forEach(item => {
        planDriverArr.push(item.driverId)
        planBusArr.push(item.busId)
      })
      for (let i = 0; i < this.driverList.length; i++) {
        let driverId = this.driverList[i].driverId
        if (planDriverArr.indexOf(driverId) > -1) {
          this.driverList[i].disabled = true
        } else {
          this.driverList[i].disabled = false
        }
      }
      for (let i = 0; i < this.busList.length; i++) {
        let busId = this.busList[i].busId
        if (planBusArr.indexOf(busId) > -1) {
          this.busList[i].disabled = true
        } else {
          this.busList[i].disabled = false
        }
      }
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    postData () {
      let pass=false
      let params = this.planForm
      if(this.planForm.planList.length!=0){
        params.flag='1'
      }else{
        params.flag='0'
      }
      this.addGroup.planList.map((item,index)=>{
        if((item.busId!=""&&item.driverId=='')||(item.busId==""&&item.driverId!='')){
           help.E("车辆和司机请匹配完整")
           pass=true
        }
      })
      if(pass){
        return
      }
      params.planList=this.addGroup.planList

      let url = ''
      request.apiPost(api.plan.cycleUpdate, params).then((data) => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    }
  }
}
</script>

<style>
  @import "../../assets/style/common.css";
  .btn-group{text-align: center;}
  .el-upload--picture-card{
    border: none;
    width: 80px;
    height: 28px;
    line-height: 28px;

  }
  .showImage{
    display: flex;
    align-items: center;
  }
</style>
