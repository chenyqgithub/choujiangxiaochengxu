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
        // wx.getUserInfo({
        //   success: function (res) {
        //     var simpleUser = res.userInfo;
        //     console.log(simpleUser);
            
        //   }
        // });
      
    // wx.navigateTo({
    //   url: '../address/address?rewardtype=2'
    // })
    // var awardIndex = Math.random() * 4 >>> 0;
    // console.log(awardIndex)
   
  },
  onLoad: function () {
     
    var that = this
    var list = wx.getStorageSync('winAwards') || {data:[]}
console.log(list)
    if (list && list.data && list.data.length > 0) {
      list = list.data
    }else {
      list = []
    }

    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo,
    //     awardsList: list || []
    //   })
    // })
    that.setData({
      awardsList: list || []
    })
  }
})
