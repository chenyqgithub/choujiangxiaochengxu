//index.js
//获取应用实例
var scanCount = 0;
var app = getApp()
Page({
  data: {
    awardsList: {},
    userInfo: {},
    modalHidden: true
  },
  //事件处理函数
  gotoLottery: function() {
        // wx.getUserInfo({
        //   success: function (res) {
        //     var simpleUser = res.userInfo;
        //     console.log(simpleUser);
            
        //   }
        // });
      
    // wx.navigateTo({
    //   url: '../showreward/showreward?rewardtype=3'
    // })
    // var awardIndex = Math.random() * 4 >>> 0;
    // console.log(awardIndex)
    
   
  },/**
   * 显示弹窗
   */
  buttonTap: function () {
    
  },

  /**
   * 点击取消
   */
  modalCandel: function () {
    // do something
    console.log("show")
    // this.setData({
    //   modalHidden: true
    // })
  },

  /**
   *  点击确认
   */
  modalConfirm: function () {
    // do something
    console.log("close")
    this.setData({
      modalHidden: true
    })
  },
  onLoad: function () {
    console.log("--")
    // var that = this
    // var list = wx.getStorageSync('winAwards') || {data:[]}
    // if (list && list.data && list.data.length > 0) {
    //   list = list.data
    // }else {
    //   list = []
    // }
    // that.setData({
    //   awardsList: list || []
    // })
  }, onShow:function(){
    console.log("--")
    var that = this
    var list = wx.getStorageSync('winAwards') || { data: [] }
    if (list && list.data && list.data.length > 0) {
      list = list.data
    } else {
      list = []
    }
    that.setData({
      awardsList: list || []
    })
  }
})
