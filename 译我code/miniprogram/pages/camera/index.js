const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

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

    // 创建camera上下文CameraContext对象
    // 具体查看微信api文档
    const ctx = wx.createCameraContext()

    // 获取camera实时帧数据
    // const listener = ctx.onCameraFrame((frame) => {
    //     //如果不需要则注释掉
    // })

    // 实拍照片配置
    ctx.takePhoto({

      quality: 'high', //成像质量

      success: (res) => { //成功回调
        this.setData({
          src: res.tempImagePath, //tempImagePath为api返回的照片路径
          show: true
        })
      },

      fail: (error) => { //失败回调
        //友好提示...
      }

    })
  },

  upload(src) {
    var that = this
    var openid = this.data.openid
    console.log(src)
    wx.cloud.uploadFile({
      cloudPath: "pointPhoto/" + (openid) + "/" + (new Date()).getTime() + Math.floor(9 * Math.random()) + ".jpg", // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
      filePath: src, // 微信本地文件，通过选择图片，聊天文件等接口获取
      config: {
        env: 'yiwo-nft-7gcgmeqx53a4441b' // 微信云托管环境
      },
      success: res => {
        that.setData({
          photoID: res.fileID
        })
      }
    })
  },


  // 保存图片/更改主页数据(用户最终点击确定按钮√)
  saveImg() {
      wx.showToast({
        title: '正在保存请稍等',
        duration: 2000,
      })
    // 获取所有页面(不懂请移步下面这篇文章)
    // https://blog.csdn.net/weixin_44198965/article/details/107821802
    let pages = getCurrentPages()

    // 当前页面-flag
    var currentPage = '';

    // 上一页-flag
    var prevPage = '';

    // 如果长度大于等于2
    if (pages.length >= 2) { //则对上面定义的flag赋值

      // 当前页
      currentPage = pages[pages.length - 1];

      // 上一页
      prevPage = pages[pages.length - 2];
    }



    // 刷新上一页(也就是主页面)数据-包含图片路径及标识
    if (prevPage) {
      var that = this
      var src = currentPage.data.src; // 获取当前图片路径(用户拍下的照片)

      var openid = that.data.openid
      console.log(123)
      wx.cloud.uploadFile({
        
        cloudPath: "pointPhoto/" + (openid) + "/" + (new Date()).getTime() + Math.floor(9 * Math.random()) + ".jpg", // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
        filePath: src, // 微信本地文件，通过选择图片，聊天文件等接口获取
        config: {
          env: 'prod-4gmcir0na5d0ba08' // 微信云托管环境ID
        },
        fali:res=>{
          console.log(123)

        },

        success: res => {
          console.log(123)
          that.setData({
            photoID: res.fileID,
          })

          prevPage.setData({
            //frontShow: false,//显示图片 
            newFrontSrc: that.data.photoID, //照片路径
            flag: true
          })
        },

      })
    }

    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)


    // 最后返回上一页(也就是主页)

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