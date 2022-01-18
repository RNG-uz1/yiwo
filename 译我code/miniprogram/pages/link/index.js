// pages/link/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    description:'',

    point_data:[],

    longitude:'',
    latitude:'',

    polyline:[{
      points:[],
      width: 4,
      color: '#15cda8',
      dottedLine: false
    }]
  },

  getDes(){
    var that = this
    var des
    wx.cloud.database().collection('route').doc('54ad1eea61e5717507e4a9b137c6d39a').get().then(res=>{
      console.log(res.description)
      des = res.data.description
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var start_longitude
    var start_latitude
    var point_data
    var that = this 
    //从对于route_ id的
    wx.cloud.database().collection('point').where({
      route_id :"54ad1eea61e5717507e4a9b137c6d39a"
    }).get({
      success(res) {
        console.log(res)
        point_data = res.data
        start_longitude = res.data[0].longitude
        start_latitude = res.data[0].latitude
        //that.getStartPoint()
        
      }
    })
    setTimeout(function () { 
      that.getDes()
      that.data.polyline[0].points = point_data
      console.log(that.data.polyline[0])
      that.setData({ 
        latitude : start_latitude,
        longitude : start_longitude,
        markers : point_data,
        polyline : that.data.polyline[0]
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
  title: "游西安day1"
})
