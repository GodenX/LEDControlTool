// miniprogram/pages/login/login.js
const app = getApp()
var mqtt = require('../../utils/mqtt.js')
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSaveInfo: [{
      name: 'saveInfo',
      checked: false,
      value: '保存用户名和密码'
    }],
    options: {
      clientId: '',
      username: '',
      password: '',
      keepalive: 60,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 4000,
    },
    warning_text: ''
  },

  onGetUsername: function(e) {
    this.data.options.username = e.detail.value
  },

  onGetPassword: function(e) {
    this.data.options.password = e.detail.value
  },

  onSaveInfo: function(e) {
    var that = this
    if (e.detail.value == '') {
      that.data.isSaveInfo[0].checked = false
    } else {
      that.data.isSaveInfo[0].checked = true
    }
    wx.setStorage({
      key: "isSaveInfo",
      data: that.data.isSaveInfo[0].checked,
      success: function() {
        console.log('自动登陆状态写入成功: ', that.data.isSaveInfo[0].checked)
      },
      fail: function() {
        console.log('自动登陆状态写入失败')
      }
    })
  },

  mqttLogin: function() {
    app.globalData.client = mqtt.connect('wxs://www.godenx.club/mqtt', this.data.options)

    app.globalData.client.on('reconnect', (error) => {
      console.log('MQTT正在重连:', error)
    })

    app.globalData.client.on('error', (error) => {
      console.log('MQTT连接失败:', error)
    })

    app.globalData.client.on('connect', (e) => {
      console.log('MQTT成功连接服务器')
      if (!app.globalData.hasLogin) {
        app.globalData.hasLogin = true
        wx.hideLoading()
        wx.redirectTo({
          url: '../main/main',
        })
      }
    })
  },

  saveUserInfo: function() {
    var that = this
    wx.setStorage({
      key: "username",
      data: that.data.options.username,
      success: function() {
        console.log('用户名写入成功: ', that.data.options.username)
      },
      fail: function() {
        console.log('用户名写入失败')
      }
    })
    wx.setStorage({
      key: "password",
      data: that.data.options.password,
      success: function() {
        console.log('密码写入成功: ', that.data.options.password)
      },
      fail: function() {
        console.log('密码写入失败')
      }
    })
  },

  onLogin: function() {
    var that = this
    wx.showLoading({
      title: '数据加载中',
    });
    db.collection('user').where({
        username: that.data.options.username,
        password: that.data.options.password
      })
      .get({
        success: function(res) {
          if (res.data.length > 0) {
            console.log("用户名密码验证成功")
            app.globalData.topic = '/' + res.data[0].macaddr
            that.setData({
              warning_text: ''
            })
            if (that.data.isSaveInfo[0].checked) {
              that.saveUserInfo()
            }
            that.mqttLogin()
          } else {
            console.log("用户名密码验证失败")
            that.setData({
              warning_text: '用户名密码验证失败！'
            })
          }
        },
        fail: function(res) {
          console.log('联网失败：', res.data)
        }
      })
  },

  onRegister: function() {
    wx.redirectTo({
      url: '../logon/logon',
    })
  },

  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'isSaveInfo',
      success(res) {
        console.log('自动登陆状态读取成功: ', res.data)
        that.setData({
          ['isSaveInfo[0].checked']: res.data
        })
        if (res.data) {
          wx.getStorage({
            key: 'username',
            success(res) {
              that.data.options.username = res.data
              console.log('用户名读取成功: ', that.data.options.username)
              that.setData({
                username: that.data.options.username
              })
              wx.getStorage({
                key: 'password',
                success(res) {
                  that.data.options.password = res.data
                  console.log('密码读取成功: ', that.data.options.password)
                  that.setData({
                    password: that.data.options.password
                  })
                },
                fail(res) {
                  console.log('密码读取失败')
                }
              })
            },
            fail(res) {
              console.log('用户名读取失败')
            }
          })
        }
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