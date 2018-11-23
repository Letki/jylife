//app.js
var serverUrl = require('pages/api/serverUrl.js')

App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },
  getUserInfo: function (fc) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: '正在登录..',
      })
      wx.getSetting({
        success: function (res) {
          if (typeof res.authSetting["scope.userInfo"] == "undefined" || res.authSetting["scope.userInfo"] == false) {
            //没有授权
            _this.hasAuthorize = false;
            reject('noAuthorise')
            wx.hideLoading()
            return false
          } else {
            //已经授权
            _this.hasAuthorize = true;
            resolve(res);
          }
        }
      })
    })
  },
  loginGetOpenid: function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (info) {
              _this.wxInfo = info.userInfo
              wx.request({
                method: 'POST',
                url: serverUrl.url + '/login',
                data: {
                  code: res.code,
                  encryptedData: info.encryptedData,
                  iv: info.iv
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (response) {
                  wx.hideLoading();
                  if (response.statusCode === 200){
                    if (response.data.bind == "1") {
                      _this._user.binding = true;
                      _this._user.openid = response.data.openid;
                      //openid存入缓存
                      wx.setStorage({
                        key: 'okey',
                        data: response.data.openid,
                      })
                      wx.setStorage({
                        key: 'wxInfo',
                        data: _this.wxInfo,
                      })
                      // 存入时间
                      wx.setStorage({
                        key: 'okeyTime',
                        data: new Date().getTime(),
                      })
                      // 绑定状态存入缓存
                      wx.setStorage({
                        key: 'bind',
                        data: true,
                      })
                      //获取梗概数据
                      resolve(response)
                    } else {
                      //未绑定
                      _this._user.binding = false;
                      _this._user.openid = response.data.openid;
                      wx.setStorage({
                        key: 'bind',
                        data: false,
                      })
                      reject("nobind")
                    }
                  }
                  else {
                    wx.showModal({
                      title: '错误',
                      content: '服务器连接失败,请检查网络连接',
                      confirmText: '再试一次',
                      success: function (res) {
                        if (res.confirm) {
                          // 重新加载
                          reject("login 404")
                        }
                      }
                    })
                    
                  }
                },
                fail: function () {
                  wx.showModal({
                    title: '错误',
                    content: '服务器连接失败,请检查网络连接',
                    confirmText: '再试一次',
                    success: function (res) {
                      if (res.confirm) {
                        // 重新加载
                        reject("LoginConnetFail")
                      }
                    }
                  })
                },
                complete: function () {
                  wx.hideLoading()
                }
              })
            }
          })
        }
      })
    })
  },
  getUserDetail: function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        method: 'POST',
        url: serverUrl.url + '/detail', //获取明细
        data: {
          openid: _this._user.openid,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.statusCode === 200){
            wx.hideLoading()
            _this.userInfo
            resolve(res)
          }
          else {
            reject('detail 404')
          }
        }
      })
    })
  },
  navigateTo: function (e) {
    console.log(e)
    var url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  hasAuthorize: null,
  _user: {
    binding: null,
    openid: null
  },
  wxInfo: null,
  changeBinding: false,
  detail_10: [],
  showError: function (title, msg) {
    wx.showModal({
      title: title,
      content: msg,
      showCancel: false,
      confirmText: '真糟糕!'
    })
  },
  // server_url1: 'http://localhost:8080/campus',
  // server_url: 'https://www.funcard.top/campusNew',
})
