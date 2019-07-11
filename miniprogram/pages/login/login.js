// miniprogram/pages/login/login.js
const app = getApp()
var mqtt = require('../../utils/mqtt.js')
const db = wx.cloud.database()
const user = db.collection('auto_login')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    isAutoLogin: [{
      name: 'saveData',
      checked: false,
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
  },

  onGetUsername: function(e) {
    this.data.options.username = e.detail.value
  },

  onGetPassword: function(e) {
    this.data.options.password = e.detail.value
  },

  onAutoLogin: function(e) {
    var that = this
    if (e.detail.value == ''){
      that.data.isAutoLogin[0].checked = false
    }else{
      that.data.isAutoLogin[0].checked = true
    }
    wx.setStorage({
      key: "isAutoLogin",
      data: that.data.isAutoLogin[0].checked,
      success: function() {
        console.log('isAutoLogin 写入成功: ', that.data.isAutoLogin[0].checked)
      },
      fail: function() {
        console.log('isAutoLogin 写入失败: ', that.data.isAutoLogin[0].checked )
      }
    })
  },

  mqttLogin: function(){
    app.globalData.username = this.data.options.username
    app.globalData.password = this.data.options.password

    app.globalData.client = mqtt.connect('wxs://www.godenx.club/mqtt', this.data.options)

    app.globalData.client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })

    app.globalData.client.on('error', (error) => {
      console.log('连接失败:', error)
    })

    app.globalData.client.on('connect', (e) => {
      console.log('成功连接服务器')
    })

    wx.navigateTo({
      url: '../main/main',
    })
  },

  onLogin: function() {
    db.collection('auto_login').doc('isAutoLogin').update({
      data: {
        username: this.data.options.username,
        password: this.data.options.password
      },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
    this.mqttLogin()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    this.data.options.clientId = app.globalData.openid
    
    wx.getStorage({
      key: 'isAutoLogin',
      success(res) {
        console.log('isAutoLogin 读取成功: ', res.data)
        that.setData({
          ['isAutoLogin[0].checked']: res.data
        })
      }
    })

    db.collection('auto_login').doc('isAutoLogin').get({
      success: function (res) {
        that.data.options.username = res.data.username
        that.data.options.password = res.data.password
        that.setData({
          username: that.data.options.username,
          password: that.data.options.password
        })

        console.log('test2: ', that.data.isAutoLogin[0].checked)
        if (that.data.isAutoLogin[0].checked) {
          console.log('自动登陆')
          that.mqttLogin()
        } else {
          console.log('不自动登陆')
        }
      },
      fail: function (res) {
        console.log('fail:', res.data)
      }
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