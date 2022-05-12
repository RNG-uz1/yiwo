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

    // 错误提示
    showErrorToastUtils: function (e) {
      wx.showModal({
        title: '提示！',
        confirmText: '朕知道了',
        showCancel: false,
        content: e,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    },

      //获取自己后台的user信息
  _getMyUserInfo() {
    let app = this
    var userStor = wx.getStorageSync('user');
    if (userStor) {
      console.log('本地获取user', userStor)
      app.globalData.userInfo = userStor;
    }
  },
  _checkOpenid() {
    let app = this
    let openid = this.globalData.openid;
    if (!openid) {
      app.getOpenid();
      wx.showLoading({
        title: 'openid不能为空，请重新登录',
      })
      return null;
    } else {
      return openid;
    }
  },
  // 保存userinfo
  _saveUserInfo: function (user) {
    this.globalData.userInfo = user;
    wx.setStorageSync('user', user)
  },

  //获取今天是本月第几周
  _getWeek: function () {
    // 将字符串转为标准时间格式
    let date = new Date();
    let month = date.getMonth() + 1;
    let week = this.getWeekFromDate(date);
    if (week === 0) { //第0周归于上月的最后一周
      month = date.getMonth();
      let dateLast = new Date();
      let dayLast = new Date(dateLast.getFullYear(), dateLast.getMonth(), 0).getDate();
      let timestamp = new Date(new Date().getFullYear(), new Date().getMonth() - 1, dayLast);
      week = this.getWeekFromDate(new Date(timestamp));
    }
    let time = month + "月第" + week + "周";
    return time;
  },

  getWeekFromDate: function (date) {
    // 将字符串转为标准时间格式
    let w = date.getDay(); //周几
    if (w === 0) {
      w = 7;
    }
    let week = Math.ceil((date.getDate() + 6 - w) / 7) - 1;
    return week;
  },
  // 获取当前时间
  _getCurrentTime() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();

    var curDateTime = d.getFullYear() + '年';
    if (month > 9)
      curDateTime += month + '月';
    else
      curDateTime += month + '月';

    if (date > 9)
      curDateTime = curDateTime + date + "日";
    else
      curDateTime = curDateTime + date + "日";
    if (hours > 9)
      curDateTime = curDateTime + hours + "时";
    else
      curDateTime = curDateTime + hours + "时";
    if (minutes > 9)
      curDateTime = curDateTime + minutes + "分";
    else
      curDateTime = curDateTime + minutes + "分";
    return curDateTime;
  },
  // 获取当前的年月日
  _getNianYuiRi() {
    let date = new Date()
    let year = date.getFullYear()
    // 我们的月份是从0开始的 0代表1月份，11代表12月
    let month = date.getMonth() + 1
    let day = date.getDate()
    let key = '' + year + month + day
    console.log('当前的年月日', key)
    return key
  },

    // 获取用户所在城市，只能同一个城市的跑腿员才能抢单
    _getCity: function (address) {
      var city = null;
      if (address) {
        city = address.cityName;
      }
      return city;
    },

  // 保存收获地址:地址里包含用户姓名，电话，地址信息
  _saveAddress: function (address) {
    //缓存到sd卡里
    wx.setStorageSync('address', address);
    console.log(address);
    console.log('地址里的电话：' + address.telNumber);
  },

      // 拼接地址信息
  _getAddress: function (address) {
    var desc = null;
    if (address) {
      desc = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    }
    return desc;
  },
    //判断用户是否登录
    checkUserInfo_collect(){
      if(this.globalData.userInfo_collect && this.globalData.userInfo_collect.nickName){
        return true;
      }
      let userInfo_collect = wx.getStorageSync('userInfo_collect');
      if(userInfo_collect && userInfo_collect.nickName){
        this.globalData.userInfo_collect = userInfo_collect;
        return true;
      }else{
        return false;
      }
    },
});