// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let size = event.size;
    let openid = cloud.getWXContext().OPENID;
    let myres = await db.collection("localCulture").where({
        openid: openid
    })
    .limit(7)
    .skip(size)
    .orderBy("_createTime","asc")
    .get();
    return myres;
}