// pages/myCollect/myCollect.js
// pages/guide/guide.js
Page({

    /**
     * 页面的初始数据
     */
    data: { 
      //触底刷新
      isloading: false,
      unloading1: false,
      unloading2: false,
      isend1: false,
      isend2: false,
      //攻略内容数组
      listCollectId:[],
      listArr_guide:[],
      listArr_localCulture: [],
        wxTitle: "译我",  //攻略标题-
      },
      gotoGuideArticle(e){
        console.log(e.currentTarget.dataset.info),
        wx.navigateTo({
          url: '/pages/guideArticle/guideArtivle?article_id='+e.currentTarget.dataset.info,
        })
      },
      gotoLocalCultureArticle(e){
        console.log(e.currentTarget.dataset.info),
        wx.navigateTo({
          url: '/pages/localCultureArticle/localCultureArticle?article_id='+e.currentTarget.dataset.info,
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getData();
    },
    clearData(size=0){ //刷新时查找字段默认为空
      //旅游攻略
      wx.cloud.callFunction({
        name: "guide_collect_user",
        data: {
          size,
        }
      }).then(res=>{
        console.log("下拉");
        console.log(res.result.data);
        this.setData({
          listArr_guide: res.result.data
        })
      }),

      //乡村文化
      wx.cloud.callFunction({
        name: "localCulture_collect_user",
        data: {
          size,
        }
      }).then(res=>{
        console.log("下拉");
        console.log(res.result.data);
        this.setData({
          listArr_localCulture: res.result.data
        })
      })
    },
    getData(size=0){
      //旅游攻略
      wx.cloud.callFunction({
        name: "guide_collect_user",
        data: {
          size,
        }
      }).then(res=>{
          console.log(res.result.data);        
        let oldData = this.data.listArr_guide;
                  /**循环遍历处理富文本里的图片 */
        for (var index in res.result.data) {

          res.result.data[index].collectcontent= res.result.data[index].collectcontent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,"");
         }
        let newData = oldData.concat(res.result.data);
        this.setData({
          listArr_guide: newData
        });
        if(res.result.data <= 0){
          this.setData({
            unloading1: true,
            isend1: true
          })
        }
      }),

      //乡土文化
      wx.cloud.callFunction({
        name: "localCulture_collect_user",
        data: {
          size,
        }
      }).then(res=>{
          console.log(res.result.data);        
        let oldData_local = this.data.listArr_localCulture;
                  /**循环遍历处理富文本里的图片 */
        for (var index in res.result.data) {

          res.result.data[index].collectcontent= res.result.data[index].collectcontent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,"");
         }
        let newData_local = oldData_local.concat(res.result.data);
        this.setData({
          listArr_localCulture: newData_local
        });
        if(res.result.data <= 0){
          this.setData({
            unloading2: true,
            isend2: true
          })
        }
      })
      //乡土文化
    },

    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.setData({
        isend1: false,
        isend2: false,
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
        unloading1: false,
        unloading2: false,
        isend1: false,
        isend2: false,
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
      if(!this.data.isend1 && !this.data.isend2){
        wx.showLoading({
          title: '数据加载中',
          mask:true
        })
      
        this.getData(this.data.listArr_guide.length),
  
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