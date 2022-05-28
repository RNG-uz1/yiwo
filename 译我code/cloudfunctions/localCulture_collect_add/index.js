// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    let {avatarUrl,nickName,collectTime,guide_id,collecttopImage,
        collecttitle,
        collectcontent} = event;

    //控制点赞用户入库数量
    let userUnique = await db.collection("localCulture_collect").where({
        guide_id,
        openid,
    }).count();
    if(userUnique.total){ //有用户点过赞，执行删除操作，不让其增加
        return await db.collection("localCulture_collect").where({
            guide_id,
            openid,
        }).remove();
    }
    return await db.collection("localCulture_collect").add({
        data:{
            avatarUrl,nickName,collectTime,guide_id,openid,collecttopImage,collecttitle,collectcontent
        }
    })
    return event;
}