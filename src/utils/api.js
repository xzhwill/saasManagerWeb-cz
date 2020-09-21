const type = 'line' //  dev：开发/测试   line：线上
// const baseUrlTest = 'http://61.149.7.37:37700/saasManager/' // 17
// const baseUrlTest = 'http://192.168.2.173:9027/saasManager/' // qiu yan
// const baseUrlTest = 'http://47.106.47.152:8080/changzhou/saasManager/' // 开发环境


// const baseUrlTest = 'http://192.168.2.83:19027/saasManager/' // 开发环境 张朋朋
// const baseUrlTest = 'http://192.168.2.42:19027/saasManager/' // 开发环境 周浩君
// const baseUrlTest = 'http://192.168.2.146:19027/saasManager/' // 开发环境 胡升平

// const baseUrlTest = 'http://192.168.2.146:19027/changzhou/saasManager/' // 开发环境
const baseUrlTest = 'http://120.77.112.216:8080/changzhou/saasManager/' // 测试环境
// const baseUrl = type === 'dev' ? baseUrlTest : 'https://changzhou.i-xiaoma.com.cn:1443/saasManager/'
const baseUrl = type === 'dev' ? baseUrlTest : 'https://ibs.czgj.cn:2443/saasManager/'


export default {
  common: { // 公共接口
    shortMsgCode: baseUrl + 'sms/info', // 获取短信验证码接口
    upload: baseUrl + 'image/upload' // 图片上传
  },
  config: { // 公共接口
    login: baseUrl + 'login/login',
    changePwd: baseUrl + 'user/password/update'
  },
  menu: {
    // 菜单权限 管理
    tableList: baseUrl + 'menu/list',
    menuList: baseUrl + 'menu/all/menu/optionList',
    add: baseUrl + 'menu/create',
    update: baseUrl + 'menu/update',
    del: baseUrl + 'menu/delete',
    info: baseUrl + 'menu/info',
    parentList: baseUrl + 'menu/parent/optionList'
  },
  role: { // 角色管理
    tableList: baseUrl + 'role/list',
    add: baseUrl + 'role/create',
    update: baseUrl + 'role/update',
    del: baseUrl + 'role/delete',
    info: baseUrl + 'role/info',
    option: baseUrl + 'role/optionList'
  },
  operate: { // 按钮权限 管理
    tableList: baseUrl + 'operation/list',
    add: baseUrl + 'operation/create',
    update: baseUrl + 'operation/update',
    del: baseUrl + 'operation/delete',
    option: baseUrl + 'operation/optionList',
    info: baseUrl + 'operation/info'
  },
  sysUser: { // 系统用户
    tableList: baseUrl + 'user/list',
    add: baseUrl + 'user/create',
    update: baseUrl + 'user/update',
    del: baseUrl + 'user/delete',
    info: baseUrl + 'user/info',
    option: baseUrl + 'user/option',
    userRe: baseUrl + 'roleRe/userRe/list' // 用户角色绑定
  },
  parameterCity: {
    tableList: baseUrl + 'parameterDemand/list',
    info: baseUrl + 'parameterDemand/info',
    update: baseUrl + 'parameterDemand/update',
    optionList: baseUrl + 'parameterDemand/option/list',
    create: baseUrl + 'parameterDemand/create',
    del: baseUrl + 'parameterDemand/delete',
    createCity: baseUrl + 'parameterDemand/create/parameter'
  },
  city: { // 城市管理
    list: baseUrl + 'city/list',
    option: baseUrl + 'city/optionList', // 获取城市
    info: baseUrl + 'city/info',
    created: baseUrl + 'city/create',
    updated: baseUrl + 'city/update',
    checkCityCode: baseUrl + 'city/checkCityCode',
    checkName: baseUrl + 'city/checkName',
    cityChannelOption: baseUrl + 'city/channel/optionList', //  渠道绑定城市下拉框（channelId必传）
    cityChannelList: baseUrl + 'channelCity/list', //  渠道城市绑定展现
    cityChannelInfo: baseUrl + 'channelCity/info', //  渠道城市绑定回显
    cityChannelUpdated: baseUrl + 'channelCity/update', //  渠道城市绑定更新
    cityChannelForbidden: baseUrl + 'channelCity/forbidden', //  渠道城市绑定禁用
    cityChannelCreate: baseUrl + 'channelCity/create', //    添加渠道城市绑定
    channelCity: baseUrl + 'channelCity/optionList', // 根据城市获取渠道列表
    bannerChannelCity: baseUrl + 'channelCity/uniquenessOptionList' // 票面管理下获取渠道列表
  },
  busType: { // 车型管理
    tableList: baseUrl + 'busType/list',
    create: baseUrl + 'busType/create',
    del: baseUrl + 'busType/delete',
    update: baseUrl + 'busType/update',
    forbidden: baseUrl + 'busType/forbidden',
    busTypeInfo: baseUrl + 'busType/info',
    optionList: baseUrl + 'busType/optionList'
  },
  white: {
    // 白名单管理
    tableList: baseUrl + 'whiteList/list',
    addWhiteList: baseUrl + 'whiteList/create',
    delWhiteList: baseUrl + 'whiteList/delete',
    info: baseUrl + 'whiteList/delete'
  },
  interfaceWhitelist: {
    /* 接口白名单 */
    tableList: baseUrl + 'path/list',
    create: baseUrl + 'path/create',
    info: baseUrl + 'path/info',
    del: baseUrl + 'path/delete',
    update: baseUrl + 'path/update'
  },
  cache: { //  清除缓存
    create: baseUrl + 'cache/create', // 创建
    info: baseUrl + 'cache/info',
    update: baseUrl + 'cache/update',
    tableList: baseUrl + 'cache/list',
    delete: baseUrl + 'cache/delete'
  },
  orgnization: {
    // 机构管理
    list: baseUrl + 'orz/list',
    create: baseUrl + 'orz/create',
    update: baseUrl + 'orz/update',
    info: baseUrl + 'orz/info',
    option: baseUrl + 'orz/optionList',
    demandOption: baseUrl + 'orz/demand/optionList',
    parentOrz: baseUrl + 'orz/superior/optionList',
    forbidden: baseUrl + 'orz/forbidden'
  },
  site: {
    // 站点管理
    list: baseUrl + 'site/list',
    createSite: baseUrl + 'site/create',
    showSite: baseUrl + 'site/optionList',
    export: baseUrl + 'site/export',
    update: baseUrl + 'site/updateId',
    updateSite: baseUrl + 'site/update',
    createOptionList: baseUrl + 'site/createLine/optionList'
  },
  line: { // 线路管理
    lineList: baseUrl + 'line/noticeOptionList', // 获取线路列表
    lineInfoTicket: baseUrl + 'line/ticketOptionList', // 票面管理下线路列表数据
    createLine: baseUrl + 'line/create',
    getLine: baseUrl + 'line/list',
    updated: baseUrl + 'line/update',
    copyLine: baseUrl + 'line/copy',
    lineInfo: baseUrl + 'line/info',
    forbidden: baseUrl + 'line/forbidden',
    optionList: baseUrl + 'line/optionList',
    export: baseUrl + 'line/export',
    exportDetail: baseUrl + 'line/detail/export',
    siteList: baseUrl + 'line/siteList',
    siteOptionList: baseUrl + 'line/site/option/list',
    changeSite: baseUrl + 'lineSite/update',
    deleteLine: baseUrl + 'line/delete',
    show: baseUrl + 'line/show',
    publish: baseUrl + '/line/publish'
  },
  area: {
    // 区管理
    create: baseUrl + 'area/create',
    nopageList: baseUrl + 'area/noPage/list',
    update: baseUrl + 'area/update',
    list: baseUrl + 'area/list',
    option: baseUrl + 'area/optionList',
    delete: baseUrl + 'area/delete',
    forbidden: baseUrl + 'area/forbidden'
  },
  /* WML */
  gatherDayLine: {
    list: baseUrl + 'gatherLine/everyDay/list',
    export: baseUrl + 'gatherLine/everyDay/export'
  },
  gatherClass: {
    list: baseUrl + 'gatherClass/everyDay/list',
    export: baseUrl + 'gatherClass/everyDay/export'
  },
  gatherBus: {
    list: baseUrl + 'gatherBus/everyDay/list',
    export: baseUrl + 'gatherBus/everyDay/export'
  },
  gatherDriver: {
    list: baseUrl + 'gatherDriver/everyDay/list',
    export: baseUrl + 'gatherDriver/everyDay/export'
  },
  gatherSeatLaw: {
    list: baseUrl + 'gatherSeatLaw/everyDay/list',
    export: baseUrl + 'gatherSeatLaw/everyDay/export'
  },
  gatherClassSeatSell: {
    list: baseUrl + 'gatherClassSeatSell/everyDay/list',
    export: baseUrl + 'gatherClassSeatSell/everyDay/export'
  },
  demandCompany: {
    create: baseUrl + 'demandCompany/create',
    info: baseUrl + 'demandCompany/info',
    list: baseUrl + 'demandCompany/list',
    update: baseUrl + 'demandCompany/update',
    option: baseUrl + 'demandCompany/optionList'
  },
  demandUser: {
    create: baseUrl + 'demandSysUser/create',
    info: baseUrl + 'demandSysUser/info',
    list: baseUrl + 'demandSysUser/list',
    update: baseUrl + 'demandSysUser/update',
    option: baseUrl + 'demandSysUser/optionList'
  },
  operationLog: {
    tableList: baseUrl + 'operationLog/list'
  },
  user: {
    // 用户管理
    tableList: baseUrl + 'cust/list',
    export: baseUrl + 'cust/export',
    import: baseUrl + 'cust/import',
    forbidden: baseUrl + 'cust/forbidden',
    updateUser: baseUrl + 'cust/update',
    custgatherList: baseUrl + 'custgather/list', // 个人线路征集列表
    custgatherExport: baseUrl + 'custgather/export', // 个人线路征集列表导出
    companygatherList: baseUrl + 'companygather/list', // 企业线路征集列表
    companygatherExport: baseUrl + 'companygather/export' // 企业线路征集列表导出
  },
  label: {
    create: baseUrl + 'label/create',
    option: baseUrl + 'label/optionList', // 获取所有的标签
    list: baseUrl + 'label/list',
    del: baseUrl + 'label/delete'
  },
  eqp: {
    option: baseUrl + 'eqp/optionList',
    list: baseUrl + 'eqp/list',
    create: baseUrl + 'eqp/create',
    del: baseUrl + 'eqp/delete',
    update: baseUrl + 'eqp/update',
    info: baseUrl + 'eqp/info'
  },
  interfaceEncrypt: { // 接口加密
    tableList: baseUrl + 'apiField/list',
    create: baseUrl + 'apiField/create',
    update: baseUrl + 'apiField/update',
    info: baseUrl + 'apiField/info',
    forbidden: baseUrl + 'apiField/forbidden'
  },
  channel: {
    option: baseUrl + 'channel/optionList',
    list: baseUrl + 'channel/list',
    create: baseUrl + 'channel/create',
    update: baseUrl + 'channel/update',
    info: baseUrl + 'channel/info'
  },
  channelBusiness: {
    option: baseUrl + 'channel/business/option/list',
    list: baseUrl + 'channel/business/list',
    create: baseUrl + 'channel/business/create',
    update: baseUrl + 'channel/business/update',
    info: baseUrl + 'channel/business/info'
  },

  order: {
    tableList: baseUrl + 'order/list',
    export: baseUrl + 'order/export'
  },
  commuteOrder: { // 定制公交行程
    tableList: baseUrl + 'commuteOrder/detail/list',
    export: baseUrl + 'commuteOrder/detail/export',
    list: baseUrl + 'commuteOrder/list',
    refund: baseUrl + 'commuteOrder/refund/create', // 行程退款（所有的行程退款都用这个接口）
    travelList: baseUrl + 'commuteOrder/detail/listNotPage' // 获取行程退款时弹窗中所有的行程信息
  },
  specialOrder: { // 专线行程
    export: baseUrl + 'specialOrder/detail/export'
  },
  carpoolOrder: { // 拼团行程
    tableList: baseUrl + 'carpoolOrder/detail/list',
    export: baseUrl + 'carpoolOrder/detail/export',
    list: baseUrl + 'carpoolOrder/list',
    refund: baseUrl + 'carpoolOrder/refund'
  },
  charterOrder: { // 包车行程
    tableList: baseUrl + 'charterOrder/detail/list',
    export: baseUrl + 'charterOrder/detail/export',
    list: baseUrl + 'charterOrder/list',
    refund: baseUrl + 'charterOrder/refund',
    exportOrder: baseUrl + 'charterOrder/export' // 客服管理：包车订单管理下的导出
  },
  smscode: {
    info: baseUrl + 'smscode/getSmsCodeByPhone'
  },
  employee: {
    tableList: baseUrl + 'employee/list'
  },
  auth: {
    list: baseUrl + 'auth/list',
    create: baseUrl + 'auth/create',
    info: baseUrl + 'auth/info',
    update: baseUrl + 'auth/update'
  },
  /* WQL */
  // 班次管理
  schedule: {
    shiftsList: baseUrl + 'schedule/classNoticeoptionList', // 获取班次列表
    tableList: baseUrl + 'schedule/list',
    add: baseUrl + 'schedule/create',
    update: baseUrl + 'schedule/update',
    forbidden: baseUrl + 'schedule/forbidden',
    info: baseUrl + 'schedule/info',
    export: baseUrl + 'schedule/export',
    notScheduleList: baseUrl + 'schedule/notSchedule',
    exportDetail: baseUrl + 'schedule/detail/export',
    specialSchedule: baseUrl + 'specialSchedule/list',
    specialOption: baseUrl + 'specialSchedule/option/list',
    option: baseUrl + 'schedule/optionList',
    scheduleList: baseUrl + 'schedule/classDiscountOptionList', // 折扣管理下的班次列表
    demandScheduleList: baseUrl + 'schedule/demand/list', // 根据需求侧ID查询班次
    publish: baseUrl + 'schedule/publish',
    normal: baseUrl + 'schedule/normal', // 班次正常
    delete: baseUrl + 'schedule/delete'
  },
  //  供给侧
  supply: {
    optionList: baseUrl + 'orz/optionList',
    superiorOptionList: baseUrl + 'orz/superior/optionList'
  },
  //  需求侧
  comp: {
    optionList: baseUrl + 'commonParameter/comp/option/list'
  },
  /* 核销交易查询 */
  verificationCodeTran: {
    tableList: baseUrl + 'codeTran/list',
    export: baseUrl + 'tran/code/export',
    refund: baseUrl + 'tran/refund'
  },
  /* 开放时间配置 */
  sellTicket: {
    list: baseUrl + 'sellTicket/list',
    option: baseUrl + 'sellTicket/option/list',
    create: baseUrl + 'sellTicket/create'
  },
  /* WQL */
  /* 活动管理 */
  activity: {
    create: baseUrl + 'banner/create',
    list: baseUrl + 'banner/list',
    info: baseUrl + 'banner/info',
    update: baseUrl + 'banner/update',
    forbidden: baseUrl + 'banner/forbidden'
  },
  /* 班次公告 */
  classNotice: {
    tableList: baseUrl + 'notice/list',
    create: baseUrl + 'notice/create',
    update: baseUrl + 'notice/update',
    info: baseUrl + 'notice/info',
    optionList: baseUrl + 'notice/option/list',
    forbidden: baseUrl + 'notice/forbidden',
    del: baseUrl + 'notice/delete'
  },
  /* 折扣管理 */
  discount: {
    list: baseUrl + 'discount/list',
    create: baseUrl + 'discount/create',
    info: baseUrl + 'discount/info',
    update: baseUrl + 'discount/update'
  },
  /* 广播 */
  broadcast: {
    list: baseUrl + 'broadcast/list',
    create: baseUrl + 'broadcast/create',
    forbidden: baseUrl + 'broadcast/forbidden',
    info: baseUrl + 'broadcast/info',
    delete: baseUrl + 'broadcast/delete',
    update: baseUrl + 'broadcast/update'
  },
  /* 用户定制信息 */
  customInfo: {
    list: baseUrl + 'custgather/list',
    export: baseUrl + 'custgather/export'
  },
  /* 用户指南 */
  userGuide: {
    // 用户指南
    tableList: baseUrl + 'guide/list',
    add: baseUrl + 'guide/create',
    update: baseUrl + 'guide/update',
    del: baseUrl + 'guide/delete',
    info: baseUrl + 'guide/info',
    copy: baseUrl + 'guide/copy',
    cityOption: baseUrl + 'guide/cityOptionList', // 获取已存在的城市列表
    channelOptionBycity: baseUrl + 'guide/channelOptionList' // 根据城市获取已存在的渠道列表
  },
  /* 运营人员管理 */
  staff: {
    list: baseUrl + 'staff/list',
    create: baseUrl + 'staff/create',
    info: baseUrl + 'staff/info',
    update: baseUrl + 'staff/update',
    delete: baseUrl + 'staff/delete',
    forbidden: baseUrl + 'staff/forbidden'
  },
  /* 节假日配置 */
  holiday: {
    tableList: baseUrl + 'commonDate/list',
    updated: baseUrl + 'commonDate/update'
  },
  /* 公共参数管理 */
  comnParam: {
    tableList: baseUrl + 'commonParameter/list',
    add: baseUrl + 'commonParameter/create',
    update: baseUrl + 'commonParameter/update',
    del: baseUrl + 'commonParameter/delete',
    info: baseUrl + 'commonParameter/info',
    forbidden: baseUrl + 'commonParameter/forbidden',
    compList: baseUrl + 'commonParameter/optionList' // 需求侧机构列表
  },
  /* 线路征集配置 */
  lineGather: {
    list: baseUrl + 'lineGather/list',
    create: baseUrl + 'lineGather/create',
    info: baseUrl + 'lineGather/info',
    update: baseUrl + 'lineGather/update',
    del: baseUrl + 'lineGather/delete'
  },
  /* 发票管理 */
  invoice: {
    list: baseUrl + 'invoice/conf/list',
    create: baseUrl + 'invoice/conf/create',
    forbidden: baseUrl + 'invoice/conf/forbidden',
    info: baseUrl + 'invoice/conf/info',
    update: baseUrl + 'invoice/conf/update',
    recordList: baseUrl + 'invoice/record/list'
  },
  /* 票面配置 */
  ticketDisplay: {
    list: baseUrl + 'ticketDisplay/list',
    create: baseUrl + 'ticketDisplay/create',
    info: baseUrl + 'ticketDisplay/info',
    forbidden: baseUrl + 'ticketDisplay/forbidden',
    update: baseUrl + 'ticketDisplay/update'
  },
  /* 分销 */
  distribution: {
    list: baseUrl + 'distribution/list',
    create: baseUrl + 'distribution/create',
    update: baseUrl + 'distribution/update',
    forbidden: baseUrl + 'distribution/forbidden',
    info: baseUrl + 'distribution/info',
    recordList: baseUrl + 'distribution/record/list'
  },
  /* 营销单模板 */
  couponSingle: {
    list: baseUrl + 'couponTemplate/list',
    create: baseUrl + 'couponTemplate/create',
    del: baseUrl + 'couponTemplate/delete',
    forbidden: baseUrl + 'couponTemplate/forbidden',
    info: baseUrl + 'couponTemplate/info',
    update: baseUrl + 'couponTemplate/update',
    option: baseUrl + 'couponTemplate/optionList'
  },
  /* 营销组合模板 */
  couponGroup: {
    list: baseUrl + 'groupCouponTemplate/list',
    create: baseUrl + 'groupCouponTemplate/create',
    del: baseUrl + 'groupCouponTemplate/delete',
    forbidden: baseUrl + 'groupCouponTemplate/forbidden',
    info: baseUrl + 'groupCouponTemplate/info',
    update: baseUrl + 'groupCouponTemplate/update',
    option: baseUrl + 'groupCouponTemplate/optionList'
  },
  /* 营销内容活动 */
  contentActivity: {
    list: baseUrl + 'contentActivity/list',
    create: baseUrl + 'contentActivity/create',
    del: baseUrl + 'contentActivity/delete',
    forbidden: baseUrl + 'contentActivity/forbidden',
    info: baseUrl + 'contentActivity/info',
    update: baseUrl + 'contentActivity/update'
  },
  /* 营销内容活动 */
  marketActivity: {
    list: baseUrl + 'activity/list',
    create: baseUrl + 'activity/create',
    option: baseUrl + 'activity/optionList', // 营销活动下拉框查询，包含内容活动
    forbidden: baseUrl + 'activity/forbidden',
    info: baseUrl + 'activity/info',
    createCoupon: baseUrl + 'activity/createCoupon',
    appendCoupon: baseUrl + 'activity/appendCoupon',
    update: baseUrl + 'activity/update',
    sellOut: baseUrl + 'activity/sellOut'
  },
  /* 定向送券 */
  present: {
    list: baseUrl + 'present/list',
    presentCoupon: baseUrl + 'present/presentCoupon'
  },
  /* 需求侧消费记录 */
  demanExpandRecord: {
    list: baseUrl + 'demandRecord/expand/list'
  },
  /* 需求侧充值记录 */
  demanRechargeRecord: {
    list: baseUrl + 'demandRecord/recharge/list'
  },
  /* 活动数据统计 */
  activityStatistics: {
    list: baseUrl + 'activityStatistics/list'
  },
  /* LXP */
  plan: {
    // 排班 管理
    tableList: baseUrl + 'plan/list',
    add: baseUrl + 'plan/create',
    update: baseUrl + 'plan/update',
    del: baseUrl + 'plan/delete',
    info: baseUrl + 'plan/info',
    export: baseUrl + 'plan/day/export',
    listDay: baseUrl + 'plan/dailyList',
    specialExport: baseUrl + 'specialPlan/day/export',
    specialDayList: baseUrl + 'specialPlan/day/list',
    cycle: baseUrl + 'plan/cycle/info',
    cycleUpdate: baseUrl + 'plan/cycle/update'
  },
  driver: {
    // 司机管理
    tableList: baseUrl + 'driver/list',
    addDriver: baseUrl + 'driver/create',
    updateDriver: baseUrl + 'driver/update',
    delDriver: baseUrl + 'driver/delete',
    optionList: baseUrl + 'driver/optionList',
    driverInfo: baseUrl + 'driver/info'
  },
  bus: {
    // 车辆管理
    tableList: baseUrl + 'bus/list',
    addBus: baseUrl + 'bus/create',
    updateBus: baseUrl + 'bus/update',
    del: baseUrl + 'bus/delete',
    optionList: baseUrl + 'bus/optionList',
    busInfo: baseUrl + 'bus/info'
  },
  TicketOpening: {
    // 班次售票时间配置管理
    tableList: baseUrl + 'scheduleSale/list', // 获取列表
    getAllChannel: baseUrl + 'channel/channelCombox', // 获取渠道列表
    ticketDarySet: baseUrl + 'scheduleSale/second/update', // 次票购买时间设置
    ticketMonthSet: baseUrl + 'scheduleSale/month/update' // 月票购买时间设置
  },
  charteredTicket: {
    // 包车计费规则管理
    tableList: baseUrl + 'ticketRule/list',
    add: baseUrl + 'ticketRule/create',
    update: baseUrl + 'ticketRule/update',
    del: baseUrl + 'ticketRule/delete',
    Info: baseUrl + 'ticketRule/info',
    optionList: baseUrl + 'ticketRule/optionList',
    forbidden: baseUrl + 'ticketRule/forbidden'
  },
  refundRule: {
    // 退票规则管理
    create: baseUrl + 'ticketChange/create', // 创建
    info: baseUrl + 'ticketChange/info',
    update: baseUrl + 'ticketChange/update',
    tableList: baseUrl + 'ticketChange/list',
    forbidden: baseUrl + 'ticketChange/forbidden'
  },
  throughTicket: {
    // 通票管理
    create: baseUrl + 'ticketShare/create', // 创建
    info: baseUrl + 'ticketShare/info',
    update: baseUrl + 'ticketShare/update',
    tableList: baseUrl + 'ticketShare/list',
    forbidden: baseUrl + 'ticketShare/forbidden',
    deleteTicket: baseUrl + 'ticketShare/delete'
  },
  charterSupply: {
    // 包车订单管理
    tableList: baseUrl + 'charter/take/list',
    dispatch: baseUrl + 'charter/supply/dispatch',
    assign: baseUrl + 'charter/supply/assign',
    optionList: baseUrl + 'charter/supply/optionList',
    dispatchList: baseUrl + 'charter/dispatch/list'
  },
  carpoolSupply: {
    // 拼车订单管理
    tableList: baseUrl + 'carpool/take/list',
    dispatch: baseUrl + 'carpool/supply/dispatch',
    assign: baseUrl + 'carpool/supply/assign',
    optionList: baseUrl + 'carpool/supply/optionList',
    dispatchList: baseUrl + 'carpool/dispatch/list',
    create: baseUrl + 'carpool/create',
    open: baseUrl + 'carpool/open',
    cancel: baseUrl + 'carpool/cancel',
    list: baseUrl + 'carpool/dispatch/list'
  },
  charteredUpShelf: {
    // 包车商品
    create: baseUrl + 'updates/create', // 创建
    info: baseUrl + 'updates/info',
    update: baseUrl + 'updates/update',
    tableList: baseUrl + 'updates/list',
    forbidden: baseUrl + 'updates/forbidden',
    deleteTicket: baseUrl + 'share/delete',
    busTypeInfo: baseUrl + 'updates/busType/info'
  },
  /* 客服管理：企业班车订单管理 */
  enterprise: {
    tableList: baseUrl + 'regular/list', // 列表
    regularExport: baseUrl + 'regular/list/export' // 企业班车订单导出
  },
  /* 财务报表 */
  report: {
    orderList: baseUrl + 'orderReportForms/list', // 订单报表列表
    orderOutput: baseUrl + 'orderReportForms/export', // 订单报表导出
    travelList: baseUrl + 'travelReportForms/list', // 行程报表列表
    travelOutput: baseUrl + 'travelReportForms/export', // 行程报表导出
    payList: baseUrl + 'payReportForms/list' // 应付报表列表
  },
  /* 班车业务 */
  shuttleBusiness: {
    demandSheet: baseUrl + 'orderDemandRegular/list' // 班车需求单管理列表
  },
  /* 客服管理 */
  customerServiceManage: {
    specialList: baseUrl + 'specialOrder/list', // 专线订单管理 首页列表
    refundList: baseUrl + 'specialOrder/refund/list', // 专线订单行程退款弹窗列表
    specialTableList: baseUrl + 'specialOrder/detail/list', // 专线订单管理 行程退款弹窗列表
    refund: baseUrl + 'specialOrder/travel/refund', // 专线订单管理 退款接口（已替换为定制公交下的行程退款接口）
    shuttleItineraryInquiry: baseUrl + 'regularTravel/list', // 行程查询 - 班车
    travelExport: baseUrl + 'regularTravel/list/export', // 企业班车行程导出
    travelList: baseUrl + 'regularTravel/refundable/list', // 企业班车可退款的行程列表
    isTicketToRide: baseUrl + 'regularTravel/isTicketToRide/enums', // 乘车形式枚举下拉
    orderState: baseUrl + 'regularTravel/orderState/enums', // 订单状态枚举下拉
    payChannelId: baseUrl + 'regularTravel/payChannelId/enums', // 支付渠道枚举下拉
    payState: baseUrl + '/regularTravel/payState/enums' // 支付状态枚举下拉
  },
  /* 运营管理 - 客服电话管理 */
  serviceTelManage: {
    list: baseUrl + 'charterNotice/list', // 列表
    create: baseUrl + 'charterNotice/create', // 新增
    update: baseUrl + 'charterNotice/update', // 修改
    info: baseUrl + 'charterNotice/info' // 修改页初始化
  },
  orderManage: {
    commuteOrderList: baseUrl + 'commuteOrder/commuteOrderList', // 定制公交订单列表
    commuteOrderOut: baseUrl + 'commuteOrder/commuteOrderList/export', // 定制公交订单导出
    orderTravelRefundList: baseUrl + 'commuteTravel/orderTravelRefundList', // 定制公交行程退款列表
    regularOrderList: baseUrl + 'regular/regularOrderList', // 企业班车订单列表
    regularOrderOut: baseUrl + 'regular/regularOrderList/export', // 企业班车订单导出
    commuteTravelDetailList: baseUrl + 'commuteTravel/commuteTravelDetailList', // 定制公交行程明细列表
    commuteTravelDetailOut: baseUrl + 'commuteTravel/commuteTravelDetailList/export', // 定制公交行程明细导出
    regularTravelDetailList: baseUrl + 'regularTravel/regularTravelDetailList', // 企业班车行程明细列表
    regularTravelDetailOut: baseUrl + 'regularTravel/regularTravelDetailList/export', // 企业班车行程明细导出
    commuteIncomeStatisticList: baseUrl + 'commuteIncomeStatisticInfo/commuteIncomeStatisticList', // 定制公交收支统计列表
    commuteIncomeStatisticOut: baseUrl + 'commuteIncomeStatisticInfo/commuteIncomeStatisticList/export', // 定制公交收支统计导出
    regularIncomeStatisticList: baseUrl + 'regularIncomeStatisticInfo/regularIncomeStatisticList', // 企业班车收支统计列表
    regularIncomeStatisticOut: baseUrl + 'regularIncomeStatisticInfo/regularIncomeStatisticList/export', // 企业班车收支统计导出
    charterIncomeStatisticList: baseUrl + 'charterIncomeStatisticInfo/charterIncomeStatisticList', // 包车收支统计列表
    charterIncomeStatisticOut: baseUrl + 'charterIncomeStatisticInfo/charterIncomeStatisticList/export', // 包车收支统计导出
    commuteScheduleStatisticsList: baseUrl + 'commuteScheduleStatistics/commuteScheduleStatisticsList', // 定制公交班次统计列表
    commuteScheduleStatisticsOut: baseUrl + 'commuteScheduleStatistics/commuteScheduleStatisticsList/export', // 定制公交班次统计导出
    regularScheduleStatisticsList: baseUrl + 'regularScheduleStatistics/regularScheduleStatisticsList', // 企业班车班次统计导出
    regularScheduleStatisticsOut: baseUrl + 'regularScheduleStatistics/regularScheduleStatisticsList/export', // 企业班车班次统计导出
    commuteScheduleStatisticsCount: baseUrl + 'commuteScheduleStatistics/commuteScheduleStatisticsCount', // 定制公交班次统计统计数据获取
  },
  smsReminder: {
    create: baseUrl + 'smsReminder/create', // 新增
    delete: baseUrl + 'smsReminder/delete', // 删除
    info: baseUrl + 'smsReminder/info', // 短信提醒回显
    list: baseUrl + 'smsReminder/list', // 列表
    update: baseUrl + 'smsReminder/update' // 编辑
  },
  // 新营销活动
  // 定向发券
  sendCoupon:{
    list:baseUrl+'api/marketing/sendCoupon/list',//定向发券列表查询
    singleSendCoupon:baseUrl+'api/marketing/sendCoupon/singleSendCoupon',//单用户发券
    detail:baseUrl+'api/marketing/sendCoupon/detail',//定向发券详情查询
    batchSendCoupon:baseUrl+'api/marketing/sendCoupon/batchSendCoupon'//批量发券
  },
  // 卡券配置
  couponConfig:{
    create:baseUrl+'api/marketing/couponConfig/create',//新建卡券配置
    forbidden:baseUrl+'api/marketing/couponConfig/forbidden',//启用/禁用卡券配置
    info:baseUrl+'api/marketing/couponConfig/info',//卡券配置明细
    update:baseUrl+'api/marketing/couponConfig/update',//修改卡券配置
    list:baseUrl+'api/marketing/couponConfig/list',//卡券配置列表
    classCouponOptionList:baseUrl+'schedule/classCouponOptionList'//班次选择框（卡券配置）
  },
  // 通用接口
  commonUse:{
    businessType:baseUrl+'api/public/commonUse/businessType',//业务类型
    channelType:baseUrl+'api/public/commonUse/channelType',//渠道查询
    ticketType:baseUrl+'api/public/commonUse/ticketType',//购票类型
    download:baseUrl+'api/marketing/sendCoupon/export',//下载csv模板
    uploading:baseUrl+'api/marketing/sendCoupon/uploading'//上传模板
  },
  // 优惠券礼包
  giftPacksActivity:{
    create:baseUrl+'api/marketing/giftPacksActivity/create',//创建礼包活动
    forbid:baseUrl+'api/marketing/giftPacksActivity/forbid',//禁用礼包活动
    get:baseUrl+'api/marketing/giftPacksActivity/get',//根据no获取礼包活动
    query:baseUrl+'api/marketing/giftPacksActivity/query',//分页查询礼包活动列表
    update:baseUrl+'api/marketing/giftPacksActivity/update'//更新
  },
  // 意见反馈
  feedback:{
    list:baseUrl+'feedback/list',//意见反馈列表
    info:baseUrl+'feedback/info',//意见反馈详情
    update:baseUrl+'feedback/update'//回复意见反馈
  }
}
