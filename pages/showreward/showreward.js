//index.js
//获取应用实例
var scanCount = 0;
var app = getApp()
var rewardtype = -1;
Page({
  data: {
    awardsList: {},
    userInfo: {},
    imgurl:'https://hybc.ikeek.cn:8443/api/code/img',
  },
  //事件处理函数
  gotoLottery: function() {
        // wx.getUserInfo({
        //   success: function (res) {
        //     var simpleUser = res.userInfo;
        //     console.log(simpleUser);
            
        //   }
        // });
      
    wx.redirectTo({
      url: '../address/address?rewardtype=' + rewardtype
    })
    // var awardIndex = Math.random() * 4 >>> 0;
    // console.log(awardIndex)
   
  },
  onLoad: function (option) {
    console.log("--")
    var that = this
    rewardtype = option.rewardtype
      that.setData({
        imgurl: 'https://hybc.ikeek.cn:8443/api/code/prizeimg/' + rewardtype
      })
    
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
