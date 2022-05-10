// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    let {guide_comment,avatarUrl,nickName,commentTime,guide_id} = event;


    return await db.collection("guide_comment").add({
        data:{
            guide_comment,avatarUrl,nickName,commentTime,guide_id,openid
        }
    })
    return event;
}