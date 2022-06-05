const app = getApp();
Page({
  data: {
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
    imgList: [],
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
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
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
  }
})