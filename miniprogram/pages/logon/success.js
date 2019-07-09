Page({
  onLogin: function(){
    wx.navigateTo({
      url: '../login/login'
    })
  },

  onReturn: function(){
    wx.navigateTo({
      url: '../index/index'
    })
  }
});