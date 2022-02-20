// pages/link/index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:0,
    photoShow : false,
    albumShow:0,
    description: '',
    current: 0,
    point_data: [],

    longitude: '',
    latitude: '',

    albumID: [],


    polyline: [{
      points: [],
      width: 4,
      color: '#15cda8',
      dottedLine: false
    }]
  },


  back() {
    wx.navigateBack({
      delta: 1
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

  //点击marker展示图片
    markertap(e) { //修改过
          var withoutNull

        var that = this
        console.log(e)
        console.log(e.markerId) //拿对应点的id
    
        wx.cloud.database().collection('point').where({ //通过id来数据库里找点
          id: e.markerId
        }).get({
          success(res) {
            console.log(res)
            new Promise(function(resolve,reject){
              var newArry = res.data[0].photoID
              console.log(newArry)
              for (var i = 0; i < newArry.length; i++) { //排除照片中的null
                if (newArry[i] == null) {
                  newArry.splice(i, 1)
                  i = i - 1
                }
              }
              resolve(newArry)
            }).then(function(value){
              console.log(res.data[0]._id)
              that.setData({
                currentPhoto: value,
                currentPoint_id: res.data[0]._id,
                currentPhotoId: e.markerId,
                photoShow: true
              })
            })
          }
        })
      },



  //关闭照片
  closePhoto() {
    this.setData({
      photoShow: false,
      albumShow:0,
      current: 0

    })
  },




  //坐标删除照片
  delPhoto() {
    var that = this
    var updatePoint
    var pointId
    var updatePhoto
    wx.showModal({
      content: '确定要当前照片吗？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          console.log(that.data.currentPhotoId)
          new Promise(function (resolve, reject) {
            wx.cloud.database().collection('point').where({
              id: that.data.currentPhotoId
            }).get({
              success(res1) {
                console.log(res1)
                updatePoint = res1.data[0]
                updatePhoto = res1.data[0].photoID
                pointId = res1.data[0]._id
                console.log(updatePhoto)
                updatePhoto.splice(that.data.current, 1)   
                resolve()
              }
            })

          }).then(function (value) {
            updatePoint.photoID = updatePhoto
            
            console.log('更新后的数组', updatePhoto)
            wx.cloud.database().collection('point').doc(pointId).update({
              data: {
                photoID: updatePhoto
              }
            })
          }).then(function (value) {
            that.setData({
              currentPhoto: updatePhoto
            })
            if (updatePhoto.length == 0) { //如果删除后没有照片了，就删除该点
              wx.cloud.database().collection('point').doc(that.data.currentPoint_id)
              .remove({
                success: function (res) {
                  console.log(res.data)
                  wx.cloud.database().collection('point').where({ //拿到markers
                    route_id: that.data.routeId
                  }).orderBy('id', 'asc').get({
                    success(res) {
                      console.log(res.data)
                      //数据渲染
                      new Promise(function (resolve, reject) {
                          that.data.markers = res.data,
                        resolve()
                      }).then(function (res) {
                        //刷新数据
                        that.setData({
                          markers: that.data.markers,
                          photoShow:false
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

  textDone(e){
    var that = this
    console.log(e)
    wx.cloud.database().collection('route').doc(that.data.routeId).update({
      data: {
        description: e.detail.value
      }
    })
    setTimeout(function () {
      that.setData({
        description: e.detail.value
      })
    }, 1000)
  },

  change() {
    this.setData({
      show: 1
    })
  },

  //打开相册
  openAlbum(e) {
    var albumFor=[]
    var _id
    var that = this
    console.log(e)
    console.log(e.markerId)
    new Promise(function (resolve, reject) {
      wx.cloud.database().collection('point').where({
        id: e.markerId
      }).get({
        success(res) {
          _id = res.data[0]._id
          resolve(res.data[0]._id)
        }
      })
    }).then(function (value) {
      console.log(value)
      that.setData({
        currentPoint_id: value,
        currentPhotoId: e.markerId
      })
    }).then(function (value) {
      console.log(that.data.markers)
      that.data.markers.forEach((item, index) => {
        albumFor=albumFor.concat(item.photoID) 
        console.log(albumFor)
      })
      for(var i=0;i<albumFor.length;i++)
      {
        if (albumFor[i]==null ||albumFor[i]=='https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-15/ptq18491i23qyhzv0l2brriwh46mdyni_.png') {
            albumFor.splice(i,1)
            i=i-1
        }
      }
      console.log(albumFor)
      that.setData({
        albumID:albumFor,
        albumShow:1
      })
    })
    // wx.cloud.database().collection('point').where({
    //   id: e.markerId
    // }).get({
    //   success(res1) {
    //     that.setData({
    //       currentPointId = res1.data[0]._id //点击时的点的_id
    //     })
    //   }
    // })
  },

  isDel() {
    var that = this
    wx.showModal({
      content: '确定要删除路线吗？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',

      success(res) {
        if (res.confirm) {
          new Promise(function (resolve, reject) {
            wx.cloud.database().collection('route').doc(that.data.routeId).remove({
              success: function (res) {
                console.log(res.data)
              }
            })
            resolve()
          }).then(function (value) {
            wx.cloud.database().collection('point').where({
              route_id: that.data.routeId
            }).remove({
              success: function (res) {
                new Promise(function(resolve,reject){
                  let pages = getCurrentPages()
                  var prevPage = pages[pages.length - 2]

                  prevPage.setData({
                    isLoad:true
                  })

                  resolve()
                })
                  wx.navigateBack({
                    delta: 1
                  })             
              }
            })
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var draw
    var that = this
    this.setData({
      routeId: options.route_id
    })
    //拿到route里的时间与描述
    var des1
    var time1

    wx.cloud.database().collection('route').doc(options.route_id).get().then(res => {
      console.log(res)
      draw = res.data.draw //拿到路线
      des1 = res.data.description
      time1 = res.data.time
    })

    //拿到point里面的点
    var start_longitude
    var start_latitude
    var point_data
    var newPoints
    var points1 = null
    wx.cloud.database().collection('point').where({
      route_id: options.route_id
    }).orderBy('id', 'desc').get({
      success(res) {
        console.log(res.data)


        point_data = res.data //
        start_longitude = res.data[res.data.length - 1].longitude //起点是该数组的最后一个值
        start_latitude = res.data[res.data.length - 1].latitude
        res.data.forEach((item, index) => {
          newPoints = [{
            latitude: item.latitude,
            longitude: item.longitude
          }]
          console.log(newPoints)
          points1 = newPoints.concat(points1)
        })
        console.log(points1)
      }
    })

    setTimeout(function () {
      if (draw == null) {
        points1.pop()
        that.data.polyline[0].points = points1
      } else {
        that.data.polyline[0].points = draw
      }
      console.log(that.data.polyline)
      that.setData({
        latitude: start_latitude,
        longitude: start_longitude,
        markers: point_data,
        polyline: that.data.polyline,
        time: time1,
        description: des1,
        routeId: options.route_id
      })
    }, 1000)


  },

  upLoad(e) {
    var updatePhoto = this.data.currentPhoto
    var updatePoint
    var that = this
    var openid = this.data.openid
    console.log(e)
    if (e.currentTarget.dataset.uploadId == "https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-15/ptq18491i23qyhzv0l2brriwh46mdyni_.png") {
      console.log('执行上传照片')
      new Promise(function (resolve, reject) {
        wx.chooseMedia({
          camera: 'camera',
          count: 1,
          mediaType: 'Image',
          sourceType: 'album',
          success(res) {
            console.log('照片路径', res.tempFiles[0].tempFilePath)
            updatePhoto = that.data.currentPhoto
            resolve(res.tempFiles[0].tempFilePath)
          }
        })
      }).then(function (value) {
        that.cms(value, updatePhoto)
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
        cloudPath: "pointPhoto/" + (openid) + "/" + (new Date()).getTime() + Math.
 floor(9 * Math.random()) + ".jpg", // 对象存储路径
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
        wx.cloud.database().collection('point').doc(that.data.currentPoint_id).
 update({
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
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      success: function () {
        console.log("hide home success");
      },
      fail: function () {
        console.log("hide home fail");
      },
      complete: function () {
        console.log("hide home complete");
      },
    });
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

wx.setNavigationBarTitle({
  title: ""
})