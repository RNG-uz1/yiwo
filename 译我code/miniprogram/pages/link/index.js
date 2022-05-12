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
      width: 10,
      color: "#FCA266",
      dottedLine: false,
      arrowLine: true,
      borderWidth: 2,
      borderColor:'#FA6400',
      arrowIconPath:"https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-04-25/2au233yrbjs1nnb1d56z6h0nauvut9om_.png"
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
        console.log(app)
        console.log(e.markerId) //拿对应点的id
     wx.cloud.database().collection('point').where({ //通过id来数据库里找点
      id: e.markerId
    }).get({
      success(res) {
        console.log(res.data[0].iconPath)
        if (res.data[0].iconPath=='https://7969-yiwo-nft-9gw5pymu18ae114f-1309408715.tcb.qcloud.la/cloudbase-cms/upload/2022-02-08/cr3uiumk4d4qtb7gdl8v5jlv39nb6ubp_.png') {
          console.log('打印现在的照片')
          new Promise(function(resolve,reject){
            var newArry = res.data[0].photoID
            console.log(newArry)
            for (var i = 0; i < newArry.length; i++) { //排除照片中的null
              if (newArry[i] == null) {
                newArry.splice(i, 1)
                i = i - 1
              }
            }
            resolve(newArry)
          }).then(function(value){
            console.log(res.data[0]._id)
            that.setData({
              currentPhoto: value,
              currentPoint_id: res.data[0]._id,
              currentPhotoId: e.markerId,
              photoShow: true
            })
          })
        }
        else{
          console.log('打印原来的照片')
          var newArry = [res.data[0].photoID]
          console.log(newArry)
          for (var i = 0; i < newArry.length; i++) { //排除照片中的null
            if (newArry[i] == null) {
              newArry.splice(i, 1)
              i = i - 1
            }
          }
          that.setData({
            currentPhoto:newArry,
            currentPoint_id: res.data[0]._id,
            currentPhotoId: e.markerId,
            photoShow: true
          })
        }
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
  var newUpdate
  var updatePhoto
  wx.showModal({
    content: '确定要删除当前照片吗？',
    showCancel: true,
    confirmText: '确定',
    cancelText: '取消',
    success(res) {
      if (res.confirm) {
          console.log("删除现在的照片")
          console.log(that.data.currentPhotoId)
          new Promise(function (resolve, reject) {
            wx.cloud.database().collection('point').where({
              id: that.data.currentPhotoId
            }).get({
              success(res1) {
                console.log('打印点的数据', res1.data[0])
                updatePhoto = res1.data[0].photoID //点内的照片赋值
                updatePhoto = res1.data[0].photoID //把点内照片赋值
                console.log(updatePhoto)
                console.log('步骤一，打印删除前的照片', res1.data[0].photoID)
                
                newUpdate = that.del(res1.data[0].photoID)   //删除数据且排除null
                resolve(newUpdate)
                console.log(newUpdate)
              }
            })
          }).then(function (value) {
              console.log('步骤四，删除且排除null',value)
            //更新数据库
            wx.cloud.database().collection('point').doc(that.data.currentPoint_id).
   update({
              data: {
                photoID: value
              }
            })
             that.setData
            ({
                currentPhoto: value,
            })
              updatePhoto = value
              console.log('更新数据')
          }).then(function (value) {
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
 del(updatePhoto) {
      var that = this
      new Promise(function(resolve1,reject){
        console.log('步骤二，执行删除，删除前数据为',updatePhoto)
        updatePhoto.splice(that.data.current, 1)
        resolve1()
      }).then(function(value){
        console.log('步骤三，执行删除之后未排除null的数据为',updatePhoto)
        for (var i = 0; i < updatePhoto.length; i++) { //排除照片中的null
          if (updatePhoto[i] == null) {
            updatePhoto.splice(i, 1)
            i = i - 1
          }
        }
      })
        return updatePhoto;
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
  openAlbum() {
    var that=this
    var albumFor=[]
    console.log(that.data.routeId)
      db.collection('point').where({
        route_id:that.data.routeId
      }).get().then(res=>{
        console.log(res.data)
        res.data.forEach((item,index)=>{
          albumFor=albumFor.concat(item.photoID)    
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
        wx.previewImage({
          current:'', // 当前显示图片的http链接
          urls:albumFor // 需要预览的图片http链接列表
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
    else{
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