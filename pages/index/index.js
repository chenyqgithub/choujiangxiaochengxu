//index.js
//获取应用实例
var scanCount = 0;
var app = getApp()
Page({
  data: {
    awardsList: {},
    userInfo: {}
  },
  //事件处理函数
  gotoLottery: function() {
    
    wx.switchTab({
      url: '../canvas/canvas'
    })
    // var awardIndex = Math.random() * 4 >>> 0;
    // console.log(awardIndex)
   
  },
  onLoad: function () {
    var that = this
    var list = wx.getStorageSync('winAwards') || {data:[]}

    if (list && list.data && list.data.length > 0) {
      list = list.data
    }else {
      list = []
    }
  }
})
