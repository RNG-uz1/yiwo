// pages/myCollect/myCollect.js
// pages/guide/guide.js
Page({

    /**
     * 页面的初始数据
     */
    data: { 
      //触底刷新
      isloading: false,
      unloading: false,
      isend: false,
      //攻略内容数组
      listCollectId:[],
      listArr:[],
        wxTitle: "译我",  //攻略标题-
        /**省份picker------------------------------------begin */
      },
      gotoGuideArticle(e){
        console.log(e.currentTarget.dataset.info),
        wx.navigateTo({
          url: '/pages/guideArticle/guideArtivle?article_id='+e.currentTarget.dataset.info,
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getData();
    },
    clearData(size=0){ //刷新时查找字段默认为空
      wx.cloud.callFunction({
        name: "guide_collect_user",
        data: {
          size,
        }
      }).then(res=>{
        console.log("下拉");
        console.log(res.result.data);
        this.setData({
          listArr: res.result.data
        })
      })
    },
    getData(size=0){
      wx.cloud.callFunction({
        name: "guide_collect_user",
        data: {
          size,
        }
      }).then(res=>{
          console.log(res.result.data);        
        let oldData = this.data.listArr;
                  /**循环遍历处理富文本里的图片 */
        for (var index in res.result.data) {

          res.result.data[index].collectcontent= res.result.data[index].collectcontent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,"");
         }
        let newData = oldData.concat(res.result.data);
        this.setData({
          listArr: newData
        });
        if(res.result.data <= 0){
          this.setData({
            unloading: true,
            isend: true
          })
        }
      })
    },

    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.setData({
        isend: false
      })
        wx.setNavigationBarTitle({
          title: this.data.wxTitle
        })
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
      this.setData({
        unloading: false,
        isend: false,
      })
        this.clearData(0);
        setTimeout(function () {
          wx.stopPullDownRefresh()
         }, 2000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if(!this.data.isend){
        wx.showLoading({
          title: '数据加载中',
          mask:true
        })
      
        this.getData(this.data.listArr.length),
  
        setTimeout(function () {
          wx.hideLoading({
          })
         }, 800) 
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})