// pages/localCulture/localCulture.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      guide_search: null,
      //幻灯片数组
      swiperShow:[],      
      //触底刷新
      isloading: false,
      unloading: false,
      isend: false,
      //攻略内容数组
      listArr:[],
        wxTitle: "译我",  //攻略标题-
        /**省份picker------------------------------------begin */
        areaList: ['全国','安徽', '澳门', '北京', '重庆','福建', '甘肃', '广东', '广西','贵州', '海南', '河北', '河南','黑龙江', '湖北', '湖南', '吉林','江苏', '江西', '辽宁', '内蒙古','宁夏', '青海', '山东', '山西','陕西', '上海', '四川', '台湾','天津', '西藏', '香港', '新疆','云南', '浙江'],
        objectArray: [
          {
            id: 0,
            name: '全国'
          },
          {
            id: 1,
            name: '安徽'
          },
          {
            id: 2,
            name: '澳门'
          },
          {
            id: 3,
            name: '北京'
          },
          {
            id: 4,
            name: '重庆'
          },
          {
            id: 5,
            name: '福建'
          },
          {
            id: 6,
            name: '甘肃'
          },
          {
            id: 7,
            name: '广东'
          },
          {
            id: 8,
            name: '广西'
          },
          {
            id: 9,
            name: '贵州'
          },
          {
            id: 10,
            name: '海南'
          },
          {
            id: 11,
            name: '河北'
          },
          {
            id: 12,
            name: '河南'
          },
          {
            id: 13,
            name: '黑龙江'
          },
          {
            id: 14,
            name: '湖北'
          },
          {
            id: 15,
            name: '湖南'
          },
          {
            id: 16,
            name: '吉林'
          },
          {
            id: 17,
            name: '江苏'
          },
          {
            id: 18,
            name: '江西'
          },
          {
            id: 19,
            name: '辽宁'
          },
          {
            id: 20,
            name: '内蒙古'
          },
          {
            id: 21,
            name: '宁夏'
          },
          {
            id: 22,
            name: '青海'
          },
          {
            id: 23,
            name: '山东'
          },
          {
            id: 24,
            name: '山西'
          },
          {
            id: 25,
            name: '陕西'
          },
          {
            id: 26,
            name: '上海'
          },
          {
            id: 27,
            name: '四川'
          },
          {
            id: 28,
            name: '台湾'
          },
          {
            id: 29,
            name: '天津'
          },
          {
            id: 30,
            name: '西藏'
          },
          {
            id: 31,
            name: '香港'
          },
          {
            id: 32,
            name: '新疆'
          },
          {
            id: 33,
            name: '云南'
          },
          {
            id: 34,
            name: '浙江'
          }
        ],
        index: 0
      },
      bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
          index: e.detail.value,
          isend: false,
          unloading: false,
          listArr:[]
        });

        console.log("所选的省份",this.data.objectArray[e.detail.value].name);
        this.getData(0,this.data.guide_search,this.data.objectArray[e.detail.value].name);
    },
    /**省份picker------------------------------------end */
     /** 发布攻略 */
     goPublish(){
      wx.navigateTo({
        url: '../addLocalCulture/addLocalCulture'
      })
    },   
    //图片页面跳转
    gotoInfo(e){
      console.log(e.target.dataset.swiper_id);
      wx.navigateTo({
        url: '/pages/localCultureArticle/localCultureArticle?article_id='+e.target.dataset.swiper_id
      })
    },
    gotoCultureArticle(e){
      console.log(e.currentTarget.dataset.info),
      wx.navigateTo({
        url: '/pages/localCultureArticle/localCultureArticle?article_id='+e.currentTarget.dataset.info,
      })
    },

    /**模糊查询 */
    goSearch(){
      console.log(this.data.guide_search);
      this.setData({
        isend: false,
        listArr:[],
        unloading: false
      })
      if(this.data.guide_search==null || ''){   //该if判断用来解决因字符串为空时,编译器replace报错
        console.log("省份选择：",this.data.objectArray[this.data.index].name);
        this.getData(0,null,this.data.objectArray[this.data.index].name);
      }else{
        console.log("省份选择：",this.data.objectArray[this.data.index].name);
        console.log("搜索框选择：",this.data.guide_search.replace(/\s+/g,''));
        this.getData(0,this.data.guide_search.replace(/\s+/g,''),this.data.objectArray[this.data.index].name);
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.swiperShow();
      this.getData();
    },
    //获取数据库里幻灯片展示的对象
    swiperShow(){
      wx.cloud.callFunction({
        name: "localCulture_swiper_show",
      }).then(res=>{
        console.log("幻灯片");
        console.log(res.result.data);
        this.setData({
          swiperShow: res.result.data
        })
      })
    },
    clearData(size=0,searchKey=null,areaProvince='全国'){ //刷新时查找字段默认为空
      wx.cloud.callFunction({
        name: "localCulture_list_get",
        data: {
          size,
          searchKey,
          areaProvince
        }
      }).then(res=>{
        console.log("下拉");
        console.log(res.result.data);
        for (var index in res.result.data) {
          /**循环遍历处理富文本里的图片 */
          res.result.data[index].content= res.result.data[index].content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,"");
          console.log(res.result.data[index].content);
         }
        this.setData({
          listArr: res.result.data
        })
      })
    },
    getData(size=0,searchKey=null,areaProvince='全国'){
      console.log('getData获取搜索框值'+searchKey);
      console.log('getData获取省份值'+areaProvince);
      wx.cloud.callFunction({
        name: "localCulture_list_get",
        data: {
          size,
          searchKey,
          areaProvince
        }
      }).then(res=>{        
        let oldData = this.data.listArr;
        for (var index in res.result.data) {
          /**循环遍历处理富文本里的图片 */
          res.result.data[index].content= res.result.data[index].content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,"");
         }
        let newData = oldData.concat(res.result.data);
        this.setData({
          listArr: newData
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
      this.setData({
        isend: false
      })
        wx.setNavigationBarTitle({
          title: this.data.wxTitle
        })
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
      this.setData({
        unloading: false,
        isend: false,
        guide_search: "",
        index: 0
      })
        this.clearData(0);
        setTimeout(function () {
          wx.stopPullDownRefresh()
         }, 2000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if(!this.data.isend){
        wx.showLoading({
          title: '数据加载中',
          mask:true
        })
      
        this.getData(this.data.listArr.length,this.data.guide_search,this.data.objectArray[this.data.index].name),
  
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