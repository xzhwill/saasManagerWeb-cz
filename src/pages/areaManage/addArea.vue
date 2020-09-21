<template>
  <el-container>
    <el-form enctype="multipart/form-data" style="width: 100%;" label-width="100px" :inline="true" :model="areaInfo" :rules="formRules" ref="addArea" label-position="right">
      <div class="form-section" style="font-size: 18px;margin-bottom: 15px;">
        <i class="el-icon-edit"></i>
        <label>{{title}}</label>
      </div>
      <div>
        <el-button class="search-form-toggle" :icon="show.showA ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="float: right" round plain type="success" @click="toggle('showA')">{{show.showA?'收起':'展开'}}</el-button>
        <div class="form-section" style="margin-bottom:25px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>区域基础信息</label>
        </div>
        <transition name="fade">
          <div class="showA" v-if="show.showA">
            <el-form-item prop="areaName" label="区域名称">
              <el-input v-model="areaInfo.areaName"></el-input>
            </el-form-item>
            <el-form-item prop="cityCode" label="选择城市" class="common-form-item">
              <el-select v-model="areaInfo.cityCode" @change="changeCity">
                <el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.cityCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="demandOrzId" label="需求侧" class="common-form-item">
              <el-select v-model="areaInfo.demandOrzId">
                <el-option v-for="(item, index) in compList" :key="index" :label="item.name" :value="item.tenantId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="seqNo" label="序号">
              <el-input v-model="areaInfo.seqNo"></el-input>
            </el-form-item>
            <el-form-item label="区域状态">
              <el-select v-model="areaInfo.state">
                <el-option :value='parseInt(0)' label="禁用"></el-option>
                <el-option :value='parseInt(1)' label="启用"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </transition>
      </div>
      <div class="divide" ></div>
      <div>
        <el-button class="search-form-toggle" :icon="show.showB ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="float: right" round plain type="success" @click="toggle('showB')">{{show.showB?'收起':'展开'}}</el-button>
        <div class="form-section" style="margin-bottom:15px;font-size: 14px;">
          <i class="el-icon-info"></i>
          <label>选择班次</label>
        </div>
        <transition name="fade">
          <div class="showB" v-if="show.showB">
            <el-button type="primary" @click="showDialog">选择班次</el-button>
            <el-table stripe :data="areaInfo.showAreaClassList" height="250" style="margin-top: 15px;">
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small" v-if="scope.$index != seqNo">移除</el-button>
                  <el-button @click.native.prevent="changeSeqNo(scope.$index)" type="text" size="small" v-if="scope.$index != seqNo">调整顺序</el-button>
                  <el-input placeholder="" v-model="newSeqNo" style="width: 60px;" type="number" v-if="scope.$index == seqNo"></el-input>
                  <el-button @click.native.prevent="trueSeqNo('1')" type="text" size="small" v-if="scope.$index == seqNo">确认</el-button>
                  <el-button @click.native.prevent="trueSeqNo('0')" type="text" size="small" v-if="scope.$index == seqNo">取消</el-button>
                </template>
              </el-table-column>
              <!--<el-table-column type="selection" width="55"></el-table-column>-->
              <!--<el-table-column property="classId" label="站点ID" width="100"></el-table-column>-->
              <el-table-column property="className" label="班次名称" width="150"></el-table-column>
              <el-table-column property="classType" label="班次类型" width="150">
                <template slot-scope="scope">
                  {{scope.row['classType'] == 1 ? '早班' :(scope.row['classType'] == 2 ? '晚班':'循环班次')}}
                </template>
              </el-table-column>
              <el-table-column property="lineName" label="线路名称" width="150"></el-table-column>
            </el-table>
          </div>
        </transition>
      </div>
      <el-row class="btn-group" style="display: flex;justify-content: center;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
    <el-dialog title="选择班次" :visible.sync="dialogTableVisible" :append-to-body='isOk'>
      <el-input placeholder="请输入班次名称" class="input-with-select" v-model="searchSchedule" @input="filterSite" style="margin-bottom: 15px;width: 200px;">
        <!--<el-button slot="append" icon="el-icon-search"></el-button>-->
      </el-input>
      <el-table ref="scheduleList" stripe tooltip-effect="dark" :data="showScheduleList" height="250" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <!--<el-table-column property="classId" label="站点ID" width="100"></el-table-column>-->
        <el-table-column property="className" label="班次名称" width="150"></el-table-column>
        <el-table-column property="classType" label="班次类型" width="150">
          <template slot-scope="scope">
            {{scope.row['classType'] == 1 ? '早班' :(scope.row['classType'] == 2 ? '晚班':'循环班次')}}
            <!--<span v-if="item.name !='state'">{{scope.row[item.name]}}</span>-->
            <!--<span v-if="item.name == 'state'"></span>-->
          </template>
        </el-table-column>
        <el-table-column property="lineName" label="线路名称" width="150"></el-table-column>
        <!--<el-table-column property="description" label="站点描述" width="200"></el-table-column>-->
      </el-table>
      <div>
        <el-button type="primary" @click="saveCheckoutSchedule()">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import help from '@/utils/helper.js'
  import request from '@/utils/request.js'
  import api from '@/utils/api.js'
  import enums from '@/utils/enums.js'
  import { addAreaRules } from '@/utils/rules.js'
  import { setTime, Trim } from '../../utils/public'
export default {
  data () {
    return {
      title: '添加区域',
      show: {
        showA: true,
        showB: false
      },
      formRules: addAreaRules,
      areaInfo: {
        areaName: '',
        cityCode: '',
        demandOrzId: '',
        state: 1, //  0-禁用，orderReportForms-启用
        seqNo: '',
        areaClassList: [],
        showAreaClassList: []
      },
      cityList: [],
      compList: [], //  需求侧列表
      searchSchedule: '',
      isOk: true,
      dialogTableVisible: false,
      scheduleList: [], //  所有班次
      showScheduleList: [], //  展示班次
      chooseScheduleList: [], //  选择的班次
      seqNo: '-1', //  要修改的班次顺序
      newSeqNo: '', //  新的顺序
    }
  },
  created () {
    this.init()
    this.showAreaInfo()
  },
  mounted () {
    this.$emit('getInfo', [])
    this.$emit('getTable', [])
  },
  methods: {
    init () {
      request.apiGet(api.city.option).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          let list = data.data.list
          this.cityList = list
          // for (var i = 0; i < list.length; i++) {
          //   this.cityOptions[i] = { cityName: list[i].cityName, cityCode: list[i].cityCode }
          // }
        } else {
          help.E(data.msg.message)
        }
      })
      /* 需求侧列表 */
      request.apiGet(api.comp.optionList).then(data => {
        if (data.msg && data.msg.code === enums.NET_SUCCESS) {
          this.compList = data.data.list
        } else {
          help.E(data.msg.message)
        }
      }).catch(() => {
        help.Echo('网络异常')
      })
    },
    /* 修改回显 */
    showAreaInfo () {
      let id = this.$route.query.id
      if (id) {
        this.action = 1
        // this.line.updateFlag = false
        let params = { areaId: id }
        request.apiGet(api.area.info, params).then(data => {
          if (data.msg.code === enums.NET_SUCCESS) {
            let res = data.data
            this.areaInfo = res
            let params = {
              cityCode: res.cityCode
            }
            request.apiGet(api.schedule.option, params).then(data => {
              if (data.msg.code === enums.NET_SUCCESS) {
                this.scheduleList = data.data.list
                this.showScheduleList = data.data.list
                data.data.list.forEach(item => {
                  res.areaClassList.forEach(val => {
                    if (val.classId == item.classId) {
                      this.chooseScheduleList.push(item)
                    }
                  })
                })
                this.areaInfo.showAreaClassList = this.chooseScheduleList
              } else {
                help.E(data.msg.message)
              }
            })
            // this.changeCity(res.cityCode)
          } else {
            help.E(data.msg.message)
          }
        })
      } else {
        this.line.updateFlag = true
      }
    },
    /* 更换城市，选择的班次要替换 */
    changeCity (val) {
      let params = {
        cityCode: val
      }
      request.apiGet(api.schedule.option, params).then(data => {
        if (data.msg.code === enums.NET_SUCCESS) {
          this.scheduleList = data.data.list
          this.showScheduleList = data.data.list
          this.chooseScheduleList = []
        } else {
          help.E(data.msg.message)
        }
      })
    },
    /* 根据班次名称过滤班次 */
    filterSite () {
      this.showScheduleList = this.scheduleList.filter((item) => {
        return (item.className.indexOf(this.searchSchedule) > -1)
      })
    },
    /* 展开/收起 */
    toggle (arg) {
      this.show[arg] = !this.show[arg]
    },
    /* 勾选班次 */
    handleSelectionChange(val) {
      console.log(val)
      this.chooseScheduleList = val
    },
    /* 保存选择的班次 */
    saveCheckoutSchedule () {
      if (this.areaInfo.showAreaClassList.length !== 0) {
        let str = ''
        this.areaInfo.showAreaClassList.forEach(item => {
          this.chooseScheduleList.forEach(val => {
            if (val.classId === item.classId) {
              str = str + '，' + val.className
            } else { }
          })
        })
        str = str.slice(1)
        if (str !== '') {
          help.E(str + '班次已存在')
        } else {
          this.chooseScheduleList.forEach(item => {
            // item.siteType = type
            item.delState = 0
          })
          this.areaInfo.showAreaClassList = [...this.areaInfo.showAreaClassList, ...this.chooseScheduleList]
          // this.dialogTableVisible = false
        }
      } else {
        // this.chooseScheduleList.forEach(item => {
        //   // item.siteType = type
        // })
        this.areaInfo.showAreaClassList = this.chooseScheduleList
        // this.dialogTableVisible = false
      }
      this.dialogTableVisible = false
    },
    /* 是否显示选择班次蒙层 */
    showDialog() {
      this.dialogTableVisible = true
      if (this.$refs.scheduleList != null) {
        this.$refs.scheduleList.clearSelection()
      }
      this.showScheduleList = this.scheduleList
    },
    /* 移除班次 */
    deleteRow(ind) {
      this.areaInfo.showAreaClassList.splice(ind, 1)
    },
    /* 调整班次的顺序 */
    changeSeqNo (ind) {
      this.seqNo = ind
    },
    /* 保存班次顺序 */
    trueSeqNo (type) {
      if (type == '1') {  //  确认修改
        if (this.newSeqNo == '' || this.newSeqNo == '0') { //  未输入的情况下或输入为0
        } else if (this.newSeqNo >= this.chooseScheduleList.length){ // 输入的值大于最大值
          if (this.seqNo == this.newSeqNo -1) { //  保留原位不移动
          } else {
            let obj = this.chooseScheduleList.splice(this.seqNo,1)
            this.chooseScheduleList.splice(this.newSeqNo - 1, 0, obj[0])
          }
        } else {
          if (this.seqNo == this.newSeqNo -1) { //  保留原位不移动
          } else if (this.seqNo > this.newSeqNo - 1) { // 向前移动
            let obj = this.chooseScheduleList.splice(this.seqNo,1)
            this.chooseScheduleList.splice(this.newSeqNo - 1, 0, obj[0])
          } else if (this.seqNo < this.newSeqNo - 1) { // 向后移动
            let obj = this.chooseScheduleList.splice(this.seqNo,1)
            this.chooseScheduleList.splice(this.newSeqNo - 2, 0, obj[0])
          }
        }
      } else {} //  放弃修改
      this.seqNo = '-1'
    },
    /* 保存数据 */
    save () {
      let areaClassList = []
      this.chooseScheduleList.forEach((item, index) => {
        console.log(item)
        let obj = {
          classId: item.classId,
          seqNo: (index + 1),
          seatMaxCount: item.seatMaxCount
        }
        areaClassList.push(obj)
      })
      let id = this.$route.query.id
      let params = {}
      let url = ''
      params = this.areaInfo
      if (id) {
        params['areaId'] = id
        url = api.area.update
      } else {
        // params = {}
        url = api.area.create
      }
      params.seqNo = parseInt(params.seqNo)
      params.areaClassList = areaClassList
      this.$refs['addArea'].validate(valid => {
        if (valid) {
          request.apiPost(url, params).then(data => {
            debugger
            if (data.msg.code === enums.NET_SUCCESS) {
              help.S('创建成功~')
              // sessionStorage.setItem('lineFlag', 'true')
              this.back()
            } else {
              help.E(data.msg.message)
            }
          })
        } else {
          return false
        }
      })
    },
    /* 返回上一页 */
    back () {
      // sessionStorage.setItem('lineFlag', 'true')
      this.$router.back()
    },
  }
}
</script>

<style scoped>

</style>
