// miniprogram/pages/main/main.js
const app = getApp()
var mqtt = require('../../utils/mqtt.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: ''
  },

  onGetSendMessage: function(e){
    this.data.message = e.detail.value
  },

  onSendMessage: function () {
    app.globalData.client.publish('/Test1', this.data.message)
    console.log("发送成功:", this.data.message)
  },

  onLogout: function(){
    app.globalData.client.end()
    console.log("退出登陆")
    wx.navigateTo({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})