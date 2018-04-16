//app.js
var server_url= 'http://localhost:8080/CampusCard';
var app=getApp;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  //获取用户信息方法弹窗
  getUserInfo: function (cb) {
    var _this = this;
    //获取微信用户信息
    wx.getUserInfo({
      success: function (res) {
        typeof cb == "function" && cb(res);
      },
      fail: function (res) {
        //拒绝授权后的错误提示
        _this.showErrorModal('拒绝授权将导致无法关联学校帐号并影响使用，请重新打开广金校园卡再点击允许授权！', '授权失败');
        _this.g_status = '未授权';
      }
    });
  },
  saveCaChe:function(key,value){
    if(!key||!value){return;}//key和value为空时
    var _this = this;
    _this.caChe[key]=value;//存进Cache中以便后面直接使用
    wx.setStorage({
      key: key,
      data: value
    });
  },
  //清楚某key缓存
  removeCache: function (key) {
    if (!key) { return; }
    var _this = this;
    _this.cache[key] = '';
    wx.removeStorage({
      key: key
    });
  },
  //错误信息封装
  showErrorModal: function (content, title) {
    wx.showModal({
      title: title || '加载失败',
      content: content || '未知错误',
      showCancel: false
    });
  },
  //获取用户数据去判断是否绑定
  getUser: function (response) {
    var _this = this;
    wx.showNavigationBarLoading();
    wx.login({
      success: function (res) {
        if (res.code) {
          //调用函数获取微信用户信息
          _this.getUserInfo(function (info) {
            _this._user.wx = info.userInfo;
            if (!info.encryptedData || !info.iv) {
              _this.g_status = '无关联AppID';
              typeof response == "function" && response(_this.g_status);
              return;
            }
            console.log(typeof response == "function");
            wx.showLoading({
              title: '获取数据中',
              mask: true
            })
            //发送code与微信用户信息，获取学生数据
            wx.request({
              method: 'POST',
              url: _this.server_url + '/Login',//先login在微信注册
              data: {
                code: res.code,
                encryptedData: info.encryptedData,
                iv: info.iv
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (reponse) {
                if (reponse.data.errmsg = "0") {
                  _this._user.openid = reponse.data.unionId;
                  _this._user.status = reponse.data.status;
                  wx.request({
                    method: 'POST',
                    url: _this.server_url + '/UserBinding',//判断是否已经绑定
                    data: {
                      unionId: reponse.data.unionId,
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      if (res.data.Binding=="0"){
                        console.log("nobinding");
                        _this._user.binding = false;
                        wx.navigateTo({
                          url: '../login/login',//跳转到绑定页面
                        })
                        return;
                      }
                       else{
                        typeof response == "function" && response(reponse.data.unionId);
                       }
                    },
                    fail: function (res) {
                    }
                  })
                }
              },
              fail: function (res) {
                wx.showModal({
                  title: '错误',
                  content: '连接服务器失败',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              },
              complete: function () {
                wx.hideLoading();
                wx.hideNavigationBarLoading();
              }
            });
          });
        }
      }
    })
  },
  //获取饭卡数据
  getCardDetail: function (cb,page,unionId){
    var _this=this;
      _this._user.binding = true;
      //获取数据
      wx.request({
        method: 'POST',
        url: _this.server_url + '/DataInfo',//获取明细
        data: {
          unionId: unionId,
          page: page
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (detail) {
          _this.detail_10 = detail.data.Info;
          typeof cb == "function" && cb(detail.data.Info);
        }
      })
  },
  //获取饭卡信息
  getUserDetail:function(cb,unionId){
    var _this=this;
    wx.request({
      method: 'POST',
      url: _this.server_url + '/Detail',//获取明细
      data: {
        unionId: unionId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (detail) {
        console.log(detail.data.detail);
        typeof cb == "function" && cb(detail.data.detail);
      }
    })
  },
  globalData: {
    costData:{},
    userInfo: null,
    tapDetail: { cost: 0 }
  },
  util: require('./utils/util'),
  key: function (data) { return this.util.key(data) },
  enCodeBase64: function (data) { return this.util.base64.encode(data) },
  cache: {},
  _user: {
    openid:'',
    //微信数据
    wx: {},
    //学生or老师数据
    users: {}
  },
  detail_10:[],
  server_url1:'http://localhost:8080/CampusCard',
  server_url:'http://www.doline.site/CampusCard',
})