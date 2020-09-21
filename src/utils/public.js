/**
 * 缓存登录成功的信息
 * @param modules 路由列表
 * @param login 账户信息
 * @param rmList
 */
export function sessionLoginInfo(modules, login, rmList) {
    sessionStorage.setItem('modules', JSON.stringify(modules))
    sessionStorage.setItem('login', JSON.stringify(login))
    sessionStorage.setItem('rmList', JSON.stringify(rmList))
}

/**
 * 清空登录成功的缓存
 */
export function clearSessionLoginInfo() {
    sessionStorage.removeItem('modules')
    sessionStorage.removeItem('login')
}

/**
 * 格式化路由列表，序列化成vue-router需要的格式
 * @param modules 路由列表
 * @returns {{path: string, component: (function(*=)), children: Array}[]}
 */
export function formatRouter(modules) {
    const routes = [{
        path: '/container',
        component: resolve => require([`../pages/Container.vue`], resolve),
        children: []
    }]
    modules.forEach(item => {
        if((item.menuName == "营销活动")){
            item.link = "";
        }
        const children = item.menu
        if (item.link && item.link !== '') {
            routes[0].children.push({
                path: `/${item.link}`,
                component: resolve => require([`../pages/${item.limodulenk}/${item.link}.vue`], resolve),
                children: [],
                meta: {
                    title: `${item.menuName}`
                }
            })
        } else {
            if (item.menu && Array.isArray(item.menu) && item.menu.length) {
                for (let i = 0; i < children.length; i++) {
                    routes[0].children.push({
                        path: `/${children[i].link}`,
                        component: resolve => require([`../pages/${children[i].link}/${children[i].link}.vue`], resolve),
                        meta: {
                            title: `${children[i].menuName}`,
                            parentTitle: `${item.menuName}`
                        }
                    })
                }
            }
        }
    })
    routes[0].children.push({
        path: `/addRole`,
        name: `addRole`,
        component: resolve => require([`../pages/roleManage/addRole.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addMenu`,
        name: `addMenu`,
        component: resolve => require([`../pages/menuManage/addMenu.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addCity`,
        name: `addCity`,
        component: resolve => require([`../pages/cityManage/addCity.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addOperate`,
        name: `addOperate`,
        component: resolve => require([`../pages/operateManage/addOperate.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addInterfaceWhitelist`,
        name: `addInterfaceWhitelist`,
        component: resolve => require([`../pages/interfaceWhitelist/addInterfaceWhitelist.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addCache`,
        name: `addCache`,
        component: resolve => require([`../pages/clearCache/addCache.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addBusType`,
        name: `addBusType`,
        component: resolve => require([`../pages/busTypeManage/addBusType.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addComnParam`,
        name: `addComnParam`,
        component: resolve => require([`../pages/comnParamManage/addComnParam.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addSysUser`,
        name: `addSysUser`,
        component: resolve => require([`../pages/sysUserManage/addSysUser.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addInterfaceEncrypt`,
        name: `addInterfaceEncrypt`,
        component: resolve => require([`../pages/interfaceEncrypt/addInterfaceEncrypt.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addChannel`,
        name: `addChannel`,
        component: resolve => require([`../pages/channel/addChannel.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addSchedule`,
        name: `addSchedule`,
        component: resolve => require([`../pages/schedulingManage/addSchedule.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addArea`,
        name: `addArea`,
        component: resolve => require([`../pages/areaManage/addArea.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addComnParamDefault`,
        name: `addComnParamDefault`,
        component: resolve => require([`../pages/comnParamDefault/addComnParamDefault.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addComnParamDefaultList`,
        name: `addComnParamDefaultList`,
        component: resolve => require([`../pages/comnParamDefault/addComnParamDefaultList.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addActivity`,
        name: `addActivity`,
        component: resolve => require([`../pages/activityManage/addActivity.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addClassNotice`,
        name: `addClassNotice`,
        component: resolve => require([`../pages/classNotice/addClassNotice.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addUserGuide`,
        name: `addUserGuide`,
        component: resolve => require([`../pages/userGuideManage/addUserGuide.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addChannelBusiness`,
        name: `addChannelBusiness`,
        component: resolve => require([`../pages/channelBusiness/addChannelBusiness.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addBus`,
        name: `addBus`,
        component: resolve => require([`../pages/busManage/addBus.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addDriver`,
        name: `addDriver`,
        component: resolve => require([`../pages/driverManage/addDriver.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addDiscount`,
        name: `addDiscount`,
        component: resolve => require([`../pages/discountManage/addDiscount.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addBroadcast`,
        name: `addBroadcast`,
        component: resolve => require([`../pages/broadcastManage/addBroadcast.vue`], resolve)
    })
    routes[0].children.push({
        path: `/copyCity`,
        name: `copyCity`,
        component: resolve => require([`../pages/userGuideManage/copyCity.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addEmergencyContact`,
        name: `addEmergencyContact`,
        component: resolve => require([`../pages/emergencyContact/addEmergencyContact.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addCollectLine`,
        name: `addCollectLine`,
        component: resolve => require([`../pages/collectLineManage/addCollectLine.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addOrgnization`,
        name: `addOrgnization`,
        component: resolve => require([`../pages/orgnization/addOrgnization.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addCityInvoice`,
        name: `addCityInvoice`,
        component: resolve => require([`../pages/cityInvoice/addCityInvoice.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addTicketImg`,
        name: `addTicketImg`,
        component: resolve => require([`../pages/ticketImgManage/addTicketImg.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addCityChannel`,
        name: `addCityChannel`,
        component: resolve => require([`../pages/cityChannel/addCityChannel.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addEqp`,
        name: `addEqp`,
        component: resolve => require([`../pages/eqp/addEqp.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addDistribution`,
        name: `addDistribution`,
        component: resolve => require([`../pages/distributionManage/addDistribution.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addMarketCouponSingle`,
        name: `addMarketCouponSingle`,
        component: resolve => require([`../pages/marketCouponSingle/addMarketCouponSingle.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addAuthor`,
        name: `addAuthor`,
        component: resolve => require([`../pages/authorizeConf/addAuthor.vue`], resolve)
    })
    routes[0].children.push({
        path: `/ticketOpening`,
        name: `ticketOpening`,
        component: resolve => require([`../pages/ticketOpening/ticketOpening.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addMarketCouponGroup`,
        name: `addMarketCouponGroup`,
        component: resolve => require([`../pages/marketCouponGroup/addMarketCouponGroup.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addMarketContentActivity`,
        name: `addMarketContentActivity`,
        component: resolve => require([`../pages/marketContentActivity/addMarketContentActivity.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addMarketActivity`,
        name: `addMarketActivity`,
        component: resolve => require([`../pages/marketActivity/addMarketActivity.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addPhone`,
        name: `addPhone`,
        component: resolve => require([`../pages/charterNotice/addPhone.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addLine`,
        name: `addLine`,
        component: resolve => require([`../pages/lineManage/addLine.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addPlan`,
        name: `addPlan`,
        component: resolve => require([`../pages/planManage/addPlan.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addTicket`,
        name: `addTicket`,
        component: resolve => require([`../pages/ticketPriceManage/addTicket.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addReturnRuleConfiguration`,
        name: `addReturnRuleConfiguration`,
        component: resolve => require([`../pages/refundRule/addReturnRuleConfiguration.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addThroughTicket`,
        name: `addThroughTicket`,
        component: resolve => require([`../pages/throughTicketManage/addThroughTicket.vue`], resolve)
    })
    routes[0].children.push({
        path: `/receiptCarpool`,
        name: `receiptCarpool`,
        component: resolve => require([`../pages/receiptCarpool/receiptCarpool.vue`], resolve)
    })
    routes[0].children.push({
        path: `/receipt`,
        name: `receipt`,
        component: resolve => require([`../pages/receipt/receipt.vue`], resolve)
    })
    routes[0].children.push({
        path: `/refundRule`,
        name: `refundRule`,
        component: resolve => require([`../pages/refundRule/refundRule.vue`], resolve)
    })
    routes[0].children.push({
        path: `/charteredUpShelf`,
        name: `charteredUpShelf`,
        component: resolve => require([`../pages/charteredUpShelf/charteredUpShelf.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addCharteredUpShelf`,
        name: `addCharteredUpShelf`,
        component: resolve => require([`../pages/charteredUpShelf/addCharteredUpShelf.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addReceiptCarpool`,
        name: `addReceiptCarpool`,
        component: resolve => require([`../pages/receiptCarpool/addReceiptCarpool.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addDemandCompany`,
        name: `addDemandCompany`,
        component: resolve => require([`../pages/demandCompany/addDemandCompany.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addDemandUser`,
        name: `addDemandUser`,
        component: resolve => require([`../pages/demandUser/addDemandUser.vue`], resolve)
    })
    routes[0].children.push({
        path: `/plan`,
        name: `plan`,
        component: resolve => require([`../pages/planManage/plan.vue`], resolve)
    })
    routes[0].children.push({
        path: `/orderEnterprise`,
        name: `orderEnterprise`,
        component: resolve => require([`../pages/orderEnterprise/orderEnterprise.vue`], resolve)
    })
    routes[0].children.push({
        path: `/lineDetailMap`,
        name: `lineDetailMap`,
        component: resolve => require([`../pages/receiptCarpool/lineDetailMap.vue`], resolve)
    })
    routes[0].children.push({
        path: `/companyBusAddLine`,
        name: `companyBusAddLine`,
        component: resolve => require([`../pages/companyLine/companyBusAddLine.vue`], resolve)
    })
    routes[0].children.push({
        path: `/companyBusAddSchedule`,
        name: `companyBusAddSchedule`,
        component: resolve => require([`../pages/companySchedule/companyBusAddSchedule.vue`], resolve)
    })
    routes[0].children.push({
        path: `/addSmsReminder`,
        name: `addSmsReminder`,
        component: resolve => require([`../pages/smsReminder/addSmsReminder.vue`], resolve)
    })
    //新建新建券模板
    routes[0].children.push({
        path: `/addCardCoupon`,
        name: `addCardCoupon`,
        component: resolve => require([`../pages/cardCouponManage/addCardCoupon.vue`], resolve)
    })
    //支付有礼-新建活动
    routes[0].children.push({
        path: `/addPayPolitely`,
        name: `addPayPolitely`,
        component: resolve => require([`../pages/payPolitelyManage/addPayPolitely.vue`], resolve)
    })
    //优惠券礼包-新建礼包
    routes[0].children.push({
        path: `/addCouponBag`,
        name: `addCouponBag`,
        component: resolve => require([`../pages/couponBagManage/addCouponBag.vue`], resolve)
    })
    //定向发券-查看详情
    routes[0].children.push({
        path: `/targetedCouponMsg`,
        name: `targetedCouponMsg`,
        component: resolve => require([`../pages/targetedCouponManage/targetedCouponMsg.vue`], resolve),
        meta: {
            parentTitle: "营销活动",
            title: "定向发券详情",
        }
    })
    // 意见反馈
    routes[0].children.push({
        path: `/opinionResReply`,
        name: `opinionResReply`,
        component: resolve => require([`../pages/opinionRes/opinionResReply.vue`], resolve)
    })
    return routes
}

/**
 * 清空对象
 * @param obj
 */
export function clearObj(obj) {
    for (const key in obj) {
        obj[key] = undefined
    }
}

/**
 * 清空对象但不保存日期
 * @param obj
 */
export function clearObjNoDate(obj) {
    for (const key in obj) {
        if (key.indexOf('Time') > -1 || key.indexOf('Date') > -1) {

        } else {
            obj[key] = undefined
        }
    }
}

/**
 * 移除空格
 * @param str 移除空格的str
 * @returns {*} 返回移除后的字段
 * @constructor
 */
export function Trim(str) {
    if (str != null) {
        return str.replace(/\s/g, '')
    } else {
        return true
    }
}

/**
 * 动态生成颜色
 * @returns {string} 返回的为十六进制的颜色值
 */
export function setColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16)
}

/**
 * 分转元
 * @param fen
 * @returns {string}
 */
export function formatRMB(fen) {
    if (typeof fen === 'number') {
        return (fen / 100).toFixed(2) + '元'
    } else {
        return ''
    }
}

/**
 * 元转分
 * @param yuan
 * @returns {number}
 */
export function toFen(yuan) {
    yuan = parseFloat(yuan)
        // yuan = yuan.toFixed(travelReportForms)
    yuan = yuan * 100
    yuan = Math.round(yuan)
    yuan = Math.trunc(yuan)
    return yuan
}

/**
 * 图片限制
 * @param file 需要验证的图片
 * @param size 尺寸
 * @returns {{isFlag: boolean, errorMessage: string}}
 */
export function checkedImage(file, size) {
    const imageType = (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')
    const isLt2M = file.size / 1024 < size
    let obj = {
        isFlag: true,
        errorMessage: ''
    }
    obj.isFlag = imageType && isLt2M
    if (!imageType) {
        obj.errorMessage = '图片格式只能支持JPG，PNG，GIF'
        obj.isFlag = false
    }
    if (!isLt2M) {
        obj.errorMessage = '图片大小不能超过' + size + 'K!'
        obj.isFlag = false
    }
    return obj
}

/**
 * EXCEL限制
 * @param file 需要验证的图片
 * @param size 尺寸
 * @returns {{isFlag: boolean, errorMessage: string}}
 */
export function checkExcel(file, size) {
    const fileName = file.name
    const isLt2M = file.size / 1024 < size
    let suffix = ''
    let obj = {
        isFlag: true,
        errorMessage: ''
    }
    try {
        var flieArr = fileName.split('.')
        suffix = flieArr[flieArr.length - 1]
    } catch (err) {
        obj.isFlag = false
        console.log(err)
        return obj
    }
    // 匹配 excel
    var excelist = ['xls', 'xlsx']
    suffix = excelist.some(function(item) {
        return item == suffix
    })

    obj.isFlag = suffix && isLt2M
    if (!suffix) {
        obj.errorMessage = '文件格式只能支持 xls, xlsx'
        obj.isFlag = false
    } else if (!isLt2M) {
        obj.errorMessage = '文件大小不能超过' + size + 'K!'
        obj.isFlag = false
    }
    return obj
}

/**
 * 对数组中的对象进行去重
 * @param arr 需要处理的对象数组
 * @param id 去重的条件
 * @returns {*}
 */
export function removeRepeatObj(arr, id) {
    let obj = {}
    let returnArr
    returnArr = arr.reduce(function(item, next) {
        if (obj[next[id]]) {} else {
            obj[next[id]] = true
            item.push(next)
        }
        return item
    }, [])
    return returnArr
}

/**
 * 对时间进行转化
 * @param str 需要转化的时间对象
 * @returns {string}
 */
export function setTime(str) {
    if (typeof str === 'string') {} else {
        str = str.toString()
    }
    let str1 = str.substring(0, 4)
    let str2 = str.substring(4, 6)
    let str3 = ''
    if (str.length > 6) {
        str3 = str.substring(6, 8)
        return str1 + '-' + str2 + '-' + str3
    } else {
        return str1 + '-' + str2
    }
}

/**
 * 获取当前时间（年月日）
 */
export function getYearMonthDayTime() {
    let date = new Date()
    let obj = {}
    obj.year = date.getFullYear()
    obj.month = date.getMonth() + 1
    obj.day = date.getDate()
    if (obj.month < 10) {
        obj.month = '0' + obj.month
    }
    if (obj.day < 10) {
        obj.day = '0' + obj.day
    }
    obj.dayStr = obj.year + '-' + obj.month + '-' + obj.day
    return obj
}

/**
 * 获取当前时间（年月）
 */
export function getYearMonthTime() {
    let date = new Date()
    let obj = {}
    obj.year = date.getFullYear()
    obj.month = date.getMonth() + 1
    if (obj.month < 10) obj.month = '0' + obj.month
    obj.dayStr = obj.year + '-' + obj.month
    obj.days = getMonthDay(obj.year, obj.month)
    return obj
}

/**
 * 获取当月有多少天
 */
export function getMonthDay(year, month) {
    let days = new Date(year, month, 0).getDate()
    return days
}

/**
 * 标准时间转2018-11-11 00:00:00
 * @param time 时间
 * @returns {string}
 */
export function toTime(time) {
    if (time) {
        return time.getFullYear() + '-' +
            (time.getMonth() + 1 < 10 ? '0' : '') +
            (time.getMonth() + 1) + '-' +
            (time.getDate() < 10 ? '0' : '') +
            time.getDate() + ' ' + (time.getHours() < 10 ? '0' : '') + time.getHours() + ':' + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes() + ':' + (time.getSeconds() < 10 ? '0' : '') + time.getSeconds()
    }
}

/**
 * 时间戳为10位需*1000，时间戳为13位的话不需乘1000
 * @param timestamp 时间戳
 * @returns {string}
 */
export function timestampToTime(timestamp) {
    if (timestamp) {
        var date = new Date(timestamp)
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = (date.getDate() < 10 ? '0' : '') + date.getDate() + ' '
        var h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':'
        var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':'
        var s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        return Y + M + D + h + m + s
    }
}

/**
 * 操作权限的设置
 * @param menuName 菜单名
 * @returns {Array}
 */
export function setOperation(menuName) {
    let rmList = JSON.parse(sessionStorage.getItem('rmList'))
        // let rmMenuList = [orderReportForms, travelReportForms, payReportForms, 4, 5, 6, 7, 8, 9]
    let rmMenuList = []
    rmList.forEach(item => {
        if (item.link === menuName) {
            item.operationList.forEach(val => {
                rmMenuList.push(val)
            })
        }
    })
    return rmMenuList
}

/**
 * 操作权限类型
 * @param url 接口url
 * @returns {number}
 */
export function operationType(url) {
    let type = 0
    if (url.indexOf('/list') > -1) {
        type = 1
    } else if (url.indexOf('/forbidden') > -1) {
        type = 2
    } else if (url.indexOf('/export') > -1 || url.indexOf('/detailExport') > -1) {
        type = 3
    } else if (url.indexOf('/create') > -1 || url.indexOf('/copy') > -1) {
        type = 4
    } else if (url.indexOf('/delete') > -1) {
        type = 5
    } else if (url.indexOf('/update') > -1 || url.indexOf('/info') > -1) {
        type = 6
    } else if (url.indexOf('/refund') > -1) {
        type = 7
    } else if (url.indexOf('/detail') > -1) {
        type = 8
    } else if (url.indexOf('/import') > -1) {
        type = 9
    } else if (url.indexOf('/publish') > -1) {
        type = 10
    }
    return type
}

/**
 * 验证手机号
 * @param val 接收到的手机号
 * @returns {boolean}
 */
export function checkPhone(val) {
    let reg = /^[1][3,4,5,6,7,8][0-9]{9}$/
    if (!reg.test(val)) {
        return false
    } else {
        return true
    }
}

/**
 * 根据长度将数组转化为 0,1数组
 * @param checkList
 * @param length
 * @returns {Array} 例：长度为4时，将数组[travelReportForms,payReportForms] 转为[0,0,orderReportForms,orderReportForms]
 */
export function getFormatZero(checkList, length) {
    var arr = []
    for (let i = 0; i < length; i++) {
        if (checkList.indexOf(i) > -1) {
            arr.push('1')
        } else {
            arr.push('0')
        }
    }
    return arr
}

/**
 * 根据长度将数组转化为 0,1数组
 * @param checkList
 * @param length
 * @returns {Array} 例：长度为4时，将数组[0,0,orderReportForms,orderReportForms] 转为[travelReportForms,payReportForms]
 */
export function getFormatZeroBack(checkList, length) {
    let arr = []
    for (let i = 0; i < length; i++) {
        if (+checkList[i] === 1) arr.push(i)
    }
    return arr
}

/**
 * 获取中心点
 * @param path
 * @returns {string[]}
 */
export function getCenterPoint(path) {
    var x = 0.0
    var y = 0.0
    var arr = []
    for (var i = 0; i < path.length; i++) {
        x = x + parseFloat(path[i][0])
        y = y + parseFloat(path[i][1])
    }
    x = x / path.length
    y = y / path.length
    arr = [x.toString(), y.toString()]
    return arr
}

/**
 * 保持引用关系
 * @param x
 */
export function cloneForce(x) {
    const uniqueList = [] // 用来去重
    let root = {}
    const loopList = [{ // 循环数组
        parent: root,
        key: undefined,
        data: x
    }]
    while (loopList.length) {
        // 深度优先
        const node = loopList.pop()
        const parent = node.parent
        const key = node.key
        const data = node.data
            // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent
        if (typeof key !== 'undefined') {
            res = parent[key] = {}
        }
        // 数据已经存在
        let uniqueData = find(uniqueList, data)
        if (uniqueData) {
            parent[key] = uniqueData.target
            continue // 中断本次循环
        }
        // 数据不存在，保存源数据，在拷贝数据中对应的引用
        uniqueList.push({
            source: data,
            target: res
        })
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === 'object') {
                    loopList.push({ // 下一次循环
                        parent: res,
                        key: k,
                        data: data[k]
                    })
                } else {
                    res[k] = data[k]
                }
            }
        }
    }
    return root
}

export function find(arr, item) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i]
        }
    }
    return null
}

/**
 * 校验中英文
 * @param name 接收到的值
 * @returns {boolean}
 */
export function checkWord(name) {
    return /^[a-zA-Z\u4e00-\u9fa5]+$/.test(name)
}

/**
 * 只校验中文
 * @param val 接收到的值
 * @returns {boolean}
 */
export function checkChinese(val) {
    return /^[\u4e00-\u9fa5]{0,16}$/.test(val)
}

/**
 * 校验英文和数字格式
 * @param val：接收的值
 * @returns {boolean}：返回布尔值
 */
export function checkNumber(val) {
    return /^[0-9A-Za-z]+$/.test(val)
}

/**
 * 校验中英文及数字格式
 * @param val：接收的值
 * @returns {boolean}：返回布尔值
 */
export function checkNumber1(val) {
    return /^[0-9A-Za-z\u4e00-\u9fa5]+$/.test(val)
}

/**
 * 校验1开头、11位的手机号
 * @param val：接收的值
 * @returns {boolean}：返回布尔值
 */
export function checkTelphone(val) {
    return /^1\d{10}$/.test(val)
}

/**
 * 校验身份证号
 * @param val：接收的值
 * @returns {boolean}：返回布尔值
 */
export function checkIdcard(val) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
}

/**
 * 校验空格
 * @param val：输入的值
 * @returns {boolean}：返回值：true；false；
 */
export function checkSpace(val) {
    return /^[^\s]*$/.test(val)
}

/**
 * 校验数字、字母、字符
 * @param val：传入的值
 * @returns {boolean}：返回值：true；flase；
 */
export function checkNumCode(val) {
    return /^[a-zA-Z0-9~!@#$%^&*_+{}:"|<>?\-=;'\\,.\/]{0,15}$/.test(val)
}

/**
 * 验证电话（手机号、固定电话）
 * @param val：接收的值
 * @returns {boolean}：返回类型
 */
export function tcheckTelPhone(val) {
    return /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(val)
}

/**
 * 返回今天的日期
 * @returns {string} ‘格式：2020-03-09’
 */
export function getToDayDate() {
    let date = new Date()
    let year = date.getFullYear()
    let mon = (date.getMonth() + 1) + ''
    let month = mon.length === 1 ? ('0' + mon) : mon
    let d = date.getDate() + ''
    let day = d.length === 1 ? ('0' + d) : d
    return { year, month, day }
}

function addZero (data) {
    let newData = data.toString()
    if (data.toString().length == 1) {
      newData = '0' + data.toString()
    }
    return newData
}

export function showDateStyle (time) {
    let date = new Date(time)
    let year = addZero(date.getFullYear())
    let month = addZero(date.getMonth() + 1)
    let day = addZero(date.getDate())
    let hour = addZero(date.getHours())
    let minute = addZero(date.getMinutes())
    let second = addZero(date.getSeconds())
    let newDate = year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + second
    return newDate
}

export function calcTimestamp(datestr) {
    var arr = datestr.split(" ");
    var date = arr[0];//日期
    var arr0 = date.split("-");
    var year = 2017, month = 0, day = 1;
    switch (arr0.length) {
        case 0:
            break;
        case 1:
            year = arr0[0];
            break;
        case 2:
            year = arr0[0], month = arr0[1] - 1;
            break;
        case 3:
            year = arr0[0], month = arr0[1] - 1, day = arr0[2];
            break;
    }
    var hour = 0, minute = 0, second = 0;
    if (arr.length > 1) {
        var time = arr[1];
        var arr1 = time.split(":");
        switch (arr1.length) {
            case 0:
                break;
            case 1:
                hour = arr1[0];
                break;//时
            case 2:
                hour = arr1[0], minute = arr1[1];
                break;//时、分
            case 3:
                hour = arr1[0], minute = arr1[1], second = arr1[2];
                break;//时、分、秒
        }
    }
    return Date.parse(new Date(year, month, day, hour, minute, second)) / 1000;
}