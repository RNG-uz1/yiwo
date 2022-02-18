const app = getApp()
const db = wx.cloud.database()  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    obtnArry:[]
  },

  addinput(e){
    if (this.data.obtnArry.length==8) {
      wx.showToast({
        title: '最多8个标签哦~',
        icon:'none'
      })
    }
    else{
      var that=this
      var inputValue
      wx.showModal({
        title: '请输入标签',
        placeholderText:'不超过4个字',
        editable:true,
        success(res){
          if (res.confirm) {
              //确定按钮，添加数组达到添加标签的作用
        inputValue=res.content
        console.log(inputValue.length)
        if (inputValue.length>4) {
          wx.showToast({
            title: '最多输入4个字哦',
            icon:'none'
          })
        }
        else{
          var obtnArry = that.data.obtnArry;
          if (res.content=="") {
            wx.showToast({
              title: '输入为空请重新输入',
              icon:'none'
            })
          }
          else{
            var newData = { num: obtnArry.length, name: res.content };
            obtnArry.push(newData);
            that.setData({
              obtnArry:obtnArry
            })
            console.log(obtnArry)
                
            //将输入的标签存入数据库
            db.collection('label').where({
              _openid: app.globalData.openid
            }).update({
              data:{
                habit:that.data.obtnArry
              }
            })
          }
        }
      
          }
        }
      })
    }
  },
 
  gotoWatch(e) {
    wx.navigateTo({
      url: '/pages/schedule/index',
    })
  },

  //用户登录
  login() {
    var that = this
    wx.getUserProfile({
      desc: '用于完善信息',
      success(res) {
        console.log(res.userInfo)
        var user = res.userInfo

        app.globalData.userInfo = user

        that.setData({
          userInfo: user
        })

        //检查之前是否登录过
        wx.cloud.database().collection('user').where({ //查找数据库内openid相同的信息
          _openid: app.globalData.openid
        }).get({
          success(res) {
            console.log(res)
            if (res.data.length == 0) { //如果在数据库内没有找到相同的openid记录则添加
              //把用户信息添加到数据库
              wx.cloud.database().collection('user').add({
                data: {
                  nickName: user.nickName,
                  avatarUrl: user.avatarUrl,
                  isLoad:false
                },
                success(res) {
                  console.log(res)
                  wx.showToast({
                    title: '登陆成功',
                  })
                }

              })
            } else {
              that.setData({
                userInfo: res.data[0]
              })
            }

          }

        })

      }
    })
  },

 


  isDel(e){
    var that=this
    wx.showModal({
      content: '确定要删除此标签吗？',
      showCancel:true,
      confirmText :'确定',
      cancelText:'取消',
      success(res){
        if (res.confirm) {
          var index=e.currentTarget.dataset.index//获取点击的下标
          var habit=that.data.obtnArry//获得整个数组
          console.log(habit)
          if (index>-1) { 
            var a=habit.splice(index,1) 
          }
        
         console.log(habit)
          db.collection('label').where({
            _openid: app.globalData.openid
          }).update({
            data:{
              habit:habit
            }
          })

          db.collection('label').where({ //查找数据库内openid相同的信息
            _openid: app.globalData.openid
          }).get().then(res=>{ 
            console.log(habit)
           that.setData({
            obtnArry:habit
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
 
    var that=this
    this.setData({
      userInfo : app.globalData.userInfo
    })

    //检查之前是否有openid
  db.collection('label').where({ //查找数据库内openid相同的信息
  _openid: app.globalData.openid
  }).get({
  success(res) {
    if (res.data.length == 0) { //如果在数据库内没有找到相同的openid记录则添加
      //把用户信息和标签添加到数据库
      wx.cloud.database().collection('label').add({
        data: {
          habit:[]
         },
        })
      }
    }
  })

    db.collection('label').where({ //查找数据库内openid相同的信息
      _openid: app.globalData.openid
    }).get().then(res=>{
      var habit=res.data[0].habit
      for(var i = 0 ;i<habit.length;i++)  
      {  
         //这里为过滤的值
          if(habit[i] == null )  
          {  
              habit.splice(i,1);
              i= i-1;
          }  
      }  
      console.log(habit)
     that.setData({
      obtnArry:res.data[0].habit
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
    // wx.navigateTo({
    //   url: '/pages/index/index',
    // })
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