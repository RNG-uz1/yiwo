// app.js
App({
  onLaunch: function () {
    //云开发环境初始化
    wx.cloud.init({
      env: 'yiwo-nft-9gw5pymu18ae114f',
      traceUser: true,
    });

    //获取用户opined
    var that = this
    wx.cloud.callFunction({
      name: 'login_get_openid',
      success(res) {
        console.log(res)
        that.globalData.opendi = res.result.opendi

        //查找数据库用户表里是否有这个用户记录
        wx.cloud.database().collection('user').where({ //查找数据库内openid相同的信息
          _openid: res.result.opendi
        }).get({
          success(result){
            console.log(result)
            that.globalData.userInfo = result.data[0]
          }
        })
      }
    })

  },

  globalData: {
    userInfo: null,
    openid: null
  }
});