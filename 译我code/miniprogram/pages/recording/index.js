const app = getApp()
var routeTime1
var i
Page({

  /**
   * 页面的初始数据
   */
  data: {


    show: false, //控制pagecontent
    chose: false,
    end: false,

    current: 0,
    tempLat: 0,
    tempLng: 0,

    route_time: '',

    route_id: "",

    flag: false,

    photoShow: false,

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

    polyline1: [{
      points: [],
      width: 10,
      color: "#FCA266",
      dottedLine: false,
      arrowLine: true,
      borderWidth: 2,
      borderColor:'#FA6400',
      arrowIconPath:'https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-04-25/2au233yrbjs1nnb1d56z6h0nauvut9om_.png'
    }]
  },

  //点击关闭展示中的照片
  closePhoto() {
    this.setData({
      photoShow: false,
      current: 0
    })
  },

  //评分，关闭弹窗
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
          score: that.data.score, //保存打分
        }
      })
    }).then(function (value) {
      clearInterval(i) //关闭保存路径时产生的倒计时）
      console.log('关闭计时器',i)
      wx.offLocationChange() //关闭获取定位接口
    }).then(function (value) {
      //跳转到主页
      wx.switchTab({
        url: `/pages/index/index`
      })
    })
  },

  //点击拍照打卡
  photoButton() {
    this.setData({
      chose: true, //显示选择
      show: true, //打开弹窗
      end: false //不显示评分
    })

  },

  //点击结束路径
  endRoute() {
    var that = this
    //判断路径需不需要保存
    if (this.data.markers.length >= 1) { //有打卡，保存
      console.log('路径中有打卡，保存路径')
      that.setData({
        show: true,
        end: true,
        chose: false
      })
    } else { //没有打卡，删除路径
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
          clearInterval(i) //关闭倒计时
          console.log('关闭计时器',i)
          //页面跳转
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      })
    }
  },

  onLoad: function (options) {
    var that = this

    new Promise(function (resolve, reject) {
      that.getDate() //获取时间信息（字符串）
      routeTime1 = (new Date()).getTime() + Math.floor(9 * Math.random()) //获取时间戳
      //进入页面时获取起始位置与信息
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            routeTime: routeTime1,
            openid: app.globalData.userInfo._openid, //获取用户_openid
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

    })
  },


  onShow: function (options) {
  },

  createPoint(longitude1, latitude1, _locationChangeFn, onlyPoiny) {
    var that = this
    var photoArry
    if (onlyPoiny == 1) {
      photoArry = ['https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-15/ptq18491i23qyhzv0l2brriwh46mdyni_.png']
    } else {
      photoArry = [that.data.newFrontSrc, 'https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-15/ptq18491i23qyhzv0l2brriwh46mdyni_.png']
    }
    var markerID = (new Date()).getTime() + Math.floor(9 * Math.random())
    new Promise(function (resolve, reject) {
      //向markers数组里添加新的markers
      var newMarkers = [{
        id: markerID,
        photoID: photoArry,
        iconPath: 'https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-08/cr3uiumk4d4qtb7gdl8v5jlv39nb6ubp_.png',
        longitude: longitude1,
        latitude: latitude1,
        height: 27,
        width: 33
      }]
      that.data.markers = that.data.markers.concat(newMarkers)

      resolve()
    }).then(function (value) {

      //刷新数据
      that.setData({
        markers: that.data.markers,
        polyline: that.data.polyline,
        frontSrc: that.data.frontSrc,
        flag: false
      })

    }).then(function (value) {

      wx.cloud.database().collection('point').add({ //向数据库中添加点
        data: {
          id: markerID,
          latitude: latitude1,
          longitude: longitude1,
          photoID: photoArry,
          iconPath: 'https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-08/cr3uiumk4d4qtb7gdl8v5jlv39nb6ubp_.png',
          route_id: that.data.route_id,
          height: 27,
          width: 33
        },
        success: function (res) {
          that.setData({
            pointID: res._id //记录最新一个点的id
          })
        }
      })
    }).then(function (value) {
      wx.offLocationChange(_locationChangeFn)
    })

  },




  onUnload: function () {
    //用户返回时如果没有打点，就删除路径
    var that = this
    if (this.data.markers.length == 0) {
      wx.cloud.database().collection('route').doc(that.data.route_id).remove({
        success(res) {

          //取消获取实时位置的定时器
          clearInterval(i)
          console.log('关闭计时器',i)
          wx.offLocationChange()
          //更改用户状态
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

  //执行值打卡，不拍照
  onlyPoint() {
    console.log('执行打点不拍照')
    var d
    var that = this
    var latitude1
    var longitude1

    wx.showToast({
      title: '正在保存',
      duration: 2000
    })

    that.setData({ //不拍照时的照片路径
      newFrontSrc: null
    })

    wx.startLocationUpdate({ //开启实时定位
      success: (res) => {
        wx.onLocationChange(_locationChangeFn)
      },
    })
    const _locationChangeFn = function (res) {

      new Promise(function (resolve, reject) {
        longitude1 = res.longitude
        latitude1 = res.latitude
        resolve()
      }).then(function (value) {
        // 计算两次打卡地点之间的距离
        d = that.GetDistance(that.data.tempLat, that.data.tempLng, latitude1, longitude1)
      }).then(function (value) {
        if (d > 20) { //如果两次打卡地点的距离大于20米，则生成新的点
          console.log('执行了新建点')
          that.createPoint(longitude1, latitude1, _locationChangeFn, 1)
          that.setData({
            tempLat: latitude1,
            tempLng: longitude1,
            show: false
          })
        } else {
          console.log('执行了存入旧点')
          wx.showToast({
            title: '两点太近，您可以在上一个点中上传',
            icon: 'none'
          })
          that.setData({
            show: false
          })
        }
      })
    }
  },

  pointAndPhoto() {
    var that = this
    var pointID
    var d
    var longitude1
    var latitude1

    new Promise(function(resolve,reject){
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success(res) {
         wx.showToast({
           title: '正在保存照片',
           duration: 2000
         })
          console.log('照片路径', res.tempFiles[0].tempFilePath)
          wx.cloud.uploadFile({
            cloudPath: "pointPhoto/" + (that.data.openid) + "/" + (new Date()).getTime() + Math.floor(9 * Math.random()) + ".jpg", // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
            filePath: res.tempFiles[0].tempFilePath, // 微信本地文件，通过选择图片，聊天文件等接口获取
            config: {
              env: 'prod-4gmcir0na5d0ba08' // 微信云托管环境ID
            },
            success: res1 => {
              console.log('上传cms成功')
              that.setData({
                newFrontSrc: res1.fileID, //照片路径
                flag: true
              })
              resolve()
            },
          })
          //updatePhoto = that.data.currentPhoto
        },
        fail(res){
          console.log('失败',res)
        }
      })
    }).then(function(value){
      // if (that.data.flag == true) {
        console.log('执行保存点')
        wx.startLocationUpdate({ //开启实时获取定位
          success: (res) => {
            wx.onLocationChange(_locationChangeFn) //监听定位
          },
        })
        const _locationChangeFn = function (res) {
          new Promise(function (resolve, reject) {
            longitude1 = res.longitude //获取经纬度信息
            latitude1 = res.latitude
            resolve()
          }).then(function (value) {
            // 计算两次打卡地点之间的距离
            d = that.GetDistance(that.data.tempLat, that.data.tempLng, latitude1, longitude1)
            console.log('距离', d)
          }).then(function (value) {
  
            if (d > 20) { //如果两次打卡地点的距离大于20米，则生成新的点
              console.log('执行了新建点')
              that.createPoint(longitude1, latitude1, _locationChangeFn, 0) //新建point
              console.log(pointID)
              that.setData({ //将新点存入对比数据中
                tempLat: latitude1,
                tempLng: longitude1
              })
            } else {
              var updatePhotoArry
              var newPhotoArry = [that.data.newFrontSrc] //接收照片路径
              console.log('执行了存入旧点')
              wx.cloud.database().collection('point').doc(that.data.pointID).get({ //获取要存入的那个点
                success(res) {
                  new Promise(function (resolve, reject) {
                    res.data.photoID.splice(res.data.photoID.length - 1, 0, that.data.newFrontSrc) //更新该点的照片数组
                    resolve()
                  }).then(function (value) {
                    wx.cloud.database().collection('point').doc(that.data.pointID).update({
                      data: {
                        photoID: res.data.photoID //数据库中也更新
                      }
                    })
                  }).then(function (value) {
                    that.data.markers[that.data.markers.length - 1].photoID = res.data.photoID
                    console.log('更新markers')
                  }).then(function (value) {
                    that.setData({
                      markers: that.data.markers,
                      flag: false
                    })
                  }).then(function (value) {
                    wx.offLocationChange(_locationChangeFn)
                    console.log('执行了关闭实时定位')
                  }).then(function (value) {
                    wx.showToast({
                      title: '两个点距离过近，已存入上一个点内',
                      icon: 'none'
                    })
                  })
                }
              })
            }
          })
        }
      // }
    })


    this.setData({
      show: false
    })
  },

  //点击marker展示图片
  markertap(e) { //修改过

    var withoutNull

    var that = this
    console.log(e)
    console.log(e.markerId) //拿对应点的id

    wx.cloud.database().collection('point').where({ //通过id来数据库里找点
      id: e.markerId
    }).get({
      success(res) {
        new Promise(function (resolve, reject) {
          var newArry = res.data[0].photoID
          console.log(newArry)
          for (var i = 0; i < newArry.length; i++) { //排除照片中的null
            if (newArry[i] == null) {
              newArry.splice(i, 1)
              i = i - 1
            }
          }
          resolve(newArry)
        }).then(function (value) {
          that.setData({
            currentPhoto: value,
            currentPoint_id: res.data[0]._id,
            currentPhotoId: e.markerId,
            photoShow: true
          })
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
            polyline1: that.data.polyline1, //获取未完成的路线的点
          })
          console.log('该路径已经有的点', res.data[0].draw)
          resolve(res.data[0]._id)
        }
      })
    }).then(function (value) {
      //用路径id来获取路径上的点
      console.log(value)
      console.log(that.data)
      wx.cloud.database().collection('point').where({ //拿到markers
        route_id: value
      }).orderBy('id', 'asc').get({
        success(res) {
          console.log(res)
          //数据渲染
          new Promise(function (resolve, reject) {
            res.data.forEach((item, index) => {
              console.log(item)
              that.data.markers = that.data.markers.concat(item),
                console.log(item.id + 'OK')
            })
            resolve()
          }).then(function (value) {
            var lastPoint = that.data.markers[0]
            that.data.pointID = res.data[0]._id
            that.data.tempLat = lastPoint.latitude
            that.data.tempLng = lastPoint.longitude
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

    clearInterval(i)
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

        if (result1.speed > 0.2 && D > 10) { //若速度大于0.2且距上一个点10m就存入
          console.log('速度大于0.2,且距离大于10米')
          var newPoint = [{
            latitude: result1.latitude,
            longitude: result1.longitude
          }]
          that.data.polyline1[0].points = newPoint.concat(that.data.polyline1[0].points)
          that.setData({
            polyline1: that.data.polyline1,
            longitude: result1.longitude,
            latitude: result1.latitude,
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
          wx.showModal({
            content: '开始记录您的旅程，请确保定位开启',
            showCancel: false,
            confirmText: '确定',

            success(res) {
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
            }
          })

        } else { //用户状态为true时,加载上一条路径的状态
          wx.showModal({
            content: '将继续您未完成的旅程',
            showCancel: false,
            confirmText: '确定',

            success(res) {
              that.loadRoute()
            }
          })
        }
      }
    })
  },

  onChange(e) {
    const {
      current
    } = e.detail
    this.setData({
      current
    })
  },

  delPhoto() { //删除照片
    var that = this
    var updatePhoto
    var newUpdate
    wx.showModal({
      content: '确定要当前照片吗？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',

      success(res) {
        if (res.confirm) {
          new Promise(function (resolve, reject) {
            wx.cloud.database().collection('point').where({ //在数据库内找到对应点
              id: that.data.currentPhotoId
            }).get({
              success(res1) {
                console.log('打印点的数据', res1.data[0])
                updatePhoto = res1.data[0].photoID //把点内照片赋值
                console.log('步骤一，打印删除前的照片', res1.data[0].photoID)
                newUpdate = that.del(res1.data[0].photoID) //删除数据且排除null
                resolve(newUpdate)
              }
            })
          }).then(function (value) {
            console.log('步骤四，删除且排除null', value)
            //更新数据库

            wx.cloud.database().collection('point').doc(that.data.currentPoint_id).update({
              data: {
                photoID: value
              }
            })
            that.setData({
              currentPhoto: value,
            })
            updatePhoto = value
            console.log('更新数据')
          }).then(function (value) {

            if (updatePhoto.length == 0) { //如果删除后没有照片了，就删除该点
              wx.cloud.database().collection('point').doc(that.data.currentPoint_id).remove({
                success: function (res) {
                  console.log(res.data)
                  wx.cloud.database().collection('point').where({ //拿到markers
                    route_id: that.data.route_id
                  }).orderBy('id', 'asc').get({
                    success(res) {
                      //数据渲染
                      new Promise(function (resolve, reject) {
                        that.data.markers = res.data,
                          resolve()
                      }).then(function (res) {
                        //刷新数据
                        that.setData({
                          markers: that.data.markers,
                          photoShow: false
                        })
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  del(updatePhoto) {
    var that = this
    new Promise(function (resolve1, reject) {
      console.log('步骤二，执行删除，删除前数据为', updatePhoto)
      updatePhoto.splice(that.data.current, 1)
      resolve1()
    }).then(function (value) {
      console.log('步骤三，执行删除之后未排除null的数据为', updatePhoto)
      for (var i = 0; i < updatePhoto.length; i++) { //排除照片中的null
        if (updatePhoto[i] == null) {
          updatePhoto.splice(i, 1)
          i = i - 1
        }
      }
    })
    return updatePhoto;

  },

  upLoad(e) { //上传照片
    var updatePhoto = this.data.currentPhoto
    var that = this
    var openid = this.data.openid
    console.log(e)
    //判断是不是上传照片的图标
    if (e.currentTarget.dataset.uploadId == "https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-15/ptq18491i23qyhzv0l2brriwh46mdyni_.png") {
      console.log('执行上传照片')

      new Promise(function (resolve, reject) {
        wx.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sourceType: ['album'],
          success(res) {
            console.log('照片路径', res.tempFiles[0].tempFilePath)
            updatePhoto = that.data.currentPhoto
            resolve(res.tempFiles[0].tempFilePath)
          }
        })
      }).then(function (value) {
        that.cms(value, updatePhoto) //照片上传云托管
      })
    } else {
      wx.previewImage({
        current:e.currentTarget.dataset.uploadId, // 当前显示图片的http链接
        urls:[e.currentTarget.dataset.uploadId] // 需要预览的图片http链接列表
    })
    }
  },

  cms(value, updatePhoto) {
    var that = this
    var openid = this.data.openid


    new Promise(function (resolve, reject) {
      console.log('步骤一')
      console.log(value)
      wx.cloud.uploadFile({
        cloudPath: "pointPhoto/" + (openid) + "/" + (new Date()).getTime() + Math.floor(9 * Math.random()) + ".jpg", // 对象存储路径
        filePath: value, // 微信本地文件，通过选择图片，聊天文件等接口获取
        config: {
          env: 'prod-4gmcir0na5d0ba08' // 微信云托管环境ID
        },
        success: res => {
          console.log('上传成功', res.fileID)
          updatePhoto.splice(updatePhoto.length - 1, 0, res.fileID)
          resolve()
        },
      })

    }).then(function (value) {
      new Promise(function (resolve1, reject1) {
        console.log('更新后的数组', updatePhoto)
        wx.cloud.database().collection('point').doc(that.data.currentPoint_id).update({
          data: {
            photoID: updatePhoto
          }
        })
        console.log('步骤二')
        resolve1()
      }).then(function (value) {
        that.setData({
          currentPhoto: updatePhoto
        })
        console.log('步骤三')
      })

    })
  }
})