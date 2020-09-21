/* eslint-disable indent */
export const sysUserManageHeadSearch = [ // 系统用户
    {
        disabled: false,
        formType: 'input',
        label: '用户名',
        message: '',
        name: 'username',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '姓名',
        message: '',
        name: 'chinesename',
        required: false,
        width: '270px'
    }
]
export const sysUserManageTableHead = [{
    label: '用户名',
    name: 'username'
}, {
    label: '姓名',
    name: 'chinesename'
}, {
    label: '状态',
    name: 'state'
}, {
    label: '最后登录时间',
    name: 'lastLogin'
}, {
    label: '添加时间',
    name: 'createTime'
}, {
    label: '修改时间',
    name: 'updateTime'
}]
export const menuManageHeadSearch = [ // 系统菜单
    {
        disabled: false,
        formType: 'input',
        label: '菜单名称',
        message: '',
        name: 'menuName',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '上级菜单',
        message: '',
        name: 'parentName',
        required: false,
        width: '270px'
    }
]
export const menuManageTableHead = [{
    label: '菜单名称',
    name: 'menuName'
}, {
    label: '上级菜单',
    name: 'parentName'
}, {
    label: '节点排序',
    name: 'seq'
}, {
    label: '接口地址',
    name: 'path'
}, {
    label: '链接地址',
    name: 'link'
}, {
    label: 'icon',
    name: 'icon'
}, {
    label: '状态',
    name: 'state'
}]
export const roleManageHeadSearch = [ // 系统角色
    {
        disabled: false,
        formType: 'input',
        label: '角色名称',
        message: '',
        name: 'roleName',
        required: false,
        width: '270px'
    }
]
export const roleManageTableHead = [{
        label: '角色名称',
        name: 'roleName'
    }, {
        label: '描述',
        name: 'description'
    }, {
        label: '状态',
        name: 'state'
    }]
    /* 站点 */
export const siteHeadSearch = [{
    disabled: false,
    formType: 'input',
    label: '站点名称',
    message: '请输入站点名称',
    name: 'siteName',
    required: false,
    width: '300px'
}, {
    disabled: false,
    formType: 'input',
    label: '站点ID',
    message: '请输入站点ID',
    name: 'siteSid',
    required: false,
    width: '300px'
}, {
    disabled: false,
    formType: 'selectVal',
    label: '状态',
    name: 'state',
    message: '请选择',
    required: false,
    option: [{
        label: '启用',
        value: 1
    }, {
        label: '禁用',
        value: 0
    }]
}, {
    disabled: false,
    formType: 'selectVal',
    label: '城市',
    name: 'cityCode',
    message: '请选择',
    required: false,
    option: []
}]
export const siteTableHead = [{
        label: '站点ID',
        name: 'siteSid'
    }, {
        label: '站点名称',
        name: 'siteName'
    }, {
        label: '站点描述',
        name: 'description'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '经度',
        name: 'longitude'
    }, {
        label: '纬度',
        name: 'latitude'
    }, {
        label: '图片地址',
        name: 'siteImg'
    }, {
        label: '状态',
        name: 'state'
    }]
    /* 城市 */
export const cityTableHead = [{
    label: '城市Id',
    name: 'cityCode'
}, {
    label: '城市名称',
    name: 'cityName'
}, {
    label: '城市拼音',
    name: 'citySpell'
}, {
    label: '城市状态',
    name: 'state'
}, {
    label: '描述',
    name: 'description'
}, {
    label: '创建时间',
    name: 'createTime'
}]
export const cityHeadSearch = [{
    disabled: false,
    formType: 'input',
    label: '城市Id',
    message: '请输入城市Id',
    name: 'cityCode',
    required: false,
    width: '300px'
}, {
    disabled: false,
    formType: 'input',
    label: '城市名称',
    message: '请输入城市名称',
    name: 'cityName',
    required: false,
    width: '300px'
}]
export const busTypeManageTableHead = [{
    label: '车型名称',
    name: 'busTypeName'
}, {
    label: '车型号',
    name: 'busTypeNo'
}, {
    label: '续航里程',
    name: 'mileageCount'
}, {
    label: '标准载客人数',
    name: 'seatCount'
}, {
    label: '最大载客人数',
    name: 'seatMaxCount'
}, {
    label: '车型描述',
    name: 'description'
}, {
    label: '状态',
    name: 'state'
}, {
    label: '添加时间',
    name: 'createTime'
}]
export const busTypeManageHeadSearch = [ // head搜索
    {
        disabled: false,
        formType: 'input',
        label: '车型名称',
        message: '请输入车型名称',
        name: 'busTypeName',
        required: false,
        width: '270px'
    }
]
export const comnParamManageDefaultHeadSearch = [ // 公共参数
    {
        disabled: false,
        formType: 'input',
        label: '参数代码',
        message: '请输入参数代码',
        name: 'code',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '参数描述',
        message: '请输入参数描述',
        name: 'description',
        required: false,
        width: '270px'
    }
]
export const comnParamDefaultTableHead = [{
    label: '业务类型',
    name: 'businessType'
}, {
    label: '参数代码',
    name: 'code'
}, {
    label: '参数内容',
    name: 'defaultValue'
}, {
    label: '描述',
    name: 'description'
}, {
    label: '添加时间',
    name: 'addTime'
}]
export const orderManageHeadSearch1 = [ // 专线订单管理
  {
    disabled: false,
    formType: 'input',
    label: '用户手机号',
    name: 'custPhone',
    required: false,
    width: '200px'
  }, {
    disabled: false,
    formType: 'daterange',
    label: '下单日期',
    message: '',
    data: [],
    name: 'orderTime',
    required: false,
    width: '200px'
  }, {
    disabled: false,
    formType: 'input',
    label: '订单编号',
    name: 'orderId',
    required: false,
    width: '200px'
  }, {
    disabled: false,
    formType: 'input',
    label: '联系电话',
    name: 'phone',
    required: false,
    width: '200px'
  }, {
    disabled: false,
    formType: 'selectVal',
    label: '订单状态',
    name: 'orderState',
    message: '请选择',
    required: false,
    option: [{
      label: '待支付',
      value: 1
    }, {
      label: '已支付',
      value: 2
    }, {
      label: '后台退款',
      value: 4
    }, {
      label: '超时未支付自动取消',
      value: 5
    }, {
      label: '超时未派车自动退款',
      value: 6
    }]
  }, {
    disabled: false,
    formType: 'selectVal',
    label: '支付方式',
    name: 'payChannel',
    message: '请选择',
    required: false,
    option: [{
      label: '微信',
      value: 1
    }, {
      label: '企业账户',
      value: 9
    }]
  }
  // {
  //   disabled: false,
  //   formType: 'selectVal',
  //   label: '渠道',
  //   name: 'channelId',
  //   message: '请选择',
  //   required: false,
  //   option: []
  // }
]
export const orderManageHeadSearch = [ // 订单
    {
        disabled: false,
        formType: 'input',
        label: '用户手机号',
        name: 'phone',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'daterange',
        label: '下单日期',
        message: '',
        data: [],
        name: 'orderTime',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '订单编号',
        name: 'orderId',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '订单状态',
        name: 'orderState',
        message: '请选择',
        required: false,
        option: [{
            label: '待支付',
            value: 1
        }, {
            label: '已支付',
            value: 2
        }, {
            label: '手动取消',
            value: 3
        }, {
            label: '自动取消',
            value: 4
        }]
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '支付方式',
        name: 'payChannel',
        message: '请选择',
        required: false,
        option: [{
            label: '微信',
            value: 2
        }]
    }
    // {
    //   disabled: false,
    //   formType: 'selectVal',
    //   label: '支付状态',
    //   name: 'payState',
    //   message: '请选择',
    //   required: false,
    //   option: [{
    //     label: '等待支付',
    //     value: 1
    //   }, {
    //     label: '支付成功',
    //     value: 2
    //   }, {
    //     label: '用户退款成功',
    //     value: 3
    //   }, {
    //     label: '后台退款',
    //     value: 4
    //   }, {
    //     label: '后台退款成功',
    //     value: 5
    //   }]
    // },
]
export const orderEnterpriseManageHeadSearch = [ // 订单
    {
        disabled: false,
        formType: 'input',
        label: '用户手机号',
        name: 'phone',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '姓名',
        name: 'nickname',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '供给侧',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '需求侧',
        name: 'demandId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '乘车形式',
        name: 'isTicketToRide',
        message: '请选择',
        required: false,
        option: [
            //   {
            //   label: '不购票乘车',
            //   value: 1
            // }, {
            //   label: '购票乘车',
            //   value: 2
            // }
        ]
    }, {
        disabled: false,
        formType: 'daterange',
        label: '下单日期',
        message: '',
        data: [],
        name: 'orderTime',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '订单编号',
        name: 'orderId',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '支付状态',
        name: 'payState',
        message: '请选择',
        required: false,
        option: [{
            label: '等待支付',
            value: 1
        }, {
            label: '支付成功',
            value: 2
        }, {
            label: '用户退款成功',
            value: 3
        }, {
            label: '后台退款',
            value: 4
        }, {
            label: '后台退款成功',
            value: 5
        }]
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '支付方式',
        name: 'payChannel',
        message: '请选择',
        required: false,
        option: [{
            label: '自主账户',
            value: 0
        }, {
            label: '支付宝',
            value: 1
        }, {
            label: '微信',
            value: 2
        }, {
            label: '企业支付',
            value: 9
        }]
    }
]
export const orderManageTableHead = [{
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '供给侧机构',
        name: 'supplyName'
    },
    // {
    //   label: '需求侧机构',
    //   name: 'demandOrzName'
    // },
    {
        label: '用户号',
        name: 'custId'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '班次名称',
        name: 'className'
    }, {
        label: '上车点',
        name: 'upSiteName'
    }, {
        label: '下车点',
        name: 'downSiteName'
    }, {
        label: '订单状态',
        name: 'orderState'
    }, {
        label: '下单时间',
        name: 'orderTime'
    }, {
        label: '支付状态',
        name: 'payState'
    }, {
        label: '支付时间',
        name: 'payTime'
    }, {
        label: '支付方式',
        name: 'payChannel'
    }, {
        label: '订单金额',
        name: 'orderAmtYuan'
    }, {
        label: '支付金额',
        name: 'payAmtYuan'
    }, {
        label: '核销金额',
        name: 'verificationAmtYuan'
    }, {
        label: '已退金额',
        name: 'refundAmtYuan'
    }, {
        label: '外部订单号 ',
        name: 'outOrderNo'
    }, {
        label: '后台取消订单备注 ',
        name: 'cancelRemark'
    }
    // {
    //   label: '客户端 ',
    //   name: 'orderSource'
    // }, {
    //   label: '取消原因',
    //   name: 'refundReason'
    // }, {
    //   label: '里程费 ',
    //   name: 'mileagePriceYuan'
    // }, {
    //   label: '平台服务费 ',
    //   name: 'platformPriceYuan'
    // },
]
export const orderEnterpriseManageTableHead = [{
    label: '订单编号',
    name: 'orderId'
}, {
    label: '城市',
    name: 'cityName'
}, {
    label: '业务类型',
    name: 'businessType'
}, {
    label: '供给侧',
    name: 'supplyName'
}, {
    label: '需求侧',
    name: 'demandName'
}, {
    label: '乘车形式',
    name: 'isTicketToRide'
}, {
    label: '用户号',
    name: 'custId'
}, {
    label: '用户手机号',
    name: 'phone'
}, {
    label: '姓名',
    name: 'nickname'
}, {
    label: '线路号',
    name: 'lineNo'
}, {
    label: '线路名称',
    name: 'lineName'
}, {
    label: '班次名称',
    name: 'className'
}, {
    label: '上车点',
    name: 'upSiteName'
}, {
    label: '下车点',
    name: 'downSiteName'
}, {
    label: '订单状态',
    name: 'orderState'
}, {
    label: '下单时间',
    name: 'orderTime'
}, {
    label: '支付状态',
    name: 'payState'
}, {
    label: '支付时间',
    name: 'payTime'
}, {
    label: '支付方式',
    name: 'payChannel'
}, {
    label: '订单金额',
    name: 'orderAmtYuan'
}, {
    label: '支付金额',
    name: 'payAmtYuan'
}, {
    label: '核销金额',
    name: 'verificationAmtYuan'
}, {
    label: '已退金额',
    name: 'refundAmtYuan'
}, {
    label: '外部订单号 ',
    name: 'outOrderNo'
}, {
    label: '后台取消订单备注 ',
    name: 'refundReason'
}]
export const charterNoticeHeadSearch = [ // 包车业务 - 客服电话管理
    {
        formType: 'input',
        label: '客服电话',
        message: '',
        name: 'servicePhone',
        required: false,
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }
]
export const charterNoticeTableHead = [{
        label: '客服电话',
        name: 'servicePhone'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
      label: '配置类型',
      name: 'typeName'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }]
    /* 操作权限 */
export const operateManageHeadSearch = [ // 系统操作权限
    {
        disabled: false,
        formType: 'input',
        label: '按钮名称',
        message: '',
        name: 'operationName',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
            label: '启用',
            value: '1'
        }, {
            label: '禁用',
            value: '0'
        }]
    }
]
export const operateManageTableHead = [{
            label: '按钮ID',
            name: 'operationId'
        },
        {
            label: '按钮名称',
            name: 'operationName'
        },
        {
            label: '状态',
            name: 'state'
        },
        {
            label: '按钮描述',
            name: 'operationDepict'
        }
    ]
    /* 接口白名单 */
export const interfaceWhitelistSearch = [ // 接口白名单搜索
    {
        disabled: false,
        formType: 'input',
        label: '接口地址',
        message: '请输入接口地址',
        name: 'path',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'select',
        label: '用户状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '启用',
                value: 0
            },
            {
                label: '禁用',
                value: 1
            }
        ]
    }
]
export const interfaceWhitelistTableHead = [{ // 接口白名单列表
            label: '接口地址',
            name: 'path'
        },
        {
            label: '描述',
            name: 'description'
        },
        {
            label: '状态',
            name: 'state'
        }
    ]
    /* 清除缓存 */
export const cacheHeadSearch = [ // 缓存配置
    {
        disabled: false,
        formType: 'input',
        label: 'url',
        message: '',
        name: 'url',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: 'key',
        message: '',
        name: 'cacheKey',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'select',
        label: 'key类型',
        name: 'cacheKeyType',
        message: '请选择',
        required: false,
        option: [{
                label: '普通',
                value: '1'
            },
            {
                label: 'hash',
                value: '2'
            }
        ]
    },
    {
        disabled: false,
        formType: 'select',
        label: '清理对象',
        name: 'db',
        message: '请选择',
        required: false,
        option: [{
                label: '定制公交',
                value: '0'
            },
            {
                label: '专线',
                value: '1'
            },
            {
                label: '订单服务',
                value: '8'
            },
            {
                label: '公共服务',
                value: '3'
            }
        ]
    }
]
export const cacheTableHead = [{ // 缓存配置
        label: '待清理缓存的url',
        name: 'url'
    },
    {
        label: '缓存类型',
        name: 'cacheType'
    },
    {
        label: '清理对象',
        name: 'db'
    },
    {
        label: '缓存key类型',
        name: 'cacheKeyType'
    },
    {
        label: 'key',
        name: 'cacheKey'
    },
    {
        label: 'field',
        name: 'cacheField'
    }
]
export const areaHeadSearch = [{
    disabled: false,
    data: '',
    formType: 'input',
    label: '区域名称',
    message: '请输入区域名称',
    name: 'className',
    required: false,
    width: '270px'
}]
export const areaTableHead = [{
            label: '显示序号',
            name: 'seqNo'
        },
        {
            label: '区域名称',
            name: 'areaName'
        },
        {
            label: '城市',
            name: 'cityName'
        },
        {
            label: '需求侧名称',
            name: 'demandOrzName'
        },
        {
            label: '状态',
            name: 'state'
        },
        {
            label: '更新时间',
            name: 'updateTimeStr'
        },
        {
            label: '添加时间',
            name: 'addTimeStr'
        }
    ]
    // 核销码交易列表查询条件
export const verificationCodeTranHeadSearchHead = [{
            disabled: false,
            formType: 'input',
            label: '外部订单号',
            message: '',
            name: 'outOrderNo',
            required: false,
            width: '200px'
        },
        {
            disabled: false,
            formType: 'input',
            label: '行程编号',
            message: '',
            name: 'travelNo',
            required: false,
            width: '200px'
        },
        {
            disabled: false,
            formType: 'input',
            label: '班次号',
            message: '',
            name: 'scheduleNo',
            required: false,
            width: '200px'
        },
        {
            disabled: false,
            formType: 'input',
            label: '线路号',
            message: '',
            name: 'lineNo',
            required: false,
            width: '200px'
        },
        {
            disabled: false,
            formType: 'input',
            label: '车牌号',
            message: '',
            name: 'carNo',
            required: false,
            width: '200px'
        },
        {
            disabled: false,
            formType: 'select',
            label: '码类型',
            name: 'codeType',
            message: '请选择',
            required: false,
            option: [{
                    label: '支付宝付款码',
                    value: '101'
                },
                {
                    label: '微信付款码',
                    value: '102'
                },
                {
                    label: '云闪付付款码',
                    value: '103'
                },
                {
                    label: '翼支付付款码',
                    value: '104'
                },
                {
                    label: '一网通付款码',
                    value: '105'
                },
                {
                    label: '核销码',
                    value: '210'
                },
                {
                    label: '小码自发码',
                    value: '301'
                }
            ]
        },
        {
            disabled: false,
            formType: 'select',
            label: '业务类型',
            name: 'businessType',
            message: '请选择',
            required: false,
            option: [{
                    label: '定制公交',
                    value: '1'
                },
                {
                    label: '出行专线',
                    value: '2'
                },
                {
                    label: '预约包车',
                    value: '3'
                },
                {
                    label: '拼团',
                    value: '4'
                }
            ]
        }
    ]
    // 核销码交易列表表头内容
export const verificationCodeTranTableHead = [{
        label: '支付渠道',
        name: 'codeType'
    },
    {
        label: '外部订单号',
        name: 'outOrderNo'
    },
    {
        label: '支付金额',
        name: 'payPriceYuan'
    },
    {
        label: '行程编号',
        name: 'travelNo'
    },
    {
        label: '用户编号',
        name: 'userId'
    },
    {
        label: '业务类型',
        name: 'businessType'
    },
    {
        label: '城市',
        name: 'cityName'
    },
    {
        label: '线路号',
        name: 'lineNo'
    },
    {
        label: '班次号',
        name: 'scheduleNo'
    },
    {
        label: '车牌号',
        name: 'carNo'
    },
    {
        label: '司机电话',
        name: 'driverPhone'
    },
    {
        label: '机具订单号',
        name: 'orderNo'
    },
    {
        label: '站点名称',
        name: 'stationName'
    },
    {
        label: '扫码时间',
        name: 'actualTime'
    },
    {
        label: '支付状态',
        name: 'payState'
    },
    {
        label: '退款金额',
        name: 'refundAmtYuan'
    },
    {
        label: '操作人',
        name: 'operator'
    },
    {
        label: '退款时间',
        name: 'refundTime'
    },
    {
        label: '原因',
        name: 'refundReason'
    }
]
export const ticketOpenHeadSearch = [{
        disabled: false,
        formType: 'selectVal',
        label: '生效渠道',
        message: '请选择',
        name: 'channelId',
        required: false,
        option: [],
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '需求侧',
        message: '请选择',
        name: 'demandOrzId',
        required: false,
        option: [],
        width: '200px'
    }
]
export const ticketOpenTableHead = [{
            label: '渠道名称',
            name: 'channelName'
        },
        {
            label: '班次名称',
            name: 'className'
        },
        {
            label: '需求侧名称',
            name: 'demandOrzName'
        },
        {
            label: '下月次票开售日期',
            name: 'nextMonthTicketSellDate'
        },
        {
            label: '次票开放类型',
            name: 'sellType'
        },
        {
            label: '次票提前购买天数',
            name: 'ticketSellDays'
        },
        {
            label: '次票开售时间',
            name: 'ticketSellTime'
        }
    ]
    /* WML */
export const areaListHeadSearch = [ // 区域列表
    {
        disabled: false,
        formType: 'input',
        label: '区域名称',
        message: '',
        name: 'areaName',
        required: false,
        width: '200px'
    }
]
export const areaListTableHead = [{
        label: '城市',
        name: 'cityName'
    },
    {
        label: '区域名称',
        name: 'areaName'
    },
    {
        label: '区域状态',
        name: 'state'
    },
    {
        label: '是否热门',
        name: 'isHot'
    },
    {
        label: '新增时间',
        name: 'createTime'
    }
]
export const gatherClassHeadSearch = [ // 每日班次汇总
    {
        disabled: false,
        formType: 'selectVal',
        label: '选择城市',
        message: '请选择',
        name: 'cityCode',
        required: false,
        option: [],
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '业务类型',
        message: '请选择',
        name: 'businessType',
        required: false,
        width: '300px',
        option: []
    },
    {
        disabled: false,
        formType: 'input',
        label: '线路号',
        message: '',
        name: 'lineNo',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '线路名称',
        message: '',
        name: 'lineName',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '班次名称',
        message: '',
        name: 'className',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'daterange',
        label: '日期',
        name: 'orderTime',
        required: false
    }
]
export const gatherClassTableHead = [{
        label: '城市',
        name: 'cityName'
    },
    {
        label: '业务类型',
        name: 'businessType'
    },
    {
        label: '供给侧',
        name: 'supplyName'
    },
    {
        label: '班次名称',
        name: 'className'
    },
    {
        label: '线路名称',
        name: 'lineName'
    },
    {
        label: '线路号',
        name: 'lineNo'
    },
    {
        label: '收入',
        name: 'income'
    },
    {
        label: '标准座位数量',
        name: 'seatCount'
    },
    {
        label: '最大座位数',
        name: 'seatMaxCount'
    },
    {
        label: '行程数',
        name: 'travelNum'
    },
    {
        label: '日期',
        name: 'gatherDate'
    }
]
export const gatherDayLineHeadSearch = [ // 每日线路汇总
    {
        disabled: false,
        formType: 'selectVal',
        label: '选择城市',
        message: '请选择',
        name: 'cityCode',
        required: false,
        option: [],
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '业务类型',
        message: '请选择',
        name: 'businessType',
        required: false,
        width: '300px',
        option: []
    }, {
        disabled: false,
        formType: 'input',
        label: '线路号',
        message: '',
        name: 'lineNo',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '线路名称',
        message: '',
        name: 'lineName',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '班次名称',
        message: '',
        name: 'className',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'daterange',
        label: '日期',
        name: 'orderTime',
        required: false
    }
]
export const gatherDayLineTableHead = [ // 每日线路统计
    {
        label: '城市',
        name: 'cityName'
    }, {
        label: '业务类型',
        name: 'businessType'
    }, {
        label: '供给侧',
        name: 'supplyName'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '班次名称',
        name: 'className'
    }, {
        label: '收入',
        name: 'income'
    }, {
        label: '标准座位数量',
        name: 'seatCount'
    }, {
        label: '最大座位数',
        name: 'seatMaxCount'
    }, {
        label: '行程数',
        name: 'travelNum'
    }, {
        label: '日期',
        name: 'gatherDate'
    }
]
export const demandUserHeadSearch = [ // 需求侧企业用户
    {
        disabled: false,
        formType: 'input',
        label: '用户名',
        message: '',
        name: 'username',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '企业名称',
        message: '',
        name: 'demandName',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        message: '请选择',
        name: 'state',
        required: false,
        option: [{
                label: '禁用',
                value: 0
            },
            {
                label: '启用',
                value: 1
            }
        ],
        width: '200px'
    }
]
export const demandUserTableHead = [ // 机构
    {
        label: '企业名称',
        name: 'demandName'
    },
    {
        label: '用户名',
        name: 'username'
    },
    {
        label: '姓名',
        name: 'chinesename'
    },
    {
        label: '手机号',
        name: 'phone'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: '添加时间',
        name: 'createTime'
    }
]
export const demandCompanyHeadSearch = [ // 需求侧企业
    {
        disabled: false,
        formType: 'input',
        label: '企业ID',
        message: '',
        name: 'demandId',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '企业名称',
        message: '',
        name: 'demandName',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        message: '请选择',
        name: 'status',
        required: false,
        option: [{
                label: '禁用',
                value: 0
            },
            {
                label: '启用',
                value: 1
            }
        ],
        width: '200px'
    }
]
export const demandCompanyTableHead = [ // 机构
    {
        label: '城市',
        name: 'cityName'
    },
    {
        label: '企业ID',
        name: 'demandId'
    },
    {
        label: '企业名称',
        name: 'demandName'
    },
    {
        label: '企业简称',
        name: 'shortName'
    },
    {
        label: '企业英文简称',
        name: 'shortNameEng'
    },
    {
        label: '企业规模',
        name: 'scale'
    },
    {
        label: '企业地址',
        name: 'demandAddr'
    },
    {
        label: '行业',
        name: 'industry'
    },
    {
        label: '联系人',
        name: 'contactName'
    },
    {
        label: '联系人电话',
        name: 'contactPhone'
    },
    {
        label: '联系人邮箱',
        name: 'contactMail'
    },
    {
        label: '状态',
        name: 'status'
    },
    {
        label: '添加时间',
        name: 'createTime'
    }
]
export const charterOrderHeadSearch = [ // 预约包车行程查询
    {
        disabled: false,
        formType: 'input',
        label: '订单号',
        message: '',
        name: 'orderId',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '手机号',
        message: '',
        name: 'phone',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '预约包车类型',
        message: '请选择',
        name: 'state',
        required: false,
        option: [{
            label: '单程',
            value: 1
        }, {
            label: '全天',
            value: 2
        }, {
            label: '往返',
            value: 3
        }, {
            label: '半天',
            value: 4
        }],
        width: '200px'
    }, {
        disabled: false,
        formType: 'daterange',
        label: '乘坐日期',
        name: 'orderTime',
        required: false
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '选择城市',
        message: '请选择',
        name: 'cityCode',
        required: false,
        option: [],
        width: '200px'
    }
]
export const charterOrderTableHead = [{
        label: '城市',
        name: 'cityName'
    }, {
        label: '订单编号',
        name: 'orderId'
    },
    {
        label: '用户号',
        name: 'userId'
    },
    {
        label: '手机号',
        name: 'phone'
    },
    {
        label: '乘坐日期',
        name: 'rideDate'
    },
    {
        label: '预约包车类型',
        name: 'travelType'
    },
    {
        label: '状态',
        name: 'completeState'
    },
    {
        label: '新增时间',
        name: 'createTime'
    }
]
export const operateLogHeadSearch = [ // 操作日志查询
    {
        disabled: false,
        formType: 'input',
        label: '操作人',
        message: '请输入操作人',
        name: 'oper',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '操作类名称',
        message: '请输入操作类名称',
        name: 'className',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '操作方法',
        message: '请输入操作方法',
        name: 'methodName',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        formType: 'select',
        label: '请求方式',
        message: '请选择',
        name: 'requestMethod',
        required: false,
        option: [{
            label: 'GET',
            value: 1
        }, {
            label: 'POST',
            value: 2
        }],
        width: '200px'
    }, {
        disabled: false,
        formType: 'daterange',
        label: '添加时间',
        name: 'addTime',
        required: false,
        width: '300px'
    }
]
export const operateLogTableHead = [ // 后台操作日志
    {
        label: '操作人',
        name: 'oper'
    }, {
        label: '操作类名称',
        name: 'className'
    }, {
        label: '操作方法名',
        name: 'methodName'
    }, {
        label: '请求方式',
        name: 'requestMethod'
    }, {
        label: '请求参数',
        name: 'params'
    }, {
        label: '请求页面url',
        name: 'requestPageUrl'
    }, {
        label: '创建时间',
        name: 'createTime'
    }
]
export const commuteOrderHeadSearch = [ // 行程查询 - 定制公交
    {
        disabled: false,
        formType: 'input',
        label: '订单号',
        message: '',
        name: 'orderId',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '手机号',
        message: '',
        name: 'phone',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '班次名称',
        message: '',
        name: 'className',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        message: '请选择',
        name: 'state',
        required: false,
        option: [{
            label: '无效',
            value: 0
        }, {
            label: '有效',
            value: 1
        }, {
            label: '预定',
            value: 2
        }, {
            label: '改签',
            value: 3
        }, {
            label: '退款',
            value: 4
        }],
        width: '200px'
    }, {
        disabled: false,
        formType: 'daterange',
        label: '乘坐日期',
        name: 'orderTime',
        required: false
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '选择城市',
        message: '请选择',
        name: 'cityCode',
        required: false,
        option: [],
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '是否验票',
        message: '请选择',
        name: 'checkTicketState',
        required: false,
        option: [{
            label: '未验票',
            value: 0
        }, {
            label: '已验票',
            value: 1
        }],
        width: '200px'
    }
]
export const commuteOrderTableHead = [ // 行程查询 - 定制公交
    {
        label: '城市',
        name: 'cityName'
    }, {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '用户号',
        name: 'userId'
    }, {
        label: '手机号',
        name: 'phone'
    }, {
        label: '班次号',
        name: 'scheduleId'
    }, {
        label: '班次名称',
        name: 'className'
    }, {
        label: '乘坐日期',
        name: 'rideDate'
    }, {
        label: '行程人数',
        name: 'travelNum'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '是否验票',
        name: 'checkTicketState'
    }, {
        label: '是否核销',
        name: 'verification'
    }
]
export const busHeadSearch = [ // 行程查询 - 班车
    {
        disabled: false,
        formType: 'input',
        label: '订单号',
        data: '',
        message: '',
        name: 'orderId',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '需求侧',
        message: '请选择',
        name: 'demandId',
        required: false,
        option: [],
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '姓名',
        message: '',
        name: 'nickname',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '手机号',
        message: '',
        name: 'phone',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '线路号',
        message: '',
        name: 'lineNo',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '线路名称',
        message: '',
        name: 'lineName',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '班次名称',
        message: '',
        name: 'className',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'input',
        label: '备注',
        message: '',
        name: 'cancelRemark',
        required: false,
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '是否核销',
        message: '请选择',
        name: 'verification',
        required: false,
        option: [{
            label: '未核销',
            value: 0
        }, {
            label: '已核销',
            value: 1
        }],
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '是否验票',
        message: '请选择',
        name: 'checkTicketState',
        required: false,
        option: [{
            label: '未验票',
            value: 0
        }, {
            label: '已验票',
            value: 1
        }],
        width: '200px'
    }, {
        disabled: false,
        formType: 'daterange',
        label: '下单时间',
        name: 'newOrderTime',
        required: false
    }, {
        disabled: false,
        formType: 'daterange',
        label: '支付时间',
        name: 'payTime',
        required: false
    }
]
export const busTableHead = [ // 行程查询 - 班车
    {
        label: '城市',
        name: 'cityName'
    }, {
        label: '需求侧',
        name: 'demandName'
    }, {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '用户号',
        name: 'userId'
    }, {
        label: '姓名',
        name: 'nickname'
    }, {
        label: '手机号',
        name: 'phone'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '班次号',
        name: 'scheduleId'
    }, {
        label: '班次名称',
        name: 'className'
    }, {
        label: '备注',
        name: 'cancelRemark'
    }, {
        label: '乘坐日期',
        name: 'rideDate'
    }, {
        label: '行程人数',
        name: 'travelNum'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '是否验票',
        name: 'checkTicketState'
    }, {
        label: '是否核销',
        name: 'verification'
    }, {
        label: '下单时间',
        name: 'orderTime'
    }, {
        label: '扫码时间',
        name: 'showTicketTime'
    }
]
export const userManageHeadSearch = [ // head搜索
    {
        disabled: false,
        formType: 'input',
        label: '用户号',
        name: 'custId',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        formType: 'input',
        label: '手机号',
        name: 'phone',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }]
    }, {
        disabled: false,
        formType: 'daterange',
        label: '注册时间',
        name: 'registerTime',
        required: false
    }
]
export const userManageTableHead = [{
    label: '城市名称',
    name: 'cityName'
}, {
    label: '用户号',
    name: 'custId'
}, {
    label: '昵称',
    name: 'nickname'
}, {
    label: '手机号',
    name: 'phone'
}, {
    label: '需求侧用车角色',
    name: 'demandRoleName'
}, {
    label: '需求侧机构',
    name: 'demandName'
}, {
    label: '状态',
    name: 'state'
}, {
    label: '注册时间',
    name: 'registerTime'
}, {
    label: '更新时间',
    name: 'updateTime'
}, {
    label: '最后登录的客户渠道',
    name: 'lastLoginChannelName'
}]
export const eqpHeadSearch = [ // 车辆
    {
        disabled: false,
        formType: 'selectVal',
        label: '机构',
        name: 'orzId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'input',
        label: '设备号',
        data: '',
        message: '请输入设备号',
        name: 'eqpNo',
        required: false,
        width: '270px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '绑定状态',
        data: '',
        name: 'bindState',
        message: '请选择',
        required: false,
        option: [{
                label: '未绑定',
                value: '1'
            },
            {
                label: '已绑定',
                value: '2'
            }
        ]
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        data: '',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '启用',
                value: 1
            },
            {
                label: '禁用',
                value: 0
            }
        ]
    }
]
export const eqpTableHead = [ // 设备
    {
        label: '所属机构',
        name: 'orzName'
    },
    {
        label: '设备号',
        name: 'eqpNo'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: '设备品牌',
        name: 'eqpBrand'
    },
    {
        label: '设备型号',
        name: 'eqpModel'
    },
    {
        label: '版本',
        name: 'eqpVersion'
    },
    {
        label: '绑定状态',
        name: 'bindState'
    },
    {
        label: '创建时间',
        name: 'createTime'
    }
]
export const busManageHeadSearch = [ // 车辆管理
    {
        disabled: false,
        formType: 'input',
        label: '车辆编号',
        message: '请输入车辆编号',
        data: '',
        name: 'busNo',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '机构',
        name: 'orzId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'input',
        label: '车牌号',
        data: '',
        message: '请输入车牌号',
        name: 'busNumber',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '车辆状态',
        data: '',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }]
    },
    //  {
    //     disabled: false,
    //     formType: 'input',
    //     label: '设备号',
    //     data: '',
    //     message: '请输入设备号',
    //     name: 'eqpNo',
    //     required: false,
    //     width: '270px'
    // }
]
export const busManageTableHead = [ // 车辆
    {
        label: '车辆编号',
        name: 'busNo'
    },
    {
        label: '车牌号',
        name: 'busNumber'
    },
    {
        label: '车型',
        name: 'busTypeName'
    },
    {
        label: '出厂编号',
        name: 'engineNumber'
    },
    // {
    //     label: '设备号',
    //     name: 'eqpNo'
    // },
    {
        label: '车辆描述',
        name: 'remark'
    },
    {
        label: '车辆状态',
        name: 'state'
    },
    {
        label: '所属机构',
        name: 'orzName'
    },
    {
        label: '创建时间',
        name: 'createTime'
    }
]
export const driverManageHeadSearch = [ // 司机
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '司机编号',
        message: '请输入编号',
        name: 'driverNo',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '司机姓名',
        message: '请输入姓名',
        name: 'driverName',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '手机号',
        message: '请输入手机号',
        name: 'phone',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '禁用',
                value: 0
            },
            {
                label: '启用',
                value: 1
            }
        ]
    }
]
export const driverManageTableHead = [{
        label: '城市',
        name: 'cityName'
    }, {
        label: '所属机构',
        name: 'orzName'
    },
    {
        label: '司机编号',
        name: 'driverNo'
    },
    {
        label: '司机姓名',
        name: 'driverName'
    },
    {
        label: '手机号',
        name: 'phone'
    },
    {
        label: '身份证',
        name: 'idCardNo'
    },
    {
        label: '性别',
        name: 'sex'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: '驾照等级',
        name: 'driverLicense'
    },
    {
        label: '创建时间',
        name: 'createTime'
    }
]
export const cityChannelHeadSearch = [ // 城市渠道配置
    {
        disabled: false,
        formType: 'selectVal',
        label: '渠道',
        name: 'channelId',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '城市',
        message: '请选择',
        name: 'cityCode',
        required: false,
        width: '300px',
        option: []
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '业务类型',
        message: '请选择',
        name: 'businessType',
        required: false,
        width: '300px',
        option: []
    }
]
export const cityChannelTableHead = [{
        label: '渠道ID',
        name: 'channelId'
    }, {
        label: '渠道',
        name: 'channelName'
    },
    {
        label: '城市编码',
        name: 'cityCode'
    },
    {
        label: '城市',
        name: 'cityName'
    },
    {
        label: '需求侧机构',
        name: 'demandName'
    },
    {
        label: '业务类型',
        name: 'businessTypeListShow'
    },
    {
        label: '默认城市',
        name: 'defaultCity'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: '添加时间',
        name: 'createTime'
    }
]
export const authorizeConfHeadSearch = [ // 授权
    {
        disabled: false,
        formType: 'selectVal',
        label: '渠道',
        name: 'channelId',
        message: '请选择',
        required: false,
        option: []
    }
]
export const authorizeConfTableHead = [ //
    {
        label: '渠道',
        name: 'channelName'
    },
    {
        label: 'appId',
        name: 'appId'
    },
    {
        label: '支付宝公钥',
        name: 'alipayPublicKey'
    },
    {
        label: '支付宝私钥',
        name: 'alipayPrivateKey'
    },
    {
        label: '微信Secret',
        name: 'wxSecret'
    },
    {
        label: '创建时间',
        name: 'createTime'
    }
]
export const channelManageHeadSearch = [ // 渠道
    {
        disabled: false,
        formType: 'input',
        label: '渠道ID',
        message: '请输入渠道ID',
        name: 'channelId',
        required: false,
        width: '270px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '渠道名称',
        message: '请输入参数描述',
        name: 'channelName',
        required: false,
        width: '270px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '启用',
                value: 1
            },
            {
                label: '禁用',
                value: 0
            }
        ]
    }
]
export const channelManageTableHead = [{
        label: '渠道ID',
        name: 'channelId'
    },
    {
        label: '渠道名称',
        name: 'channelName'
    },
    {
        label: '短信签名',
        name: 'smsSignName'
    },
    {
        label: '短信模板Id',
        name: 'smsTemplateId'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: '描述',
        name: 'description'
    },
    {
        label: '添加时间',
        name: 'createTime'
    }
]
export const interfaceEncryptHeadSearch = [ // 公共参数
    {
        disabled: false,
        formType: 'selectVal',
        label: '渠道',
        name: 'channelId',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'input',
        label: 'URL',
        message: '请输入URL',
        name: 'servletPath',
        required: false,
        width: '270px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '启用',
                value: '1'
            },
            {
                label: '禁用',
                value: '0'
            }
        ]
    }
]
export const interfaceEncryptTableHead = [{
        label: '渠道',
        name: 'channelName'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: 'URL',
        name: 'servletPath'
    },
    {
        label: '加密字段',
        name: 'secretFields'
    },
    {
        label: '更新时间',
        name: 'updateTime'
    }
]
export const channelTableHead = [ // 渠道
    {
        label: '渠道Id',
        name: 'channelId'
    },
    {
        label: '渠道名称',
        name: 'channelName'
    },
    {
        label: '短信签名',
        name: 'smsSignName'
    },
    {
        label: '短信模板ID',
        name: 'smsTemplateId'
    },
    {
        label: '渠道身份认证公钥',
        name: 'channelPublicKey'
    },
    {
        label: '渠道身份认证私钥',
        name: 'channelPrivateKey'
    },
    {
        label: '盐值',
        name: 'saltValue'
    },
    {
        label: '加密类型',
        name: 'encryptType'
    },
    {
        label: '状态',
        name: 'state'
    }
]
export const channelHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '渠道Id',
        message: '请输入渠道Id',
        name: 'channelId',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '渠道名称',
        message: '请输入渠道名称',
        name: 'channelName',
        required: false,
        width: '300px'
    }
]
export const clearChacheTableHead = [ // 缓存配置
    {
        label: '待清理缓存的url',
        name: 'url'
    },
    {
        label: '缓存类型',
        name: 'cacheType'
    },
    {
        label: '清理对象',
        name: 'db'
    },
    {
        label: '缓存key类型',
        name: 'cacheKeyType'
    },
    {
        label: 'key',
        name: 'cacheKey'
    },
    {
        label: 'field',
        name: 'cacheField'
    }
]
export const clearChacheHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: 'key',
        message: '请输入key',
        name: 'cacheKey',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: 'key类型',
        name: 'cacheKeyType',
        message: '请选择',
        required: false,
        option: [{
                label: '普通',
                value: '1'
            },
            {
                label: 'hash',
                value: '2'
            }
        ]
    },
    {
        disabled: false,
        formType: 'input',
        label: 'url',
        message: '请输入url',
        name: 'url',
        required: false,
        width: '300px'
    }
]
export const channelBusinessTableHead = [ // 渠道
    {
        label: '渠道名称',
        name: 'channelName'
    },
    {
        label: '城市',
        name: 'cityName'
    },
    {
        label: '需求侧机构',
        name: 'name'
    },
    {
        label: '是否默认城市',
        name: 'defaultCity'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: '更新时间',
        name: 'updateTime'
    }
]
export const channelBusinessHeadSearch = [ // 渠道需求侧
    {
        disabled: false,
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '渠道',
        name: 'channelId',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '需求侧',
        name: 'demandOrzId',
        message: '请选择',
        required: false,
        option: []
    }
]
export const employeeTableHead = [ // 企业员工
    {
        label: '员工姓名',
        name: 'employeeName'
    },
    {
        label: '工号',
        name: 'employeeNo'
    },
    {
        label: '手机号',
        name: 'phone'
    },
    {
        label: '需求侧机构',
        name: 'demandOrzName'
    },
    {
        label: '状态',
        name: 'status'
    },
    {
        label: '登录名',
        name: 'loginName'
    },
    {
        label: '地址',
        name: 'address'
    },
    {
        label: '地址坐标',
        name: 'location'
    },
    {
        label: '更新时间',
        name: 'updateTime'
    }
]
export const employeeHeadSearch = [ // 企业员工
    {
        disabled: false,
        formType: 'input',
        label: '员工姓名',
        message: '请输入员工姓名',
        name: 'employeeName',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '电话',
        message: '请输入电话',
        name: 'phone',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '工号',
        message: '工号',
        name: 'employeeNo',
        required: false,
        width: '300px'
    }
]
export const orgnizationHeadSearch = [ // 白名单
    {
        disabled: false,
        formType: 'input',
        label: '机构号',
        message: '',
        name: 'orzId',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '机构名称',
        message: '',
        name: 'orzName',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '类型',
        message: '请选择',
        name: 'orzType',
        required: false,
        option: [{
                label: '供给侧',
                value: '1'
            },
            {
                label: '需求侧',
                value: '2'
            }
        ],
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        message: '请选择',
        name: 'state',
        required: false,
        option: [{
                label: '禁用',
                value: 0
            },
            {
                label: '启用',
                value: 1
            }
        ],
        width: '200px'
    }
]
export const orgnizationTableHead = [ // 机构
        {
            label: '机构类型',
            name: 'orzType'
        },
        {
            label: '机构号',
            name: 'orzId'
        },
        {
            label: '机构名称',
            name: 'orzName'
        },
        {
            label: '机构简称',
            name: 'orzAbbr'
        },
        {
            label: '状态',
            name: 'state'
        },
        {
            label: '所属城市',
            name: 'cityName'
        },
        {
            label: '上级机构',
            name: 'parentOrzName'
        },
        {
            label: '创建时间',
            name: 'createTime'
        }
    ]
    /* WQL */
export const discountManageHeadSearch = [ // 折扣管理
    {
        disabled: false,
        formType: 'input',
        label: '折扣名称',
        message: '请输入折扣名称',
        name: 'discountName',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '折扣类型',
        name: 'discountType',
        message: '请选择',
        required: false,
        option: [{
            label: '次票',
            value: '1'
        }, {
            label: '月票',
            value: '2'
        }]
    }
]
export const discountManageTableHead = [ // 折扣管理
        {
            label: '折扣名称',
            name: 'discountName'
        }, {
            label: '业务类型',
            name: 'businessType'
        }, {
            label: '折扣类型',
            name: 'discountType'
        }, {
            label: '生效日期',
            name: 'effectiveDate'
        }, {
            label: '失效日期',
            name: 'expiryDate'
        }, {
            label: '创建时间',
            name: 'createTime'
        }
        // {
        //   label: '状态',
        //   name: 'state'
        // },
    ]
    /* 运营人员管理 */
export const emergencyContactSearch = [{
        disabled: false,
        formType: 'input',
        label: '姓名',
        message: '',
        name: 'staffName',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '手机号',
        message: '',
        name: 'phone',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '禁用',
                value: 0
            },
            {
                label: '启用',
                value: 1
            }
        ]
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '所属城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }
]
export const emergencyContactTableHead = [{
        label: '姓名',
        name: 'staffName'
    }, {
        label: '手机号',
        name: 'phone'
    }, {
        label: '管理城市',
        name: 'cityName'
    }, {
        label: '角色类型',
        name: 'staffCityInfoList'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '添加时间',
        name: 'createTime'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }]
    /* 用户定制信息 */
export const customManageHeadSearch = [{
    disabled: false,
    formType: 'input',
    label: '手机号',
    message: '',
    name: 'phone',
    required: false,
    width: '270px'
}, {
    disabled: false,
    formType: 'daterange',
    label: '添加时间',
    name: 'addTime',
    required: false
}, {
    disabled: false,
    formType: 'selectVal',
    label: '城市',
    name: 'cityCode',
    required: false
}]
export const customManageTableHead = [{
    label: '城市',
    name: 'cityName'
}, {
    label: '手机号',
    name: 'phone'
}, {
    label: '家庭住址',
    name: 'homeAddress'
}, {
    label: '公司地址',
    name: 'companyAddress'
}, {
    label: '上班时间',
    name: 'goWorkTime'
}, {
    label: '下班时间',
    name: 'offWorkTime'
}, {
    label: '家经度',
    name: 'homeLongitude'
}, {
    label: '家纬度',
    name: 'homeLatitude'
}, {
    label: '公司经度',
    name: 'companyLongitude'
}, {
    label: '公司纬度',
    name: 'companyLatitude'
}, {
    label: '添加时间',
    name: 'createTime'
}]

export const broadcastHeadSearch = [ // 广播配置
    {
        disabled: false,
        formType: 'input',
        label: '广播标题',
        message: '',
        name: 'broadcastName',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '所属城市',
        name: 'cityCode',
        required: false
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '业务类型',
        name: 'businessType',
        option: [],
        required: false
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }],
        required: false
    }
]
export const broadcastTableHead = [{
        label: '广播标题',
        name: 'broadcastName'
    }, {
        label: '广播内容',
        name: 'broadcastContent'
    }, {
        label: '所属城市',
        name: 'cityName'
    }, {
        label: '业务类型',
        name: 'businessTypeStr'
    }, {
        label: '生效日期',
        name: 'effectiveDate'
    }, {
        label: '失效日期',
        name: 'expiryDate'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }, {
        label: '添加时间',
        name: 'createTime'
    }]
    /* 用户指南 */
export const userGuideManageHeadSearch = [ // 用户指南
    {
        disabled: false,
        formType: 'input',
        label: '问题',
        message: '',
        name: 'question',
        required: false,
        width: '270px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '答案',
        name: 'answer',
        required: false
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '所属城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }
]
export const userGuideManageTableHead = [{
        label: '所属城市',
        name: 'cityName'
    }, {
        label: '所属渠道',
        name: 'channelName'
    }, {
        label: '问题',
        name: 'question'
    }, {
        label: '答案',
        name: 'answer'
    }, {
        label: '顺序',
        name: 'seq'
    }, {
        label: '添加时间',
        name: 'createTime'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }]
    /* 活动配置 */
export const activityHeadSearch = [{
    disabled: false,
    formType: 'input',
    label: '活动名称',
    message: '请输入活动名称',
    name: 'bannerName',
    required: false,
    width: '300px'
}, {
    disabled: false,
    formType: 'selectVal',
    label: '业务类型',
    name: 'businessType',
    message: '请选择',
    required: false,
    option: []
}, {
    disabled: false,
    formType: 'daterange',
    label: '开始时间',
    message: '',
    name: 'startDate',
    required: false,
    width: '300px'
}, {
    disabled: false,
    formType: 'selectVal',
    label: '城市',
    name: 'cityCode',
    required: false,
    option: [],
    width: '300px'
}, {
    disabled: false,
    formType: 'selectVal',
    label: '状态',
    name: 'state',
    required: false,
    option: [{
        label: '启用',
        value: 1
    }, {
        label: '禁用',
        value: 0
    }],
    width: '300px'
}]
export const activityTableHead = [{
        label: '城市',
        name: 'cityName'
    }, {
        label: '活动Id',
        name: 'bannerId'
    }, {
        label: '活动名称',
        name: 'bannerName'
    }, {
        label: '渠道',
        name: 'channelName'
    }, {
        label: '业务类型',
        name: 'businessType'
    }, {
        label: '活动状态',
        name: 'state'
    }, {
        label: '开始时间',
        name: 'effectiveDate'
    }, {
        label: '结束时间',
        name: 'expiryDate'
    }, {
        label: '创建时间',
        name: 'createTime'
    }, {
        label: '修改时间',
        name: 'updateTime'
    }]
    /* 班次公告 */
export const classNoticeHeadSearch = [ // 发布班次公告
    {
        disabled: false,
        formType: 'selectVal',
        label: '通知类型',
        message: '请选择',
        name: 'noticeType',
        required: false,
        option: [{
            label: '班次公告',
            value: '1'
        }, {
            label: '线路公告',
            value: '5'
        }],
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '业务类型',
        message: '请选择',
        name: 'businessType',
        required: false,
        option: [],
        width: '200px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        message: '请选择',
        name: 'state',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }],
        width: '200px'
    }
]
export const classNoticeTableHead = [ // 发布班次公告
        {
            label: '通知内容',
            name: 'noticeContent'
        }, {
            label: '通知类型',
            name: 'noticeType'
        }, {
            label: '生效时间',
            name: 'effectiveTime'
        }, {
            label: '失效时间',
            name: 'expiryTime'
        }, {
            label: '业务类型',
            name: 'businessType'
        }, {
            label: '状态',
            name: 'state'
        }, {
            label: '创建时间',
            name: 'createTime'
        }, {
            label: '更新时间',
            name: 'updateTime'
        }
    ]
    /* 线路征集配置 */
export const collectLineSearchHead = [{
    disabled: false,
    formType: 'selectVal',
    label: '所属城市',
    message: '请选择',
    name: 'cityCode',
    required: false,
    option: [],
    width: '200px'
}]
export const collectLineTableHead = [{
        label: '所属城市',
        name: 'cityName'
    }, {
        label: '上班开始时间',
        name: 'goWorkStart'
    }, {
        label: '上班结束时间',
        name: 'goWorkEnd'
    }, {
        label: '下班开始时间',
        name: 'offWorkStart'
    }, {
        label: '下班结束时间',
        name: 'offWorkEnd'
    }, {
        label: '间隔时间',
        name: 'runInterval'
    }, {
        label: '创建时间',
        name: 'createTime'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }]
    /* 公共参数配置 */
export const comnParamManageHeadSearch = [ // 公共参数
    {
        disabled: false,
        formType: 'selectVal',
        label: '所属城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'input',
        label: '参数代码',
        message: '请输入参数代码',
        name: 'code',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '参数描述',
        message: '请输入参数描述',
        name: 'description',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }]
    }
]
export const comnParamManageTableHead = [{
        label: '参数代码',
        name: 'code'
    }, {
        label: '参数内容',
        name: 'content'
    }, {
        label: '所属城市',
        name: 'cityName'
    }, {
        label: '业务类型',
        name: 'businessType'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '描述',
        name: 'description'
    }, {
        label: '创建时间',
        name: 'createTime'
    }]
    /* 抬头配置 */
export const cityInvoiceHeadSearch = [ //
    {
        disabled: false,
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '开票标识',
        message: '请选择',
        name: 'invoiceType',
        required: false,
        option: [{
                label: '是',
                value: 1
            },
            {
                label: '否',
                value: 0
            }
        ],
        width: '80px'
    }
]
export const cityInvoiceTableHead = [ // 城市发票配置
        {
            label: '城市',
            name: 'cityName'
        },
        {
            label: '开票标识',
            name: 'invoiceType'
        },
        {
            label: '销售方纳税人识别号',
            name: 'sellerTaxpayerId'
        },
        {
            label: '销售方名称',
            name: 'sellerName'
        },
        {
            label: '销售方地址',
            name: 'sellerAddress'
        },
        {
            label: '销售方电话',
            name: 'sellerPhone'
        },
        {
            label: '销售方开户行',
            name: 'sellerOpenBank'
        },
        {
            label: '销售方银行账号',
            name: 'sellerBankAccount'
        },
        {
            label: '销售方邮箱',
            name: 'sellerEmail'
        },
        {
            label: '销售方开票人',
            name: 'sellerDrawer'
        },
        {
            label: '销售方收款人',
            name: 'sellerPayee'
        },
        {
            label: '销售方复核人',
            name: 'sellerChecker'
        },
        {
            label: '销售方开票地址',
            name: 'sellerUrl'
        },
        {
            label: '购买方商品编号',
            name: 'buyerProductNo'
        },
        {
            label: '购买方项目名称',
            name: 'buyerProjectName'
        },
        {
            label: '购买方密钥',
            name: 'buyerAppkey'
        },
        {
            label: '销售方发票下载地址',
            name: 'downloadUrl'
        },
        {
            label: '税率',
            name: 'taxRatio'
        },
        {
            label: '最小开票金额限制',
            name: 'minInvoicePriceYuan'
        }
    ]
    /* 发票记录 */
export const invoiceHeadSearch = [ //
        {
            disabled: false,
            formType: 'input',
            label: '用户手机号',
            message: '请输入用户手机号',
            name: 'custPhone',
            required: false,
            width: '200px'
        },
        {
            disabled: false,
            formType: 'selectVal',
            label: '开票状态',
            message: '请选择',
            name: 'state',
            required: false,
            option: [{
                    label: '开票中',
                    value: '0'
                },
                {
                    label: '已开票',
                    value: '1'
                }
            ],
            width: '80px'
        },
        {
            disabled: false,
            formType: 'input',
            label: '发票抬头',
            message: '请输入发票抬头',
            name: 'invoiceTitle',
            required: false,
            width: '200px'
        }, {
            disabled: false,
            formType: 'selectVal',
            label: '城市',
            name: 'cityCode',
            message: '请选择',
            required: false,
            option: []
        },
        {
            disabled: false,
            formType: 'input',
            label: '用户ID',
            message: '请输入用户ID',
            name: 'custId',
            required: false,
            width: '200px'
        }
    ]
    /* 发票配置 */
export const invoiceTableHead = [ // 开票记录
    {
        label: '城市',
        name: 'cityName'
    }, {
        label: '用户ID',
        name: 'custId'
    },
    {
        label: '用户手机号',
        name: 'custPhone'
    },
    {
        label: '发票抬头',
        name: 'invoiceTitle'
    },
    {
        label: '税号',
        name: 'invoiceNumber'
    },
    {
        label: '公司电话地址',
        name: 'address'
    },
    {
        label: '开户行账号',
        name: 'openBank'
    },
    {
        label: '电子邮箱',
        name: 'email'
    },
    {
        label: '发票类型',
        name: 'type'
    },
    {
        label: '发票金额',
        name: 'amtYuan'
    },
    {
        label: '订单数',
        name: 'orderCount'
    },
    {
        label: '开票状态',
        name: 'state'
    },
    {
        label: '申请时间',
        name: 'addTimeString'
    },
    {
        label: '更新时间',
        name: 'updateTimeString'
    }
]
export const invoiceOrderTableHead = [ //
        {
            label: '订单号',
            name: 'orderId'
        },
        {
            label: '业务类型',
            name: 'businessType'
        },
        {
            label: '班次名称',
            name: 'className'
        },
        {
            label: '上车点',
            name: 'upSiteName'
        },
        {
            label: '下车点',
            name: 'downSiteName'
        },
        {
            label: '订单状态',
            name: 'orderState'
        },
        {
            label: '订单金额',
            name: 'orderAmtYuan'
        },
        {
            label: '支付金额',
            name: 'payAmtYuan'
        },
        {
            label: '核销金额',
            name: 'verificationAmtYuan'
        },
        {
            label: '已退金额',
            name: 'refundAmtYuan'
        },
        {
            label: '下单时间',
            name: 'orderTimeString'
        },
        {
            label: '支付时间',
            name: 'payTimeString'
        }
    ]
    /* 票面配置 */
export const ticketImgHeadSearch = [{
    disabled: false,
    formType: 'input',
    label: '票面名称',
    name: 'displayName',
    message: '请输入票面名称',
    required: false,
    width: '200px'
}, {
    disabled: false,
    formType: 'selectVal',
    label: '城市',
    name: 'cityCode',
    message: '请选择',
    required: false,
    option: []
}, {
    disabled: false,
    formType: 'selectVal',
    label: '状态',
    name: 'state',
    message: '请选择',
    required: false,
    option: [{
        label: '启用',
        value: '1'
    }, {
        label: '禁用',
        value: '0'
    }]
}]
export const ticketImgTableHead = [ // 票面管理
        {
            label: '票面名称',
            name: 'displayName'
        }, {
            label: '所属城市',
            name: 'cityNameList'
        }, {
            label: '状态',
            name: 'state'
        }, {
            label: '更新时间',
            name: 'updateTime'
        }, {
            label: '创建时间',
            name: 'createTime'
        }
    ]
    /* 分销管理 */
export const distributionHeadSearch = [{
        disabled: false,
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'input',
        label: '分销渠道名称',
        name: 'channelName',
        message: '请输入分销渠道名称',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '启用',
                value: '1'
            },
            {
                label: '禁用',
                value: '0'
            }
        ]
    }
]
export const distributionTableHead = [{
        label: '分销渠道名称',
        name: 'channelName'
    },
    {
        label: '所属城市',
        name: 'cityName'
    },
    {
        label: '联系人',
        name: 'contacts'
    },
    {
        label: '状态',
        name: 'state'
    },
    {
        label: '更新时间',
        name: 'updateTime'
    },
    {
        label: '创建时间',
        name: 'createTime'
    }
]
export const distributionRecordHeadSearch = [{
        disabled: false,
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'input',
        label: '分销渠道名称',
        name: 'channelName',
        message: '请输入分销渠道名称',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '订单号',
        name: 'orderId',
        message: '请输入订单号',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '手机号',
        name: 'phone',
        message: '请输入手机号',
        required: false,
        width: '200px'
    }
]
export const distributionRecordTableHead = [{
            label: '分销渠道名称',
            name: 'channelName'
        },
        {
            label: '订单号',
            name: 'orderId'
        },
        {
            label: '用户号',
            name: 'custId'
        },
        {
            label: '手机号',
            name: 'phone'
        },
        {
            label: '线路编号',
            name: 'lineId'
        },
        {
            label: '班次号',
            name: 'scheduleId'
        },
        {
            label: '司机编号',
            name: 'driverId'
        },
        {
            label: '车辆编号',
            name: 'busId'
        },
        {
            label: '下单时间',
            name: 'orderTime'
        },
        {
            label: '订单状态',
            name: 'payState'
        },
        {
            label: '支付时间',
            name: 'payTime'
        },
        {
            label: '支付方式',
            name: 'payChannelId'
        },
        {
            label: '订单金额',
            name: 'orderAmtYuan'
        },
        {
            label: '支付金额',
            name: 'payAmtYuan'
        },
        {
            label: '购买优惠券支付金额',
            name: 'totalPayAmtYuan'
        },
        {
            label: '总支付金额',
            name: 'totalPayAmtYuan'
        },
        {
            label: '实际退款金额',
            name: 'refundAmtYuan'
        },
        {
            label: '等待退款金额',
            name: 'waitRefundAmtYuan'
        },
        {
            label: '取消订单时间',
            name: 'refundTime'
        },
        {
            label: '后台退款时间',
            name: 'waitRefundTime'
        },
        {
            label: '更新时间',
            name: 'updateTime'
        }
    ]
    /* 营销单模板 */
export const marketCouponSingleHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '模板Id',
        name: 'templateId',
        message: '请输入模板Id',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '模板名称',
        name: 'templateName',
        message: '请输入模板名称',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '模板状态',
        name: 'templateStatus',
        message: '请输入订单号',
        required: false,
        width: '200px',
        option: [{
                label: '草稿',
                value: '1'
            },
            {
                label: '上线中',
                value: '2'
            },
            {
                label: '已下线',
                value: '3'
            }
        ]
    }
]
export const marketCouponSingleTableHead = [{
        label: '模板id',
        name: 'templateId'
    }, {
        label: '模板名称',
        name: 'templateName'
    }, {
        label: '模板状态',
        name: 'templateStatus'
    }, {
        label: '抵扣类型',
        name: 'templateKind'
    }, {
        label: '模板类型',
        name: 'templateType'
    }, {
        label: '权重',
        name: 'templateWeight'
    }, {
        label: '是否允许折上折',
        name: 'foldUp'
    }, {
        label: '创建时间',
        name: 'createTime'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }]
    /* 营销组合模板 */
export const marketCouponGroupHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '模板Id',
        name: 'templateId',
        message: '请输入模板Id',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '模板名称',
        name: 'templateName',
        message: '请输入模板名称',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '模板状态',
        name: 'templateStatus',
        message: '请选择',
        required: false,
        width: '200px',
        option: [{
                label: '草稿',
                value: '1'
            },
            {
                label: '上线中',
                value: '2'
            },
            {
                label: '已下线',
                value: '3'
            }
        ]
    }
]
export const marketCouponGroupTableHead = [{
            label: '模板id',
            name: 'templateId'
        },
        {
            label: '模板名称',
            name: 'templateName'
        },
        {
            label: '模板状态',
            name: 'templateStatus'
        },
        {
            label: '创建时间',
            name: 'createTime'
        },
        {
            label: '更新时间',
            name: 'updateTime'
        }
    ]
    /* 营销内容活动 */
export const marketConentActivityHeadSearch = [{
    disabled: false,
    formType: 'input',
    label: '活动Id',
    name: 'activityId',
    message: '请输入活动Id',
    required: false,
    width: '200px'
}, {
    disabled: false,
    formType: 'input',
    label: '活动名称',
    name: 'activityName',
    message: '请输入模板名称',
    required: false,
    width: '200px'
}, {
    disabled: false,
    formType: 'selectVal',
    label: '活动状态',
    name: 'activityStatus',
    message: '请选择',
    required: false,
    width: '200px',
    option: [{
        label: '待审核',
        value: '1'
    }, {
        label: '待发布',
        value: '2'
    }, {
        label: '已发布',
        value: '3'
    }, {
        label: '已下线',
        value: '4'
    }]
}]
export const marketConentActivityTableHead = [{
        label: '活动Id',
        name: 'activityId'
    }, {
        label: '活动名称',
        name: 'activityName'
    }, {
        label: '活动状态',
        name: 'activityStatus'
    }, {
        label: '开始时间',
        name: 'startTime'
    }, {
        label: '结束时间',
        name: 'endTime'
    }, {
        label: '创建时间',
        name: 'createTime'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }]
    /* 营销活动 */
export const marketActivityHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '活动Id',
        name: 'activityId',
        message: '请输入活动Id',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '活动名称',
        name: 'activityName',
        message: '请输入模板名称',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '活动状态',
        name: 'activityStatus',
        message: '请选择',
        required: false,
        width: '200px',
        option: [{
                label: '待审核',
                value: '1'
            },
            {
                label: '待发布',
                value: '2'
            },
            {
                label: '已发布',
                value: '3'
            },
            {
                label: '已下线',
                value: '4'
            }
        ]
    }
]
export const marketActivityTableHead = [{
        label: '活动Id',
        name: 'activityId'
    }, {
        label: '活动名称',
        name: 'activityName'
    }, {
        label: '活动状态',
        name: 'activityStatus'
    }, {
        label: '生券状态',
        name: 'couponStatus'
    }, {
        label: '售罄状态',
        name: 'selloutFlag'
    }, {
        label: '活动类型',
        name: 'activityType'
    }, {
        label: '开始时间',
        name: 'startTime'
    }, {
        label: '结束时间',
        name: 'endTime'
    }, {
        label: '创建时间',
        name: 'createTime'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }]
    /* 送券记录 */
export const presentCouponHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '活动id',
        name: 'activityId',
        message: '请输入活动id',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '手机号',
        name: 'phone',
        message: '请输入手机号',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '送券状态',
        name: 'state',
        message: '请选择',
        required: false,
        width: '200px',
        option: [{
                label: '送券成功',
                value: '1'
            },
            {
                label: '送券失败',
                value: '0'
            }
        ]
    }
]
export const presentCouponTableHead = [{
            label: '手机号',
            name: 'phone'
        },
        {
            label: '活动id',
            name: 'activityId'
        },
        {
            label: '送券状态',
            name: 'state'
        },
        {
            label: '失败原因',
            name: 'errReason'
        },
        {
            label: '更新时间',
            name: 'updateTime'
        },
        {
            label: '创建时间',
            name: 'createTime'
        }
    ]
    /* 需求侧消费记录 */
export const demanExpandRecordHeadSearch = [{
    disabled: false,
    formType: 'input',
    label: '交易编号',
    name: 'orderId',
    message: '请输入交易编号',
    required: false,
    width: '200px'
}, {
    disabled: false,
    formType: 'input',
    label: '外部流水号',
    name: 'outTradeNo',
    message: '请输入外部流水号',
    required: false,
    width: '200px'
}, {
    disabled: false,
    formType: 'selectVal',
    label: '订单状态',
    name: 'state',
    message: '请选择',
    required: false,
    width: '200px',
    option: [{
        label: '未支付',
        value: '1'
    }, {
        label: '支付成功',
        value: '2'
    }, {
        label: '充值失败',
        value: '3'
    }, {
        label: '充值成功',
        value: '4'
    }]
}, {
    disabled: false,
    formType: 'selectVal',
    label: '消费类型',
    name: 'expendType',
    message: '请选择',
    required: false,
    width: '200px',
    option: [{
        label: '企业班车',
        value: '1'
    }, {
        label: '企业包车',
        value: '2'
    }]
}, {
    disabled: false,
    formType: 'selectVal',
    label: '交易渠道',
    name: 'tradeChannel',
    message: '请选择',
    required: false,
    width: '200px',
    option: [{
        label: '支付宝',
        value: '1'
    }, {
        label: '微信',
        value: '2'
    }, {
        label: '企业账号扣款',
        value: '3'
    }]
}]
export const demanExpandRecordTableHead = [{
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '交易编号',
        name: 'tradeNo'
    }, {
        label: '需求侧ID',
        name: 'demandId'
    }, {
        label: '需求侧名称',
        name: 'demandName'
    }, {
        label: '外部流水号',
        name: 'outTradeNo'
    }, {
        label: '订单状态',
        name: 'state'
    }, {
        label: '交易渠道',
        name: 'tradeChannel'
    }, {
        label: '交易金额（元）',
        name: 'amountYuan'
    }, {
        label: '消费时间',
        name: 'expendTime'
    }, {
        label: '消费类型',
        name: 'expendType'
    }]
    /* 需求侧充值记录 */
export const demanRechargeRecordHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '交易编号',
        name: 'tradeNo',
        message: '请输入交易编号',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '外部流水号',
        name: 'outTradeNo',
        message: '请输入外部流水号',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '订单状态',
        name: 'state',
        message: '请选择',
        required: false,
        width: '200px',
        option: [{
                label: '未支付',
                value: '1'
            },
            {
                label: '支付成功',
                value: '2'
            },
            {
                label: '充值失败',
                value: '3'
            },
            {
                label: '充值成功',
                value: '4'
            }
        ]
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '消费类型',
        name: 'expendType',
        message: '请选择',
        required: false,
        width: '200px',
        option: [{
                label: '企业班车',
                value: '1'
            },
            {
                label: '企业包车',
                value: '2'
            }
        ]
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '交易渠道',
        name: 'tradeChannel',
        message: '请选择',
        required: false,
        width: '200px',
        option: [{
                label: '支付宝',
                value: '1'
            },
            {
                label: '微信',
                value: '2'
            },
            {
                label: '企业账号扣款',
                value: '3'
            }
        ]
    }
]
export const demanRechargeRecordTableHead = [{
            label: '交易编号',
            name: 'tradeNo'
        },
        {
            label: '需求侧ID',
            name: 'demandId'
        },
        {
            label: '需求侧名称',
            name: 'demandName'
        },
        {
            label: '外部流水号',
            name: 'outTradeNo'
        },
        {
            label: '订单状态',
            name: 'state'
        },
        {
            label: '交易渠道',
            name: 'tradeChannel'
        },
        {
            label: '交易金额（元）',
            name: 'amountYuan'
        },
        {
            label: '消费时间',
            name: 'createTime'
        },
        {
            label: '消费类型',
            name: 'expendType'
        },
        {
            label: '操作人',
            name: 'operationUser'
        }
    ]
    /* 活动参与记录 */
export const activityStatisticsRecordHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '活动id',
        name: 'activityId',
        message: '请输入活动id',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '活动名称',
        name: 'activityName',
        message: '请输入活动名称',
        required: false,
        width: '200px'
    }
]
export const activityStatisticsRecordTableHead = [ // 活动数据统计
        {
            label: '活动Id',
            name: 'activityId'
        }, {
            label: '活动名称',
            name: 'activityName'
        }, {
            label: '剩余优惠券数量',
            name: 'remainQuantity'
        }, {
            label: '领取优惠券数量',
            name: 'takeCoupon'
        }, {
            label: '已核销数量',
            name: 'useCoupon'
        }, {
            label: '核销总金额',
            name: 'verAmt'
        }, {
            label: '模板名称',
            name: 'templateName'
        }, {
            label: '开始时间',
            name: 'startTime'
        }, {
            label: '结束时间',
            name: 'endTime'
        }, {
            label: '参与人数',
            name: 'joinNum'
        }
    ]
    /* LXP */
    /* 线路管理 */
export const lineHeadSearch = [{
    disabled: false,
    data: '',
    formType: 'input',
    label: '线路号',
    message: '请输入线路号',
    name: 'lineNo',
    required: false,
    width: '300px'
}, {
    disabled: false,
    data: '',
    formType: 'input',
    label: '线路名称',
    message: '请输入线路名称',
    name: 'lineName',
    required: false,
    width: '300px'
}, {
    disabled: false,
    data: '',
    formType: 'selectVal',
    label: '状态',
    name: 'state',
    message: '请选择',
    required: false,
    option: [{
        label: '启用',
        value: 1
    }, {
        label: '禁用',
        value: 0
    }]
}, {
    disabled: false,
    formType: 'selectVal',
    label: '标签',
    name: 'labelId',
    message: '请选择',
    required: false,
    option: []
}]
export const lineTableHead = [{
        label: '城市',
        name: 'cityName'
    }, {
        label: '线路类型',
        name: 'businessType'
    }, {
        label: '标签',
        name: 'labelNameList'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '起点',
        name: 'startSiteName'
    }, {
        label: '终点',
        name: 'endSiteName'
    }, {
        label: '开始时间',
        name: 'effectiveDate'
    }, {
        label: '结束时间',
        name: 'expiryDate'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '线路描述',
        name: 'description'
    }]
    /* 班次管理 */
export const scheduleManageHeadSearch = [ // 班次
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '班次名称',
        message: '请输入班次名称',
        name: 'className',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路名称',
        name: 'lineName',
        required: false
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '班次性质',
        name: 'classNature',
        message: '请选择',
        required: false,
        option: [{
            label: '预售',
            value: 1
        }, {
            label: '正常',
            value: 2
        }]
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'orzId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }]
    }
]
export const scheduleManageTableHead = [{
    label: '班次名称',
    name: 'className'
}, {
    label: '线路名称',
    name: 'lineName'
}, {
    label: '班次性质',
    name: 'classNature'
}, {
    label: '发车时间',
    name: 'startTime'
}, {
    label: '到达时间',
    name: 'endTime'
}, {
    label: '车型',
    name: 'busTypeName'
}, {
    label: '班次',
    name: 'classType'
}, {
    label: '票价',
    name: 'priceYuan'
}, {
    label: '运行周期',
    name: 'workingCirculate'
}, {
    label: '城市',
    name: 'cityName'
}, {
    label: '机构',
    name: 'orzName'
}, {
    label: '选座',
    name: 'seatType'
}, {
    label: '状态',
    name: 'state'
}, {
    label: '生效时间',
    name: 'effectiveDate'
}, {
    label: '失效时间',
    name: 'expiryDate'
}, {
    label: '修改时间',
    name: 'updateTime'
}]
export const orderReportHeadSearch = [ // 订单报表
    {
        data: '',
        formType: 'input',
        label: '订单编号',
        name: 'orderId',
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        option: []
    }, {
        data: '',
        formType: 'selectVal',
        label: '业务类型',
        name: 'businessType',
        type: 'orderReport',
        option: [],
        width: '270px'
    }, {
        data: '',
        formType: 'selectVal',
        label: '购票类型',
        name: 'ticketType',
        option: [{
            label: '日票',
            value: 1
        }, {
            label: '月票',
            value: 2
        }, {
            label: '多次票',
            value: 3
        }, {
            label: '通票',
            value: 4
        }],
        width: '270px'
    }, {
        formType: 'daterange',
        label: '支付日期',
        name: 'orderTime',
        required: false,
        width: '300px'
    }, {
        formType: 'selectVal',
        label: '支付方式',
        name: 'payChannelId',
        option: [{
            label: '自主账户',
            value: 0
        }, {
            label: '支付宝',
            value: 1
        }, {
            label: '微信',
            value: 2
        }, {
            label: '企业账户',
            value: 9
        }],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '订单状态',
        name: 'state',
        option: [{
            label: '待支付',
            value: 1
        }, {
            label: '待派车',
            value: 2
        }, {
            label: '待出行',
            value: 3
        }, {
            label: '出行中',
            value: 4
        }, {
            label: '已完成',
            value: 5
        }, {
            label: '自动取消',
            value: 6
        }, {
            label: '前台退款',
            value: 7
        }, {
            label: '后台退款',
            value: 8
        }],
        width: '270px'
    }
]
export const orderReportListTableHead = [ // 订单报表
    {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构',
        name: 'orzName'
    }, {
        label: '业务类型',
        name: 'businessType'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '班次名称',
        name: 'scheduleName'
    }, {
        label: '班次类型',
        name: 'scheduleType'
    }, {
        label: '订单状态',
        name: 'state'
    }, {
        label: '购票类型',
        name: 'ticketType'
    }, {
        label: '渠道',
        name: 'channelName'
    }, {
        label: '下单时间',
        name: 'orderTime'
    }, {
        label: '支付时间',
        name: 'payTime'
    }, {
        label: '支付方式',
        name: 'payChannelId'
    }, {
        label: '车票数量',
        name: 'ticketCount'
    }, {
        label: '订单单价',
        name: 'price'
    }, {
        label: '支付单价',
        name: 'ticketUnitPirce'
    }, {
        label: '订单金额',
        name: 'totalAmt'
    }, {
        label: '支付金额',
        name: 'payAmt'
    }, {
        label: '营销金额',
        name: 'couponAmt'
    }, {
        label: '已退金额',
        name: 'refundAmt'
    }, {
        label: '退款票数',
        name: 'refundTicketNum'
    }, {
        label: '成交票数',
        name: 'successTicketNum'
    }, {
        label: '实付订单票款',
        name: 'realOrderTicketAmt'
    }, {
        label: '实付支付票款',
        name: 'realTicketAmt'
    }, {
        label: '退款手续费',
        name: 'refundProcedureAmt'
    }, {
        label: '渠道手续费',
        name: 'channelAmt'
    }, {
        label: '外部订单号',
        name: 'outOrderNo'
    }, {
        label: '后台取消订单备注',
        name: 'cancelRemark'
    }, {
        label: '更新时间',
        name: 'updateTime'
    }
]
export const tripListHeadSearch = [ // 行程报表
    {
        data: '',
        formType: 'input',
        label: '订单编号',
        name: 'orderId',
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '行程状态',
        name: 'state',
        option: [{
            label: '无效',
            value: 0
        }, {
            label: '有效',
            value: 1
        }, {
            label: '预定',
            value: 2
        }, {
            label: '改签',
            value: 3
        }, {
            label: '退款',
            value: 4
        }],
        width: '270px'
    }, {
        formType: 'daterange',
        label: '乘坐日期',
        name: 'orderTime',
        required: false,
        width: '300px'
    }, {
        data: '',
        formType: 'selectVal',
        label: '业务类型',
        name: 'businessType',
        type: 'transitSchedule',
        option: [],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        option: [],
        width: '270px'
    }, {
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        option: [],
        width: '270px'
    }
]
export const tripListTableHead = [ // 行程报表
    {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构',
        name: 'orzName'
    }, {
        label: '业务类型',
        name: 'businessType'
    }, {
        label: '渠道',
        name: 'channelName'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '班次名称',
        name: 'scheduleName'
    }, {
        label: '班次类型',
        name: 'scheduleType'
    }, {
        label: '购票类型',
        name: 'ticketType'
    }, {
        label: '乘坐日期',
        name: 'rideDate'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '是否验票',
        name: 'checkTicketState'
    }, {
        label: '票数',
        name: 'travelNum'
    }, {
        label: '订单单价',
        name: 'price'
    }, {
        label: '支付单价',
        name: 'ticketUnitPirce'
    }, {
        label: '退款手续费',
        name: 'refundProcedureAmt'
    }, {
        label: '退款票数',
        name: 'refundTicketNum'
    }, {
        label: '成交票数',
        name: 'successTicketNum'
    }, {
        label: '订单票款',
        name: 'orderTicketAmt'
    }, {
        label: '渠道手续费',
        name: 'channelAmt'
    }
]
export const dueListHeadSearch = [ // 应付报表
    {
        formType: 'daterange',
        label: '日期',
        name: 'orderTime',
        required: false,
        width: '300px'
    }, {
        data: '',
        formType: 'selectVal',
        label: '业务类型',
        message: '请选择',
        name: 'businessType',
        type: 'transitSchedule',
        option: [],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        option: [],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '机构',
        message: '请选择',
        name: 'supplyId',
        option: [],
        width: '270px'
    }, {
        data: '',
        formType: 'input',
        label: '线路号',
        message: '请输入',
        name: 'lineNo',
        width: '270px'
    }
]
export const dueListTableHead = [ // 应付报表
    {
        label: '城市',
        name: 'cityName'
    }, {
        label: '日期',
        name: 'gatherDate'
    }, {
        label: '业务类型',
        name: 'businessType'
    }, {
        label: '所属子公司',
        name: 'supplyName'
    }, {
        label: '班次名称',
        name: 'className'
    }, {
        label: '车牌号',
        name: 'busNumber'
    }, {
        label: '司机姓名',
        name: 'driverName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '发车时间',
        name: 'startTime'
    }, {
        label: '到达时间',
        name: 'endTime'
    }, {
        label: '车型',
        name: 'busTypeName'
    }, {
        label: '班次类型',
        name: 'classType'
    }, {
        label: '全票价金额（元）',
        name: 'originalPrice'
    }, {
        label: '标准载客数',
        name: 'seatCount'
    }, {
        label: '最大载客数',
        name: 'seatMaxCount'
    }, {
        label: '实际乘坐人数',
        name: 'rideNum'
    }, {
        label: '上座率（%）',
        name: 'seatRate'
    }, {
        label: '月票占比（%）',
        name: 'monthlyRate'
    }, {
        label: '次票占比（%）',
        name: 'thisRate'
    }, {
        label: '多次票占比（%）',
        name: 'multipleRate'
    }, {
        label: '月票应付（元）',
        name: 'monthlyAmt'
    }, {
        label: '次票应付（元）',
        name: 'thisAmt'
    }, {
        label: '多次票应付（元）',
        name: 'multipleAmt'
    }, {
        label: '代收金额',
        name: 'collectionAmt'
    }, {
        label: '应收平台服务费',
        name: 'paasAmt'
    }, {
        label: '应收渠道手续费',
        name: 'channelAmt'
    }, {
        label: '应结算金额',
        name: 'settleAmt'
    }
]
export const shuttleDemandHeadSearch = [ // 班车需求单管理
    {
        data: '',
        formType: 'input',
        label: '需求订单号',
        name: 'orderId',
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        option: []
    }, {
        data: '',
        formType: 'selectVal',
        label: '需求侧',
        name: 'orzId',
        // type: 'orderReport',
        option: [],
        width: '270px'
    }, {
        data: '',
        formType: 'input',
        label: '联系人',
        name: 'contactName',
        width: '270px'
    }, {
        formType: 'daterange',
        label: '下单时间',
        name: 'orderTime',
        required: false,
        width: '300px'
    }
]
export const shuttleDemandListTableHead = [ // 班车需求单管理
    {
        label: '需求订单号',
        name: 'orderId'
    }, {
        label: '城市',
        name: 'cityCodeName'
    }, {
        label: '需求侧',
        name: 'demandName'
    }, {
        label: '联系人',
        name: 'contactName'
    }, {
        label: '公司地址',
        name: 'useAddr'
    }, {
        label: '用车周期',
        name: 'useCycleName'
    }, {
        label: '用车班次',
        name: 'scheduleType'
    }, {
        label: '早班到达时间',
        name: 'amTime'
    }, {
        label: '晚班上车时间',
        name: 'pmTime'
    }, {
        label: '乘车人数',
        name: 'passengerNum'
    }, {
        label: '起点',
        name: 'startPoint'
    }, {
        label: '终点',
        name: 'endPoint'
    }, {
        label: '下单时间',
        name: 'orderTime'
    }
]
export const planManageHeadSearch = [ // 排班管理
    {
        formType: 'selectVal',
        label: '供给侧',
        name: 'orzId',
        option: [],
        type: 'busSchedule',
        width: '270px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '班次类型',
        name: 'classType',
        required: false,
        option: [{
            label: '早班',
            value: 1
        }, {
            label: '晚班',
            value: 2
        }, {
            label: '循环班',
            value: 3
        }]
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '班次名称',
        name: 'className',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路名称',
        name: 'lineName',
        required: false
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '业务类型',
        name: 'businessType',
        required: false,
        option: [],
        type: 'transitSchedule',
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        data: '',
        label: '状态',
        name: 'state',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }]
    }
]
export const planManageTableHead = [{
        label: '供给侧',
        name: 'supplyName'
    }, {
        label: '班次类型',
        name: 'classType'
    }, {
        label: '班次名称',
        name: 'className'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '业务类型',
        name: 'businessType'
    }, {
        label: '发车时间',
        name: 'startTime'
    }, {
        label: '车辆类型',
        name: 'busTypeName'
    }, {
        label: '到达时间',
        name: 'endTime'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '最近未排日期',
        name: 'recentNoScheduleDate'
    }, {
        label: '生效日期',
        name: 'effectiveDate'
    }, {
        label: '失效日期',
        name: 'expiryDate'
    }]
    /* 每日排班管理 */
export const planDayHeadSearch = [ //  每日排班
    {
        disabled: false,
        formType: 'daterange',
        label: '日期范围',
        message: '',
        name: 'workDate',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        formType: 'select',
        label: '所属机构',
        name: 'orzId',
        type: 'orzId',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'input',
        label: '司机姓名',
        message: '请输入司机名称',
        name: 'driverName',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '司机ID',
        message: '请输入司机ID',
        name: 'driverId',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '班次名称',
        message: '请输入班次名称',
        name: 'className',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '班次类型',
        name: 'classType',
        message: '请选择',
        required: false,
        option: [{
            label: '早班',
            value: 1
        }, {
            label: '晚班',
            value: 2
        }, {
            label: '循环班',
            value: 3
        }]
    }, {
        disabled: false,
        formType: 'input',
        label: '线路名称',
        message: '请输入线路名称',
        name: 'lineName',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '线路号',
        message: '请输入线路号',
        name: 'lineNo',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '车辆ID',
        message: '请输入车辆ID',
        name: 'busId',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'input',
        label: '车牌号',
        message: '请输入车牌号',
        name: 'busNumber',
        required: false,
        width: '270px'
    }, {
        disabled: false,
        formType: 'select',
        label: '线路性质',
        name: 'lineProperty',
        message: '请选择',
        required: false,
        option: [{
            label: '固定时间发车',
            value: 1
        }, {
            label: '周期循环发车',
            value: 2
        }]
    }
]
export const planDayTableHead = [{
            label: '日期',
            name: 'workDate'
        },
        {
            label: '所属机构',
            name: 'orzName'
        },
        {
            label: '线路号',
            name: 'lineNo'
        },
        {
            label: '线路名称',
            name: 'lineName'
        },
        {
            label: '班次类型',
            name: 'classType'
        },
        {
            label: '业务类型',
            name: 'businessType'
        },
        {
            label: '班次名称',
            name: 'className'
        },
        {
            label: '线路性质',
            name: 'lineProperty'
        },
        {
            label: '司机ID',
            name: 'driverId'
        },
        {
            label: '司机姓名',
            name: 'driverName'
        },
        {
            label: '司机手机号',
            name: 'phone'
        },
        {
            label: '车辆ID',
            name: 'busId'
        },
        {
            label: '车牌号',
            name: 'busNumber'
        },
        {
            label: '车辆类型',
            name: 'busTypeName'
        }
    ]
    /* 开放日期配置 */
export const ticketOpeningHeadSearch = [ // 购票开放时间配置
    {
        disabled: false,
        formType: 'input',
        label: '线路号',
        message: '',
        name: 'lineNo',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '线路名称',
        message: '',
        name: 'lineName',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '班次名称',
        message: '',
        name: 'className',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '班次类型',
        name: 'classType',
        message: '请选择',
        required: false,
        option: [{
                label: '早班',
                value: 1
            },
            {
                label: '晚班',
                value: 2
            },
            {
                label: '循环班',
                value: 3
            }
        ]
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '机构',
        message: '请选择',
        name: 'orzId',
        type: 'orzId',
        required: false,
        option: [],
        width: '200px'
    }
]
export const ticketOpeningTableHead = [ // 购票开放时间配置
        {
            label: '机构',
            name: 'orzName'
        },
        {
            label: '线路号',
            name: 'lineNo'
        },
        {
            label: '线路名称',
            name: 'lineName'
        },
        {
            label: '班次名称',
            name: 'className'
        },
        {
            label: '班次类型',
            name: 'classType'
        },
        {
            label: '月票开放时间点',
            name: 'monthTicketSellTime'
        },
        {
            label: '月票开放日期',
            name: 'monthTicketSellDay'
        },
        {
            label: '次票开放时间点',
            name: 'secondaryTicketSellTime'
        },
        {
            label: '次票开放日期',
            name: 'nextMonthSecondarySellDate'
        },
        {
            label: '次票开放类型',
            name: 'secondarySellType'
        },
        {
            label: '参数',
            name: 'secondaryTicketSellDay'
        },
        {
            label: '最新设置时间',
            name: 'updateTime'
        }
    ]
    /**
     * LXP
     */

export const ticketManageHeadSearch = [ // 票价管理搜索
    {
        disabled: false,
        formType: 'input',
        label: '名称',
        message: '请输入名称',
        name: 'ticketName',
        required: false,
        width: '270px'
    },
    {
        disabled: false,
        formType: 'select',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
                label: '启用',
                value: 1
            },
            {
                label: '禁用',
                value: 0
            }
        ]
    }
]
export const ticketManageTableHead = [ // 票价管理
  {
    label: '名称',
    name: 'ticketName'
  },
  // {
  //   label: '起步价（往返）',
  //   name: 'roundStartPriceYuan'
  // }, {
  //   label: '免费里程（往返）',
  //   name: 'roundFreeInterval'
  // },
  {
    label: '起步价（单程）',
    name: 'singleStartPriceYuan'
  }, {
    label: '免费里程（单程）',
    name: 'singleFreeInterval'
  }, {
    label: '状态',
    name: 'state'
  }
  // {
  //   label: '起步价（全天）',
  //   name: 'allDayStartPriceYuan'
  // }, {
  //   label: '免费时长（全天）',
  //   name: 'allDayFreeInterval'
  // }, {
  //   label: '起步价（半天）',
  //   name: 'halfDayStartPriceYuan'
  // }, {
  //   label: '免费时长（半天）',
  //   name: 'halfDayFreeInterval'
  // }
]
export const returnRuleConfigurationSearch = [{
    disabled: false,
    formType: 'selectVal',
    label: '所属城市',
    name: 'cityCode',
    message: '请选择',
    required: false,
    option: []
}, {
    disabled: false,
    formType: 'selectVal',
    label: '状态',
    name: 'state',
    message: '请选择',
    required: false,
    option: [{
        label: '禁用',
        value: 0
    }, {
        label: '启用',
        value: 1
    }]
}]
export const returnRuleConfigurationTableHead = [{
        label: '所属城市',
        name: 'cityName'
    }, {
        label: '生效时间',
        name: 'effectiveDate'
    }, {
        label: '失效时间',
        name: 'expiryDate'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '规则类型',
        name: 'changeType'
    }, {
        label: '车票类型',
        name: 'ticketType'
    }, {
        label: '业务类型',
        name: 'businessType'
    }]
    /* 通票搜索配置 */
export const throughTicketSearch = [ // 购票开放时间配置
    {
        disabled: false,
        formType: 'input',
        label: '名称',
        message: '',
        name: 'ticketName',
        required: false,
        width: '200px'
    },
    {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'orzId',
        message: '请选择',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'select',
        label: '核销类型',
        message: '请选择',
        name: 'verificationType',
        required: false,
        option: [{
                label: '单日次数',
                value: 1
            },
            {
                label: '总次数',
                value: 2
            }
        ],
        width: '200px'
    },
    {
        disabled: false,
        formType: 'select',
        label: '可退款',
        message: '请选择',
        name: 'isRefund',
        required: false,
        option: [{
                label: '是',
                value: 1
            },
            {
                label: '否',
                value: 0
            }
        ],
        width: '200px'
    },
    {
        disabled: false,
        formType: 'select',
        label: '状态',
        message: '请选择',
        name: 'state',
        required: false,
        option: [{
                label: '禁用',
                value: 0
            },
            {
                label: '启用',
                value: 1
            }
        ],
        width: '200px'
    }
]
export const throughTicketTableHead = [{
        label: '通票名称',
        name: 'ticketName'
    },
    {
        label: '城市',
        name: 'cityNameList'
    },
    {
        label: '供给侧',
        name: 'orzNameList'
    },
    {
        label: '线路数量',
        name: 'lineNum'
    },
    {
        label: '折扣价',
        name: 'priceYuan'
    },
    {
        label: '原价',
        name: 'showPriceYuan'
    },
    {
        label: '有效天数',
        name: 'effectiveDays'
    },
    {
        label: '生效时间',
        name: 'effectiveDate'
    },
    {
        label: '失效时间',
        name: 'expiryDate'
    },
    {
        label: '车票类型',
        name: 'verificationType'
    },
    {
        label: '状态',
        name: 'state'
    }
]

export const receiptManageHeadSearch = [ // 接单管理
    {
        disabled: false,
        formType: 'input',
        label: '订单号',
        message: '请输入订单号',
        name: 'orderId',
        required: false
    }, {
        disabled: false,
        formType: 'input',
        label: '手机号',
        message: '请输入手机号',
        name: 'phone',
        required: false
    }, {
        disabled: false,
        formType: 'select',
        label: '排班状态',
        name: 'travelState',
        message: '请选择',
        required: false,
        option: [{
            label: '未匹配',
            value: '1'
        }, {
            label: '已匹配',
            value: '2'
        }, {
            label: '已派车',
            value: '3'
        }]
    }, {
        disabled: false,
        formType: 'select',
        label: '包车类型',
        name: 'charterType',
        message: '请选择',
        required: false,
        option: [{
            label: '单程',
            value: '1'
        }, {
            label: '全天',
            value: '2'
        }, {
            label: '往返',
            value: '3'
        }, {
            label: '半天',
            value: '4'
        }]
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '订单类型',
        name: 'orderType',
        message: '请选择',
        required: false,
        option: [{
            label: '个人订单',
            value: '1'
        }, {
            label: '企业订单',
            value: '2'
        }]
    }
]

export const receiptManageTableHead = [{
    label: '订单号',
    name: 'orderId'
}, {
    label: '城市',
    name: 'cityName'
}, {
    label: '供给侧',
    name: 'supplyName'
}, {
    label: '联系电话',
    name: 'phone'
}, {
    label: '包车类型',
    name: 'charterType'
}, {
    label: '订单类型',
    name: 'orderType'
}, {
    label: '车牌号',
    name: 'busList'
}, {
    label: '车辆数',
    name: 'busCount'
}, {
    label: '下单时间',
    name: 'orderTime'
}, {
    label: '用车时间',
    name: 'goTime'
}, {
    label: '起点',
    name: 'goPlace'
}, {
    label: '终点',
    name: 'arrivePlace'
}, {
    label: '订单金额（元）',
    name: 'payAmtYuan'
}, {
    label: '状态',
    name: 'parentState'
}, {
    label: '包车里程/时长',
    name: 'total'
}]

export const charteredUpShelfSearch = [{
    disabled: false,
    formType: 'input',
    label: '商品名称',
    message: '请输入商品名称',
    name: 'updatesName',
    required: false
}, {
    disabled: false,
    formType: 'select',
    label: '所属城市',
    name: 'cityCode',
    message: '请选择',
    required: false,
    option: []
}, {
    disabled: false,
    formType: 'select',
    label: '车型名称',
    name: 'busTypeName',
    message: '请选择',
    required: false,
    option: []
}, {
    disabled: false,
    formType: 'select',
    label: '状态',
    message: '请选择',
    name: 'state',
    required: false,
    option: [{
        label: '禁用',
        value: 0
    }, {
        label: '启用',
        value: 1
    }],
    width: '200px'
}]

export const charteredUpShelfTableHead = [{
            label: '商品名称',
            name: 'updatesName'
        },
        // {
        //   label: '生效时间',
        //   name: 'effectiveDate'
        // },
        // {
        //   label: '失效时间',
        //   name: 'expiryDate'
        // },
        {
            label: '城市',
            name: 'cityName'
        },
        {
            label: '车型',
            name: 'busTypeName'
        },
        {
            label: '最小准备时间',
            name: 'prepareTime'
        },
        {
            label: '开始时间',
            name: 'startTime'
        },
        {
            label: '结束时间',
            name: 'endTime'
        },
        {
            label: '描述',
            name: 'description'
        },
        {
            label: '状态',
            name: 'state'
        },
        {
            label: '起步价',
            name: 'startingPriceYuan'
        }
    ]
    // 接单管理
export const receiptCarpoolManageHeadSearch = [{
        disabled: false,
        formType: 'input',
        label: '订单号',
        message: '请输入订单号',
        name: 'orderId',
        required: false
    },
    {
        disabled: false,
        formType: 'input',
        label: '手机号',
        message: '请输入手机号',
        name: 'phone',
        required: false
    },
    {
        disabled: false,
        formType: 'select',
        label: '排班状态',
        name: 'carpoolState',
        message: '请选择',
        required: false,
        option: [{
                label: '待分配',
                value: '1'
            },
            {
                label: '待排班',
                value: '2'
            },
            {
                label: '已排班',
                value: '3'
            },
            {
                label: '已取消',
                value: '4'
            }
        ]
    },
    {
        disabled: false,
        formType: 'select',
        label: '拼车类型',
        name: 'carpoolType',
        message: '请选择',
        required: false,
        option: [{
                label: 'APP发起',
                value: '1'
            },
            {
                label: '后台发起',
                value: '2'
            }
        ]
    }
]

export const receiptCarpoolManageTableHead = [{
        label: '拼团号',
        name: 'carpoolId'
    }, {
        label: '线路名',
        name: 'lineName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '乘车日期',
        name: 'rideDate'
    }, {
        label: '出发日期',
        name: 'startTime'
    }, {
        label: '拼团人数',
        name: 'alreadyCarpoolNum'
    }, {
        label: '拼车类型',
        name: 'carpoolType'
    }, {
        label: '发起时间',
        name: 'createTime'
    }, {
        label: '状态',
        name: 'state'
    }, {
        label: '成功时间',
        name: 'successTime'
    }, {
        label: '取消时间',
        name: 'cancelTime'
    }
    //  {
    //    label: '订单号',
    //    name: 'orderId'
    //  },
    //  {
    //   label: '供给侧',
    //   name: 'supplyName'
    // }
]
export const orderCharterManageTableHead = [{
    label: '订单编号',
    name: 'orderId'
}, {
    label: '城市',
    name: 'cityName'
}, {
    label: '包车类型',
    name: 'orderType'
}, {
    label: '出发时间',
    name: 'goTime'
}, {
    label: '出发地点',
    name: 'goPlace'
}, {
    label: '包车方式',
    name: 'charterType'
}, {
    label: '联系电话',
    name: 'phone'
}, {
    label: '用户号',
    name: 'custId'
}, {
    label: '用户手机号',
    name: 'custPhone'
}, {
    label: '订单状态',
    name: 'orderState'
}, {
    label: '下单时间',
    name: 'orderTime'
}, {
    label: '支付时间',
    name: 'payTime'
}, {
    label: '支付方式',
    name: 'payChannel'
}, {
    label: '订单金额',
    name: 'originalAmtYuan'
}, {
    label: '支付金额',
    name: 'payAmtYuan'
}, {
    label: '已退金额',
    name: 'refundAmtYuan'
}, {
    label: '取消原因',
    name: 'bgRefundReason'
}, {
    label: '后台取消原因 ',
    name: 'appRefundReason'
}]

export const orderSpecialManageTableHead = [{
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '供给侧机构',
        name: 'supplyName'
    }, {
        label: '用户号',
        name: 'custId'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '班次名称',
        name: 'className'
    }, {
        label: '上车点',
        name: 'upSiteName'
    }, {
        label: '下车点',
        name: 'downSiteName'
    }, {
        label: '订单状态',
        name: 'orderState'
    }, {
        label: '下单时间',
        name: 'orderTime'
    }, {
        label: '支付状态',
        name: 'payState'
    }, {
        label: '支付时间',
        name: 'payTime'
    }, {
        label: '支付方式',
        name: 'payChannel'
    }, {
        label: '订单金额',
        name: 'orderAmtYuan'
    }, {
        label: '支付金额',
        name: 'payAmtYuan'
    }, {
        label: '核销金额',
        name: 'verificationAmtYuan'
    }, {
        label: '已退金额',
        name: 'refundAmtYuan'
    }, {
        label: '取消原因',
        name: 'refundReason'
    }, {
        label: '外部订单号 ',
        name: 'outOrderNo'
    }, {
        label: '后台取消订单备注 ',
        name: 'cancelRemark'
    }
    // {
    //   label: '里程费 ',
    //   name: 'mileagePriceYuan'
    // }, {
    //   label: '平台服务费 ',
    //   name: 'platformPriceYuan'
    // }
]
export const companyBusLineHeadSearch = [ // 企业班车线路管理
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路名称',
        message: '请输入线路名称',
        name: 'lineName',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '乘车形式',
        name: 'isTicketToRide',
        message: '请选择',
        required: false,
        option: [
            //   {
            //   label: '不购票乘车',
            //   value: 1
            // }, {
            //   label: '购票乘车',
            //   value: 2
            // }
        ]
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路号',
        message: '请输入线路号',
        name: 'lineNo',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }]
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '供给侧',
        name: 'orzId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '需求侧',
        name: 'demandId',
        message: '请选择',
        required: false,
        option: []
    }
]
export const companyBusLineTableHead = [{
    label: '线路名称',
    name: 'lineName'
}, {
    label: '城市',
    name: 'cityName'
}, {
    label: '线路类型',
    name: 'businessType'
}, {
    label: '乘车形式',
    name: 'isTicketToRide'
}, {
    label: '标签',
    name: 'labelNameList'
}, {
    label: '线路号',
    name: 'lineNo'
}, {
    label: '起点',
    name: 'startSiteName'
}, {
    label: '终点',
    name: 'endSiteName'
}, {
    label: '开始时间',
    name: 'effectiveDate'
}, {
    label: '结束时间',
    name: 'expiryDate'
}, {
    label: '状态',
    name: 'state'
}, {
    label: '线路描述',
    name: 'description'
}, {
    label: '供给侧',
    name: 'orzName'
}, {
    label: '需求侧',
    name: 'demandName'
}]
export const companyBusScheduleHeadSearch = [ // 企业班车班次管理
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '班次名称',
        message: '请输入班次名称',
        name: 'className',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路名称',
        message: '',
        name: 'lineName',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '运行周期',
        name: 'workingCirculate',
        message: '请选择',
        required: false,
        option: [{
            label: '工作日',
            value: 1
        }, {
            label: '节假日',
            value: 2
        }, {
            label: '不限',
            value: 3
        }, {
            label: '指定日期',
            value: 4
        }]
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '状态',
        name: 'state',
        message: '请选择',
        required: false,
        option: [{
            label: '启用',
            value: 1
        }, {
            label: '禁用',
            value: 0
        }]
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '供给侧',
        name: 'orzId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '需求侧',
        name: 'demandId',
        message: '请选择',
        required: false,
        option: []
    }
]
export const companyBusScheduleTableHead = [{
    label: '班次名称',
    name: 'className'
}, {
    label: '线路名称',
    name: 'lineName'
}, {
    label: '班次性质',
    name: 'classNature'
}, {
    label: '发车时间',
    name: 'startTime'
}, {
    label: '到达时间',
    name: 'endTime'
}, {
    label: '车型',
    name: 'busTypeName'
}, {
    label: '班次类型',
    name: 'classType'
}, {
    label: '票价',
    name: 'priceYuan'
}, {
    label: '运行周期',
    name: 'workingCirculate'
}, {
    label: '城市',
    name: 'cityName'
}, {
    label: '供给侧',
    name: 'orzName'
}, {
    label: '需求侧',
    name: 'demandName'
}, {
    label: '状态',
    name: 'state'
}, {
    label: '生效时间',
    name: 'effectiveDate'
}, {
    label: '失效时间',
    name: 'expiryDate'
}, {
    label: '修改时间',
    name: 'updateTime'
}]
export const customeBusOrderHeadSearch = [ // 定制公交订单 - 订单管理
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '用户手机号',
        message: '请输入手机号',
        name: 'phone',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路号',
        message: '请输入线路号',
        name: 'lineNo',
        required: false,
        width: '300px'
    }, {
        formType: 'daterange',
        label: '支付时间',
        name: 'payTimeCustom',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '订单编号',
        message: '请输入订单编号',
        name: 'orderId',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路名称',
        message: '请输入线路名称',
        name: 'lineName',
        required: false,
        width: '300px'
    }, {
        data: '',
        formType: 'selectVal',
        label: '购票类型',
        name: 'ticketType',
        option: [{
            label: '次票',
            value: 1
        }, {
            label: '月票',
            value: 2
        }],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '支付状态',
        name: 'payState',
        option: [{
            label: '等待支付',
            value: 1
        }, {
            label: '支付成功',
            value: 2
        }, {
            label: '用户退款成功',
            value: 3
        }, {
            label: '后台退款',
            value: 4
        }, {
            label: '后台退款成功',
            value: 5
        }],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '订单状态',
        name: 'orderState',
        option: [{
            label: '待支付',
            value: 1
        }, {
            label: '已支付',
            value: 2
        }, {
            label: '手动取消',
            value: 3
        }, {
            label: '自动取消',
            value: 4
        }],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '支付方式',
        name: 'payChannelId',
        option: [{
            label: '自主账户',
            value: 0
        }, {
            label: '支付宝',
            value: 1
        }, {
            label: '微信',
            value: 2
        }, {
            label: '企业账户',
            value: 9
        }],
        width: '270px'
    }, {
        disabled: false,
        formType: 'selectVal',
        label: '业务类型',
        message: '请选择',
        name: 'businessType',
        type: 'orderCustom',
        required: false,
        width: '300px',
        option: []
    },  
    // {
    //     disabled: false,
    //     data: '',
    //     formType: 'selectVal',
    //     label: '城市',
    //     name: 'cityCode',
    //     message: '请选择',
    //     required: false,
    //     option: []
    // }, {
    //     disabled: false,
    //     data: '',
    //     formType: 'selectVal',
    //     label: '机构',
    //     name: 'supplyId',
    //     type: 'orzId',
    //     message: '请选择',
    //     required: false,
    //     option: []
    // } 
]
export const customeBusOrderTableHead = [ // 定制公交订单 - 订单管理
    {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构',
        name: 'supplyName'
    }, {
        label: '业务类型',
        name: 'businessTypeName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '班次名称',
        name: 'scheduleName'
    }, {
        label: '班次类型',
        name: 'scheduleTypeName'
    }, {
        label: '购票类型',
        name: 'ticketTypeName'
    }, {
        label: '渠道',
        name: 'channelName'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '下单时间',
        name: 'orderTime'
    }, {
        label: '订单状态',
        name: 'orderStateName'
    }, {
        label: '支付状态',
        name: 'payStateName'
    }, {
        label: '支付时间',
        name: 'payTime'
    }, {
        label: '支付方式',
        name: 'payChannelIdName'
    }, {
        label: '车票数量',
        name: 'ticketCount'
    }, {
        label: '订单总价',
        name: 'orderAmt'
    }, {
        label: '支付金额',
        name: 'payAmt'
    }, {
        label: '已退金额',
        name: 'refundAmt'
    }, {
        label: '退款票数',
        name: 'refundTicketCount'
    }, {
        label: '退款手续费',
        name: 'refundFeeSum'
    }, {
        label: '外部订单号',
        name: 'outOrderNo'
    }
]
export const regularOrderHeadSearch = [ // 企业班车订单 - 订单管理
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '订单编号',
        message: '请输入订单编号',
        name: 'orderId',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        data: '',
        formType: 'selectVal',
        label: '购票类型',
        name: 'ticketType',
        option: [{
            label: '次票',
            value: 1
        }, {
            label: '月票',
            value: 2
        }],
        width: '270px'
    }, {
        formType: 'daterange',
        label: '支付时间',
        name: 'payTimeCustom',
        required: false,
        width: '300px'
    }, {
        formType: 'selectVal',
        label: '支付方式',
        name: 'payChannelId',
        option: [{
            label: '自主账户',
            value: 0
        }, {
            label: '支付宝',
            value: 1
        }, {
            label: '微信',
            value: 2
        }, {
            label: '企业账户',
            value: 9
        }],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '支付状态',
        name: 'payState',
        option: [{
            label: '等待支付',
            value: 1
        }, {
            label: '支付成功',
            value: 2
        }, {
            label: '用户退款成功',
            value: 3
        }, {
            label: '后台退款',
            value: 4
        }, {
            label: '后台退款成功',
            value: 5
        }],
        width: '270px'
    }, {
        formType: 'selectVal',
        label: '订单状态',
        name: 'orderState',
        option: [{
            label: '待支付',
            value: 1
        }, {
            label: '已支付',
            value: 2
        }, {
            label: '手动取消',
            value: 3
        }, {
            label: '自动取消',
            value: 4
        }],
        width: '270px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '用户手机号',
        message: '请输入手机号',
        name: 'phone',
        required: false,
        width: '300px'
    }
]
export const regularOrderTableHead = [ // 企业班车订单 - 订单管理
    {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构',
        name: 'supplyName'
    }, {
        label: '企业',
        name: 'demandName'
    }, {
        label: '业务类型',
        name: 'businessTypeName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '班次名称',
        name: 'scheduleName'
    }, {
        label: '班次类型',
        name: 'scheduleTypeName'
    }, {
        label: '购票类型',
        name: 'ticketTypeName'
    }, {
        label: '渠道',
        name: 'channelName'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '下单时间',
        name: 'orderTime'
    }, {
        label: '订单状态',
        name: 'orderStateName'
    }, {
        label: '支付状态',
        name: 'payStateName'
    }, {
        label: '支付时间',
        name: 'payTime'
    }, {
        label: '支付方式',
        name: 'payChannelIdName'
    }, {
        label: '车票数量',
        name: 'ticketCount'
    }, {
        label: '订单总价',
        name: 'orderAmt'
    }, {
        label: '支付金额',
        name: 'payAmt'
    }, {
        label: '已退金额',
        name: 'refundAmt'
    }, {
        label: '退款票数',
        name: 'refundTicketCount'
    }, {
        label: '退款手续费',
        name: 'refundFeeSum'
    }, {
        label: '外部订单号',
        name: 'outOrderNo'
    }
]
export const commuteTravelHeadSearch = [ // 定制公交行程明细 - 订单管理
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '订单编号',
        message: '请输入订单编号',
        name: 'orderId',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '行程编号',
        message: '请输入行程编号',
        name: 'travelId',
        required: false,
        width: '300px'
    }, {
        formType: 'selectVal',
        label: '行程状态',
        name: 'state',
        option: [{
            label: '无效',
            value: 0
        }, {
            label: '有效',
            value: 1
        }, {
            label: '预定',
            value: 2
        }, {
            label: '改签',
            value: 3
        }, {
            label: '退款',
            value: 4
        }, {
            label: '过期',
            value: 5
        }, {
            label: '完成',
            value: 6
        }],
        width: '270px'
    }, {
        formType: 'daterange',
        label: '乘坐日期',
        data: '',
        name: 'customeDetailTime',
        hasTime: 'typeDay',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '用户手机号',
        message: '请输入用户手机号',
        name: 'phone',
        required: false,
        width: '300px'
    }
]
export const commuteTravelTableHead = [ // 定制公交行程明细 - 订单管理
    {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '行程编号',
        name: 'travelId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构',
        name: 'supplyName'
    }, {
        label: '业务类型',
        name: 'businessTypeName'
    }, {
        label: '渠道',
        name: 'channelName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '班次号',
        name: 'scheduleId'
    }, {
        label: '班次名称',
        name: 'scheduleName'
    }, {
        label: '班次类型',
        name: 'scheduleTypeName'
    }, {
        label: '购票类型',
        name: 'ticketTypeName'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '乘坐日期',
        name: 'rideDate'
    }, {
        label: '状态',
        name: 'stateName'
    }, {
        label: '票数',
        name: 'travelNum'
    }, {
        label: '行程原价',
        name: 'travelOriginAmt'
    }, {
        label: '支付金额',
        name: 'travelPayAmt'
    }, {
        label: '退款金额',
        name: 'refundAmt'
    }, {
        label: '退款手续费',
        name: 'refundFee'
    }, {
        label: '核销日期',
        name: 'verificationTime'
    }
]
export const regularTravel1HeadSearch = [ // 企业班车行程明细 - 订单管理
    {
        disabled: false,
        data: '',
        formType: 'input',
        label: '订单编号',
        message: '请输入订单编号',
        name: 'orderId',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '行程编号',
        message: '请输入行程编号',
        name: 'travelId',
        required: false,
        width: '300px'
    }, {
        formType: 'selectVal',
        label: '行程状态',
        name: 'state',
        option: [{
            label: '无效',
            value: 0
        }, {
            label: '有效',
            value: 1
        }, {
            label: '预定',
            value: 2
        }, {
            label: '改签',
            value: 3
        }, {
            label: '退款',
            value: 4
        }, {
            label: '过期',
            value: 5
        }, {
            label: '完成',
            value: 6
        }],
        width: '270px'
    }, {
        formType: 'daterange',
        label: '乘坐日期',
        name: 'customeDetailTime',
        hasTime: 'typeDay',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '用户手机号',
        message: '请输入手机号',
        name: 'phone',
        required: false,
        width: '300px'
    }
]
export const regularTravel1TableHead = [ // 企业班车行程明细 - 订单管理
    {
        label: '订单编号',
        name: 'orderId'
    }, {
        label: '行程编号',
        name: 'travelId'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构',
        name: 'supplyName'
    }, {
        label: '企业',
        name: 'demandName'
    }, {
        label: '业务类型',
        name: 'businessTypeName'
    }, {
        label: '渠道',
        name: 'channelName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '班次号',
        name: 'scheduleId'
    }, {
        label: '班次名称',
        name: 'scheduleName'
    }, {
        label: '班次类型',
        name: 'scheduleTypeName'
    }, {
        label: '购票类型',
        name: 'ticketTypeName'
    }, {
        label: '用户手机号',
        name: 'phone'
    }, {
        label: '乘坐日期',
        name: 'rideDate'
    }, {
        label: '状态',
        name: 'stateName'
    }, {
        label: '票数',
        name: 'travelNum'
    }, {
        label: '行程原价',
        name: 'travelOriginAmt'
    }, {
        label: '支付金额',
        name: 'travelPayAmt'
    }, {
        label: '退款金额',
        name: 'refundAmt'
    }, {
        label: '退款手续费',
        name: 'refundFee'
    }, {
        label: '核销日期',
        name: 'verificationTime'
    }
]
export const commuteInfoHeadSearch = [ // 定制公交收支统计 - 财务统计
    {
        formType: 'daterange',
        label: '日期',
        name: 'workDates',
        hasTime: 'typeMon',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }
]
export const commuteInfoTableHead = [ // 定制公交收支统计 - 财务统计
    {
        label: '日期',
        name: 'gatherDate'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构名称',
        name: 'supplyName'
    }, {
        label: '订单数量',
        name: 'orderNum'
    }, {
        label: '收款金额',
        name: 'proceedsAmt'
    }, {
        label: '退款笔数',
        name: 'refundNum'
    }, {
        label: '退款金额',
        name: 'refundAmt'
    }, {
        label: '净收入',
        name: 'income'
    }
]
export const regularInfoHeadSearch = [ // 企业班车收支统计 - 财务统计
    {
        formType: 'daterange',
        label: '日期',
        name: 'workDates',
        hasTime: 'typeMon',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }
]
export const regularInfoTableHead = [ // 企业班车收支统计 - 财务统计
    {
        label: '日期',
        name: 'gatherDate'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构名称',
        name: 'supplyName'
    }, {
        label: '订单数量',
        name: 'orderNum'
    }, {
        label: '收款金额',
        name: 'proceedsAmt'
    }, {
        label: '退款笔数',
        name: 'refundNum'
    }, {
        label: '退款金额',
        name: 'refundAmt'
    }, {
        label: '净收入',
        name: 'income'
    }
]
export const charterInfoHeadSearch = [ // 包车收支统计 - 财务统计
    {
        formType: 'daterange',
        label: '日期',
        name: 'workDates',
        hasTime: 'typeMon',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }
]
export const charterInfoTableHead = [ // 包车收支统计 - 财务统计
    {
        label: '日期',
        name: 'gatherDate'
    }, {
        label: '机构名称',
        name: 'supplyName'
    }, {
        label: '订单数量',
        name: 'orderNum'
    }, {
        label: '收款金额',
        name: 'proceedsAmt'
    }, {
        label: '退款笔数',
        name: 'refundNum'
    }, {
        label: '退款金额',
        name: 'refundAmt'
    }, {
        label: '净收入',
        name: 'income'
    }
]
export const commuteStatisticsHeadSearch = [ // 定制公交班次统计 - 运营数据
    {
        formType: 'daterange',
        label: '乘坐日期',
        name: 'customeDetailTime',
        hasTime: 'typeDay',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路号',
        message: '请输入线路号',
        name: 'lineNo',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路名称',
        message: '请输入线路名称',
        name: 'lineName',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '班次名称',
        message: '请输入班次名称',
        name: 'scheduleName',
        required: false,
        width: '300px'
    },
    // {
    //     disabled: false,
    //     data: '',
    //     formType: 'input',
    //     label: '班次号',
    //     message: '请输入班次号',
    //     name: 'scheduleId',
    //     required: false,
    //     width: '300px'
    // },  
    // {
    //     disabled: false,
    //     data: '',
    //     formType: 'selectVal',
    //     label: '机构',
    //     name: 'supplyId',
    //     type: 'orzId',
    //     message: '请选择',
    //     required: false,
    //     option: []
    // }
]
export const commuteStatisticsTableHead = [ // 定制公交班次统计 - 运营数据
    {
        label: '乘坐日期',
        name: 'rideDate'
    }, 
    // {
    //     label: '城市',
    //     name: 'cityName'
    // }, 
    // {
    //     label: '机构',
    //     name: 'supplyName'
    // }, 
    // {
    //     label: '班次号',
    //     name: 'scheduleId'
    // }, 
    {
        label: '班次名称',
        name: 'scheduleName'
    }, 
    {
        label: '班次类型',
        name: 'scheduleTypeName'
    },
    {
        label: '线路号',
        name: 'lineNo'
    }, 
    {
        label: '线路名称',
        name: 'lineName'
    }, 
    {
        label: '线路类型',
        name: 'businessTypeName'
    }, 
    {
        label: '最大载客座位总数',
        name: 'seatMaxCount'
    }, 
    {
        label: '已售票数',
        name: 'soldOutTicketNum'
    }, 
    {
        label: '次票张数',
        name: 'thisTicketNum'
    }, 
    {
        label: '次票销售金额',
        name: 'thisTicketAmt'
    }, 
    {
        label: '月票张数',
        name: 'monthlyTicketNum'
    }, 
    {
        label: '月票销售金额',
        name: 'monthlyTicketAmt'
    }, 
    {
        label: '总金额',
        name: 'totalAmt'
    }, 
    {
        label: '上座率',
        name: 'seatRate'
    }
]
export const regularStatisticsHeadSearch = [ // 企业班车班次统计 - 运营数据
    {
        formType: 'daterange',
        label: '乘坐日期',
        name: 'customeDetailTime',
        hasTime: 'typeDay',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '机构',
        name: 'supplyId',
        type: 'orzId',
        message: '请选择',
        required: false,
        option: []
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '班次号',
        message: '请输入班次号',
        name: 'scheduleId',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'input',
        label: '线路号',
        message: '请输入线路号',
        name: 'lineNo',
        required: false,
        width: '300px'
    }, {
        disabled: false,
        data: '',
        formType: 'selectVal',
        label: '企业',
        message: '请选择',
        name: 'demandId',
        required: false,
        option: []
    }
]
export const regularStatisticsTableHead = [ // 企业班车班次统计 - 运营数据
    {
        label: '乘坐日期',
        name: 'rideDate'
    }, {
        label: '城市',
        name: 'cityName'
    }, {
        label: '机构',
        name: 'supplyName'
    }, {
        label: '企业名称',
        name: 'demandName'
    }, {
        label: '班次号',
        name: 'scheduleId'
    }, {
        label: '班次名称',
        name: 'scheduleName'
    }, {
        label: '班次类型',
        name: 'scheduleTypeName'
    }, {
        label: '线路号',
        name: 'lineNo'
    }, {
        label: '线路名称',
        name: 'lineName'
    }, {
        label: '线路类型',
        name: 'businessTypeName'
    }, {
        label: '最大载客座位总数',
        name: 'seatMaxCount'
    }, {
        label: '已售票数',
        name: 'soldOutTicketNum'
    }, {
        label: '次票张数',
        name: 'thisTicketNum'
    }, {
        label: '次票销售金额',
        name: 'thisTicketAmt'
    }, {
        label: '月票张数',
        name: 'monthlyTicketNum'
    }, {
        label: '月票销售金额',
        name: 'monthlyTicketAmt'
    }, {
        label: '总金额',
        name: 'totalAmt'
    }, {
        label: '上座率',
        name: 'seatRate'
    }
]
export const smsReminderHeadSearch = [ // 短信提醒 搜
    {
        disabled: false,
        formType: 'selectVal',
        label: '城市',
        name: 'cityCode',
        message: '请选择城市',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '机构',
        name: 'orzId',
        type: 'orzId',
        message: '请选择机构',
        required: false,
        option: []
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '通知类型',
        name: 'type',
        message: '请选择',
        required: false,
        option: [{
            label: '包车下单后通知',
            value: 1
        }]
    },
    {
        disabled: false,
        formType: 'input',
        label: '手机号',
        message: '请输入手机号',
        data: '',
        name: 'phone',
        required: false,
        width: '270px'
    }
]
export const smsReminderTableHead = [ // 短信提醒 表格
    {
        label: '城市名称',
        name: 'cityName'
    },
    {
        label: '机构名称',
        name: 'orzName'
    },
    {
        label: '通知类型',
        name: 'typeName'
    },
    {
        label: '手机号',
        name: 'phone'
    },
    {
        label: '备注',
        name: 'remark'
    }
]
export const linePersonHeadSearch = [ // 线路征集 - 个人
  {
    disabled: false,
    formType: 'selectVal',
    label: '城市',
    name: 'cityCode',
    message: '请选择城市',
    required: false,
    option: [],
    width: '200px'
  }, {
    disabled: false,
    formType: 'input',
    label: '手机号码',
    message: '请输入手机号码',
    name: 'phone',
    required: false,
    width: '270px'
  }, {
    disabled: false,
    formType: 'daterange',
    label: '添加时间',
    name: 'lineTime',
    required: false,
    width: '300px'
  }
]
export const linePersonTableHead = [ // 线路征集 - 个人
  {
    label: '城市',
    name: 'cityName'
  }, {
    label: '手机号码',
    name: 'phone'
  }, {
    label: '居住地址',
    name: 'homeAddress'
  }, {
    label: '公司地址',
    name: 'companyAddress'
  }, {
    label: '上班时间',
    name: 'goWorkTime'
  }, {
    label: '下班时间',
    name: 'offWorkTime'
  }, {
    label: '居住经度',
    name: 'homeLongitude'
  }, {
    label: '居住纬度',
    name: 'homeLatitude'
  }, {
    label: '公司经度',
    name: 'companyLongitude'
  }, {
    label: '公司纬度',
    name: 'companyLatitude'
  }, {
    label: '其它需求',
    name: 'otherNeed'
  }, {
    label: '添加时间',
    name: 'createTime'
  }
]
export const lineCompanyHeadSearch = [ // 线路征集 - 企业
  {
    disabled: false,
    formType: 'selectVal',
    label: '城市',
    name: 'cityCode',
    message: '请选择城市',
    required: false,
    option: [],
    width: '200px'
  }, {
    disabled: false,
    formType: 'daterange',
    label: '添加时间',
    name: 'lineTime',
    required: false,
    width: '300px'
  }
]
export const lineCompanyTableHead = [ // 线路征集 - 企业
  {
    label: '城市',
    name: 'cityName'
  }, {
    label: '企业名称',
    name: 'companyName'
  }, {
    label: '需求人数',
    name: 'carNumber'
  }, {
    label: '公司地址',
    name: 'companyAddress'
  }, {
    label: '联系方式',
    name: 'phone'
  }, {
    label: '添加时间',
    name: 'createTime'
  }
]

export const cardCouponHeadSearch = [ // 卡券配置
    {
        formType: 'daterange',
        label: '创建时间',
        name: 'createTimeCardCoupon',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '券模板ID',
        message: '请输入券模板ID',
        data: '',
        name: 'templateId',
        required: false,
        width: '270px'
    }, 
    {
        disabled: false,
        formType: 'selectVal',
        label: '选择机构',
        name: 'orzId',
        message: '请选择机构',
        required: false,
        option: [],
        width: '200px'
    },
    {
        disabled: false,
        formType: 'input',
        label: '券名称',
        message: '请输入券名称',
        data: '',
        name: 'couponName',
        required: false,
        width: '270px'
    }
]

export const cardCouponTableHead = [ // 卡券配置
    {
        label: '机构',
        name: 'orzName'
    },
    {
        label: '券名称',
        name: 'couponName'
    },
    {
        label: '券模板ID',
        name: 'templateId'
    },
    {
        label: '创建时间',
        name: 'createTimeStr'
    },
    {
        label: '状态',
        name: 'state'
    }
]

// 支付有礼
// export const payPolitelyHeadSearch = [ // 支付有礼
//     {
//         disabled: false,
//         formType: 'input',
//         label: '活动名称',
//         message: '请输入活动名称',
//         data: '',
//         name: 'payPolitelyName',
//         required: false,
//         width: '270px'
//     },
//     {
//         disabled: false,
//         formType: 'input',
//         label: '活动名称',
//         message: '请输入券模板ID',
//         data: '',
//         name: 'cardCouponId',
//         required: false,
//         width: '270px'
//     }, 
//     {
//         disabled: false,
//         formType: 'selectVal',
//         label: '生效渠道',
//         name: 'channelId',
//         message: '请选择生效渠道',
//         required: false,
//         option: [],
//         width: '200px'
//     },
//     {
//         disabled: false,
//         formType: 'selectVal',
//         label: '业务类型',
//         name: 'businessType',
//         message: '请选择业务类型',
//         required: false,
//         option: [],
//         width: '200px'
//     },
//     {
//         formType: 'daterange',
//         label: '活动时间',
//         name: 'createTime',
//         required: false,
//         width: '300px'
//     }
// ]

// export const payPolitelyTableHead = [ // 支付有礼
//     {
//         label: '活动名称',
//         name: 'cardCouponName'
//     },
//     {
//         label: '活动时间',
//         name: 'cardCouponTime'
//     },
//     {
//         label: '业务类型',
//         name: 'cardCouponType'
//     },
//     {
//         label: '券模板ID',
//         name: 'cardCouponId'
//     },
//     {
//         label: '生效渠道',
//         name: 'channelId'
//     },
//     {
//         label: '活动状态',
//         name: 'cardCouponStatus'
//     }
// ]

// 优惠券礼包

// 优惠券礼包
export const couponBagHeadSearch = [ // 优惠券礼包
    {
        disabled: false,
        formType: 'input',
        label: '礼包名称',
        message: '请输入礼包名称',
        data: '',
        name: 'name',
        required: false,
        width: '270px'
    },
    {
        formType: 'daterange',
        label: '活动时间',
        name: 'createTimeCouponBag',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '选择机构',
        name: 'orzId',
        message: '请选择机构',
        required: false,
        option: [],
        width: '200px'
    }
]

export const couponBagTableHead = [ // 优惠券礼包
    {
        label: '机构',
        name: 'orzName'
    },
    {
        label: '礼包名称',
        name: 'name'
    },
    {
        label: '组合模板ID',
        name: 'groupTemplateId'
    },
    {
        label: '活动时间',
        name: 'createTime'
    },
    {
        label: '操作人',
        name: 'creatorUserName'
    },
    {
        label: '活动状态',
        name: 'state'
    },
    {
        label: '活动链接',
        name: 'activityLink'
    }
]

// 定向发券
export const targetedCouponHeadSearch = [ // 定向发券
    {
        formType: 'daterange',
        label: '发券时间',
        name: 'createTime',
        required: false,
        width: '300px'
    },
    {
        disabled: false,
        formType: 'selectVal',
        label: '发券渠道',
        name: 'channelId',
        message: '请选择生效渠道',
        required: false,
        option: [],
        width: '200px'
    }
]

export const targetedCouponTableHead = [ // 定向发券
    {
        label: '操作人',
        name: 'operatorUserName'
    },
    {
        label: '发券渠道',
        name: 'channelName'
    },
    {
        label: '组合模板名称',
        name: 'groupTemplateName'
    },
    {
        label: '发券时间',
        name: 'sendTimeStr'
    }
]

export const targetedCouponMsgTableHead = [ // 定向发券 - 查看详情
    {
        label: '序号',
        name: 'index'
    },
    {
        label: '用户手机号',
        name: 'phone'
    },
    {
        label: '渠道',
        name: 'channelName'
    },
    {
        label: '发券状态',
        name: 'state'
    },
    {
        label: '发券时间',
        name: 'sendTimeStr'
    }
]

// 意见反馈
// 1-咨询 2-投诉 3-建议 4-表扬
export const opinionResHeadSearch=[
    {
        disabled: false,
        formType: 'selectVal',
        label: '反馈类型',
        name: 'type',
        message: '请选择反馈类型',
        required: false,
        option: [
            {
                type:1,
                value:"咨询"
            },
            {
                type:2,
                value:"投诉"
            },
            {
                type:3,
                value:"建议"
            },
            {
                type:4,
                value:"表扬"
            }
        ],
        width: '200px'
    },
    // 0-未处理 1-已处理
    {
        disabled: false,
        formType: 'selectVal',
        label: '状态',
        name: 'disposeState',
        message: '请选择状态',
        required: false,
        option: [
            {
                state:0,
                value:"未处理"
            },
            {
                state:1,
                value:"已处理"
            }
        ],
        width: '200px'
    }
]

export const opinionResTableHead=[
    {
        label: '状态',
        name: 'disposeState'
    },
    {
        label: '反馈类型',
        name: 'typeName'
    },
    {
        label: '城市',
        name: 'cityName'
    },
    {
        label: '机构',
        name: 'orzName'
    },
    {
        label: '反馈内容',
        name: 'content'
    },
    {
        label: '姓名',
        name: 'name'
    },
    {
        label: '联系方式',
        name: 'phone'
    },
    {
        label: '创建时间',
        name: 'createTime'
    },
    {
        label: '客服回复时间',
        name: 'replyTime'
    }
]