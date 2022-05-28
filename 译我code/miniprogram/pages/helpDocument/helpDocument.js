// pages/helpDocument/helpDocument.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //触底刷新
        isloading: false,
        unloading: false,
        isend: false,

        showIndex: 10,
        questList: []
      },

      panel: function (e) {
        this.data.questList[e.currentTarget.dataset.index].t = !this.data.questList[e.currentTarget.dataset.index].t
        this.setData({
          questList:this.data.questList
        })
        if (e.currentTarget.dataset.index != this.data.showIndex) {
          this.setData({
            showIndex: e.currentTarget.dataset.index,
          })
        } 
        else {
          this.setData({
            showIndex: 10
          })
        }
      },     

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getData();
    },

    //获取帮助文档函数
    
    getData(size=0){
      wx.cloud.callFunction({
        name: "guide_help",
        data: {
          size,
        }
      }).then(res=>{        
        console.log(res);
        let oldData = this.data.questList;
        let newData = oldData.concat(res.result.data);
        this.setData({
          questList: newData
        });
        if(res.result.data <= 0){
          this.setData({
            unloading: true,
            isend: true
          })
        }
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
      console.log("chudi")
      if(!this.data.isend){
        wx.showLoading({
          title: '数据加载中',
          mask:true
        })
      
        this.getData(this.data.questList.length),  
        setTimeout(function () {
          wx.hideLoading({
          })
         }, 800) 
      }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})