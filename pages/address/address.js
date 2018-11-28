//index.js
//获取应用实例
var rewardtype = -1;
var app = getApp()
Page({
  data: {
    awardsList: {},
    userInfo: {},
    name:'',
    address:'',
    phone:''
  },
  //获取用户输入的用户名
  nameNameInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  }, phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //事件处理函数
  gotoLottery: function(e) {
    console.log(e)
    //进行保存用户信息
    if (this.data.name.length == 0 || this.data.phone.length != 11 || this.data.address==0){
      setTimeout(function () {
        wx.showModal({
          title: '提交失败',
          content: '请填写准确的信息',
          showCancel: false,
          complete: function (res) {
            
          }
        })
      })
      return;
    }
    var name = this.data.name;
    var phone = this.data.phone;
    var address = this.data.address;
    wx.showModal({
      title: '确认提交填写信息?',
      content: '提交后将无法修改',
      showCancel: true,
      success(res) {
        if (res.confirm) {
          console.log(name)
          wx.request({
            url: 'https://hybc.ikeek.cn:8443/api/code/insertUserInfo',
            method: 'post',
            data: {
              name: name,
              phone: phone,
              address: address,
              rewardtype: rewardtype,
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: function (data) {
              console.log(data)
              // 
              setTimeout(function () {
                wx.showModal({
                  title: '提示',
                  content: '提交信息成功',
                  showCancel: false,
                  complete: function (res) {
                    wx.switchTab({
                      url: '../canvas/canvas'
                    })

                  }
                })
              })
              // 
            },
            fail: function (error) {
              console.log(error)
              wx.showModal({
                title: '抱歉',
                content: '网络异常，请重试',
                showCancel: false
              })
              //解除扫码操作
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
     

   
  },
  onLoad: function (option) {
    console.log(option)
    rewardtype = option.rewardtype
    var that = this
    var list = wx.getStorageSync('winAwards') || {data:[]}

    if (list && list.data && list.data.length > 0) {
      list = list.data
    }else {
      list = []
    }

    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo,
    //     awardsList: list || [],
    //     name: '',
    //     address: '',
    //     phone: ''
    //   })
    // })
  }
})
