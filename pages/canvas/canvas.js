var app = getApp()
var scanCount = 0;
var table=null;
var getLotteryFun = function () 
{
  var that = this
  //调用后台接口进行抽奖
  ///https://hybc.ikeek.cn:8443/api/code/choujiang

  var awardIndex = Math.random() * 4 >>> 0;
  var awardIndex = -1;
  wx.request({
    url: 'https://hybc.ikeek.cn:8443/api/code/choujiang',
    method: 'post',
    data: {
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (data) {
      console.log(data)
      awardIndex = data.data;

      // 获取奖品配置
      var awardsConfig = app.awardsConfig,
        runNum = 8
      if (awardIndex < 2) awardsConfig.chance = false
      console.log(awardIndex)

      // 记录奖品
      var winAwards = wx.getStorageSync('winAwards') || {
        data: []
      }
      winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
      wx.setStorageSync('winAwards', winAwards)


      // 中奖提示
      setTimeout(function () {
        // wx.showModal({
        //   title: '恭喜',
        //   content: '恭喜您 获得' + (awardsConfig.awards[awardIndex].name),
        //   showCancel: false,
        //   complete: function (res) {
            

        //   }
        // })
        //---
        scanCount = 0
        if (awardIndex != 3) {
          wx.navigateTo({
            url: '../showreward/showreward?rewardtype=' + awardIndex
          })
          // wx.navigateTo({
          //   url: '../address/address?rewardtype=' + awardIndex
          // })

        } else {
          //进行保存用户信息
          wx.request({
            url: 'https://hybc.ikeek.cn:8443/api/code/insertUserInfo',
            method: 'post',
            data: {
              name: 'simpleUser.nickName',
              phone: '',
              address: 'simpleUser.province' + ' ' + 'simpleUser.city',
              rewardtype: 3,
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: function (data) {
              wx.navigateTo({
                url: '../showreward/showreward?rewardtype=3'
              })
            },
            fail: function (error) {
              console.log(error)
              wx.showModal({
                title: '抱歉',
                content: '网络异常，请重试',
                showCancel: false
              })
            }
          })
        }
        //---

        if (awardsConfig.chance) {
          // that.setData({
          //   btnDisabled: 'disabled'
          // })

        }
      }, 600);
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

};
Page({
  data: {
    awardsList: {},
    scancodetext: {},
    animationData: {},
    btnDisabled: 'disabled',
    btnClass: '',
    messageNum:'你还需要6次成功扫码可进行抽奖',
  },
  gotoList: function() {
    //进行扫码
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res) 
        
        //将扫码数据传入后台进行对比 返回值 -1奖品不足 0成功  -1扫码信息不可用
        //https://hybc.ikeek.cn:8443/api/code/validationCode?code=
        wx.request({
          url: 'https://hybc.ikeek.cn:8443/api/code/validationCode?code=' + res.result,
          method: 'get',
          data: {
            add: res.result
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (data) {
            console.log(data)
            if(data.data==0){
              // 记录扫描码
              var scancodetexts = wx.getStorageSync('winscancodetext') 
              if(scancodetexts.length==0){
                scancodetexts= {
                  data: []
                }
              }
              console.log(scancodetexts)
              scancodetexts.data.push('条码信息:' + res.result)
              wx.setStorageSync('winscancodetext', scancodetexts)

              //绑定条码
              var list = wx.getStorageSync('winscancodetext') || { data: [] }
              if (list && list.data && list.data.length > 0) {
                list = list.data
              } else {
                list = []
              }
              that.setData({
                scancodetext: list || []
              })
              console.log(list)
              scanCount++;
              if (scanCount >= 6) {//进行抽奖
              //清空scancodetext
                wx.setStorageSync('winscancodetext', [])
                that.setData({
                  btnDisabled: '',
                  // btnClass: 'color:#ccc; pointer-events: none;',
                })
                scanCount == 0;
                // wx.showModal({ title: '提示', content: '你已达到抽奖条件' })
                //进行抽奖
                wx.showModal({
                  title: '提示',
                  content: '获得你已达到抽奖资格,点击确定进行抽奖',
                  showCancel: false,
                  complete: function (res) {
                    getLotteryFun();
                  }
                })
                
                //点击确认进行跳转页面
              } else {
                // wx.showModal({ title: '提示', content: '你还差(' + (6 - scanCount) + ')次扫码可抽奖' })
                var messageNum = '你还需要成功扫码' + (6 - scanCount)+'次可抽奖'
                  table.setData({
                    messageNum: messageNum
                  });

              }
            } else if (data.data == -2) {
              wx.showModal({ title: '提示', content: '活动已经结束' })
            }else if(data.data==-1){
              wx.showModal({ title: '提示', content: '暂无奖品'})
            } else if (data.data == 1) {
              wx.showModal({ title: '提示', content: '本次扫码无效' })
            }
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
       
       
       
      }
    })
    // wx.switchTab({
    //   url: '../list/list'
    // })
  },
  getLottery: function() {
    var that = this
    //调用后台接口进行抽奖
    ///https://hybc.ikeek.cn:8443/api/code/choujiang

    var awardIndex = Math.random() * 4 >>> 0;
    var awardIndex = -1;
    wx.request({
      url: 'https://hybc.ikeek.cn:8443/api/code/choujiang',
      method: 'post',
      data: {
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (data) {
        console.log(data)
        awardIndex=data.data;

        // 获取奖品配置
        var awardsConfig = app.awardsConfig,
          runNum = 8
        if (awardIndex < 2) awardsConfig.chance = false
        console.log(awardIndex)

        // 初始化 rotate
        /*  var animationInit = wx.createAnimation({
            duration: 10
          })
          this.animationInit = animationInit;
          animationInit.rotate(0).step()
          this.setData({
            animationData: animationInit.export(),
            btnDisabled: 'disabled'
          })*/

        // 旋转抽奖
        app.runDegs = app.runDegs || 0
        console.log('deg', app.runDegs)
        app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / 4))
        console.log('deg', app.runDegs)

        var animationRun = wx.createAnimation({
          duration: 4000,
          timingFunction: 'ease'
        })
        that.animationRun = animationRun
        animationRun.rotate(app.runDegs).step()
        that.setData({
          animationData: animationRun.export(),
          btnDisabled: 'disabled'
        })

        // 记录奖品
        var winAwards = wx.getStorageSync('winAwards') || {
          data: []
        }
        winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
        wx.setStorageSync('winAwards', winAwards)


        // 中奖提示
        setTimeout(function () {
          wx.showModal({
            title: '恭喜',
            content: '获得' + (awardsConfig.awards[awardIndex].name),
            showCancel: false,
            complete: function (res) {
              scanCount = 0
              that.setData({
                btnClass: '',
              })
              if (awardIndex!=3){
                wx.navigateTo({
                  url: '../address/address?rewardtype=' + awardIndex
                })
              }else{
                //进行保存用户信息
                // wx.login({
                //   success: function () {
                //     wx.getUserInfo({
                //       success: function (res) {
                //         var simpleUser = res.userInfo;
                //         console.log(simpleUser);
                        
                //       }
                //     });
                //   }
                // });
                wx.request({
                  url: 'https://hybc.ikeek.cn:8443/api/code/insertUserInfo',
                  method: 'post',
                  data: {
                    name: 'simpleUser.nickName',
                    phone: '',
                    address: 'simpleUser.province' + ' ' + 'simpleUser.city',
                    rewardtype: 3,
                  },
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (data) {

                  },
                  fail: function (error) {
                    console.log(error)
                    wx.showModal({
                      title: '抱歉',
                      content: '网络异常，请重试',
                      showCancel: false
                    })
                  }
                })
              }
              
            }
          })

          if (awardsConfig.chance) {
            that.setData({
              btnDisabled: 'disabled'
            })

          }
        }, 4000);
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


//锁定扫码操作
    // wx.request({
    //   url: 'https://hybc.ikeek.cn:8443/api/aa',
    //   method: 'post',
    //   data: {
    //     username: 'admin',
    //     password: 111111
    //   },
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: function(data) {
    //     console.log(data)
    //   },
    //   fail: function(error) {
    //     console.log(error)
    //     wx.showModal({
    //       title: '抱歉',
    //       content: '网络异常，请重试',
    //       showCancel: false
    //     })
    //     //解除扫码操作
    //   }
    // })
  },
  onReady: function(e) {

    var that = this;
table=that;
    // getAwardsConfig
    app.awardsConfig = {
      chance: true,
      awards: [{
          'index': 0,
        'name': '一等奖'
        },
        {
          'index': 1,
          'name': '二等奖'
        },
        {
          'index': 2,
          'name': '三等奖'
        },
        {
          'index': 3,
          'name': '四等奖'
        }
      ]
    }

    // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))


    // 绘制转盘
    var awardsConfig = app.awardsConfig.awards,
      len = awardsConfig.length,
      rotateDeg = 360 / len / 2 + 90,
      html = [],
      turnNum = 1 / len // 文字旋转 turn 值
    that.setData({
      btnDisabled: app.awardsConfig.chance ? '' : 'disabled'
    })
    var ctx = wx.createContext()
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

      // 颜色间隔
      if (i % 2 == 0) {
        ctx.setFillStyle('rgba(255,184,32,.1)');
      } else {
        ctx.setFillStyle('rgba(255,203,63,.1)');
      }

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,.1)');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({
        turn: i * turnNum + 'turn',
        lineTurn: i * turnNum + turnNum / 2 + 'turn',
        award: awardsConfig[i].name
      });
    }
    table.setData({
      awardsList: html,
      btnDisabled: 'disabled',
    });
    scanCount=0;
    // 对 canvas 支持度太差，换种方式实现
    /*wx.drawCanvas({
      canvasId: 'lotteryCanvas',
      actions: ctx.getActions()
    })*/

  }, onShow:function () {
    

    var that = this
    console.log(22)
    var messageNum = '你还需要成功扫码' + (6 - scanCount) + '次可抽奖'
    that.setData({
      messageNum: messageNum
    });
    //初始化扫描code
    var list = wx.getStorageSync('winscancodetext') || { data: [] }
    if (list && list.data && list.data.length > 0) {
      list = list.data
    } else {
      list = []
    }
    that.setData({
      scancodetext: list || []
    })
    console.log(list)
    // 跑马灯
    //获取跑马灯显示文本
    wx.request({
      url: 'https://hybc.ikeek.cn:8443/api/code/getmarqueetext',
      method: 'post',
      data: {
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
        that.setData({
          msgList: data.data
        });

      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})