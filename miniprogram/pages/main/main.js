// miniprogram/pages/main/main.js
const app = getApp()
var mqtt = require('../../utils/mqtt.js')
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    styles: ['', '字符滚动显示', '幻彩呼吸灯', '光带滚动显示'],
    stylesIndex: 0,
    topic: '',
    message: ''
  },

  bindstylesChange: function (e) {
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
    wx.setStorage({
      key: "isAutoLogin",
      data: false,
      success: function() {
        console.log('isAutoLogin 写入成功: false')
      },
      fail: function() {
        console.log('isAutoLogin 写入失败: false')
      }
    })
    wx.navigateTo({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    db.collection('user').where({
        _openid: app.globalData.openid,
        username: app.globalData.username,
        password: app.globalData.password
      })
      .get({
        success: function(res) {
          if (res.data.length > 0) {
            that.data.topic = '/' + res.data[0].macaddr
            app.globalData.client.subscribe(that.data.topic, {
              qos: 0
            }, function(err) {
              if (!err) {
                console.log("订阅成功:", that.data.topic)
              } else {
                console.log("订阅失败：", err)
              }
            })
          } else {
            console.log("未查询到主题！")
          }
        },
        fail: function(res) {
          console.log('fail: ', res.data)
        }
      })

    //监听mq的返回
    app.globalData.client.on('message', function(topic, message, packet) {
      // message is Buffer
      var data = packet.payload.toString()
      console.log("Packet:", data)
      //client.end()
    })
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