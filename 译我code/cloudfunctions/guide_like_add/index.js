// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    let {avatarUrl,nickName,likeTime,guide_id} = event;

    //控制点赞用户入库数量
    let userUnique = await db.collection("guide_like").where({
        guide_id,
        openid,
    }).count();
    if(userUnique.total){ //有用户点过赞，执行删除操作，不让其增加
        return await db.collection("guide_like").where({
            guide_id,
            openid,
        }).remove();
    }
    return await db.collection("guide_like").add({
        data:{
            avatarUrl,nickName,likeTime,guide_id,openid
        }
    })
    return event;
}