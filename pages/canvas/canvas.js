var app = getApp()
var scanCount = 0;
var table=null;
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: 'disabled',
    btnClass: '',
  },
  gotoList: function() {
    //进行扫码
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        scanCount++;
        wx.showModal({ title: '提示', content: '扫描成功次数' + scanCount })
       
        if (scanCount >= 6) {//进行抽奖
          that.setData({
            btnDisabled: '',
            btnClass:'color:#ccc; pointer-events: none;',
          })
          scanCount==0;
          wx.showModal({ title: '提示', content: '你已达到抽奖条件'})
        } else {
          wx.showModal({ title: '提示', content: '你还差(' + (6 - scanCount)+')次扫码可抽奖' })
        }
      }
    })
    // wx.switchTab({
    //   url: '../list/list'
    // })
  },
  getLottery: function() {
    var that = this
    var awardIndex = Math.random() * 4 >>> 0;

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
    setTimeout(function() {
      wx.showModal({
        title: '恭喜',
        content: '获得' + (awardsConfig.awards[awardIndex].name),
        showCancel: false,
        complete:function(res){
          scanCount = 0
          that.setData({
            btnClass: '',
          })
          // wx.navigateTo({
          //   url: '../address/address'
          // })
        }
      })
      
      if (awardsConfig.chance) {
        that.setData({
          btnDisabled: 'disabled'
        })

      }
    }, 4000);

//锁定扫码操作
    wx.request({
      url: 'https://hybc.ikeek.cn:8443/api/aa',
      method: 'post',
      data: {
        username: 'admin',
        password: 111111
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '抱歉',
          content: '网络异常，请重试',
          showCancel: false
        })
        //解除扫码操作
      }
    })
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

  }

})