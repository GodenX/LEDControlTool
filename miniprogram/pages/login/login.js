// miniprogram/pages/login/login.js
const app = getApp()
var mqtt = require('../../utils/mqtt.js')
const db = wx.cloud.database()
const user = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // array: [],
    items: [{
      name: 'saveData',
      value: '自动登陆'
    }, ],
    options: {
      clientId: '',
      username: '',
      password: '',
      keepalive: 60,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 4000,
    },
    topic: ''
  },

  onGetUsername: function(e) {
    this.data.options.username = e.detail.value
  },

  onGetPassword: function(e) {
    this.data.options.password = e.detail.value
  },

  onAutoLogin: function() {
    db.collection('user').add({
      data: {
        macaddr: this.data.macAddr,
        username: this.data.username,
        password: this.data.password
      },
      success: function(res) {}
    })
  },

  onLogin: function() {
    var that = this

    db.collection('user').where({
        username: this.data.options.username,
        password: this.data.options.password
      })
      .get({
        success: function(res) {
          if (res.data.length > 0) {
            that.data.topic = '/' + res.data[0].macaddr
            console.log('topic', that.data.topic)
          } else {
            console.log("登陆失败")
          }
        },
        fail: function(res) {
          console.log('fail', res.data)
        }
      })
    console.log('ttopic', that.data.topic)
    app.globalData.client = mqtt.connect('wxs://www.godenx.club/mqtt', that.data.options)

    app.globalData.client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })

    app.globalData.client.on('error', (error) => {
      console.log('连接失败:', error)
    })

    app.globalData.client.on('connect', (e) => {
      console.log('成功连接服务器')
      wx.navigateTo({
        url: '../main/main',
      })
      app.globalData.client.subscribe('/b827eb2a1414', {
        qos: 0
      }, function(err) {
        if (!err) {
          //app.globalData.client.publish('/Test1', 'Hello mqtt')
          console.log("订阅成功:", that.data.topic)
        }
      })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.options.clientId = app.globalData.openid
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