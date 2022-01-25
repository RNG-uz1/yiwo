const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    route_time: '',

    route_id: "",

    flag: false,

    photoShow: 0,

    //图片路径
    frontSrc: [],
    newFrontSrc: '',
    //展示弹窗
    show: 0,
    //评分
    score: 0,
    //点
    markers: [],

    //线
    polyline: [{
      points: [],
      width: 4,
      color: "#15cda8",
      dottedLine: false
    }]
  },

  closePhoto() {
    this.setData({
      photoShow : 0
    })
  },

  //评分完成关闭弹窗
  close() {
    var that = this

      //点击关闭更改用户状态
      wx.cloud.database().collection('user').where({     
        _openid: app.globalData.userInfo._openid
      }).update({
        data: {
          isLoad: false
        }
      })

    // new Promise(function (resolve, reject) {
    //   //路径传入数据库里
    //   wx.cloud.database().collection('route').add({
    //     data: {
    //       start_longitude: that.data.startLongitude,
    //       start_latitude: that.data.startLatitude,
    //       end_longitude: that.data.endLongitude,
    //       end_latitude: that.data.endLatitude,
    //       routeTime: that.data.routeTime, //路径时间戳，用来区别同一地点不同路径
    //       time: that.data.time, //路径时间  用来展示
    //       route_title: '',
    //       description: '点击进行编辑',
    //       score: that.data.score,
    //     },
    //     success(res) {
    //       wx.cloud.database().collection('route').where({
    //         routeTime: that.data.routeTime
    //       }).get({
    //         success(result) {
    //           console.log(result)
    //           that.data.route_id = result.data[0]._id
    //           that.pushPoint()
    //         }
    //       })
    //     }
    //   })
    //   resolve()
    // }).then(function (value) {
    //   wx.navigateTo({
    //     url: `/pages/index/index`
    //   })
    // }).then(function (value) {
    //   that.setData({
    //     show: 0
    //   })
    // })
    //console.log(this.data.score)
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

    //把点存入数据库


  },

  //点击结束路径
  endRoute() {
    var that = this
    if (this.data.markers.length >= 1) { //只有用户打点了之后才会继续下一步，没打点就直接返回首页
      wx.getLocation({
        isHighAccuracy: true, // 开启地图精准定位
        type: 'gcj02', // 地图类型写这个
        success(res) {
          new Promise(function (resolve, reject) {

            that.setData({
              longitude: res.longitude,
              latitude: res.latitude,
              endLongitude: res.longitude,
              endLatitude: res.latitude,
            })
            resolve()
          }).then(function (value) {
            show: 1
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }


  },

  onLoad: function (options) {
    var isload
    var that = this
    new Promise(function(resolve,reject){
      that.getDate() //获取时间,字符串形式

    //进入页面时获取起始位置与信息
    wx.getLocation({
      //isHighAccuracy: true, // 开启地图精准定位
      type: 'gcj02',
      success(res) {       
        that.setData({
          routeTime: (new Date()).getTime() + Math.floor(9 * Math.random()),
          longitude: res.longitude,
          latitude: res.latitude,
          startLongitude: res.longitude,
          startLatitude: res.latitude,
          openid: app.globalData.userInfo._openid,
        })
      }
    })
      resolve()
    }).then(function(value){
      wx.cloud.database().collection('user').where({   //查看用户状态
        _openid: app.globalData.userInfo._openid
      }).get({
        success(res) {
          console.log(res)
          isload = res.data[0].isLoad
          if (isload == false) {               //用户状态为false时，改变用户状态，并且存入一条路径
            wx.cloud.database().collection('user').where({     
              _openid: app.globalData.userInfo._openid
            }).update({
              data: { isLoad: true }
            }).then(res=>{
              console.log(that.data)
              that.createRoute()      //存入一条路径
            })
          }else{        //用户状态为true时,加载上一条路径的状态
            wx.cloud.database().collection('route').where({
              _openid : app.globalData.userInfo._openid
            }).orderBy('routeTime', 'desc').get({
              success(res){
                console.log(res)
                that.setData({
                  route_id : res.data[0]._id
                })
              }
            })
          }
        }
      })
    })
  },


  onShow: function (options) {
    if (this.data.flag == true) {
      var that = this
      var markerID = (new Date()).getTime() + Math.floor(9 * Math.random())
      wx.getLocation({
        //isHighAccuracy: true, // 开启地图精准定位
        type: 'gcj02', // 地图类型写这个
        success(res) {
          //向point数组里添加新的point
          var newPoint = [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
          that.data.polyline[0].points = newPoint.concat(that.data.polyline[0].points)

          //向markers数组里添加新的markers
          var newMarkers = [{
            id: markerID,
            photoID: that.data.newFrontSrc,
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
            polyline: that.data.polyline,
            frontSrc: that.data.frontSrc,
            flag: false
          })

          wx.cloud.database().collection('point').add({
            data:{
              id : markerID,
              latitude : res.latitude,
              longitude: res.longitude,
              photoID: that.data.newFrontSrc,
              route_id : that.data.route_id
            }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取时间
  getDate() {
    // wx.setInterval(() => {

    // }, 5000);
    var d = new Date
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    console.log(year + '年' + month + '月' + date + '日')
    this.setData({
      time: year + '年' + month + '月' + date + '日'
    })
  },

  //调相机
  getCamera() {
    wx.navigateTo({
      url: '/pages/camera/index',
    })
  },

  //点击marker展示图片
  markertap(e) {
    console.log(e)
    this.data.markers.forEach((item, index) => {
      console.log(item.id)
      if (e.detail.markerId == item.id) {
        this.setData({
          currentPhoto: item.photoID,
          photoShow: 1
        })
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

  //把打卡地点存入数据库
  pushPoint() {
    var that = this
    console.log(777)
    that.data.markers.forEach((item, index) => {
      wx.cloud.database().collection('point').add({
        data: {
          id: item.id,
          route_id: that.data.route_id,
          longitude: item.longitude,
          latitude: item.latitude,
          photoID: item.photoID
        },
        success(res) {
          console.log('点存入成功')
        }
      })
    })
  },

  //加载页面时 状态由true改为false  创建一条路径数据并存入
  createRoute(){
    var that = this
    console.log(this.data)
    wx.cloud.database().collection('route').add({
      data: {
        start_longitude: that.data.startLongitude,
        start_latitude: that.data.startLatitude,
        routeTime: that.data.routeTime, //路径时间戳，用来区别同一地点不同路径
        time: that.data.time, //路径时间  用来展示
        route_title: '',
        description: '点击进行编辑',
        score: that.data.score,
      },
      success(res) {
        wx.cloud.database().collection('route').where({
          routeTime: that.data.routeTime
        }).get({
          success(result) {
            console.log(result)
            that.data.route_id = result.data[0]._id
          }
        })
      }
    })
  }
})