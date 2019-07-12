Page({
  onRegister: function(){
    wx.redirectTo({
      url: '../logon/logon'
    })
  },

  onReturn: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  }
});