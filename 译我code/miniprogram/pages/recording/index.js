// pages/recording/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  
  

    //图片路径
    frontSrc:'',

    //展示弹窗
    show: 0,
    //评分
    score : 0,
    //点
    markers: [{
        iconPath: "https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-15/updam9bnagcpcc2u167lb7ycu0u39gc8_.png",
        longitude: 102.835588,
        latitude: 24.883896,
        width: 50,
        heigth: 50,
      },
      {
        iconPath: "https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-15/updam9bnagcpcc2u167lb7ycu0u39gc8_.png",
        longitude: 102.834558,
        latitude: 24.881694,
        width: 50,
        heigth: 50,
      }
    ],

    //线
    polyline: [{
      points: [{
        latitude: 24.881694,
        longitude: 102.834558
      }, {
        latitude: 24.883896,
        longitude: 102.835588
      }],
      width: 4,
      color: '#15cda8',
      dottedLine: false
    }]
  },

  //评分完成关闭弹窗
  close(){
    wx.navigateTo({
      url: `/pages/index/index`
    })
    this.setData({
      show : 0
    })
  },

  //点击拍照打卡，获取当前位置
  getLocation() {
    var that = this
    wx.getLocation({
      isHighAccuracy: true, // 开启地图精准定位
      type: 'gcj02', // 地图类型写这个
      success(res) {
        console.log(res)

        //向point数组里添加新的point
        var newPoint = [{
          latitude: res.latitude,
          longitude: res.longitude
        }]
        that.data.polyline[0].points = newPoint.concat(that.data.polyline[0].points)


        //向markers数组里添加新的markers
        var newMarkers = [{
          iconPath: "https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-15/updam9bnagcpcc2u167lb7ycu0u39gc8_.png",
          longitude: res.longitude,
          latitude: res.latitude,
          width: 50,
          heigth: 50,
        }]
        that.data.markers = that.data.markers.concat(newMarkers)

        //刷新数据
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers: that.data.markers,
          polyline: that.data.polyline
        })
      }
    })
  },

  //点击结束路径
  endRoute(){
    this.setData({
      show : 1
    })
  },


  //评分
  showResult(e) {
    console.log(e.detail.value)
    wx.showToast({
      title: `${e.detail.value}星`,
      icon: 'none'
    })
  },
  setValue(e) {
    var that  = this
    that.setData({
      score: e.detail.value
    })


  
  },
  
  
  //调相机
  getCamera(){
    wx.navigateTo({
      url: '/pages/camera/index',

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //进入页面时获取起点位置
    wx.getLocation({
      isHighAccuracy: true, // 开启地图精准定位
      type: 'gcj02', // 地图类型写这个
      success(res) {

        //向markers数组里添加起点markers
        var newMarkers = [{
          iconPath: "https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-15/28202i16213hd8f7nve3sgsvlw486ypt_.png",
          longitude: res.longitude,
          latitude: res.latitude,
          width: 50,
          heigth: 50,
        }]
        that.data.markers = that.data.markers.concat(newMarkers)

        console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          startLongitude: res.longitude,
          startLatitude: res.latitude,
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
  onShow: function (options) {
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