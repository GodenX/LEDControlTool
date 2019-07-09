Page({
  onRegister: function(){
    wx.navigateTo({
      url: '../logon/logon'
    })
  },

  onReturn: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  }
});