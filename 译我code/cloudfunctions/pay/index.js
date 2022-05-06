const cloud = require('wx-server-sdk')
cloud.init()

//1.引入依赖
const tenpay = require('tenpay');

//2.配置参数
const config = {
  appid: '公众号ID',
  mchid: '微信商户号',
  partnerKey: '微信支付安全密钥',
  notify_url: '支付回调网址',
  spbill_create_ip: '127.0.0.1'
};


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //3.初始化
  const api = tenpay.init(config);

  //4.获取支付参数
  let result = await api.getPayParams({
    out_trade_no: Data.now(),
    body: '商品简单描述',
    total_fee: '订单金额(分)',
    openid: wxContext.OPENID
  });

  return result
}