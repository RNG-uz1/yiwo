// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})

const db = cloud.database();
const _= db.command; 

// 云函数入口函数
exports.main = async (event, context) => {
    let id = event.id;
    let openid = cloud.getWXContext().OPENID;
    let myres = await db.collection("localCulture").doc(id).get();



    //获取赞
    let myreslike = await db.collection("guide_like").where({
        guide_id: id
    }).count();


    //获取赞头像
    let myresheadimg = await db.collection("guide_like").where({
        guide_id: id
    }).field({
        avatarUrl: true
    }).orderBy("likeTime","desc").limit(5).get();

    //获取是否收藏了
    let myresiscollect = await db.collection("localCulture_collect").where({
        guide_id: id,       //以文章id，用户openid筛选
        openid: openid
    }).count();

     //获取是否点赞了
     let myresislike = await db.collection("guide_like").where({
        guide_id: id,       //以文章id，用户openid筛选
        openid: openid
    }).count();
    
    //获取阅读量
    let myresread = await db.collection("localCulture").doc(id).update({
        data:{
            readCount:_.inc(1), //自增1
        }
    })

    //是否收藏
    if(myresiscollect.total){
        myres.data.iscollect = true;
    }else{
        myres.data.iscollect = false;
    }

    //是否点赞
    if(myresislike.total){
        myres.data.islike = true;
    }else{
        myres.data.islike = false;
    }
    myres.data.userArr = myresheadimg.data.reverse();
    myres.data.likeCount = myreslike.total;
    return myres;
}