const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },


  //跳转页面  打卡记录
  gotuRecording(e) {
    var that = this
    if (app.globalData.userInfo != null){
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
    }else{
      wx.showToast({
        title: '请到个人页面先登录哦~',
        icon: 'none'
      })
    }
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
            content: '请将位置信息由更改为“使用小程序期间和离开后”',
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({  // 文档中有介绍 getTabBar用于获取当前组件实例
        selected: 0,
        show:true
      })
    }

    setTimeout(function () {
      console.log(app.globalData.userInfo)
      wx.cloud.database().collection('user').where({
        _openid : app.globalData.userInfo._openid
      }).get({
        success(res){
          console.log(res)
          if(res.data[0].isLoad == false ){
            wx.stopLocationUpdate({
              success(result){
                console.log('定位关闭')
              }
            })
          }else{
            console.log('路线中')
          }
        }
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