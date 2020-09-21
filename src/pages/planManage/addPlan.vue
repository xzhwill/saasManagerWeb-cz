<template>
  <el-container style="display: flex;justify-content: flex-start">
    <el-form enctype="multipart/form-data" label-width="80px" :inline="true" :model="schedule" ref="addPlan"
             label-position="right">
      <div class="form-section">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item prop="className" label="班次名称">
        <el-select v-model="schedule.scheduleId" style="width:130px" @change="changeSchedule" disabled>
          <el-option v-for="(item,index) in scheduleList" :key="index" :value="item.scheduleId" :label="item.className"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="lineName" label="所属线路">
        <el-input v-model="schedule.lineName" style="width:130px" readonly></el-input>
      </el-form-item>
      <el-form-item prop="supplyName" label="供给侧">
        <el-input v-model="schedule.supplyName" style="width:130px" readonly></el-input>
      </el-form-item>
      <el-form-item prop="workingCirculate" label="运行周期">
        <el-radio v-model="schedule.workingCirculate" v-if="schedule.workingCirculate == 1" :label="parseInt(1)">工作日</el-radio>
        <el-radio v-model="schedule.workingCirculate" v-if="schedule.workingCirculate == 2" :label="parseInt(2)">节假日</el-radio>
        <el-radio v-model="schedule.workingCirculate" v-if="schedule.workingCirculate == 3" :label="parseInt(3)">不限</el-radio>
      </el-form-item>
      <el-form-item prop="effectiveTime" label="运行日期">
        <el-input v-model="schedule.effectiveTime" style="width:130px" readonly></el-input>
      </el-form-item>
      <el-form-item prop="busTypeName" label="车型">
        <el-input v-model="schedule.busTypeName" style="width:130px" readonly></el-input>
      </el-form-item>
      <el-form-item prop="startTime" label="发车时间">
        <el-input v-model="schedule.startTime" style="width:130px" readonly></el-input>
      </el-form-item>
      <el-form-item prop="endTime" label="到达时间">
        <el-input v-model="schedule.endTime" style="width:130px" readonly></el-input>
      </el-form-item>
      <el-form-item prop="busId" label="车辆" class="common-form-item" @click="configSelect()" v-if="schedule.lineProperty!=2">
        <el-select v-model="schedule.busId" filterable>
          <el-option v-for="(item, index) in busList" :key="index" :label="item.busNumber" :value="item.busId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="driverId" label="司机" class="common-form-item" @click="configSelect()" v-if="schedule.lineProperty!=2">
        <el-select v-model="schedule.driverId" filterable>
          <el-option v-for="(item, index) in driverList" :key="index" :label="item.driverName+'-'+item.phone" :value="item.driverId"></el-option>
        </el-select>
      </el-form-item>
      <div id="calendar">
        <div id="right">
          <!-- 年份 月份 -->
          <div class="month">
            <ul>
              <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
              <li class="year-month">
                <span class="choose-year">{{ currentYear }}年 {{ currentMonth }}月</span>
              </li>
              <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
            </ul>
          </div>
          <!-- 星期 -->
          <ul class="weekdays">
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li style="color:red">六</li>
            <li style="color:red">日</li>
          </ul>
          <!-- 日期 -->
          <ul class="days">
            <li v-for="(dayobject, index) in days" style="height: 90px;line-height: 30px;position:relative" :key="dayobject.dayStr">
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <span v-else>
								<!--今天-->
								<span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate() "
                      class="active">{{ dayobject.day.getDate() }}</span>
								<span v-else>{{ dayobject.day.getDate() }}</span>
							</span>
              <div v-if="schedule.lineProperty!=2">
                <p v-if="dayobject.driverName != null">
									<span style="color:red;">
										<span style="display: block;line-height: 16px;">{{dayobject.busNumber}}</span>
										<span style="display: block;line-height: 16px;">{{dayobject.driverName}}</span>
									</span>
                </p>
                <p v-if="dayobject.driverName == null|| dayobject.driverName == undefined">无</p>
                <p v-if="(dayobject.day.getTime() >= time)
								          && (dayobject.day.getTime() >= firstDay)
								          && (dayobject.day.getTime() <= lastDay)
								          && (schedule.workingCirculate === dayobject.type || schedule.workingCirculate == 3)">
                  <el-checkbox v-model="checkedDays[dayobject.dayStr]" @change="changeSelect" ref="box"></el-checkbox>
                </p>
              </div>
              <div v-else>
                <p v-if="dayobject.driverName != null">
									<span style="color:red;">
										<span style="display: block;line-height: 16px;margin-top:16px">已排班</span>
									</span>
                </p>
                <p v-if="dayobject.driverName == null|| dayobject.driverName == undefined">无</p>
                <div style="width:100%;height:100%;position:absolute;top:0;left:0;cursor:pointer;"
                     @click="goPlan(dayobject.dayStr,dayobject.id)">
                  <span style="font-size:12px;color:#00b8ec;position:absolute;top:0px;right:0px">可排班</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <el-row class="btn-group" style="margin-top: 5px;">
        <el-button type="danger" @click="deletePlan" v-if="rmList.indexOf(operateInfo.delete.operationId) > -1 && +this.clsType !== 3">删除排班</el-button>
        <el-button type="primary" @click="save" v-if="rmList.indexOf(operateInfo.change.operationId) > -1 && +this.clsType !== 3">保存</el-button>
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
import { setTime, getYearMonthDayTime, setOperation } from '@/utils/public.js'

export default {
  data () {
    return {
      clsType: this.$route.query.clsType ? this.$route.query.clsType : '', // 判断班次类型
      title: '添加排班信息',
      action: 0,
      labelWidth: '80px',
      scheduleList: [],
      schedule: {
        scheduleId: '',
        scheduleName: '',
        lineName: '',
        lineId: '',
        supplyName: '',
        supplyId: '',
        busTypeName: '',
        busTypeId: '',
        startTime: '',
        endTime: '',
        workingCirculate: '', //  运行周期，orderReportForms-工作日 travelReportForms-节假日 payReportForms-不限 4-指定日期
        effectiveTime: '',
        busId: '',
        driverId: '',
        planList: []
      },
      busList: [],
      driverList: [],
      classList: [],
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: [],
      planList: [],
      checkedDays: [],
      timeStr: '',
      lastDay: '',
      firstDay: '',
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted () {
    let date = new Date()
    let str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    this.time = new Date(str).getTime()
    this.$emit('getInfo', [])
    this.rmList = setOperation('planManage')
    this.getQueryParams() // 是否在修改状态
    this.initCalendar(null)
    this.getScheduleList() // 获取所有班次
  },
  methods: {
    changeSelect () {
      event.stopPropagation()
      // let arr = []
      // for (let key in this.checkedDays) {
      //   arr[key] = this.checkedDays[key]
      // }
      // this.checkedDays = arr
    },
    getBusDriver (id) {
      // 获取所有车辆司机
      request.apiGet(api.driver.optionList, {
        supplyId: id
      }).then(data => {
        if (data.msg.code === enums.NET_SUCCESS) {
          this.driverList = data.data;
        }
      });
      request
        .apiGet(api.bus.optionList, {
          supplyId: id,
          busTypeId: this.schedule.busTypeId
        })
        .then(data => {
          if (data.msg.code === enums.NET_SUCCESS) {
            this.busList = data.data;
          }
        });
    },
    changeSchedule(val) {
      this.scheduleList.forEach(item => {
        if (item.scheduleId === val) {
          console.log("该班次");
          console.log(item);
          this.schedule.lineId = item.lineId;
          this.schedule.lineName = item.lineName;
          this.schedule.supplyId = item.supplyId;
          this.schedule.supplyName = item.supplyName;
          this.schedule.busTypeId = item.busTypeId;
          this.schedule.busTypeName = item.busTypeName;
          this.schedule.workingCirculate = item.workingCirculate;
          this.schedule.startTime = item.startTime;
          this.schedule.endTime = item.endTime;
          let type = this.$route.query.type;
          let lastDate = ''
          if (type == 2) {
            this.schedule.effectiveTime = item.effectiveDate;
            lastDate = item.expiryDate
          } else {
            this.schedule.effectiveTime = setTime(item.effectiveDate)
            lastDate = setTime(item.expiryDate)
          }
          this.firstDay = new Date(this.schedule.effectiveTime).getTime();
          this.lastDay = new Date(lastDate).getTime();
          this.getBusDriver(item.supplyId);
        }
      });
    },
    getScheduleList() {
      let type = this.$route.query.type;
      let url = "";
      let params = {};
      url = api.schedule.option
      console.log(url);
      request.apiGet(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          console.log(data);
          this.scheduleList = data.data;
          let id = this.$route.query.id;
          this.schedule.scheduleId = id;
          //this.changeSchedule(id);
        } else {
          help.E(data.msg);
        }
      });
    },
    getQueryParams() {
      let scheduleId = this.$route.query.id;
      let type = this.$route.query.type;
      let url = "";
      url = api.plan.info;
      if (scheduleId != undefined) {
        this.action = 1;
        this.title = "排班";
        this.scheduleId = scheduleId;
        request.apiGet(url, {
          scheduleId: scheduleId
        }).then(data => {
          if (data && data.code === enums.NET_SUCCESS) {
            let timeObj = getYearMonthDayTime();
            let type = this.$route.query.type;
            this.timeStr = timeObj.year + timeObj.month + timeObj.day;
            this.schedule = data.data;
            if (type == 2) {
              let effectiveDate = parseInt(this.schedule.effectiveDate);
              let expiryDate = parseInt(this.schedule.expiryDate);
              this.schedule.effectiveTime = setTime(effectiveDate);
              this.schedule.effectiveDate = effectiveDate;
              this.schedule.expiryDate = expiryDate;
            } else {
              this.schedule.effectiveTime = setTime(this.schedule.effectiveDate);
            }
            this.firstDay = new Date(setTime(this.schedule.effectiveDate)).getTime();
            this.lastDay = new Date(setTime(this.schedule.expiryDate)).getTime();
            if (this.schedule.workingCirculate == 4) { //  若未指定日期，则将其type换成对应的workingCirculate
              this.schedule.planList.forEach(item => {
                item.type = 4
              })
              this.classList = this.schedule.planList
            } else {
              this.classList = this.schedule.planList;
            }
            // 获取司机
            request
              .apiGet(api.driver.optionList, {
                supplyId: this.schedule.supplyId
              })
              .then(data => {
                if (data && data.code === enums.NET_SUCCESS) {
                  this.driverList = data.data;
                }
              });
            // 获取车辆
            request
              .apiGet(api.bus.optionList, {
                supplyId: this.schedule.supplyId,
                busTypeId: this.schedule.busTypeId
              })
              .then(data => {
                if (data && data.code === enums.NET_SUCCESS) {
                  this.busList = data.data
                }
              })
            this.initClass()
          }
        })
      }
    },
    initCalendar (cur) {
      let date
      let now
      if (cur) {
        date = new Date(cur)
      } else {
        now = new Date()
        let d = new Date(
          this.formatDate(now.getFullYear(), now.getMonth() + 1, 1)
        )
        date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      }
      this.currentDay = date.getDate()
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1

      this.currentWeek = date.getDay() // orderReportForms...6,0
      if (!+this.currentWeek) {
        this.currentWeek = 7
      }
      let str = this.formatDate(
        this.currentYear,
        this.currentMonth,
        this.currentDay
      )
      this.days.length = 0
      // 今天是周日，放在第一行第7个位置，前面6个
      // 初始化本周
      for (let i = this.currentWeek - 1; i >= 0; i--) {
        let d = new Date(str)
        d.setDate(d.getDate() - i)
        let dayobject = {} // 用一个对象包装Date对象  以便为以后预定功能添加属性
        dayobject.day = d
        let fullMonth = ''
        if (d.getMonth() + 1 < 10) {
          fullMonth = '0' + (d.getMonth() + 1)
        } else {
          fullMonth = d.getMonth() + 1
        }
        let fullDay = ''
        if (d.getDate() < 10) {
          fullDay = '0' + d.getDate()
        } else {
          fullDay = d.getDate()
        }
        dayobject.dayStr = d.getFullYear() + '-' + fullMonth + '-' + fullDay
        this.days.push(dayobject) // 将日期放入data 中的days数组 供页面渲染使用
      }
      let monthDateWeek = this.getMonthWeek(
        this.currentYear,
        this.currentMonth
      )
      // 其他周
      for (let i = 1; i <= monthDateWeek * 7 - this.currentWeek; i++) {
        let d = new Date(str)
        d.setDate(d.getDate() + i)
        let dayobject = {}
        dayobject.day = d
        let fullMonth = ''
        if (d.getMonth() + 1 < 10) {
          fullMonth = '0' + (d.getMonth() + 1)
        } else {
          fullMonth = d.getMonth() + 1
        }
        let fullDay = ''
        if (d.getDate() < 10) {
          fullDay = '0' + d.getDate()
        } else {
          fullDay = d.getDate()
        }
        dayobject.dayStr = d.getFullYear() + '-' + fullMonth + '-' + fullDay
        this.days.push(dayobject)
      }
    },
    initClass () {
      let classList = this.classList;
      let days = this.days;
      days.forEach(dayobject => {
        for (let i = 0; i < classList.length; i++) {
          let tmpClass = classList[i];
          let strDay = setTime(tmpClass.workDate);
          let dd = new Date(strDay);
          if (dd.getTime() == dayobject.day.getTime()) {
            dayobject.type = tmpClass.type;
            dayobject.driverName = tmpClass.driverName;
            dayobject.busNumber = tmpClass.busNumber;
            dayobject.id = tmpClass.id;
          }
        }
      });
      // this.checkedDays = ...checkDaysList
      this.days = days;
    },
    getMonthWeek(a, b) {
      /*计算有多少周*/
      var last = new Date(a, b, 0); //获取当前月最后一天时间
      var c = last.getDate();
      let date = new Date(a, parseInt(b) - 1, c);
      let w = date.getDay();
      if (w == 0) {
        w = 7;
      }
      let d = date.getDate();
      return Math.ceil((d + 7 - w) / 7);
    },
    formatDate(year, month, day) {
      let y = year;
      let m = month;
      if (m < 10) m = "0" + m;
      let d = day;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    },
    pickPre(year, month) {
      var d = new Date(this.formatDate(year, month, 1));
      d.setDate(0);
      this.initCalendar(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      this.initClass();
    },
    pickNext(year, month) {
      var d = new Date(this.formatDate(year, month, 1));
      d.setDate(35);
      this.initCalendar(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      this.initClass();
    },
    deletePlan() {
      let params = {};
      let type = this.$route.query.type;
      let url = "";
      params["scheduleId"] = this.schedule.scheduleId;
      let planList = [];
      //this.checkedDays = ['2019-09-23', '2019-09-26']
      for (let key in this.checkedDays) {
        // console.log(this.checkedDays);
        if (this.checkedDays[key]) {
          let obj = {};
          obj["workDate"] = Number.parseInt(key.replace(/-/g, ""));
          planList.push(obj);
        }
      }
      params["planList"] = planList;
      url = api.plan.del;
      request.apiPost(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S("删除成功~");
          setTimeout(() => {
            location.reload();
          }, 50);
        } else {
          help.E(data.msg);
        }
      });
    },
    save() {
      this.$refs["addPlan"].validate(valid => {
        if (valid) {
          this.postData();
        } else {
          return false
        }
      })
    },
    postData () {
      let params = this.schedule
      let url = ''
      let type = this.$route.query.type
      if (parseInt(this.action) === 1) {
        let planList = []
        // this.checkedDays = ['2019-09-23', '2019-09-26']
        for (let key in this.checkedDays) {
          // let key = this.checkedDays[index]
          if (Number.parseInt(key.replace(/-/g, '')) >= this.timeStr) {
            if (this.checkedDays[key]) {
              let obj = {}
              if (!this.schedule.busId || !this.schedule.driverId) return help.E('请选择车辆和司机')
              obj.busId = this.schedule.busId
              obj.driverId = this.schedule.driverId
              obj.workDate = Number.parseInt(key.replace(/-/g, ''))
              this.classList.forEach(item => {
                if (item.workDate === obj.workDate) {
                  if (item.busId) {
                    obj.flag = 0
                  } else {
                    obj.flag = 1
                  }
                }
              })
              planList.push(obj)
            }
          }
        }
        if (!planList.length) return help.E('请选择排班日期')
        params.planList = planList
        url = api.plan.update
      } else {
        url = api.plan.add
        for (let key in this.checkedDays) {
          if (this.checkedDays[key]) {
            let obj = {}
            obj.busId = this.schedule.busId
            obj.driverId = this.schedule.driverId
            obj.workDate = Number.parseInt(key.replace(/-/g, ''))
            params.planList.push(obj)
          }
        }
      }
      request.apiPost(url, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          help.S('保存成功')
          sessionStorage.setItem('planFlag', 'true')
          this.$router.back()
        } else {
          help.E(data.msg)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    back () {
      sessionStorage.setItem('planFlag', 'true')
      this.$router.back()
    },
    goPlan (workDate, id) {
      let scheduleId = this.schedule.scheduleId
      let busTypeId = this.schedule.busTypeId
      let scheduleFrom = JSON.stringify(this.schedule)
      if (busTypeId) {
        this.$router.push({
          name: 'plan',
          query: {
            scheduleId: scheduleId,
            busTypeId: busTypeId,
            workDate: workDate,
            scheduleFrom: scheduleFrom,
            supplyId: this.schedule.supplyId
          }
        })
      }
    }
  }
}
</script>

<style>
  @import "../../assets/style/common.css";
  .btn-group {
    text-align: center;
  }
  * {
    box-sizing: border-box;
  }
  ul {
    list-style-type: none;
  }
  body {
    font-family: Verdana, sans-serif;
    background: #e8f0f3;
  }
  #calendar {
    width: 100%;
    height: auto !important;
    margin: 0 auto;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }
  .month {
    width: 100%;
    background: #00b8ec;
  }
  .month ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .year-month {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  .year-month:hover {
    background: rgba(150, 2, 12, 0.1);
  }
  .choose-year {
    padding-left: 10px;
    padding-right: 10px;
  }
  .arrow {
    padding: 10px;
  }
  .arrow:hover {
    background: rgba(100, 2, 12, 0.1);
  }
  .month ul li {
    color: white;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 3px;
  }
  .weekdays {
    margin: 0;
    padding: 10px 0;
    background-color: #00b8ec;
    display: flex;
    flex-wrap: wrap;
    color: #ffffff;
    justify-content: space-around;
  }
  .weekdays li {
    display: inline-block;
    width: 13.6%;
    text-align: center;
  }
  .days {
    padding: 0;
    background: #ffffff;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .days li {
    list-style-type: none;
    display: inline-block;
    width: 14.2%;
    text-align: center;
    padding-bottom: 3px;
    padding-top: 3px;
    font-size: 1.1rem;
    color: #000;
  }
  .days li .active {
    padding: 2px 8px;
    border-radius: 50%;
    background: #00b8ec;
    color: #fff;
  }
  .days li .other-month {
    padding: 5px;
    color: gainsboro;
  }
  .days li:hover {
    background: #e1e1e1;
  }
  .days p {
    font-size: 0.8rem;
  }
  #right {
    width: 100%;
  }
</style>
