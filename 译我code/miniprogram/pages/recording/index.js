const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    route_id: "",

    flag: false,

    //图片路径
    frontSrc: ['https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-16/cmwto5dk6egl104yk7vxw7f155alefd5_.png', 'https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-16/zf6baoy3bhhauytm5n4wseqnd8v7k64i_.png'],
    newFrontSrc: '',
    //展示弹窗
    show: 0,
    //评分
    score: 0,
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
  close() {
    var that = this

    //路径传入数据库里
    wx.cloud.database().collection('route').add({
      data: {
        start_longitude: that.data.startLongitude,
        start_latitude: that.data.startLatitude,
        end_longitude: that.data.endLongitude,
        end_latitude: that.data.endLatitude,
        score: that.data.score,
      },
      success(res) {
        wx.cloud.database().collection('route').where({
          start_longitude: that.data.startLongitude,
          end_longitude: that.data.endLongitude,
          end_latitude: that.data.endLatitude,
        }).get({
          success(result) {
            that.data.route_id = result.data[0]._id
            that.pushPoint()
          }
        })
      }
    })

    setTimeout(function () {
      wx.navigateTo({
        url: `/pages/index/index`
      })
      that.setData({
        show: 0
      })
    }, 1000)


    
    //console.log(this.data.score)

  },

  //把打卡地点存入数据库
  pushPoint() {
    var that = this
    console.log(777)
    that.data.frontSrc.forEach((item, index) => {
      console.log(item)
      wx.cloud.database().collection('point').add({
        data: {
          photo: item
        }
      })
    })
    that.data.markers.forEach((item, index) => {
      wx.cloud.database().collection('point').add({
        data: {
          route_id: that.data.route_id,
          longitude: item.longitude,
          latitude: item.latitude,
        },
      })
    })

  },



  //点击拍照打卡，获取当前位置
  photoButton() {
    var flag = false
    this.getCamera()
    if (flag == true) {
      var newFrontSrc = [frontSrc]
      newFrontSrc = newFrontSrc.concat(frontSrc)
      this.setData({
        frontSrc: newFrontSrc
      })
    }
  },

  getLocation() {
    var promise = new Promise(function (resolve, reject) {
      var that = this
      wx.getLocation({
        //isHighAccuracy: true, // 开启地图精准定位
        type: 'gcj02', // 地图类型写这个
        success(res) {
          console.log(222)
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
      resolve("调用成功");
    })

  },

  //点击结束路径
  endRoute() {
    var that = this
    wx.getLocation({
      //isHighAccuracy: true, // 开启地图精准定位
      type: 'gcj02', // 地图类型写这个
      success(res) {
        //向markers数组里添加终点markers
        var newMarkers = [{
          iconPath: "https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-15/8jkfruwj4sg7i1xcb6hblsxubu9ds97t_.png",
          longitude: res.longitude,
          latitude: res.latitude,
          width: 50,
          heigth: 50,
        }]
        that.data.markers = that.data.markers.concat(newMarkers)
        //把终点路径存入data里
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          endLongitude: res.longitude,
          endLatitude: res.latitude,
        })
        setTimeout(function () {
          that.setData({
            show: 1
          })
        }, 1000)
      },
      fail(res){
        console.log(res)
      }
    })

  },


  //评分
  showResult(e) {
    console.log(e.detail.value)
    wx.showToast({
      title: `${e.detail.value}星`,
      icon: 'none'
    })
    var that = this
    that.setData({
      score: e.detail.value
    })
  },



  //调相机
  getCamera() {
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
      //isHighAccuracy: true, // 开启地图精准定位
      type: 'gcj02', // 地图类型写这个
      success(res) {

        // 向markers数组里添加起点markers
        // var newMarkers = [{
        //   iconPath: "https://7969-yiwo-4gsw4af5a186d6b7-1308472708.tcb.qcloud.la/cloudbase-cms/upload/2022-01-15/28202i16213hd8f7nve3sgsvlw486ypt_.png",
        //   longitude: res.longitude,
        //   latitude: res.latitude,
        //   width: 50,
        //   heigth: 50,
        // }]
        // that.data.markers = that.data.markers.concat(newMarkers)

        // console.log(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          startLongitude: res.longitude,
          startLatitude: res.latitude,
          openid: app.globalData.userInfo._openid,
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



    if (this.data.flag == true) {
      var that = this
      // wx.getFileSystemManager().readFile({
      //   filePath: that.data.newFrontSrc, //选择图片返回的相对路径
      //   encoding: 'base64', //编码格式
      //   success: res => { //成功的回调
      //     console.log('data:image/png;base64,' + res.data)
      //   }
      // })
      wx.getLocation({
        isHighAccuracy: true, // 开启地图精准定位
        type: 'gcj02', // 地图类型写这个
        success(res) {
          console.log(222)
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

          //向frontSrc数组里添加新的照片路径
          var newSrc = [that.data.newFrontSrc]
          that.data.frontSrc = that.data.frontSrc.concat(newSrc)

          //刷新数据
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            markers: that.data.markers,
            polyline: that.data.polyline,
            frontSrc: that.data.frontSrc
          })
        }
      })

      
    }
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