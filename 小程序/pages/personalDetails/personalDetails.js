var app=getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    binding: app._user.binding,
    user:app._user.users,
    wx:app._user,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
onShow:function(){
},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  tobinding:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  toChangeBinding:function(){
    this.tobinding()
  }
})
