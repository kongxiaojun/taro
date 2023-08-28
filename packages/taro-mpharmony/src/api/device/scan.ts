import { processOpenApi } from '../../utils'

// 扫码
export const scanCode = /* @__PURE__ */ processOpenApi({
  name: 'scanQRCode',
  defaultOptions: { needResult: 1 },
  formatResult: (res) => ({
    errMsg: res.errMsg === 'scanQRCode:ok' ? 'scanCode:ok' : res.errMsg,
    result: res.resultStr,
  }),
})
