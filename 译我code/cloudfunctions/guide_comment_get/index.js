// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})

const db = cloud.database();
const _= db.command; 

// 云函数入口函数
exports.main = async (event, context) => {
    let size = event.size;
    let id = event.id;

    //获取评论数量
    let myrescount = await db.collection("guide_comment").where({
        guide_id: id
    }).count();

    let myres = await db.collection("guide_comment").where({
        guide_id: id
    })
    .get();
    return {
        myres,
        myrescount
    }
}