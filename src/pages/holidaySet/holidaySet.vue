<template>
  <div class="common-container"
       style="display: block;">
    <div class="table-container">
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
            <li v-for="(dayobject) in days"
                style="height: 100px;line-height: 30px;"
                :key="dayobject.dayStr">
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth"
                    class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <span v-else>
                <!--今天-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate() "
                      class="active">{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>
              </span>
              <p style="display: block;"
                 v-if="dayobject.typeInfo === '班'">
                <span style="color:blue;">
                  <span style="display: block;line-height: 28px;font-size: 20px;">{{dayobject.typeInfo}}</span>
                </span>
              </p>
              <p style="display: block;"
                 v-else-if="dayobject.typeInfo === '休'">
                <span style="color:red;">
                  <span style="display: block;line-height: 28px;font-size: 20px;">{{dayobject.typeInfo}}</span>
                </span>
              </p>
              <p>
                <el-checkbox v-model="checkedDays[dayobject.dayStr]"></el-checkbox>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div style="text-align: center;margin-top: 20px;">
        <!-- <div style="text-align: center;margin-top: 20px;" v-if="rmList.indexOf(operateInfo.change.operationId)> -orderReportForms"> -->
        <el-button type="info"
                   @click="changeHoliday('2')">班改休</el-button>
        <el-button type="info"
                   @click="changeHoliday('1')">休改班</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import help from '@/utils/helper.js'
import request from '@/utils/request.js'
import api from '@/utils/api.js'
import enums from '@/utils/enums.js'
import { setTime, getYearMonthDayTime, setOperation } from '@/utils/public.js'
export default {
  name: 'holidaySet',
  props: {
    searchData: {
      type: Array,
      required: true
    },
    tableHeaderCheckList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentDay: 1,
      currentMonth: 1,
      currentYear: new Date().getFullYear(),
      currentWeek: 1,
      days: [],
      planList: [],
      checkedDays: [],
      timeStr: '',
      dayInfo: [],
      rmList: [],
      operateInfo: enums.OPERATIONID
    }
  },
  mounted() {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
    this.$emit('getPage', this.page)
    this.rmList = setOperation('holidaySet')
    this.getHolidayList()
  },
  methods: {
    changeHoliday (type) {
      let dayArr = []
      for (let key in this.checkedDays) {
        if (this.checkedDays[key]) {
          dayArr.push(Number.parseInt(key.replace(/-/g, "")))
        }
      }
      let params = {
        type,
        dates: dayArr
      }
      request.apiPost(api.holiday.updated, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          +type === 1 ? help.S('已是上班日') : help.S('已是休息日')
          this.getHolidayList()
        } else {
          help.E(data.msg)
        }
      })
    },
    getHolidayList() {
      // let params ={year:this.currentYear}
      request.apiGet(api.holiday.tableList).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.dayInfo = data.data
          this.initCalendar()
        } else {
          help.E(data.msg)
        }
      })
    },
    initCalendar(cur) {
      let date
      let now
      if (cur) {
        date = new Date(cur)
      } else {
        now = new Date()
        let d = new Date(this.formatDate(now.getFullYear(), now.getMonth() + 1, 1))
        // d.setDate(35)
        date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      }

      this.currentDay = date.getDate()
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
      this.currentWeek = date.getDay() // orderReportForms...6,0
      if (this.currentWeek == 0) {
        this.currentWeek = 7
      }
      let str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)
      this.days.length = 0
      // 今天是周日，放在第一行第7个位置，前面6个
      // 初始化本周
      for (let i = this.currentWeek - 1; i >= 0; i--) {
        let d = new Date(str)
        d.setDate(d.getDate() - i)
        let dayobject = {} // 用一个对象包装Date对象  以便为以后预定功能添加属性
        dayobject.day = d
        let fullMonth = ''
        if ((d.getMonth() + 1) < 10) {
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
        this.days.push(dayobject)// 将日期放入data 中的days数组 供页面渲染使用
      }
      let monthDateWeek = this.getMonthWeek(this.currentYear, this.currentMonth)
      console.log(this.currentMonth + "月份共有" + monthDateWeek + "周")
      // 其他周
      for (let i = 1; i <= (monthDateWeek * 7 - this.currentWeek); i++) {
        let d = new Date(str)
        d.setDate(d.getDate() + i)
        let dayobject = {}
        dayobject.day = d
        let fullMonth = ''
        if ((d.getMonth() + 1) < 10) {
          fullMonth = '0' + (d.getMonth() + 1)
        } else {
          fullMonth = (d.getMonth() + 1)
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
      this.initClass()
    },
    initClass() {
      let days = this.days
      let classList = this.dayInfo
      days.forEach(dayobject => {
        for (let i = 0; i < classList.length; i++) {
          let tmpClass = classList[i]
          let strDay = setTime(tmpClass.date)
          let dd = new Date(strDay)
          if (dd.getTime() == dayobject.day.getTime()) {
            if (tmpClass.type == '1') {
              dayobject.typeInfo = '班'
            } else if (tmpClass.type == '2') {
              dayobject.typeInfo = '休'
            }
          } else { }
        }
      })
      this.days = days
    },
    getMonthWeek(a, b) {/*计算有多少周*/
      var last = new Date(a, b, 0); //获取当前月最后一天时间
      var c = last.getDate();
      let date = new Date(a, parseInt(b) - 1, c);
      let w = date.getDay()
      if (w == 0) {
        w = 7
      }
      let d = date.getDate();
      // debugger
      console.log(Math.ceil(
        (d + 7 - w) / 7
      ))
      return Math.ceil(
        (d + 7 - w) / 7
      );
    },
    formatDate(year, month, day) {
      let y = year
      let m = month
      if (m < 10) m = '0' + m
      let d = day
      if (d < 10) d = '0' + d
      return y + '-' + m + '-' + d
    },
    pickPre(year, month) {
      var d = new Date(this.formatDate(year, month, 1))
      d.setDate(0)
      this.initCalendar(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      this.initClass()
    },
    pickNext(year, month) {
      var d = new Date(this.formatDate(year, month, 1))
      d.setDate(35)
      this.initCalendar(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      this.initClass()
    },
  }
}
</script>

<style>
@import '../../assets/style/common.css';
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
  height: 80%;
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
  padding-bottom: 10px;
  padding-top: 10px;
  font-size: 20px;
  color: #000;
}

.days li .active {
  padding: 4px 10px;
  border-radius: 50%;
  background: #00b8ec;
  color: #fff;
}

.days li .other-month {
  padding: 10px;
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
