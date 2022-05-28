// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    return await db.collection("localCulture").where({showSwiper: true}).get();
}