const app = getApp()
var routeTime1
var i
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
      points: [{
        latitude: '',
        longitude: '',
      }],
      width: 4,
      color: "#15cda8",
      dottedLine: false
    }],

    polyline1: [{
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
      clearInterval(i)
      wx.offLocationChange()
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
          clearInterval(i)
          //页面跳转
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      })
    }


  },

  onLoad: function (options) {

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
    }).then(function (values) {

      //查看用户状态，判断是加载未完成还是新建路径
      that.checkUser()

    }).then(function (value) {

      //画线路
      that.drawRoute()

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
      const _locationChangeFn = function (res) {
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
            iconPath:'https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-08/cr3uiumk4d4qtb7gdl8v5jlv39nb6ubp_.png',
            longitude: longitude1,
            latitude: latitude1,
            height:27,
            width:33
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
              iconPath:'https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-08/cr3uiumk4d4qtb7gdl8v5jlv39nb6ubp_.png',
              route_id: that.data.route_id,
              height:27,
              width:33
            }
          })
        }).then(function (value) {
          wx.offLocationChange(_locationChangeFn)
        })
      }
    }
  },

  onHide: function () {

  },


  onUnload: function () {
    //用户返回时如果没有打点，就删除路径
    var that = this
    if (this.data.markers.length == 0) {
      wx.cloud.database().collection('route').doc(that.data.route_id).remove({
        success(res) {

          //取消获取实时位置的定时器
          clearInterval(i)
          wx.offLocationChange()
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



  onShareAppMessage: function () {

  },

  //获取时间
  getDate() {
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
        routeTime: routeTime1, //路径时间戳，用来区别同一地点不同路径
        time: that.data.time, //路径时间  用来展示
        route_title: '',
        description: '点击进行编辑',
        score: that.data.score,
        draw: []
      },
      success(res) {
        console.log(res)
        that.setData({
          drawTap: true,
          route_id: res._id
        })
      }
    })
  },

  //加载上一条路径状态
  loadRoute() {
    var that = this

    new Promise(function (resolve, reject) {
      //先获取上一条路径的id
      wx.cloud.database().collection('route').where({
        _openid: app.globalData.userInfo._openid
      }).orderBy('routeTime', 'desc').get({
        success(res) {
          console.log(res)
          that.data.polyline1[0].points = res.data[0].draw
          that.setData({
            route_id: res.data[0]._id,
            polyline1 : that.data.polyline1,   //获取未完成的路线的点
          })
          console.log('该路径已经有的点',res.data[0].draw)
          resolve(res.data[0]._id)
        }
      })
    }).then(function (value) {
      //用路径id来获取路径上的点
      console.log(value)
      console.log(that.data)
      wx.cloud.database().collection('point').where({   //拿到markers
        route_id: value
      }).orderBy('id', 'desc').get({
        success(res) {
          console.log(res)
          //数据渲染
          new Promise(function (resolve, reject) {
            res.data.forEach((item, index) => {
              console.log(item)
              that.data.markers = that.data.markers.concat(item),
              // that.data.polyline[0].points = that.data.polyline[0].points.concat(item)
              console.log(item.id + 'OK')
            })
            resolve()
          }).then(function (res) {
            //刷新数据
            that.setData({
              markers: that.data.markers,
            })
          })
        }
      })
    })
  },

  drawRoute() {
    var that = this
    var lat1, lng1, lat2, lng2
    lat1 = 0
    lng1 = 0

    i = setInterval(function (result) {
      console.log(i)
      wx.startLocationUpdateBackground({
        success(res) {
          wx.onLocationChange(_locationChangeDraw)
        },
      })
      const _locationChangeDraw = function (result1) {
        lat2 = result1.latitude
        lng2 = result1.longitude
        var D = that.GetDistance(lat1, lng1, lat2, lng2) //计算这次坐标距上次的距离
        console.log('距离',D)
        console.log('倒计时执行1次')
        console.log('速度',result1.speed)
        if (result1.speed > 0.2 && D > 10) {  //若速度大于0.2且距上一个点10m就存入
          console.log('速度大于0.2,且距离大于10米')
          var newPoint = [{
            latitude: result1.latitude,
            longitude: result1.longitude
          }]
          that.data.polyline1[0].points = newPoint.concat(that.data.polyline1[0].points)
          that.setData({
            polyline1: that.data.polyline1
          })
          lat1 = lat2
          lng1 = lng2
        }
        wx.offLocationChange()
      }
      wx.cloud.database().collection('route').doc(that.data.route_id).update({
        data: {
          draw: that.data.polyline1[0].points
        }
      })
    }, 10000)
  },

  Rad(d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
  },

  GetDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // 地球半径;
    s = Math.round(s * 10000) / 10; //输出为米
    return s;
  },

  checkUser() {
    var that = this
    var isload
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
  }

})