//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    wx.cloud.callFunction({
      name: 'getOpenID',
      data: {},
      success: res => {
        console.log('[云函数] [getOpenID] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [getOpenID] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  onLogon: function() {
    wx.navigateTo({
      url: '../logon/logon',
    })
  },

  onLogin: function() {
    // 调用云函数获取openid
    wx.navigateTo({
      url: '../login/login',
    })
  }

})