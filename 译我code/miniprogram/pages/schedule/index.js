const app = getApp()
Page({


  data: {
    routeList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadRoute()
  
  },

  goto(e){
    console.log(e.currentTarget.dataset.routeId)
    wx.navigateTo({
      url: `../link/index?route_id=${e.currentTarget.dataset.routeId}`,

    })
  },

 

 
  titleDone(e){
      var that = this
      console.log(e)
      wx.cloud.database().collection('route').doc(e.currentTarget.dataset.routeId).update({
        data :{
          route_title : e.detail.value
        }
      })
      setTimeout(function () {
        that.setData({
          title : e.detail.value
        })
      }, 1000)
},

  loadRoute(){
    var that = this
    var time1
    var title1
    var openid
    wx.cloud.callFunction({
      name: 'login_get_openid',
      success(res){
        console.log(res)
        openid = res.result.openid
        wx.cloud.database().collection('route').where({
          _openid : openid
        }).orderBy('routeTime', 'desc').get().then(res1=>{
          console.log(res1)
          that.setData({
            routeList:res1.data,
          })
        })
      }

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
    wx.hideHomeButton({
      success: function () {
        console.log("hide home success");
      },
      fail: function () {
        console.log("hide home fail");
      },
      complete: function () {
        console.log("hide home complete");
      },
    });
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
