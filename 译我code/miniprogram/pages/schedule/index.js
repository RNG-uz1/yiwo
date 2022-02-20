const app = getApp()
Page({


  data: {
    routeList: [],
    show: false,
    totalPages: 1,
    currentPage: 1,
    isLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    this.loadRoute()
  },

  goto(e) {
    console.log(e.currentTarget.dataset.routeId)
    wx.navigateTo({
      url: `../link/index?route_id=${e.currentTarget.dataset.routeId}`,
    })
  },




  titleDone(e) {
    var that = this
    console.log(e)
    new Promise(function (resolve, reject) {
      wx.cloud.database().collection('route').doc(e.currentTarget.dataset.routeId).update({
        data: {
          route_title: e.detail.value
        }
      })
      resolve()
    }).then(function (value) {
      that.setData({
        title: e.detail.value
      })
    })

  },

  loadRoute() {
    var that = this
    wx.cloud.callFunction({
      name: 'login_get_openid',
      success(res) {
        new Promise(function (resolve, reject) {
          that.setData({
            openid: res.result.openid
          })
          resolve()
        }).then(function (value) {
          that.getRouteList()
        })
      }
    })
  },

  getRouteList() {
    var that = this
    //if(that.data.isLoad == true){
    wx.cloud.database().collection('route').where({
      _openid: that.data.openid
    }).count().then(res => {
      const total = res.total //获取条数
      that.data.totalPages = Math.ceil(total / 10) //获取总页数
      wx.cloud.database().collection('route').where({
        _openid: that.data.openid
      }).orderBy('routeTime', 'desc').skip((that.data.currentPage - 1) * 10).limit(10).get().then(res1 => {
        console.log(res1)
        console.log(that.data.totalPages)
        that.setData({
          routeList: [...that.data.routeList, ...res1.data],

        })
      })
    })
    // }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.isLoad){
      var that = this
      console.log('onshow')
      wx.cloud.database().collection('route').where({
        _openid: that.data.openid
      }).orderBy('routeTime', 'desc').limit(10).get().then(res1 => {
        that.setData({
          routeList: res1.data,
          currentPage:1,
          isLoad:false
        })
      })
    }
  },

  onReachBottom: function () {
    var that = this
    //判断还有没有下一页数据
    if (that.data.currentPage >= that.data.totalPages) {
      wx.showToast({
        title: '已经没有了~',
      })
    } else {
      new Promise(function (resolve, reject) {
        that.data.currentPage = that.data.currentPage + 1
        that.setData({

          currentPage: that.data.currentPage
        })
        resolve()
      }).then(function (value) {
        that.getRouteList()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})