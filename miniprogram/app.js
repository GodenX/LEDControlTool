//app.js
App({
  globalData:{
    openid: '',
    topic: '',
    client: '',
    hasLogin: ''
  },

  onLaunch: function () {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // 调用云函数获取openid
    wx.cloud.callFunction({
      name: 'getOpenID',
      data: {},
      success: res => {
        console.log('[云函数] [getOpenID] user openid: ', res.result.openid)
        that.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [getOpenID] 调用失败', err)
      }
    })
  }
})
