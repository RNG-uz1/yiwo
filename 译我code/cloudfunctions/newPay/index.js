const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "event.goodName",
    "outTradeNo" : "e1577abcd" + new Date().getTime(),
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1625443557",
    "totalFee" : event.totalFee,
    "envId": "yiwo-nft-9gw5pymu18ae114f",
    "functionName": "pay_cb"
  })
  return res
}