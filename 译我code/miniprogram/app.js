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
        that.globalData.openid = res.result.openid
        //查找数据库用户表里是否有这个用户记录
        wx.cloud.database().collection('user').where({ //查找数据库内openid相同的信息
          _openid: res.result.openid
        }).get({
          success(result){
            that.globalData.userInfo = result.data[0]
            if(result.data[0].isLoad == true){
              wx.navigateTo({
                url: `/pages/recording/index`,
              })
            }
          }
        })
      }
    })

    this.getAuth()
  },

  globalData: {
    userInfo: null,
    openid: null
  },

  

  //获取权限
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
});