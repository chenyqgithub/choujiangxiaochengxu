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
    if (rewardtype!=3){
      wx.redirectTo({
        url: '../address/address?rewardtype=' + rewardtype
      })
    }else{
      wx.showModal({
          title: '恭喜',
          content: '恭喜您 获得四等奖 在中奖记录中可查看',
          showCancel: false,
          complete: function (res) {
            wx.switchTab({
              url: '../canvas/canvas'
            })

          }
        })
    }
        // wx.getUserInfo({
        //   success: function (res) {
        //     var simpleUser = res.userInfo;
        //     console.log(simpleUser);
            
        //   }
        // });
      
    
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
