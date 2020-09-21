const NET_SUCCESS = '000000'
const NOT_IN_RANGE = '30164' // 不在有效期内（下单可享活动）
const PAGESIZES = [10, 20, 50, 100]
const DISTRICT = [ // 服务区
  {
    'districtName': '郫都区',
    'districtId': '1'
  }, {
    'districtName': '高新西区',
    'districtId': '2'
  }, {
    'districtName': '高新南区',
    'districtId': '3'
  }
]
const BUSINESSTYPE5 = [
  // {
  //   businessName: '企业班车',
  //   businessId: '5'
  // }
]
const BUSINESSTYPE4 = [
  {
    businessName: '通勤',
    businessId: 1
  }, {
    businessName: '专线',
    businessId: 2
  }
]
const BUSINESSTYPE3 = [
  {
    businessName: '通勤',
    businessId: '1'
  }
]
const BUSINESSTYPE2 = [
  {
    businessName: '通勤',
    businessId: '1'
  }, {
    businessName: '专线',
    businessId: '2'
  }, {
    businessName: '预约包车',
    businessId: '4'
  }
  // {
  //   businessName: '企业班车',
  //   businessId: '5'
  // }, {
  //   businessName: '企业包车',
  //   businessId: '6'
  // }
]
const BUSINESSTYPE1 = [
  {
    businessName: '通勤',
    businessId: '1'
  }, {
    businessName: '专线',
    businessId: '2'
  }
  // {
  //   businessName: '企业班车',
  //   businessId: '5'
  // }
]
const BUSINESSTYPE = [
  {
    businessName: '定制公交',
    businessId: '1'
  }, {
    businessName: '预约包车',
    businessId: '4'
  }
  // {
  //   businessName: '企业班车',
  //   businessId: '5'
  // }, {
  //   businessName: '企业包车',
  //   businessId: '6'
  // }
]
const LINEBUSINESS = [
  {
    businessName: '定制公交',
    businessId: '1'
  }, {
    businessName: '出行专线',
    businessId: '2'
  }
  // {
  //   businessName: '企业班车',
  //   businessId: '5'
  // }
]
const SINGLETEMPLATETYPE = [
  {
    businessName: '定制公交',
    businessId: '1'
  }, {
    businessName: '出行专线',
    businessId: '2'
  }, {
    businessName: '网约拼车',
    businessId: '3'
  }, {
    businessName: '预约包车',
    businessId: '4'
  }
  // {
  //   businessName: '企业班车',
  //   businessId: '5'
  // }, {
  //   businessName: '企业包车',
  //   businessId: '6'
  // }
]
const DRIVERLICENSE = [
  {
    'licenseName': 'A1'
  }, {
    'licenseName': 'A2'
  }, {
    'licenseName': 'A3'
  }, {
    'licenseName': 'B1'
  }, {
    'licenseName': 'B2'
  }, {
    'licenseName': 'B3'
  }, {
    'licenseName': 'C1'
  }, {
    'licenseName': 'C2'
  }, {
    'licenseName': 'C3'
  }
]
const IMAGEACTIVITYTEXTS = '图片比例为500*500px,图片大小不得超过50K，图片格式仅支持png,jpg，gif'
const IMAGEACTIVITYTEXTM = '图片比例为400*400px,图片大小不得超过40K，图片格式仅支持png,jpg，gif'
const IMAGEACTIVITYTEXTL = '图片比例为300*300px,图片大小不得超过30K，图片格式仅支持png,jpg，gif'
const OPERATIONID = {
  select: {
    operationName: '查询',
    operationId: 1
  },
  changeSate: {
    operationName: '状态修改',
    operationId: 2
  },
  export: {
    operationName: '导出',
    operationId: 3
  },
  create: {
    operationName: '添加',
    operationId: 4
  },
  delete: {
    operationName: '删除',
    operationId: 5
  },
  change: {
    operationName: '修改',
    operationId: 6
  },
  refund: {
    operationName: '退款',
    operationId: 7
  },
  detail: {
    operationName: '查看',
    operationId: 8
  },
  import: {
    operationName: '导入',
    operationId: 9
  },
  createCoupon: {
    operationName: '生券',
    operationId: 11
  }
}
const TICKETTYPE = [{ //  票类型
  ticketType: '次票',
  value: '1'
},
  {
    ticketType: '月票',
    value: '2'
  },
  {
    ticketType: '多次票',
    value: '3'
  }
]
const TICKETTYPELIMIT = [ //  购票类型限制
  {
    ticketType: '不限',
    value: '1'
  }, {
    ticketType: '月票',
    value: '2'
  }, {
    ticketType: '次票',
    value: '3'
  }, {
    ticketType: '通票',
    value: '4'
  }
]

export default {
  NET_SUCCESS,
  PAGESIZES,
  BUSINESSTYPE,
  BUSINESSTYPE1,
  BUSINESSTYPE2,
  BUSINESSTYPE3,
  BUSINESSTYPE4,
  BUSINESSTYPE5,
  SINGLETEMPLATETYPE,
  LINEBUSINESS,
  IMAGEACTIVITYTEXTS,
  IMAGEACTIVITYTEXTM,
  IMAGEACTIVITYTEXTL,
  DRIVERLICENSE,
  OPERATIONID,
  NOT_IN_RANGE,
  TICKETTYPE,
  TICKETTYPELIMIT,
  DISTRICT
}
