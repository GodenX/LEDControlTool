Page({
  onLogin: function(){
    wx.redirectTo({
      url: '../login/login'
    })
  },

  onReturn: function(){
    wx.redirectTo({
      url: '../index/index'
    })
  }
});