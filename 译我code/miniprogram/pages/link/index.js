// pages/link/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:0,
    photoShow : 0,
    description: '',

    point_data: [],

    longitude: '',
    latitude: '',

    polyline: [{
      points: [],
      width: 4,
      color: '#15cda8',
      dottedLine: false
    }]
  },


  back(){
    wx.navigateBack({
      delta : 1
    })
  },

  markertap(e){
    var that = this
    var currentPhoto
    var newPoint =e.currentTarget.dataset
    console.log(this.data.markers)
    console.log(e.markerId)
    new Promise(function(resolve,rejact){
      that.data.markers.forEach((item,index)=>{
        if(e.markerId == item.id){
          currentPhoto = item.photoID
        }
      })
      resolve()
    }).then(function(value){
      that.setData({
        photoID : currentPhoto,
        latitude : newPoint.latitude,
        longitude: newPoint.longitude,
        photoShow:1
      })
      console.log(that.data.photoID)
    })   
  },

  close(){
    this.setData({
      photoShow : 0
    })
  },

  textDone(e){
    var that = this
    console.log(e)
    wx.cloud.database().collection('route').doc(that.data.routeId).update({
      data :{
        description:e.detail.value
      }     
    })
    setTimeout(function () {
      that.setData({
        description : e.detail.value
      })
    }, 1000)
  },

  change(){
    this.setData({
      show : 1
    })
  },

  isDel(){
    var that = this
    wx.showModal({
      content: '确定要删除路线吗？',
      showCancel:true,
      confirmText :'确定',
      cancelText:'取消',
      
      success(res){
        if(res.confirm){
          new Promise(function(resolve,reject){
            wx.cloud.database().collection('route').doc(that.data.routeId).remove({
            success:function(res){
              console.log(res.data)
            }
          })
            resolve()
          }).then(function(value){
          wx.cloud.database().collection('point').where({
            route_id : that.data.routeId
          }).remove({
            success:function(res){
              console.log(res.data)
            }
          })
          }).then(function(value){
            wx.redirectTo({
              url: '/pages/schedule/index'
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
    var that = this
    this.setData({
      routeId:options.route_id
    })
    //拿到route里的时间与描述
    var des1
    var time1
    wx.cloud.database().collection('route').doc(options.route_id).get().then(res => {
      console.log(res)
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

        
        point_data = res.data   //
        start_longitude = res.data[res.data.length-1].longitude    //起点是该数组的最后一个值
        start_latitude = res.data[res.data.length-1].latitude      
        res.data.forEach((item,index) =>{
          newPoints = [{latitude :item.latitude,longitude : item.longitude}]
          console.log(newPoints)
          points1 = newPoints.concat(points1)
        })
      }
    })

    setTimeout(function () {
      points1.pop()
      console.log(points1)
      that.data.polyline[0].points = points1
      console.log(that.data.polyline)
      that.setData({
        latitude: start_latitude,
        longitude: start_longitude,
        markers: point_data,
        polyline: that.data.polyline,
        time: time1,
        description: des1,
        routeId:options.route_id
      })
    }, 1000)


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