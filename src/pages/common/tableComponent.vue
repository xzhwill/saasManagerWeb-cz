<template>
  <el-table @selection-change="handleSelectionChange" stripe  header-row-class-name="tableHeader" class="page-table-main" style="margin-bottom: 30px;" :data="tableList" bgatherTicketDay>
    <slot name="header"></slot>
    <el-table-column v-if="tableHeaderCheckList.indexOf(item.label) !== -1" v-for="(item, index) in tableHeader" :key="index" :label="item.label" align="center"
                     :prop="item.name" show-overflow-tooltip>
      <template slot-scope="scope">
        <span v-if="item.name === 'classType'">
          {{ (+scope.row.classType === 1 || scope.row.classType === '早班') ? '早班' : ((+scope.row.classType === 2 || scope.row.classType === '晚班') ? '晚班' : '')}}
        </span>
        <!--模板状态-->
        <span v-else-if="item.name =='templateStatus'">
          {{(scope.row['templateStatus'] == '1')?'草稿':((scope.row['templateStatus'] == '2') ? '上线中': ((scope.row['templateStatus'] == '3') ? '已下线':''))}}
        </span>
        <!--是否允许折上折-->
        <span v-else-if="item.name == 'foldUp'">{{scope.row['foldUp'] == 0 ? '否' : '是'}}</span>
        <!--模板类型-->
        <span v-else-if="item.name == 'templateType'">{{scope.row['templateType'] == 1 ? '单次券' : '多次券'}}</span>
        <!--抵扣类型-->
        <span v-else-if="item.name == 'templateKind'">{{scope.row['templateKind'] == 3 ? '现金抵扣' : '消费折扣'}}</span>
        <!--内容营销活动状态-->
        <span v-else-if="item.name =='activityStatus'">
          {{(scope.row['activityStatus'] == '1')?'待审核':((scope.row['activityStatus'] == '2') ? '待发布': ((scope.row['activityStatus'] == '3') ? '已发布':'已下线'))}}
        </span>
        <!--营销活动生券状态-->
        <span v-else-if="item.name === 'activityType'">
          {{(scope.row.activityType === '1')?'老带新活动':((scope.row['activityType'] == '2') ? '送券活动': ((scope.row['activityType'] == '3') ? '买票送券活动':'新人活动'))}}
        </span>
        <!--活动售罄状态-->
        <span v-else-if="item.name === 'selloutFlag'">{{scope.row['selloutFlag'] == 1 ? '已售罄' : '未售罄'}}</span>
        <!--营销活动类型-->
        <span v-else-if="item.name === 'couponStatus'">
          {{(scope.row.couponStatus === '1')?'未生券':((scope.row['couponStatus'] == '2') ? '生券中': ((scope.row['couponStatus'] == '3') ? '已生券':'生券失败'))}}
        </span>
        <span v-else-if="item.name === 'businessType'">
          <span v-if="scope.row.businessType == '1'">通勤</span>
          <span v-else-if="scope.row.businessType == '2'">专线</span>
          <span v-else-if="scope.row.businessType == '4'">预约包车</span>
          <!--<span v-else-if="scope.row.businessType === '5'">企业班车</span>-->
          <!--<span v-else-if="scope.row.businessType === '6'">企业包车</span>-->
          <!--<span v-else-if="scope.row.businessType === '99' || scope.row.businessType === '0'">不限</span>-->
        </span>
        <!--<span v-else-if="item.name == 'businessType'">{{scope.row['businessType'] == 0 ? '不限制':(scope.row['businessType'] == orderReportForms?"定制公交":"出行专线")}}</span>-->
        <span v-else-if="item.name === 'state'">{{scope.row['state'] == 0 ? '禁用' : '启用'}}</span>
        <span v-else-if="item.name === 'ticketType'">{{scope.row['ticketType'] == 1 ? '次票' : (scope.row['ticketType'] == 2 ? '月票' : '多次票')}}</span>
        <span v-else>{{scope.row[item.name]}}</span>
      </template>
    </el-table-column>
    <slot name="footer"></slot>
  </el-table>
</template>

<script>
export default {
  props: {
    tableHeader: {
      type: Array,
      default: () => []
    },
    tableList: {
      type: Array,
      default: () => []
    },
    tableHeaderCheckList: {
      type: Array,
      default: () => []
    }
  },
  name: 'tableComponent',
  data () {
    return {}
  },
  methods: {
    handleSelectionChange (checkedArr) {
      this.$emit('selectionChange', checkedArr)
    }
  }
}
</script>

<style scoped>

</style>
