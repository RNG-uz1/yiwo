// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    let {articleTitle,articleContent,author,myloadImg,area,createTime} = event;
    return await db.collection("localCulture").add({
        data:{
            author,
            check: true,
            collectCount: 0,
            content: articleContent,
            _createTime: createTime,
            likeCount: 0,
            province: area,
            readCount: 0,
            showSwiper: false,
            title: articleTitle,
            topImage: myloadImg,
            openid
        }
    })
    return event;
}