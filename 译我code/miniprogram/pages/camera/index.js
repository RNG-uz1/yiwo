const app = getApp()
Page({


  data: {

    src: '', //拍照后图像路径(临时路径)
    show: false, //相机视图显示隐藏标识
    cameraPos: "back",
  },


  // 取消/重新拍照按钮
  cancelBtn() {
    this.setData({ //更新数据
      show: false
    })
  },

  changePos() {
    this.setData({
      cameraPos: this.data.cameraPos == "back" ? "front" : "back"
    })
  },


  // 点击拍照按钮
  takePhoto() {

    const ctx = wx.createCameraContext()


    // 实拍照片配置
    ctx.takePhoto({

      quality: 'high', //成像质量

      success: (res) => { //成功回调
        console.log('返回照片临时路径')
        this.setData({
          src: res.tempImagePath, //tempImagePath为api返回的照片路径
          show: true
        })
      },
    })
  },


  // 保存图片/更改主页数据(用户最终点击确定按钮√)
  saveImg() {
    console.log('执行保存图片')
    var that = this
    var openid = this.data.openid
    var prevPage 


    // new Promise(function (resolve, reject) {
      wx.cloud.uploadFile({
        cloudPath: "pointPhoto/" + (openid) + "/" + (new Date()).getTime() + Math.floor(9 * Math.random()) + ".jpg", // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
        filePath: that.data.src, // 微信本地文件，通过选择图片，聊天文件等接口获取
        config: {
          env: 'prod-4gmcir0na5d0ba08' // 微信云托管环境ID
        },
        success: res => {

          that.setData({
            photoID: res.fileID,
          })
          console.log('上传照片完成')
          
          let pages = getCurrentPages()
          console.log(pages.length)
          prevPage = pages[pages.length - 2];
          prevPage.setData({
            newFrontSrc: res.fileID, //照片路径
            flag: true
          })
          // resolve()
          setTimeout(function(){
            console.log('执行跳转')
            wx.navigateBack({
              success(res){
                console.log('成功',res)
              },
              fail(res){
                console.log('失败',res)
              }
            })
          },2000)
        },
      })
    // }).then(function (value) {

    // })

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo._openid)
    this.setData({
      openid: app.globalData.userInfo._openid
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