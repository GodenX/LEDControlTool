// miniprogram/pages/main/main.js
const app = getApp()
var mqtt = require('../../utils/mqtt.js')
const db = wx.cloud.database()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["设备", "模式1", "模式2", "模式3"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    styles: ['字符滚动显示', '幻彩呼吸灯', '光带滚动显示'],
    stylesIndex: 0,

    showColorPicker1: false,
    colorData1: {
      //基础色相(色盘右上顶点的颜色)
      hueData: {
        colorStopRed: 255,
        colorStopGreen: 0,
        colorStopBlue: 0,
      },
      //选择点的信息
      pickerData: {
        x: 0,
        y: 480,
        red: 0,
        green: 0,
        blue: 0,
        hex: '#000000'
      },
      //色相控制条位置
      barY: 0
    },
    rpxRatio: 1 //单位rpx实际像素

  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  bindstylesChange: function(e) {
    console.log('picker styles 发生选择改变，携带值为', e.detail.value);

    this.setData({
      stylesIndex: e.detail.value
    })
  },

  onGetSendMessage: function(e) {
    this.data.message = e.detail.value
  },

  onSendMessage: function() {
    app.globalData.client.publish(this.data.topic, this.data.message)
    console.log("发送成功:", this.data.message)
  },

  onLogout: function() {
    app.globalData.client.end()
    console.log("退出登陆")
    app.globalData.hasLogin = false
    wx.redirectTo({
      url: '../index/index',
    })
  },

  onChangeColor(e) {
    const index = e.target.dataset.id
    this.setData({
      [`colorData${index}`]: e.detail.colorData
    })
  },
  toggleColorPicker(e) {
    const index = e.currentTarget.dataset.id
    this.setData({
      [`showColorPicker${index}`]: !this.data[`showColorPicker${index}`]
    })
  },
  closeColorPicker() {
    this.setData({
      showColorPicker1: false,
      showColorPicker2: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    app.globalData.client.subscribe(app.globalData.topic, {
      qos: 0
    }, function(err) {
      if (!err) {
        console.log("订阅成功:", app.globalData.topic)
      } else {
        console.log("订阅失败：", err)
      }
    });

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          rpxRatio: res.screenWidth / 750
        });
      }
    });

    //监听mq的返回
    app.globalData.client.on('message', function(topic, message, packet) {
      // message is Buffer
      var data = packet.payload.toString()
      console.log("Packet:", data)
      //client.end()
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})