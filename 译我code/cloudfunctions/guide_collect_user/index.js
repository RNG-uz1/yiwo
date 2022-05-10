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
    let myres = await db.collection("guide_collect").where({
        openid: openid
    })
    .limit(7)
    .skip(size)
    .orderBy("collectTime","asc")
    .get();

    //获取个人收藏攻略数量
    let myreslike = await db.collection("guide_collect").where({
        openid: openid
    }).count();

    return myres;
}