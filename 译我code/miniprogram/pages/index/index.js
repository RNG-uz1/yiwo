const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    howToUse: 0
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
    console.log('调用一次')
    wx.navigateTo({
      url: `/pages/me/index`
    })
  },

  //展示使用说明
  showInfo() {
    if (this.data.howToUse == 0) {
      this.setData({
        howToUse: 1
      })
    }
  },

  close() {
    this.setData({
      howToUse: 0
    })
  },


  //跳转页面  打卡记录
  gotuRecording(e) {
    var that = this
    new Promise(function (resolve, reject) {
      that.getAuth()
      resolve()
    }).then(function (value) {
      wx.getSetting({
        success(res){
          if (res.authSetting['scope.userLocationBackground']) {
            wx.navigateTo({
              url: `/pages/recording/index`
            })
          }
        }
      })
    })

  },

  getAuth() {
    console.log('执行权限获取')
    const that = this;
    wx.getSetting({
      success(res) {
        // 如果没有拿到scope.userLocationBackground授权，提示
        if (!res.authSetting['scope.userLocationBackground']) {
          wx.showModal({
            confirmText: '去设置',
            content: '请将位置信息由“使用中”更改为“使用小程序期间和离开后”',
            showCancel: false,
            title: '提示',
            success: (result) => {
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)
                },
              })
            },
          })
        }
      }
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
  onReady: function () {},

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