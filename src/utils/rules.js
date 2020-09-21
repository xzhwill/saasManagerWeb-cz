/* eslint-disable indent */
const isChart = (rule, value, callback) => {
    if (value != null && value != '') {
        if (!(/^[a-zA-Z]+$/.test(value))) {
            callback(new Error('请输入字母!'))
        } else {
            callback()
        }
    } else {
        callback()
    }
}
const isPhone = (rule, value, callback) => {
    if (value != null && value != '') {
        if (!(/^(13[0-9]|14[579]|15[0-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value))) {
            callback(new Error('请输入正确格式的手机号!'))
        } else {
            callback()
        }
    } else {
        callback()
    }
}
const isValidateInteger = (rule, value, callback) => {
    if (value != null && value != '') {
        if (!(value % 1 === 0 && value > 0)) {
            callback(new Error('请输入正整数!'))
        } else {
            callback()
        }
    } else {
        callback()
    }
}
const isThanZero = (rule, value, callback) => {
    if (value != null && value != '') {
        if (!(value > 0)) {
            callback(new Error('必须大于零!'))
        } else {
            callback()
        }
    } else {
        callback()
    }
}
const isPostCode = (rule, value, callback) => {
    var reg = /^[0-9]{6}$/
    if (reg.test(value)) {
        callback()
    } else {
        callback(new Error('邮政编码格式有误'))
    }
}
export const addMenuFormRules = { // 系统管理——菜单管理
    menuName: {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur'
    },
    seq: {
        required: true,
        message: '请输入序号',
        trigger: 'blur'
    }
}
export const cityRule = {
    cityCode: {
        required: true,
        message: '请输入城市id',
        trigger: 'blur'
    },
    cityName: {
        required: true,
        message: '请输入城市名称',
        trigger: 'blur'
    },
    citySpell: [{
        required: true,
        message: '请输入城市拼音',
        trigger: 'blur'
    }, {
        validator: isChart,
        message: '请输入拼音',
        trigger: 'blur'
    }]
}
export const addBusFormRules = {
    busNumber: {
        required: true,
        message: '请输入车牌号',
        trigger: 'blur'
    },
    busNo: {
        required: true,
        message: '请输入车辆ID',
        trigger: 'blur'
    },
    busTypeId: {
        required: true,
        message: '请选择车型',
        trigger: 'change'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    supplyId: {
        required: true,
        message: '请选择机构',
        trigger: 'change'
    },
    seatCapacity: {
        required: true,
        message: '请输入载客人数',
        trigger: 'blur'
    }
}
export const addEqpFormRules = {
    eqpNo: {
        required: true,
        message: '请输入设备号',
        trigger: 'blur'
    },
    eqpModel: {
        required: true,
        message: '请输入设备型号',
        trigger: 'blur'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    orzId: {
        required: true,
        message: '请选择机构',
        trigger: 'change'
    },
    eqpBrand: {
        required: true,
        message: '请输入设备品牌',
        trigger: 'blur'
    }
}
export const addBusTypeFormRules = {
    busTypeName: {
        required: true,
        message: '请输入车型名称',
        trigger: 'blur'
    },
    seatCount: [{
        required: true,
        message: '请输入标准载客数',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '请输入正整数',
        trigger: 'blur'
    }],
    seatMaxCount: [{
        required: true,
        message: '请输入最高载客数',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '请输入正整数',
        trigger: 'blur'
    }],
    mileageCount: {
        required: true,
        message: '请输入续航里程',
        trigger: 'blur'
    }
}
export const addComnParamFormRules = {
    code: {
        required: true,
        message: '请输入参数代码',
        trigger: 'blur'
    },
    defaultValue: {
        required: true,
        message: '请输入内容',
        trigger: 'blur'
    },
    description: {
        required: true,
        message: '请输入描述',
        trigger: 'blur'
    },
    cityCode: {
        required: true,
        message: '请选择所属城市',
        trigger: 'blur'
    },
    demandOrzId: {
        required: true,
        message: '请选择需求侧机构',
        trigger: 'blur'
    }
}
export const addInterfaceEncryptRules = {
        secretFields: {
            required: true,
            message: '请输入加密字段',
            trigger: ''
        },
        servletPath: {
            required: true,
            message: '请输入URL',
            trigger: 'blur'
        },
        channelId: {
            required: true,
            message: '请选择渠道',
            trigger: 'blur'
        }
    }
    /* 创建站点 */
export const addPointFormRules = {
        cityCode: {
            required: true,
            message: '请选择城市',
            trigger: 'change'
        },
        // areaId: {
        //   required: true,
        //   message: '请选择区域',
        //   trigger: 'change'
        // },
        siteSid: {
            required: true,
            message: '请输入站点id',
            trigger: 'blur'
        },
        longitude: {
            required: true,
            message: '请输入经度',
            trigger: 'blur'
        },
        latitude: {
            required: true,
            message: '请输入纬度',
            trigger: 'blur'
        },
        siteName: {
            required: true,
            message: '请输入站点名称',
            trigger: 'blur'
        }
    }
    /* 创建区域 */
export const addAreaRules = {
    areaName: {
        required: true,
        message: '请输入区域名称',
        trigger: 'blur'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    }
}
export const addDiscountRules = {
        discountName: {
            required: true,
            message: '请输入折扣名称',
            trigger: 'blur'
        },
        timeArr: [{
            type: 'array',
            required: true,
            message: '请选择生效日期',
            trigger: 'blur'
        }],
        timeArr1: [{
            type: 'array',
            required: true,
            message: '请选择生效月份',
            trigger: 'blur'
        }]
    }
    /* 创建活动 */
export const addActivityRules = {
    bannerName: {
        required: true,
        message: '请输入活动名称',
        trigger: 'blur'
    },
    timeArr: [{
        type: 'array',
        required: true,
        message: '请选择活动时间',
        trigger: 'blur'
    }],
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    channelId: {
        required: true,
        message: '请选择展示渠道',
        trigger: 'change'
    },
    seq: {
        required: true,
        message: '请输入序号',
        trigger: 'blur'
    },
    jumpType: {
        required: true,
        message: '请选择跳转类型',
        trigger: 'change'
    },
    jumpAddr: {
        required: true,
        message: '请输入跳转地址',
        trigger: 'blur'
    }
}
export const contentMarketRule = { // 内容营销管理
    activityName: {
        required: true,
        message: '请填写活动名称',
        trigger: 'blur'
    },
    chooseChannelList: [{
        type: 'array',
        required: true,
        message: '请选择渠道',
        trigger: 'change'
    }],
    chooseBusinessTypeList: [{
        type: 'array',
        required: true,
        message: '请选择业务类型',
        trigger: 'change'
    }],
    dateRange: {
        required: true,
        message: '请选择有效期',
        trigger: 'blur'
    },
    relationType: {
        required: true
    }
}
export const authorizateRule = { // 授权配置
    channelId: {
        required: true,
        message: '请选择渠道',
        trigger: 'change'
    },
    appId: {
        required: true,
        message: '请输入APPId',
        trigger: 'blur'
    }
}
export const channelRule = {
    channelId: {
        required: true,
        message: '请输入渠道ID',
        trigger: ''
    },
    channelName: {
        required: true,
        message: '请输入渠道名称',
        trigger: 'blur'
    }
}
export const channelBusinessRule = {
    cityCode: {
        required: true,
        message: '请选择所属城市',
        trigger: 'blur'
    },
    demandOrzId: {
        required: true,
        message: '请选择需求侧机构',
        trigger: 'blur'
    },
    channelId: {
        required: true,
        message: '请选择渠道',
        trigger: 'blur'
    }
}
export const addSysUserFormRules = {
        username: {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        },
        password: {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
        },
        chinesename: {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
        },
        orzId: {
            required: true,
            message: '请选择机构',
            trigger: 'change'
        },
        state: {
            required: true
        },
        cityList: {
            required: true,
            message: '请选择城市',
            trigger: 'blur'
        },
        demandList: {
            required: true,
            message: '请选择需求侧机构',
            trigger: 'blur'
        },
        supList: {
            required: true,
            message: '请选择供给侧机构',
            trigger: 'blur'
        },
        roleList: {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
        }
    }
    /* wql */
    /* 广播配置校验 */
export const broadcastRules = {
        broadcastName: {
            required: true,
            message: '请输入广播名称',
            trigger: 'blur'
        },
        broadcastContent: {
            required: true,
            message: '请输入广播内容',
            trigger: 'blur'
        },
        cityCode: {
            required: true,
            message: '请选择城市',
            trigger: 'blur'
        },
        seq: [{
                required: true,
                message: '请输入展示顺序',
                trigger: 'blur'
            },
            {
                validator: isValidateInteger,
                message: '请输入正整字',
                trigger: 'blur'
            }
        ],
        channelId: {
            type: 'array',
            required: true,
            message: '请选择渠道',
            trigger: 'change'
        }
    }
    /* 运营人员管理 */
export const addEmergencyContactRules = {
        staffName: {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
        },
        phone: [{
                required: true,
                message: '请输入手机号',
                trigger: 'blur'
            },
            {
                validator: isPhone,
                message: '请输入正确的手机号',
                trigger: 'blur'
            }
        ],
        cityList: {
            required: true,
            message: '请选择城市',
            trigger: 'blur'
        },
        dutyType: {
            required: true,
            message: '请选择类型',
            trigger: 'blur'
        }
    }
    /* 线路征集配置 */
export const addCollectLineRules = {
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'blur'
    },
    goWorkStart: {
        required: true,
        message: '请选择上班开始时间',
        trigger: 'blur'
    },
    goWorkEnd: {
        required: true,
        message: '请选择上班结束时间',
        trigger: 'blur'
    },
    offWorkStart: {
        required: true,
        message: '请选择下班开始时间',
        trigger: 'blur'
    },
    offWorkEnd: {
        required: true,
        message: '请选择下班结束时间',
        trigger: 'blur'
    },
    runInterval: [{
        required: true,
        message: '请输入时间间隔',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '请输入正整字',
        trigger: 'blur'
    }]
}
export const distributionRules = {
        cityCode: {
            required: true,
            message: '请选择城市',
            trigger: 'blur'
        },
        channelName: {
            required: true,
            message: '请输入渠道名称',
            trigger: 'blur'
        },
        contacts: {
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
        },
        phone: [{
                required: true,
                message: '请输入手机号',
                trigger: 'blur'
            },
            {
                validator: isPhone,
                message: '请输入正确的手机号',
                trigger: 'blur'
            }
        ],
    }
    /* 单模板 */
export const marketCouponSingleRule = {
    templateName: {
        required: true,
        message: '请输入券模板名称',
        trigger: 'blur'
    },
    faceValueDisc: [{
        required: true,
        message: '请输入折扣',
        trigger: 'blur'
    }],
    effectiveDays: [{
            required: true,
            message: '请输入有效天数',
            trigger: 'blur'
        },
        {
            validator: isValidateInteger,
            message: '请输入正整数',
            trigger: 'blur'
        }
    ],
    effectiveTimes: [{
        required: true,
        message: '请输入使用次数',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '请输入正整数',
        trigger: 'blur'
    }],
    couponQuantity: [{
        required: true,
        message: '请输入张数',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '请输入正整数',
        trigger: 'blur'
    }],
    templateWeight: [{
        required: true,
        message: '请输入权重',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '请输入正整字',
        trigger: 'blur'
    }],
    faceValueYuan: [{
        required: true,
        message: '请输入面值',
        trigger: 'blur'
    }, {
        validator: isThanZero,
        message: '必须大于零',
        trigger: 'blur'
    }],
    minLimitYuan: [{
        required: false,
        message: '请输入最低消费金额',
        trigger: 'blur'
    }],
    useRuleValueYuan: [{
        required: false,
        message: '请输入使用门槛',
        trigger: 'blur'
    }],
    discountLimitYuan: [{
        required: false,
        message: '请输入优惠上限',
        trigger: 'blur'
    }],
    dailyUseLimit: [{
        required: false,
        message: '请输入使用限制',
        trigger: 'blur'
    }],
    chooseChannel: [{
        type: 'array',
        required: true,
        message: '请选择渠道',
        trigger: 'change'
    }],
    businessTypeList: [{
        type: 'array',
        required: true,
        message: '请选择业务类型',
        trigger: 'change'
    }],
    checkedCityList: [{
        type: 'array',
        required: true,
        message: '请选择城市',
        trigger: 'change'
    }],
    ticketTypeLimits: [{
        type: 'array',
        required: true,
        message: '请选择购票类型',
        trigger: 'change'
    }]
}
export const marketCouponGroupRule = { // 组合模板
    templateName: {
        required: true,
        message: '请输入模板名称',
        trigger: 'blur'
    }
}
export const marketActivityRule = { // 营销活动
    activityName: {
        required: true,
        message: '请输入活动名称',
        trigger: 'blur'
    },
    dateRange: [{
        type: 'array',
        required: true,
        message: '请选择生效日期',
        trigger: 'change'
    }],
    chooseChannelList: [{
        type: 'array',
        required: true,
        message: '请选择渠道',
        trigger: 'change'
    }],
    chooseBusinessTypeList: [{
        type: 'array',
        required: true,
        message: '请选择业务类型',
        trigger: 'change'
    }],
    templateId1: [{
        required: true,
        message: '请选择优惠券',
        trigger: 'change'
    }],
    launchQuantity1: [{
        required: true,
        message: '请输入投放数量',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '必须为正整数',
        trigger: 'blur'
    }],
    templateId2: [{
        required: true,
        message: '请选择优惠券',
        trigger: 'change'
    }],
    launchQuantity2: [{
        required: true,
        message: '请输入投放数量',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '必须为正整数',
        trigger: 'blur'
    }],
    limitJoinTimes: [{
        required: true,
        message: '请配置活动限制',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '必须为正整数',
        trigger: 'blur'
    }],
    warnQuantity: [{
        required: true,
        message: '请输入预警值',
        trigger: 'blur'
    }, {
        validator: isValidateInteger,
        message: '必须为正整数',
        trigger: 'blur'
    }],
    warnPhone: [{
        required: true,
        message: '请输入预警手机号',
        trigger: 'blur'
    }, {
        validator: isPhone,
        message: '手机号格式不正确',
        trigger: 'blur'
    }]
}
export const compensateRules = {
        channelId: {
            required: true,
            message: '请选择渠道',
            trigger: 'change'
        },
        activityId: {
            required: true,
            message: '请选择活动',
            trigger: 'change'
        },
        phone: [{
                required: true,
                message: '请输入手机号',
                trigger: 'blur'
            },
            {
                validator: isPhone,
                message: '手机号格式不正确',
                trigger: 'blur'
            }
        ]
    }
    /* 添加用户指南 */
export const addUserGuideFormRules = {
        question: {
            required: true,
            message: '请输入问题',
            trigger: 'blur'
        },
        answer: {
            required: true,
            message: '请输入答案',
            trigger: 'blur'
        },
        seq: [{
                required: true,
                message: '请输入顺序',
                trigger: 'blur'
            },
            {
                validator: isValidateInteger,
                message: '请输入正整数',
                trigger: 'blur'
            }
        ],
        cityCode: {
            required: true,
            message: '请选择城市',
            trigger: 'change'
        },
        channelId: {
            required: true,
            message: '请选择渠道',
            trigger: 'change'
        }
    }
    /* 添加票面 */
export const ticketImgRule = {
        displayName: {
            required: true,
            message: '请输入票面名称',
            trigger: 'blur'
        },
        channelId: {
            required: true,
            message: '请选择渠道',
            trigger: 'change'
        },
        timeArr: [{
            type: 'array',
            required: true,
            message: '请选择生效日期',
            trigger: 'blur'
        }],
        iconTpe: {
            required: true
        },
        state: {
            required: true
        },
        iconAddress: {
            required: true,
            message: '请上传票面图片',
            trigger: 'change'
        }
    }
    /**
     * wml
     */
export const adddemandUserFormRules = {
    demandId: {
        required: true,
        message: '请选择企业',
        trigger: 'blur'
    },
    username: {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
    },
    password: {
        required: true,
        message: '请输入密码',
        trigger: 'blur'
    },
    chinesename: {
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
    },
    phone: {
        required: true,
        message: '请输入手机号',
        trigger: 'blur'
    }
}
export const addDemandCompanyFormRules = {
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'blur'
    },
    demandId: {
        required: true,
        message: '请选择企业',
        trigger: 'blur'
    }
}
export const cacheRule = {
    url: {
        required: true,
        message: '请输入url',
        trigger: 'blur'
    },
    cacheKey: {
        required: true,
        message: '请输入key',
        trigger: 'blur'
    }
}
export const addDriverFormRules = {
    driverName: {
        required: true,
        message: '请输入司机姓名',
        trigger: 'blur'
    },
    driverNo: {
        required: true,
        message: '请输入司机编号',
        trigger: 'blur'
    },
    supplyId: {
        required: true,
        message: '请选择机构',
        trigger: 'change'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    phone: [{
        required: true,
        message: '请输入手机号',
        trigger: 'blur'
    }]
}
export const cityChannelRule = {
    channelId: {
        required: true,
        message: '请选择渠道',
        trigger: 'change'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    showBusinessTypeList: [{
        type: 'array',
        required: true,
        message: '请至少选择一个生效业务',
        trigger: 'change'
    }]
}
export const addOrgnizationFormRules = { // 机构
        orzId: {
            required: true,
            message: '请输入机构号',
            trigger: 'blur'
        },
        orzName: {
            required: true,
            message: '请输入机构名称',
            trigger: 'blur'
        },
        cityCode: {
            required: true,
            message: '请选择所属城市',
            trigger: 'change'
        },
        state: {
            required: true
        }
    }
    /**
     * LXP
     */
    /* 创建班次 */
export const addScheduleFormRules = {
        className: {
            required: true,
            message: '请输入班次名称',
            trigger: 'blur'
        },
        lineId: {
            required: true,
            message: '请选择线路',
            trigger: 'change'
        },
        busTypeId: {
            required: true,
            message: '请选择车型',
            trigger: 'change'
        },
        seatMaxCount: {
            required: true,
            message: '请输入最大载客数',
            trigger: 'blur'
        },
        dateRange: [{
            type: 'array',
            required: true,
            message: '请选择有效期',
            trigger: 'change'
        }],
        supplyOrzId: {
            required: true,
            message: '请选择供给侧',
            trigger: 'change'
        },
        startTime: {
            required: true,
            message: '请输入发车时间',
            trigger: 'blur'
        },
        endTime: {
            required: true,
            message: '请输入末班车时间',
            trigger: 'blur'
        },
        scheduleFrequence: {
            required: true,
            message: '请输入发车频率',
            trigger: 'blur'
        },
        cityCode: {
            required: true,
            message: '请选择城市',
            trigger: 'change'
        },
        businessType: {
            required: true,
            message: '请选择线路类型',
            trigger: 'change'
        },
        priceYuan: {
            required: true,
            message: '请填写价格',
            trigger: 'blur'
        }
    }
    //退票规则
export const ruleRules = {
        cityCode: {
            required: true,
            message: '请选择所属城市',
            trigger: 'change'
        },
        businessType: {
            required: true,
            message: '请选择业务类型',
            trigger: 'change'
        },
        timeGroup: {
            required: true,
            message: '请选择生效时间',
            trigger: 'change'
        },
        noRefundTime: {
            required: true,
            message: '请输入不可退款时间',
            trigger: 'blur'
        }
    }
    //通票规则
export const thoughTicketRules = {
        description: {
            required: true,
            message: '请填写通票描述',
            trigger: 'blur',
        },
        ticketName: {
            required: true,
            message: '请填写通票名称',
            trigger: 'blur',
        },
        price: {
            required: true,
            message: '请填写价格',
            trigger: 'blur',
        },
        showPrice: {
            required: true,
            message: '请填写展示票价',
            trigger: 'blur',
        },
        effectiveDays: {
            required: true,
            message: '请填写有效天数',
            trigger: 'blur',
        },
        sellNum: {
            required: true,
            message: '请填写售票数量',
            trigger: 'blur',
        },
        verificationNum: {
            required: true,
            message: '请填写核销次数',
            trigger: 'blur',
        }
    }
    //
export const charteredUpShelfRules = {
  updatesName: {
    required: true,
    message: '请填写商品名称',
    trigger: 'blur'
  },
  busTypeId: {
    required: true,
    message: '请选择车型',
    trigger: 'change'
  },
  cityCode: {
    required: true,
    message: '请选择城市',
    trigger: 'blur'
  },
  prepareTime: {
    required: true,
    message: '请填写最小准备时间',
    trigger: 'blur'
  },
  startingPriceYuan: {
    required: true,
    message: '请填写起步价',
    trigger: 'blur'
  }
}
export const addCarpoolFormRules = {
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'blur'
    },
    businessType: {
        required: true,
        message: '请选择线路类型',
        trigger: 'blur'
    },
    lineId: {
        required: true,
        message: '请选择线路',
        trigger: 'blur'
    },
    startTime: {
        required: true,
        message: '请填写发车时间:HH:mm',
        trigger: 'blur'
    },
    upSiteId: {
        required: true,
        message: '请选上车站点',
        trigger: 'blur'
    },
    downSiteId: {
        required: true,
        message: '请选择下车站点',
        trigger: 'blur'
    },
    rideDate: {
        required: true,
        message: '请选择乘车日期',
        trigger: 'blur'
    }
}
export const customePhoneRules = {
    servicePhone: {
        required: true,
        message: '请输入客服电话',
        trigger: 'blur'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
  type: {
    required: true,
    message: '请选择配置类型',
    trigger: 'change'
  }
}
export const lineRules = {
    lineNo: {
        required: true,
        message: '请输入线路号',
        trigger: 'blur'
    },
    lineName: {
        required: true,
        message: '请输入线路名称',
        trigger: 'blur'
    },
    businessType: {
        required: true,
        message: '请选择线路类型',
        trigger: 'blur'
    },
    frequency: {
        required: true,
        message: '请输入发车频率',
        trigger: 'blur'
    },
    firstTime: {
        required: true,
        message: '请输入首班发车时间',
        trigger: 'blur'
    },
    lastTime: {
        required: true,
        message: '请输入末班发车时间',
        trigger: 'blur'
    },
    forecastTime: {
        required: true,
        message: '请输入预计时长',
        trigger: 'blur'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    displayPriceYuan: {
        required: true,
        message: '请输入展示价格',
        trigger: 'blur'
    },
    startTime: {
        required: true,
        message: '请选择有效期',
        trigger: 'blur'
    },
  supplyId: {
    required: true,
    message: '请选择供给侧',
    trigger: 'change'
  },
    demandId: {
        required: true,
        message: '请选择需求侧',
        trigger: 'change'
    }
}
export const roleManageAdd = {
        roleName: {
            required: true,
            message: '请填写角色名称',
            trigger: 'blur'
        },
        state: {
            required: true
        }
    }
    // 新建企业班车线路
export const companyBusLineRules = {
        lineNo: {
            required: true,
            message: '请输入线路号',
            trigger: 'blur'
        },
        lineName: {
            required: true,
            message: '请输入线路名称',
            trigger: 'blur'
        },
        lineProperty: {
            required: true,
            message: '请选择线路性质',
            trigger: 'change'
        },
        isTicketToRide: {
            required: true,
            message: '请选择乘车形式',
            trigger: 'change'
        },
        frequency: {
            required: true,
            message: '请输入发车频率',
            trigger: 'blur'
        },
        firstTime: {
            required: true,
            message: '请输入首班发车时间',
            trigger: 'blur'
        },
        lastTime: {
            required: true,
            message: '请输入末班发车时间',
            trigger: 'blur'
        },
        forecastTime: {
            required: true,
            message: '请输入预计时长',
            trigger: 'blur'
        },
        cityCode: {
            required: true,
            message: '请选择城市',
            trigger: 'change'
        },
        displayPriceYuan: {
            required: false,
            message: '请输入展示价格',
            trigger: 'blur'
        },
        startTime: {
            required: true,
            message: '请选择有效期',
            trigger: 'blur'
        },
        orzId: {
            required: true,
            message: '请选择供给侧',
            trigger: 'change'
        },
        demandId: {
            required: true,
            message: '请选择需求侧',
            trigger: 'change'
        },
        siteArr: {
            required: true,
            message: '请选择站点',
            trigger: 'change'
        }
    }
    // 新建企业班车班次
export const companyBusScheduleFormRules = {
    className: {
        required: true,
        message: '请输入班次名称',
        trigger: 'blur'
    },
    lineId: {
        required: true,
        message: '请选择线路',
        trigger: 'change'
    },
    busTypeId: {
        required: true,
        message: '请选择车型',
        trigger: 'change'
    },
    timeArr: [{
        type: 'array',
        required: true,
        message: '请选择有效期',
        trigger: 'change'
    }],
    supplyOrzId: {
        required: true,
        message: '请选择供给侧',
        trigger: 'change'
    },
    startTime: {
        required: true,
        message: '请输入发车时间',
        trigger: 'blur'
    },
    endTime: {
        required: true,
        message: '请输入末班车时间',
        trigger: 'blur'
    },
    scheduleFrequence: {
        required: true,
        message: '请输入发车频率',
        trigger: 'blur'
    },
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    seatMaxCount: {
        required: true,
        message: '请输入最大载客数',
        trigger: 'blur'
    },
    workingCirculate: {
        required: true,
        message: '请选择运行周期',
        trigger: 'change'
    },
    state: {
        required: true,
        message: '请选择班次状态',
        trigger: 'change'
    },
    classType: {
        required: true,
        message: '请选择班次类型',
        trigger: 'change'
    },
    priceYuan: {
        required: true,
        message: '请输入价格',
        trigger: 'blur'
    }
}

// 短信提醒
export const addSmsReminderFormRules = {
    cityCode: {
        required: true,
        message: '请选择城市',
        trigger: 'change'
    },
    orzId: {
        required: true,
        message: '请选择机构',
        trigger: 'change'
    },
    type: {
        required: true,
        message: '请选择类型',
        trigger: 'change'
    },
    phone: {
        required: true,
        message: '请输入手机号',
        trigger: 'blur'
    }
}

//卡券配置
export const addCardCouponFormRules = {
    orzId:{
        required: true,
        message: '请输入机构',
        trigger: 'change'
    },
    channelIds: {
        type: 'array',
        required: true,
        message: '请选择渠道',
        trigger: 'change'
    },
    businessTypes: {
        type: 'array',
        required: true,
        message: '请选择业务类型',
        trigger: 'change'
    },
    templateId: {
        required: true,
        message: '请输入券模板ID',
        trigger: 'blur'
    },
    couponName: {
        required: true,
        message: '请输入券名称',
        trigger: 'blur'
    },
    ticketTypes:{
        type: 'array',
        required: true,
        message: '请选择购票类型限制',
        trigger: 'change'
    }
}
// 支付有礼
export const addPayPolitelyFormRules = {
    payPolitelyName: {
        required: true,
        message: '请输入活动名称',
        trigger: 'blur'
    },
    createTime:{
        required: true,
        message: '请选择活动时间',
        trigger: 'change'
    },
    webtex: {
        required: true,
        message: '请输入活动页面文案',
        trigger: 'blur'
    },
    paytex: {
        required: true,
        message: '请输入优惠券金额展示',
        trigger: 'blur'
    },
    paynum: {
        required: true,
        message: '请输入支付满足金额',
        trigger: 'blur'
    }
}

// 优惠券礼包
export const addCouponBagFormRules = {
    orzId: {
        required: true,
        message: '请选择机构',
        trigger: 'blur'
    },
    name: {
        required: true,
        message: '请输入礼包名称',
        trigger: 'blur'
    },
    createTime:{
        required: true,
        message: '请选择活动时间',
        trigger: 'change'
    },
    userType: {
        required: true,
        message: '请选择用户',
        trigger: 'blur'
    },
    groupTemplateId: {
        required: true,
        message: '请输入组合模板ID',
        trigger: 'blur'
    },
    ruleContent: {
        required: true,
        message: '请输入活动规则',
        trigger: 'blur'
    },
    bannerUrl:{
        required: true,
        message: '请上传活动页主视觉',
        trigger: 'change'
    }
}
