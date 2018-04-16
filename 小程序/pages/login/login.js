var app=getApp()
Page({
  data: {
    userid_focus: false,
    passwd_focus: false,
    userid: '',
    passwd: '',
  },
  
  onLoad: function (options) {
  
  },

  onShareAppMessage: function () {
  
  },
  bind: function () {
    var _this = this
    if (!_this.data.userid || !_this.data.passwd) {
      app.showErrorModal('账号及密码不能为空', '提醒');
      return false;
    }           
    if (!app._user.openid) {
      console.log("error")
      return false;
    }
    wx.showLoading('绑定中');
    wx.request({
      method: 'POST',
      url: app.server_url+'/Binding',
      data: {
        unionId: app._user.openid,
        username: _this.data.userid,
        password: _this.data.passwd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.errmsg=="0") {
          if (res.data.msgBinding=="1"){
            app._user.binding=true;
            wx.showLoading('正在获取数据，请稍候');
            wx.request({
              method: 'POST',
              url: app.server_url + '/Obtain',
              data: {
                unionId: app._user.openid,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success:function(a){
                //清除缓存
                app.cache = {};
                wx.clearStorage();
                wx.showToast({
                  title: '绑定成功',
                  icon: 'success',
                  duration: 1500
                })
                wx.navigateBack();
              },
              fail:function(){

              }
            })
          }else{
            console.log(res.data.msgBinding);
            if (res.data.msgBinding = "0"){
              wx.hideLoading()
              wx.showModal({
                title: '错误',
                content: '一卡通账号已被绑定',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }else{
              wx.showModal({
                title: '加载失败',
                content: '未知错误',
                showCancel: false
              });
            }
          }
        }
        else {
          wx.hideLoading();
          console.log("fail")
        }
      },
      fail: function (res) {
        app._user.binding = false;
        wx.hideLoading();
        console.log("fail");
      }
    })
  },
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    });
    if (e.detail.value.length >= 9) {
      wx.hideKeyboard();
    }
  },
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },
})