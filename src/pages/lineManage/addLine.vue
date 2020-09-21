<template>
  <div class="common-container">
    <el-form enctype="multipart/form-data" label-width="150px" :model="line" :rules="formRules" ref="addLine" label-position="right">
      <div class="form-section" style="margin-bottom: 20px;">
        <i class="el-icon-edit"></i>
        <label>{{ title }}</label>
      </div>
      <el-form-item label="线路号:" prop="lineNo" class="common-form-item">
        <el-input v-model="line.lineNo" placeholder="请输入线路号" @blur="judgeInfo1(line.lineNo, '5')" :maxLength="15"></el-input>
      </el-form-item>
      <el-form-item label="线路名称:" prop="lineName" class="common-form-item">
        <el-input v-model="line.lineName" placeholder="请输入线路名称"></el-input>
      </el-form-item>
      <el-form-item label="线路类型:" prop="businessType" class="common-form-item">
        <el-select v-model="line.businessType" filterable @change="changeBusinessType" :disabled="Boolean(uid) && !copy">
          <el-option v-for="(item, index) in businessTypeList " :key="index" :label="item.businessName" :value="item.businessId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线路性质">
        <el-radio v-model="line.lineProperty" :label="1">固定时间发车</el-radio>
        <el-radio v-model="line.lineProperty" :label="2" v-if="line.businessType !== 1">周期循环发车</el-radio>
      </el-form-item>
      <el-form-item label="发车频率" prop="frequency" v-if="line.lineProperty === 2" class="common-form-item">
        <el-input v-model="line.frequency" placeholder="展示发车频率" type="number"></el-input>分/班
      </el-form-item>
      <el-form-item label="首班发车时间" prop="firstTime" v-if="line.lineProperty === 2" class="common-form-item">
        <el-input v-model="line.firstTime" placeholder="时间格式09:00"></el-input>
      </el-form-item>
      <el-form-item label="末班发车时间" prop="lastTime" v-if="line.lineProperty === 2" class="common-form-item">
        <el-input v-model="line.lastTime" placeholder="时间格式09:00"></el-input>
      </el-form-item>
      <el-form-item label="运营时间" v-if="line.lineProperty === 2" class="common-form-item operate-time">
        <div style="display: flex;flex-direction: column;">
          <div v-for="(item, index) in dateRanges" :key="index" show-overflow-tooltip>
            <div style="display: flex;flex-direction: row;">
              <el-input v-model="item.startTime" placeholder="例:09:00" style="width: 150px;" @blur="judgeEmpty"></el-input>至
              <el-input v-model="item.endTime" placeholder="例:09:00" style="width: 150px;margin-left: 5px;" @blur="judgeEmpty"></el-input>
              <el-button
                plain
                style="margin-left:10px"
                type="warning"
                v-if="index > 0"
                @click.prevent="removeDate(index,'all')"
                icon="el-icon-remove"></el-button>
            </div>
          </div>
          <el-form-item>
            <transition name="slide-fade">
              <span class="el-form-item__error" v-show="!hideTips">请输入运营时间</span>
            </transition>
            <el-button type="primary" plain @click.prevent="addDate('all')" icon="el-icon-circle-plus"></el-button>
          </el-form-item>
        </div>

      </el-form-item>
      <el-form-item label="预计时长" prop="forecastTime" class="common-form-item">
        <el-input
          v-model="line.forecastTime"
          placeholder="预计时长"
          type="number"
          @blur="judgeInfo1(line.forecastTime, '1')"></el-input>分
      </el-form-item>
      <el-form-item label="城市" prop="cityCode" class="common-form-item">
        <el-select v-model="line.cityCode" filterable @change="changeCity" :disabled="Boolean(uid) && !copy">
          <el-option v-for="(item, index) in cityList " :key="index" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展示价格:" prop="displayPriceYuan" class="common-form-item">
        <el-input
          v-model="line.displayPriceYuan"
          placeholder="请输入展示价格"
          type="number"
          @blur="judgeInfo1(line.displayPriceYuan, '2')"></el-input>元
      </el-form-item>
      <el-form-item label="里程数:" class="common-form-item">
        <el-input
          v-model="line.mileageCount"
          placeholder="请输入里程数"
          type="number"
          @blur="judgeInfo1(line.mileageCount, '3')"></el-input>公里
      </el-form-item>
      <el-form-item label="有效期" prop="startTime" class="common-form-item">
        <el-date-picker
          :disabled="Boolean(uid) && !copy"
          v-model="line.startTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="供给侧:" prop="supplyId" class="common-form-item">
        <el-select v-model="line.supplyId" :disabled="Boolean(uid) && !copy">
          <el-option v-for="(item, index) in instructor" :key="index" :label="item.orzName" :value="item.orzId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="需求侧:" prop="demandId" class="common-form-item" v-if="line.businessType === 5 || line.businessType === 6">
        <el-select v-model="line.demandId" :disabled="Boolean(uid) && (line.businessType === 5)">
          <el-option v-for="(item, index) in demandInside" :key="index" :label="item.orzName" :value="item.orzId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择标签:" prop="labels" class="common-form-item">
        <div class="tag-con" v-if="selectedTag.length > 0">
          <draggable v-model="selectedTag">
            <el-tag
              closable
              v-for="(item,index) in selectedTag"
              :key="item.labelId"
              effect="dark"
              style="margin:0 8px;"
              @close="closeTag(index)"
              type="warning">{{ item.labelName}}</el-tag>
          </draggable>
        </div>
        <div>
          <el-button type="primary" @click="tagAllVisible = true">所有标签</el-button>
          <el-button type="primary" @click="newTagVisible = true">添加新标签</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="verification" label="展现形式:">
        <el-radio v-model="line.verification" :label="1">电子票</el-radio>
        <el-radio v-model="line.verification" :label="2">二维码</el-radio>
      </el-form-item>
      <el-form-item label="码类型:" class="common-form-item" style="width: 48%" v-if="line.verification === 2">
        <el-checkbox-group v-model="line.codeTypeList">
          <el-checkbox v-for="(item,index) in cityOptions" :label="index" :key="index">{{item}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="校验位:" class="common-form-item" style="width: 80%" v-if="line.verification === 2">
        <el-checkbox-group v-model="line.actionCodeList">
          <el-checkbox v-for="(item,index) in actionCodeList" :label="index" :key="index">{{item}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="站点:" prop="siteArr" class="common-form-item" style="width: 1020px;">
        <el-button type="primary" @click="showDialog">选择站点</el-button>
        <el-table :data="line.siteArr" stripe border style="margin-top: 15px;width: 881px;" :header-cell-style="getRowClass">
          <el-table-column property="siteNo" width="120" label="站点序号" sortable>
            <template slot-scope="scope">
              <el-input
                v-model="line.siteArr[scope.$index].siteNo"
                placeholder=""
                style="width: 90px;"
                type="number"
                @blur="line.siteArr[scope.$index].siteNo < 0 ? line.siteArr[scope.$index].siteNo = '0' : line.siteArr[scope.$index].siteNo = Math.floor(line.siteArr[scope.$index].siteNo)">
                {{ scope.row.siteNo }}
              </el-input>
            </template>
          </el-table-column>
          <el-table-column property="siteSid" width="80" label="站点ID"></el-table-column>
          <el-table-column property="siteName" width="120" label="站点名称"></el-table-column>
          <el-table-column property="longitude" width="90" label="经度"></el-table-column>
          <el-table-column property="latitude" width="90" label="维度"></el-table-column>
          <el-table-column property="description" width="100" label="站点描述"></el-table-column>
          <el-table-column property="siteType" width="80" label="站点类型">
            <template slot-scope="scope">
              <span v-if="scope.row.siteType === 3">正常点</span>
              <span v-if="scope.row.siteType === 4">途径点</span>
            </template>
          </el-table-column>
          <el-table-column property="delState" width="80" label="是否删除">
            <template slot-scope="scope">
              <span v-if="scope.row.delState === 1">是</span>
              <span v-if="scope.row.delState === 0">否</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">移除</el-button>
              <el-button
                v-if="!+scope.row.delState"
                @click.native.prevent="deleteSite(scope.$index, scope.row)"
                type="text"
                size="small">删除站点</el-button>
              <el-button
                v-else-if="+scope.row.delState === 1"
                @click.native.prevent="deleteSite(scope.$index, scope.row)"
                type="text"
                size="small">恢复站点</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item prop="state" label="线路状态:">
        <el-radio v-model="line.state" :label="parseInt(1)">可用</el-radio>
        <el-radio v-model="line.state" :label="parseInt(0)">禁用</el-radio>
      </el-form-item>
      <el-form-item prop="isHaveBackLine" label="是否有返程:">
        <el-radio v-model="line.isHaveBackLine" :label="parseInt(1)" @change='changeSupplyOrz'>是</el-radio>
        <el-radio v-model="line.isHaveBackLine" :label="parseInt(0)">否</el-radio>
      </el-form-item>
      <el-form-item prop="backLineId" label="选择线路" class="common-form-item" v-if="line.isHaveBackLine==1">
        <el-select v-model="line.backLineId" filterable placeholder="请选择返程线路" style="width:350px">
          <el-option v-for="(item, index) in lineList" :key="index" :label="item.lineName" :value="item.lineId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="description" class="common-form-item" label="备注:">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="200" v-model="line.description" placeholder=""></el-input>
      </el-form-item>
      <el-row class="btn-group" style="margin-left: 100px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="info" @click="back">取消</el-button>
      </el-row>
    </el-form>
    <el-dialog title="添加站点" :visible.sync="dialogTableVisible" :append-to-body='isOk'>
      <el-input
        class="input-with-select"
        v-model="searchSite"
        placeholder="请输入站点名称/站点Id"
        @input="filterSite"
        style="margin-bottom: 15px;"></el-input>
      <el-table ref="siteArr" tooltip-effect="dark" :data="showSiteArr" height="250" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="siteSid" label="站点ID" width="100"></el-table-column>
        <el-table-column property="siteName" label="站点名称" width="150"></el-table-column>
        <el-table-column property="longitude" label="经度" width="150"></el-table-column>
        <el-table-column property="latitude" label="维度" width="150"></el-table-column>
        <el-table-column property="description" label="站点描述" width="200"></el-table-column>
      </el-table>
      <div>
        <el-button type="primary" @click="saveCheckoutSite(3)">正常点</el-button>
        <el-button type="info" @click="saveCheckoutSite(4)">途径点</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择标签" :visible.sync="tagAllVisible">
      <el-tag v-for="(item,index) in labelList" :key="item.labelId" :effect="item.checked ? 'dark':'plain'" style="margin:0 8px;"
              @click="clickTag(index)" type="warning" @close="closeTag(index)">
        {{ item.labelName +'('+item.seq +")"}}
      </el-tag>
      <div>
        <el-button type="primary" @click="chooseTag" style="margin-top:10px;">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加新标签" :visible.sync="newTagVisible" :before-close="handleClose">
      <el-form v-model="newLabel" label-position="right" label-width="120px" ref="addTag">
        <el-form-item label="标签序号">
          <el-input v-model="newLabel.seq" class="input-tag" @blur="judgeInfo1(newLabel.seq, '4')" :maxLength="4"></el-input>
        </el-form-item>
        <el-form-item label="标签名称">
          <el-input v-model="newLabel.labelName" class="input-tag" :maxLength="4"></el-input>
          <div style="maegin-left:10px;color:red;display:inline;">最大为4位</div>
        </el-form-item>
        <el-row class="btn-group">
          <el-button type="primary" @click="saveTag">保存标签</el-button>
        </el-row>
      </el-form>
      <div>
      </div>
    </el-dialog>
    <div id="amapContainer" style="display: none"></div>
  </div>
</template>

<script>
import api from '@/utils/api'
import request from '@/utils/request'
import helper from '@/utils/helper'
import enums from '@/utils/enums'
import draggable from 'vuedraggable'
import { lineRules } from '@/utils/rules'
import { getFormatZero, getFormatZeroBack, checkWord, checkNumCode } from '@/utils/public'

export default {
  name: 'addLine',
  data () {
    return {
      title: '添加线路',
      line: {
        lineId: '', // 线路编号
        lineNo: '', // 线路号
        lineName: '', // 线路名称
        businessType: 1, // 线路类型
        lineProperty: 1, // 线路性质
        frequency: '', // 发车频率
        forecastTime: '', // 预计时长
        cityCode: '', // 城市编码
        displayPriceYuan: '', // 展示价格（前端）
        displayPrice: '', // 展示价格（需要传给后端的）
        mileageCount: '', // 里程数
        startTime: [], // 有效期
        effectiveDate: '', // 生效日期
        expiryDate: '', // 失效日期
        state: 1, // 状态
        description: '', // 线路描述
        siteArr: [],
        deleteSiteList: [], // 删除站点集合
        supplyId: '', // 供给侧ID
        verification: 1, // 核销方式
        codeTypeList: [], // 码类型
        actionCodeList: [],
        updateFlag: true,
        labels: [],
        firstTime: '', // 首班车时间
        lastTime: '', // 晚班车时间
        isHaveBackLine: 0, // 是否有返程：0-否；1-是；
        backLineId: '', // 返回线路的ID
        demandId: '' // 需求侧ID
      },
      cityList: [],
      cityOptions: ['是否支持核销码', '是否支持付款码', '是否支持自发码', '是否支持金码'],
      actionCodeList: ['车辆编号', '线路名称', '线路ID', '班次编号', '最高消费上限', '乘车时间', '业务类型'],
      searchSite: '',
      distance: '',
      instructor: [],
      demandInside: [],
      isOk: true,
      siteArr: [],
      showSiteArr: [],
      checkoutSiteArr: [],
      formRules: lineRules,
      dialogTableVisible: false,
      businessTypeList: enums.BUSINESSTYPE4,
      labs: [],
      lineList: [],
      labelList: [
        {
          labelId: '1',
          labelName: '标签一',
          checked: false
        }, {
          labelId: '2',
          labelName: '标签二',
          checked: false
        }, {
          labelId: '3',
          labelName: '标签三',
          checked: false
        }, {
          labelId: '4',
          labelName: '标签四',
          checked: false
        }, {
          labelId: '5',
          labelName: '标签五',
          checked: false
        }, {
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
      tagAllVisible: false, // 所有标签页面,
      dateRanges: [{ // 运营时间
        startTime: '',
        endTime: ''
      }],
      uid: this.$route.query.id ? this.$route.query.id : '', // 判断是修改还是添加
      copy: this.$route.query.copy ? this.$route.query.copy : false, // 判断是否是复制线路
      hideTips: true // 是否隐藏运营时间的判空提示
    }
  },
  mounted () {
    this.$emit('getInfo', [])
    this.getAllLabel()
    this.showLineInfo() // 初始化获取页面信息
    this.getCity()
  },
  components: { draggable },
  methods: {
    /**
     * 校验输入内容
     * @param val：输入框值
     * @param index：判断输入的类型：预计时长1、展示价格2、里程数3
     */
    judgeInfo1 (val, index) {
      switch (index) {
        case '1':
          if (isNaN(+val) || val < 0) {
            this.line.forecastTime = ''
            return helper.E('请输入正确的时长')
          } else {
            if (+val) this.line.forecastTime = (+val).toFixed()
          }
          break
        case '2':
          if (isNaN(+val) || val < 0) {
            this.line.displayPriceYuan = ''
            return helper.E('请输入正确的价格')
          } else {
            if (+val) this.line.displayPriceYuan = (+val).toFixed(2)
          }
          break
        case '3':
          if (isNaN(+val) || val < 0) {
            this.line.mileageCount = ''
            return helper.E('请输入正确的里程数')
          } else {
            if (+val) this.line.mileageCount = (+val).toFixed(1)
          }
          break
        case '4':
          if (isNaN(+val)) {
            this.newLabel.seq = ''
            return helper.E('请输入正确的标签序号')
          } else {
            if (+val) this.newLabel.seq = (+val).toFixed()
          }
          break
        case '5':
          if (val) {
            if (!checkNumCode(val)) {
              this.line.lineNo = ''
              return helper.E('线路号不可输入中文和空格')
            }
          }
      }
    },
    /**
     * 运营时间判空
     */
    judgeEmpty () {
      let flag = false
      this.dateRanges.forEach((item, index) => {
        if (!item.startTime || !item.endTime) flag = true
      })
      this.hideTips = !flag
    },
    /**
     * 选择标签
     * @param index
     */
    clickTag (index) {
      this.labelList[index].checked = !this.labelList[index].checked
    },
    /**
     * 关闭选中的标签
     * @param index
     */
    closeTag (index) {
      let labelId = this.selectedTag[index].labelId
      this.selectedTag.splice(index, 1)
      this.labelList.forEach((label) => {
        if (label.labelId == labelId) {
          label.checked = false
        }
      })
    },
    /**
     * 确认选择标签
     */
    chooseTag () {
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
        helper.E('最多可选择5个标签')
      } else {
        this.selectedTag = []
        this.selectedTag = tmp
        this.tagAllVisible = false
      }
    },
    /**
     * 保存新建标签
     * @returns {*}
     */
    saveTag () {
      if (!this.newLabel.labelName) return helper.E('请输入标签名称')
      if (!checkWord(this.newLabel.labelName)) return helper.E('标签应为中文或英文')
      if (!this.newLabel.seq) return helper.E('请输入标签序号')
      request.apiPost(api.label.create, this.newLabel).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          helper.S('创建成功~')
          this.getAllLabel()
          this.handleClose()
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 获取所有的标签
     */
    getAllLabel () {
      request.apiGet(api.label.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.labelList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /**
     * 获取城市
     */
    getCity () {
      request.apiGet(api.city.option).then(data => {
        if (data && data.code === enums.NET_SUCCESS) {
          this.cityList = data.data
        } else {
          helper.E(data.msg)
        }
      }).catch(() => {
        helper.Echo('网络异常')
      })
    },
    /**
     * 站点过滤
     */
    filterSite () {
      this.showSiteArr = this.siteArr.filter((item) => {
        return (item.siteName.indexOf(this.searchSite) > -1 || item.siteSid.indexOf(this.searchSite) > -1)
      })
    },
    /**
     * 获取表格背景色
     * @param row
     * @param column
     * @param rowIndex
     * @returns {string}
     */
    getRowClass ({ row, column, rowIndex }) {
      if (!+rowIndex) {
        return 'background:#FAFAFA'
      } else {
        return ''
      }
    },
    /**
     * 获取供给侧
     */
    getOptionList () {
      // if (this.line.updateFlag == false) {
      //   this.line.isHaveBackLine = 0
      //   this.line.backLineId = ''
      // }
      request.apiGet(api.supply.optionList, {
        cityCode: this.line.cityCode,
        orzType: 1
      }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.instructor = data.data
        } else {
          helper.E(data.msg)
        }
      })
      request.apiGet(api.supply.optionList, {
        cityCode: this.line.cityCode,
        orzType: 2
      }).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.demandInside = data.data
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 切换城市
     */
    changeCity () {
      let params = {
        cityCode: this.line.cityCode,
        noPage: 1,
        state: '1'
      }
      this.getOptionList()
      request.apiGet(api.site.showSite, params).then(data => {
        if (data.code === enums.NET_SUCCESS) {
          this.siteArr = data.data
          this.showSiteArr = data.data
        } else {
          helper.E(data.msg)
        }
      })
    },
    /**
     * 改变线路类型
     * @param type
     */
    changeBusinessType (type) {
      if (this.line.businessType === 1) {
        this.line.lineProperty = 1
      }
      this.line.isHaveBackLine = 0
      this.line.backLineId = ''
    },
    /**
     * 切换供给侧
     */
    changeSupplyOrz () {
      let params = {
        cityCode: this.line.cityCode,
        orzId: this.line.supplyId,
        businessType: this.line.businessType,
        isNoRoundAsked: 1,
        curLineId: this.line.backLineId
      }
      if (this.uid) params.ownLineId = this.uid;
      request.apiGet(api.line.optionList, params).then(data => { // 获取线路
        if (data && data.code === enums.NET_SUCCESS) {
          this.lineList = data.data
        }
      })
    },
    /**
     * 点击保存
     */
    save () {
      let flag = false
      if (this.line.lineProperty === 1) {
        this.line.operationTime = ''
        this.line.frequency = ''
      } else {
        var operateTime = '' // 初始化运营时间
        this.dateRanges.forEach((item, index) => {
          if (!item.startTime || !item.endTime) flag = true
          if (!+index) {
            operateTime = item.startTime + '-' + item.endTime
          } else {
            operateTime += ',' + item.startTime + '-' + item.endTime
          }
        })
        this.line.operationTime = operateTime
      }
      if (flag) this.hideTips = false
      this.$refs.addLine.validate(valid => {
        if (valid) {
          if (flag) return
          let siteNoList = []
          var siteNoList2
          for (let i = 0; i < this.line.siteArr.length; i++) {
            let item = this.line.siteArr[i]
            if (item.siteNo) {
              siteNoList.push(Number(item.siteNo))
            } else {
              this.$alert('站点序号不可为空', '保存失败', { confirmButtonText: '确定' })
              return
            }
          }
          siteNoList2 = siteNoList.filter((x, index, self) => {
            self.indexOf(x) === index
          })
          if (new Set(siteNoList).size != siteNoList.length) {
            this.$alert('站点序号不可重复', '保存失败', {
              confirmButtonText: '确定'
            })
            return
          }
          let param = { ...this.line }
          param.mileageCount = parseInt(this.line.mileageCount, 10)
          param.effectiveDate = this.line.startTime[0]
          param.expiryDate = this.line.startTime[1]
          param.displayPrice = Math.round(this.line.displayPriceYuan * 100).toString()
          param.lableId = this.line.labels
          param.backLineId = +this.line.isHaveBackLine === 1 ? this.line.backLineId : ''
          if (this.uid) param.lineId = this.uid
          if (this.copy) delete param.lineId
          if (!this.line.siteArr.length || this.line.siteArr.length < 2) return helper.W('请添加至少两个站点')
          param.siteList = []
          for (let i = 0; i < this.line.siteArr.length; i++) {
            let sar = this.line.siteArr[i]
            !i ? param.startSiteId = sar.siteId : param.endSiteId = sar.siteId
            param.siteList.push({ // 站点列表
              siteNo: parseInt(sar.siteNo + ''),
              longitude: sar.longitude,
              latitude: sar.latitude,
              siteId: sar.siteId,
              siteSid: sar.siteSid,
              lineId: this.line.lineId,
              siteType: sar.siteType,
              delState: sar.delState,
              id: sar.id,
              areaName: sar.areaName,
              description: sar.description,
              siteName: sar.siteName,
              isRemove: sar.isRemove
            })
          }
          if (this.line.codeTypeList) param.codeTypeList = getFormatZero(this.line.codeTypeList, 4)
          if (this.line.actionCodeList) param.actionCodeList = getFormatZero(this.line.actionCodeList, 7)
          if (this.selectedTag.length) param.labelList = this.selectedTag // 标签集合
          let url = this.uid ? api.line.updated : api.line.createLine
          if (this.copy) url = api.line.createLine
          request.apiPost(url, param).then(data => {
            if (data.code === enums.NET_SUCCESS) {
              this.uid ? helper.S(data.msg) : helper.S('创建成功')
              sessionStorage.setItem('lineFlag', 'true')
              this.back()
            } else {
              helper.E(data.msg)
            }
          })
        }
      })
    },
    /**
     * 返回
     */
    back () {
      sessionStorage.setItem('lineFlag', 'true')
      this.$router.back()
    },
    /**
     * 展示弹窗
     */
    showDialog () {
      this.dialogTableVisible = true
      if (this.$refs.siteArr != null) {
        this.$refs.siteArr.clearSelection()
      }
      this.showSiteArr = this.siteArr
    },
    /**
     * 选中站点
     * @param val
     */
    handleSelectionChange (val) {
      this.checkoutSiteArr = val
    },
    /**
     * 点击保存站点
     * @param type
     */
    saveCheckoutSite (type) {
      if (this.line.siteArr.length !== 0) {
        let str = ''
        this.line.siteArr.forEach(item => {
          this.checkoutSiteArr.forEach(val => {
            if (val.siteId === item.siteId) {
              str = str + '，' + val.siteName
            } else {}
          })
        })
        str = str.slice(1)
        if (str !== '') {
          helper.E(str + '站点已存在')
        } else {
          this.checkoutSiteArr.forEach(item => {
            item.siteType = type
            item.delState = 0
          })
          this.line.siteArr = [...this.line.siteArr, ...this.checkoutSiteArr]
          this.dialogTableVisible = false
        }
      } else {
        this.checkoutSiteArr.forEach(item => {
          item.siteType = type
        })
        this.line.siteArr = this.checkoutSiteArr
        this.dialogTableVisible = false
      }
    },
    /**
     * 点击移除
     * @param ind
     * @param item
     */
    deleteRow (ind, item) {
      if (item.id && !this.copy) {
        this.line.deleteSiteList.push(item.siteId)
        this.line.deleteSiteList = Array.from(new Set(this.line.deleteSiteList))
      }
      this.line.siteArr.splice(ind, 1)
    },
    /**
     * 删除、恢复站点
     * @param ind：列表中站点的下标
     * @param item：当前点击的站点的所有信息
     */
    deleteSite (ind, item) {
      item.delState = !+item.delState ? 1 : 0
    },
    /**
     * 初始化获取数据接口
     */
    showLineInfo () {
      if (this.uid) {
        this.title = '修改线路'
        this.line.updateFlag = false
        request.apiGet(api.line.lineInfo, { lineId: this.uid }).then(data => {
          if (data.code === enums.NET_SUCCESS) {
            let res = data.data
            res.isHaveBackLine = res.backLineId ? 1 : 0
            res.siteArr = res.siteList
            this.checkoutSiteArr = res.siteList
            this.line = {
              ...this.line,
              ...res
            }
            this.line.startTime = [res.effectiveDate, res.expiryDate]
            if (res.lineProperty === 1) { // 判断线路性质是否为固定时间发车
              this.dateRanges = [{
                startTime: '',
                endTime: ''
              }]
              this.line.frequency = ''
            } else {
              var dateRanges = []
              res.operationTime.split(',').forEach((item, index) => {
                var arr = item.split('-')
                if (arr.length === 2) {
                  dateRanges.push({
                    startTime: arr[0],
                    endTime: arr[1]
                  })
                }
              })
              this.dateRanges = dateRanges
            }
            if (res.codeTypeList) {
              res.codeTypeList = getFormatZeroBack(res.codeTypeList, 4)
            }
            if (res.actionCodeList) {
              res.actionCodeList = getFormatZeroBack(res.actionCodeList, 7)
            }
            this.changeCity()
            if (res.labelList.length > 0) { // 当有选择的标签时
              this.selectedTag = res.labelList
              this.labelList.forEach((label) => { // 所有标签和返回标签比较
                res.labelList.forEach((item) => { // 反显标签
                  if (label.labelId == item.labelId) {
                    label['checked'] = true
                  }
                })
              })
            }
            if (+res.isHaveBackLine) {
              this.changeSupplyOrz()
            }
          } else {
            helper.E(data.msg)
          }
        })
      } else {
        this.line.updateFlag = true
      }
    },
    /**
     * 添加运营时间
     * @param e
     * @returns {*}
     */
    addDate (e) {
      if (this.dateRanges.length > 5) return helper.E('运营时间最多可添加6个')
      this.dateRanges.push({
        startTime: '',
        endTime: ''
      })
    },
    /**
     * 移除运营时间
     * @param idx
     * @param params
     */
    removeDate (idx, params) {
      if (params === 'all') {
        if (this.dateRanges.length > 1) {
          this.dateRanges.splice(idx, 1)
        } else {
          helper.E('不能再删除了！')
        }
      }
    },
    /**
     * 点击关闭弹窗
     */
    handleClose () {
      this.newTagVisible = false
      this.newLabel.seq = ''
      this.newLabel.labelName = ''
    }
  }
}
</script>

<style scoped lang="less">
  @import "./addLine.less";
</style>
