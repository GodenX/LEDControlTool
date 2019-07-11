// miniprogram/pages/logon/logon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    macAddr: '',
    username: '',
    password: '',
    confirmPassword: '',
    status: '',
    warning_text: ''
  },

  onGetMACAddr: function(e) {
    this.data.macAddr = e.detail.value
    if (this.data.macAddr != '') {
      this.data.status |= 0b00000001
    }
  },

  onScanMACAddr: function() {
    var that = this;
    wx.scanCode({
      success(res) {
        console.log(res)
        var mac_tmp = res.result
        that.setData({
          macAddr: mac_tmp
        })
        that.data.status |= 0b00000001
      }
    })
  },

  onGetUsername: function(e) {
    this.data.username = e.detail.value
    if (this.data.username != '') {
      this.data.status |= 0b00000010
    }
  },

  onGetPassword: function(e) {
    this.data.password = e.detail.value
    if (this.data.password != '') {
      this.data.status |= 0b00000100
    }
    if (this.data.confirmPassword != this.data.password) {
      this.setData({
        warning_text: '两次密码输入不一致！'
      })
      this.data.status &= 0b11110111
    } else {
      this.setData({
        warning_text: ''
      })
      this.data.status |= 0b00001000
    }
  },

  onGetConfirmPassword: function(e) {
    this.data.confirmPassword = e.detail.value
    if (this.data.confirmPassword != this.data.password) {
      this.setData({
        warning_text: '两次密码输入不一致！'
      })
      this.data.status &= 0b11110111
    } else {
      this.setData({
        warning_text: ''
      })
      this.data.status |= 0b00001000
    }
  },

  onRegister: function() {
    const db = wx.cloud.database()
    const user = db.collection('user')

    if (this.data.status == 0b00001111) {
      db.collection('user').add({
        data: {
          macaddr: this.data.macAddr,
          username: this.data.username,
          password: this.data.password
        },
        success: function(res) {
          console.log(res)
          wx.navigateTo({
            url: 'success'
          })
        },
        fail: function(res){
          console.log(res)
          wx.navigateTo({
            url: 'fail'
          })
        } 
      })
    } else {
      this.setData({
        warning_text: '请正确填写信息！'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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