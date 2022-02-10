const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


 
  gotoWatch(e) {
    wx.navigateTo({
      url: '/pages/schedule/index',
    })
  },

  //用户登录
  login() {
    var that = this
    wx.getUserProfile({
      desc: '用于完善信息',
      success(res) {
        console.log(res.userInfo)
        var user = res.userInfo

        app.globalData.userInfo = user

        that.setData({
          userInfo: user
        })

        //检查之前是否登录过
        wx.cloud.database().collection('user').where({ //查找数据库内openid相同的信息
          _openid: app.globalData.openid
        }).get({
          success(res) {
            console.log(res)
            if (res.data.length == 0) { //如果在数据库内没有找到相同的openid记录则添加
              //把用户信息添加到数据库
              wx.cloud.database().collection('user').add({
                data: {
                  nickName: user.nickName,
                  avatarUrl: user.avatarUrl,
                  isLoad:false
                },
                success(res) {
                  console.log(res)
                  wx.showToast({
                    title: '登陆成功',
                  })
                }

              })
            } else {
              that.setData({
                userInfo: res.data[0]
              })
            }

          }

        })

      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo : app.globalData.userInfo
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
    // wx.navigateTo({
    //   url: '/pages/index/index',
    // })
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