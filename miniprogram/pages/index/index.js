//index.js
Page({
  data: {

  },

  onLoad: function() {
    
  },

  onLogon: function() {
    wx.redirectTo({
      url: '../logon/logon',
    })
  },

  onLogin: function() {
    wx.redirectTo({
      url: '../login/login',
    })
  }

})