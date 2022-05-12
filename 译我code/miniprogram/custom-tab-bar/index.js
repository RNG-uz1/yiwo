// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected:0,
    color: "#999999",
    selectedColor: "#0A9996",
    position: "bottom",
    borderStyle: "white",
    list: [
      {
        "pagePath": "/pages/index/index",
        "text":"首页",
        "iconPath": "../images/tBarOne.png",
        "selectedIconPath": "../images/tBarOne_color.png"
      },
      {
        "pagePath": "/pages/village/index",
        "text":"田家",
        "iconPath": "../images/tBarTwo.png",
        "selectedIconPath": "../images/tBarTwo_color.png"
      },
      {
        "pagePath": "/pages/me/index",
        "text":"个人",
        "iconPath": "../images/tBarThree.png",
        "selectedIconPath": "../images/tBarThree_color.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换tab
    switchLab:async function(e){
      console.log(e)
      const {jumppath,index} = e.currentTarget.dataset;
      console.log(jumppath)
      wx.switchTab({
        url: jumppath,
        fail(res){
          console.log(res)
        }
      })
      // this.setData({
      //   selected:index,
      // })
    }
  },
  observers:{

  }
})
