// pages/guideArticle/guideArtivle.js
let id;
const app = getApp();
Page({
    listArr:[],
    /**
     * 页面的初始数据
     */
    data: {
      collecttopImage: null,
      collecttitle: null,
      collectcontent: null,
      commentArr:{},
      commentCount: 0,
      guide_comment: null,
      article: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      id = options.article_id;
      console.log(id);
        this.getMyContent();
        this.getMyComment();
      },

      //获取评论
      goComment(){
        if(app.checkUserInfo_collect()){
          if(this.data.guide_comment == null || this.data.guide_comment.replace(/\s+/g, '') == ''){
            console.log("错误");
          }else{
            console.log(this.data.guide_comment);
            this.pushcommentData();
          }
        }else{
          wx.getUserProfile({
            desc: '微信发表评论授权',
            success:res=>{
              wx.setStorageSync('userInfo_collect', res.userInfo);
              app.globalData.userInfo_collect = res.userInfo;
            }
          })
        };
      },
      pushcommentData(){

        let commentTime = Date.now();
        wx.cloud.callFunction({
          name: "guide_comment_add",
          data: {
            guide_comment: this.data.guide_comment,
            avatarUrl: app.globalData.userInfo_collect.avatarUrl,
            nickName: app.globalData.userInfo_collect.nickName,
            commentTime,
            guide_id: id
          }
        }).then(res=>{
          console.log("发表成功");
          this.setData({
            guide_comment: null,
            commentArr: {}
          })
          this.getMyComment();
        }).catch(res=>{
          console.log("发表失败");
        })

      },
      //收藏-------------------------------------------------------
      clickCollect(){
        if(app.checkUserInfo_collect()){
          this.pushcollectData();
        }else{
          wx.getUserProfile({
            desc: '微信收藏授权',
            success:res=>{
              wx.setStorageSync('userInfo_collect', res.userInfo);
              app.globalData.userInfo_collect = res.userInfo;
            }
          })
        };
      },
      pushcollectData(){
        let iscollect = this.data.article.iscollect;    //控制页面收藏按钮
        //收藏
        this.setData({
          "article.iscollect": !iscollect,
        });        
        let collectTime = Date.now();
        wx.cloud.callFunction({
          name: "guide_collect_add",
          data: {
            avatarUrl: app.globalData.userInfo_collect.avatarUrl,
            nickName: app.globalData.userInfo_collect.nickName,
            collectTime,
            guide_id: id,
            collecttopImage: this.data.collecttopImage,
            collecttitle: this.data.collecttitle,
            collectcontent: this.data.collectcontent
          }
        }).then(res=>{
          console.log(res);
        })
      },
      //收藏--------------------------------------------------------


      //点赞
      clickLike(){
        if(app.checkUserInfo_collect()){
          this.pushlikeData();
        }else{
          wx.getUserProfile({
            desc: '微信收藏授权',
            success:res=>{
              wx.setStorageSync('userInfo_collect', res.userInfo);
              app.globalData.userInfo_collect = res.userInfo;
            }
          })
        }
      },
      //发送点赞信息给数据库
      pushlikeData(){
        
        let islike = this.data.article.islike;          //控制页面点赞按钮
        let likeCount = this.data.article.likeCount;    //控制页面点赞数量
        let userArr = this.data.article.userArr;        //控制页面用户头像



        //点赞
        if(islike){
          likeCount--;
          userArr.forEach((item,index)=>{ //forEach循环判断头像已存在
            if(item.avatarUrl == app.globalData.userInfo_collect.avatarUrl){
              userArr.splice(index,1)
            }
          })
        }else{
          likeCount++;
          userArr.push({
            avatarUrl: app.globalData.userInfo_collect.avatarUrl
          });
          if(userArr.length >= 5){
            userArr = userArr.slice(1,6)
          }
        }
        //点赞
        this.setData({
          "article.islike": !islike,
          "article.likeCount": likeCount,
          "article.userArr": userArr
        })
        let likeTime = Date.now();
        wx.cloud.callFunction({
          name: "guide_like_add",
          data: {
            avatarUrl: app.globalData.userInfo_collect.avatarUrl,
            nickName: app.globalData.userInfo_collect.nickName,
            likeTime,
            guide_id: id
          }
        }).then(res=>{
          console.log(res);
        })
      },
      //获取文章内容
      getMyContent(size=0){
        wx.cloud.callFunction({
          name: "guide_article_get",  //获取文章内容云函数
          data: {
            size,
            id
          }
        }).then(res=>{
          res.result.data.content= res.result.data.content.replace(/<img/g,"<img style='max-width:100%' mode='aspectFill' ");
          /**去掉图片res.result.data.content= res.result.data.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,""); */
          console.log(res);
          this.setData({
            collecttopImage: res.result.data.topImage,
            collecttitle: res.result.data.title,
            collectcontent: res.result.data.content,
            article: res.result.data
          })
        })
      },

      //获取评论内容
      getMyComment(){
        wx.cloud.callFunction({
          name: "guide_comment_get",  //获取文章内容云函数
          data: {
            id,
          }
        }).then(res=>{
          console.log("获取成功");
          this.setData({
            commentArr: res.result.myres.data,
            commentCount: res.result.myrescount.total
          })
        }).catch(res=>{
          console.log("获取失败");
        })
      },      


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})