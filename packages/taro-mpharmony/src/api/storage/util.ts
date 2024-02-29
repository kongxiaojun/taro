import native from '../NativeApi'

interface Status {
  done: boolean
  data: string
  errorMsg: string
}

export function getStorageStatus (method: string, key: string) {
  let count = 0
  const res: Status = { done: false, data: '', errorMsg: `${method} timeout` } // false 可能插入数据超时; true, 数据在20000刻度的时间内插入完成
  while (count < 20000) {
    count++
    if (count % 1000 === 0) {
      const status: Status = native.getExecStatus({ method, key })
      if (status.done || status.errorMsg) { // 插入数据完成，退出循环
        return status
      }
    }
  }
  return res
}


export function displayExecRes (status: Status, method: string) {
  if (!status.done) {
    console.error({ errMsg: status.errorMsg })
  } else {
    // eslint-disable-next-line no-console
    console.log(`${method} execution succeeded` + (status.data ? `res: ${status.data}` : ''))
  }
}

export function getItem (data: string) {
  let item
  try {
    item = JSON.parse(data)
    // item = JSON.parse(localStorage.getItem(key) || '')
  } catch (e) {
  } // eslint-disable-line no-empty

  // 只返回使用 Taro.setStorage API 存储的数据
  if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
    return { result: true, data: item.data }
  } else {
    return { result: true, data: '' }
  }
}

export function handleData (data) {
  const type = typeof data
  let obj = {}

  if (type === 'symbol') {
    obj = { data: '' }
  } else {
    obj = { data }
  }
  return obj
}
