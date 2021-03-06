// pages/village/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({  // 文档中有介绍 getTabBar用于获取当前组件实例
        selected: 1,
        show:true
      })
    }
  },

  gotoMall(){
    wx.navigateTo({
      url: '/pages/mall/index',
    })
  },
  gotoGuide(){
    wx.navigateTo({
      url: '/pages/guide/guide',
    })
  },
  gotoLocalCulture(){
    wx.navigateTo({
      url: '/pages/localCulture/localCulture',
    })
  },

  gotoTree(){
    wx.showToast({
      title: '开发中，敬请期待~',
      icon: 'none',
    })
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