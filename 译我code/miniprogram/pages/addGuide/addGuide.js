// pages/addGuide/addGuide.js
var WxParse = require('../guide/components/wxParse/wxParse.js');
 Page({
   data: {
       myloadImg: "",
    mytitle: "预览",
     radio: '发布攻略',
     html: '', // 实时富文本html结构
    //ylShow: false, // 预览弹层
    article: '',  // 要解析的html结构数据
     titValue: null,  // 文章标题
     url: '',        // 上传图片url
     radioV: '',    // 单选按钮所选
     mlList: '',    // 目录列表/所有单选
     yulan: false,
     author: "author",
     area: "",
     /*************-------------------------------发表文章 */
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
     index: 0,
 date: '2018-12-25',
 imgList: "",
   },
   onLoad: function(options) {
     
   },


   /**--------------------------------------------------------------------------------文章发表 */
   bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
      isend: false,
      unloading: false,
      listArr:[]
    });

    console.log("所选的省份",this.data.objectArray[e.detail.value].name);
    this.setData({
        area: this.data.objectArray[e.detail.value].name
    })
    console.log(this.data.area);
    // this.getData(0,this.data.guide_search,this.data.objectArray[e.detail.value].name);
},


   DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log("upload my img*-----------------------");
        if (this.data.imgList.length != 0) {
            console.log("upload my img*--------------if---------");
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        
        } else {
            console.log("upload my img*--------------else---------");
          this.setData({
            imgList: res.tempFilePaths
          })
          var that = this;
          console.log(this.data.imgList);
          wx.cloud.uploadFile({
            cloudPath: 'guideImg/' + Date.now() + '-' + Math.random() * 1000000,         // 云存储路径
            filePath: that.data.imgList[0]               // 要上传的文件资源路径(本地)
          }).then(res => {
            let imgUrl = res.fileID
            this.setData({
                myloadImg: imgUrl
            })
            // console.log(res);
            console.log(this.data.myloadImg)
          }).catch(error => {
            console.log(error);
          })
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '缩略图',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
   /**--------------------------------------------------------------------------------文章发表 */
   /**返回发布页 */
   gotoMyCollect(){
       this.setData({
           yulan: false
       })
},

/**-------------------------------------------- */
   onChange(val){  // 单选按钮发生变化
     this.setData({
       radioV: val.detail
     })
   },
   getHtml(e) {  // 获取实时富文本
     this.setData({
       // html:e.detail.content.html <strong>${this.data.titValue}</strong>
       html: `<p style="text-align: center;"></p><p style="text-align: center;"><br></p>${e.detail.content.html}`
     })
     console.log("getHtml----------------------")
     this.setData({
         article: this.data.html
     })
     console.log(this.data.html);
   },
   submit() {   // 点击预览
    if(this.data.yulan){
        this.setData({
            yulan: false,
            mytitle: "预览"
          })
    }else{
        this.setData({
            yulan: true,
            mytitle: "返回"
          })
    }

     console.log("this.data.html"+this.data.html);
    //  WxParse.wxParse('article', 'html', this.data.html, this, 5);
   },
   uploadContent(){  // 点击发布
    console.log("----------------------------------------------------发布文章-------------------------------------------------------------------------")
    console.log("文章标题");
    console.log(this.data.titValue)
    console.log("文章内容");
    console.log(this.data.html);
    if(this.data.html == null || this.data.titValue == null || this.data.titValue.trim() == ""){
       wx.showToast({
         title: "文章不可为空",
         icon: 'none',
         duration: 1000
       })
     } else {
      //  var nowTime = new Date().toJSON().substring(0, 10);
      var nowTime = Date.parse(new Date());
       wx.cloud.callFunction({
        name: "addGuide",
        data:{
            articleTitle: this.data.titValue,
            // type: this.data.radioV,
            articleContent: this.data.html,
            author: this.data.author,
            myloadImg: this.data.myloadImg,
            area: this.data.area,
            // url: this.data.url,
            createTime: nowTime,
        }
      }).then(res=>{
        console.log("添加攻略");
        console.log(res.result.data);
        // wx.switchTab({
        //     url: '../guide/guide',
        //   }) 
          wx.showToast({
            title: "文章发布成功",
            icon: 'none',
            duration: 2000
          })
          wx.navigateTo({
            url: '../guide/guide'
          })
        });
     }
     console.log("----------------------------------------------------发布文章-------------------------------------------------------------------------")
   },
//    onClose(){  // 关闭预览
//      this.setData({
//        ylShow: false
//      })
//    },
   insertImage(){ // 选择图片，将本地图片路径插入显示文本中 暂时显示
     wx.chooseImage({
       count: 1,
       success: res => {
         this.uploadMage(res.tempFilePaths[0])
       }
     })
   },
   uploadMage(article){  // 将图片上传到云存储
     let suffix = /\.\w+$/.exec(article)[0]      
     wx.cloud.uploadFile({
       cloudPath: 'guideImg/' + Date.now() + '-' + Math.random() * 1000000 + suffix,         // 云存储路径
       filePath: article                   // 要上传的文件资源路径(本地)
     }).then(res => {
       let imgUrl = res.fileID
       this.setData({
         url: imgUrl
       })
       this.selectComponent('#hf_editor').insertSrc(imgUrl); // 将云存储图片路径插入文本中
       // console.log(res);
     }).catch(error => {
       console.log(error);
     })
   },
 })