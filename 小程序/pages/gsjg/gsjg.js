var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:app._user.users,
    status:true,
    passwd_focus: false,
    passwd:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    if(app._user.users.CardStatus=="正常"){
      console.log("正常")
      _this.setData({
        status:true
      })
    }else{
      _this.setData({
        status: false
      })
    }
  },
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  inputFocus: function (e) {
    if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },
  reportLoss: function () {
    var _this = this
    if (!_this.data.passwd) {
      app.showErrorModal('一卡通密码不能为空', '提醒');
      return false;
    }
    if (!app._user.openid) {
      console.log("error")
      return false;
    }
    wx.showLoading('挂失中');
    wx.request({
      method: 'POST',
      url: app.server_url + '/Lost',
      data: {
        unionId: app._user.openid,
        password: _this.data.passwd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //密码正确
        if(res.data.msg=="1"){
          //挂失成功
          if(res.data.lose=="1"){
            wx.hideLoading();
            wx.showToast({
              title: '挂失成功',
              icon: 'success',
              duration: 2000
            })
            app._user.users.CardStatus="挂失";
          }
          else{
            wx.hideLoading();
            app.showErrorModal('服务器繁忙,挂失失败', '错误');
            return false;
          }
        }
        else{
          wx.hideLoading();
          app.showErrorModal('一卡通密码错误,请重新输入', '错误');
          return false;
        }
      },
      fail:function(){
        console.log("系统繁忙")
      }
    })
  },
  backToIndex:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})