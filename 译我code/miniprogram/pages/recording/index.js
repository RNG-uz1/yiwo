const app = getApp()
var routeTime1
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
      photoShow: 0
    })
  },

  //评分完成关闭弹窗
  close() {
    var that = this

    new Promise(function (resolve, reject) {
      //点击结束更改用户状态
      wx.cloud.database().collection('user').where({
        _openid: app.globalData.userInfo._openid
      }).update({
        data: {
          isLoad: false
        }
      })
      resolve()
    }).then(function (value) {
      //更新路径信息
      wx.cloud.database().collection('route').where({
        _id: that.data.route_id
      }).update({
        data: {
          score: that.data.score,
          end_longitude: that.data.endLongitude,
          end_latitude: that.data.endLatitude,
        }
      })
    }).then(function (value) {
      //跳转页面
      wx.navigateTo({
        url: `/pages/index/index`
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

  //点击结束路径
  endRoute() {
    var that = this
    if (this.data.markers.length >= 1) { //只有用户打点了之后才会继续下一步，没打点就直接返回首页
      wx.getLocation({
        isHighAccuracy: true, // 开启地图精准定位
        type: 'gcj02', // 地图类型写这个
        success(res) {
          console.log(321)
          new Promise(function (resolve, reject) {
            that.setData({
              longitude: res.longitude,
              latitude: res.latitude,
              endLongitude: res.longitude,
              endLatitude: res.latitude,
            })
            resolve()
          }).then(function (value) {
            that.setData({
              show: 1
            })
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    } else { //当本次路径没有点时
      //删除本条路径
      wx.cloud.database().collection('route').doc(that.data.route_id).remove({
        success(res) {
          //更改用户状态
          wx.cloud.database().collection('user').where({
            _openid: app.globalData.userInfo._openid
          }).update({
            data: {
              isLoad: false
            }
          })

          //页面跳转
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      })
    }


  },

  onLoad: function (options) {
    var isload
    var that = this


    new Promise(function (resolve, reject) {
      that.getDate() //获取时间,字符串形式
      routeTime1 = (new Date()).getTime() + Math.floor(9 * Math.random())
      //进入页面时获取起始位置与信息
      wx.getLocation({
        //isHighAccuracy: true, // 开启地图精准定位
        type: 'gcj02',
        success(res) {
          that.setData({
            routeTime: routeTime1,
            longitude: res.longitude,
            latitude: res.latitude,
            startLongitude: res.longitude,
            startLatitude: res.latitude,
            openid: app.globalData.userInfo._openid,
          })
        }
      })
      resolve()
    }).then(function (value) {
      wx.cloud.database().collection('user').where({ //查看用户状态
        _openid: app.globalData.userInfo._openid
      }).get({
        success(res) {
          console.log(res)
          isload = res.data[0].isLoad
          if (isload == false) { //用户状态为false时，改变用户状态，并且存入一条路径
            wx.cloud.database().collection('user').where({
              _openid: app.globalData.userInfo._openid
            }).update({
              data: {
                isLoad: true
              }
            }).then(res => {
              console.log(that.data)
              that.createRoute() //存入一条路径
            })
          } else { //用户状态为true时,加载上一条路径的状态
            that.loadRoute()
          }
        }
      })
    }).then(function (value) {
      wx.showToast({
        title: '请确保使用过程中已开启定位，否则将导致定位不准确',
        icon: 'none',
        duration: 2500
      })
    })
  },


  onShow: function (options) {

    if (this.data.flag == true) {
      wx.startLocationUpdate({
        success: (res) => {
          console.log(res);
            wx.onLocationChange(_locationChangeFn)
        },
      })
      var that = this
      var markerID = (new Date()).getTime() + Math.floor(9 * Math.random())     
        const _locationChangeFn = function(res){   
        const longitude1 = res.longitude
        const latitude1 = res.latitude
        new Promise(function (resolve, reject) {

          //向point数组里添加新的point
          var newPoint = [{
            latitude: latitude1,
            longitude: longitude1
          }]
          that.data.polyline[0].points = newPoint.concat(that.data.polyline[0].points)

          resolve()
        }).then(function (value) {

          //向markers数组里添加新的markers
          var newMarkers = [{
            id: markerID,
            photoID: that.data.newFrontSrc,
            longitude: longitude1,
            latitude: latitude1,
          }]
          that.data.markers = that.data.markers.concat(newMarkers)

        }).then(function (value) {

          //刷新数据
          that.setData({
            longitude: longitude1,
            latitude: latitude1,
            markers: that.data.markers,
            polyline: that.data.polyline,
            frontSrc: that.data.frontSrc,
            flag: false
          })

        }).then(function (value) {

          wx.cloud.database().collection('point').add({
            data: {
              id: markerID,
              latitude: latitude1,
              longitude: longitude1,
              photoID: that.data.newFrontSrc,
              route_id: that.data.route_id
            }
          })
        }).then(function(value){
          wx.offLocationChange(_locationChangeFn)
        })
      }
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
    //用户返回时如果没有打点，就删除路径
    var that = this
    if (this.data.markers.length == 0) {
      wx.cloud.database().collection('route').doc(that.data.route_id).remove({
        success(res) {
          //更改用户状态
          console.log(555)
          wx.cloud.database().collection('user').where({
            _openid: app.globalData.userInfo._openid
          }).update({
            data: {
              isLoad: false
            }
          })
        }
      })
    }
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
  createRoute() {
    var that = this
    console.log(routeTime1)
    wx.cloud.database().collection('route').add({
      data: {
        start_longitude: that.data.startLongitude,
        start_latitude: that.data.startLatitude,
        routeTime : routeTime1, //路径时间戳，用来区别同一地点不同路径
        time: that.data.time, //路径时间  用来展示
        route_title: '',
        description: '点击进行编辑',
        score: that.data.score,
      },
      success(res) {
        console.log(res)
        that.setData({
          route_id: res._id
        })
      }
    })
  },

  //加载上一条路径状态
  loadRoute() {
    var that = this
    var newPoint = [{
      latitude: '',
      longitude: ''
    }]
    new Promise(function (resolve, reject) {
      //先获取上一条路径的id
      wx.cloud.database().collection('route').where({
        _openid: app.globalData.userInfo._openid
      }).orderBy('routeTime', 'desc').get({
        success(res) {
          console.log(res)
          that.setData({
            route_id: res.data[0]._id
          })
          resolve(res.data[0]._id)
        }
      })
    }).then(function (value) {
      //用路径id来获取路径上的点
      console.log(value)
      wx.cloud.database().collection('point').where({
        route_id: value
      }).orderBy('id', 'desc').get({
        success(res) {
          console.log(res)
          //数据渲染
          new Promise(function (resolve, reject) {
            res.data.forEach((item, index) => {
              console.log(item)
           
              that.data.markers = that.data.markers.concat(item),
              that.data.polyline[0].points = that.data.polyline[0].points.concat(item)
              console.log(item.id + 'OK')
            })
            resolve()
          }).then(function (res) {
            //刷新数据
            that.setData({
              markers: that.data.markers,
              polyline: that.data.polyline,
            })
          })
        }
      })
    })
  }


})