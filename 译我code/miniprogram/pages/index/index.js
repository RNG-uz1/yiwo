const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //弹窗
  popUp() {
    wx.showToast({
      title: `左上角登录后再来哦`,
      icon: 'none'
    })
  },

  //跳转页面——我的
  gotoMe(e) {
    wx.navigateTo({
      url: `/pages/me/index`
    })
  },


  //跳转页面  打卡记录
  gotuRecording(e) {
    wx.navigateTo({
      url: `/pages/recording/index`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    setTimeout(function () {
      console.log(app.globalData.userInfo)
      that.setData({
        user: app.globalData.userInfo
      })
    }, 1000)

    //隐藏左上角
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