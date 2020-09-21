import { Message } from 'element-ui'
let flag = false

const S = (msg = '成功') => {
  if (!flag) {
    Message.success(msg)
    flag = true
    setTimeout(() => {
      flag = false
    }, 3000)
  } else {
    return false
  }
}

const W = (msg = '警告') => {
  if (!flag) {
    Message.warning(msg)
    flag = true
    setTimeout(() => {
      flag = false
    }, 3000)
  } else {
    return false
  }
}

const E = (msg = '出错了!') => {
  if (!flag) {
    Message.error(msg)
    flag = true
    setTimeout(() => {
      flag = false
    }, 3000)
  } else {
    return false
  }
}

const I = (msg = '') => {
  if (!flag) {
    Message.info(msg)
    flag = true
    setTimeout(() => {
      flag = false
    }, 3000)
  } else {
    return false
  }
}

export default {
  S,
  W,
  E,
  I
}
