let name = ''
Page({
  onLoad(){
    let name=wx.getStorageSync('name')
    this.setData({
      name:name
    })
  },
  getName(e){
    name=e.detail.value
    wx.setStorageSync('name', name)
    console.log(name)
  }
})