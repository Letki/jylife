var app = getApp();
var page = 1;

Page({
  data: {
    scrolly: true,
    showselect: false,
    windowHeight: '',
    detail: [],
    pageIndex: 1,
    hasmore: true,
    tip: "上拉加载更多",
    backgroundcolor: [{ "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }]
  },
  onLoad: function () {
    var _this = this;
    try {
      let res = wx.getSystemInfoSync();
      _this.setData({
        windowHeight: res.windowHeight - 20
      })
    } catch (e) {
      // do something when get system info failed
    }
    var now = new Date().getTime();
    if (!wx.getStorageSync('moredetail')) {
      app.getCardDetail(function (e) {
        var i = 0;
        for (i = 0; i < 10; i++) {
          e[i].time = _this.changeTime(new Date(e[i].time.time));
        }
        _this.setData({
          detail: e
        })
        _this.saveDetail("detailVersion", new Date().getTime());
      }, page, app._user.openid);
    }else{
      console.log(now - wx.getStorageSync("detailVersion"))
      if (wx.getStorageSync("detailVersion")!=""&&now - wx.getStorageSync("detailVersion") > 600000){
        wx.removeStorage({
          key: 'detailVersion',
          key:'pageIndexCache',
          success: function(res) {},
        })
        //缓存超过10分钟数据重新获取,缓存失效
        app.getCardDetail(function (e) {
          var i = 0;
          for (i = 0; i < 10; i++) {
            e[i].time = _this.changeTime(new Date(e[i].time.time));
          }
          _this.setData({
            detail: e
          })
          _this.saveDetail("detailVersion", new Date().getTime());
        }, page, app._user.openid);
      }
      else{
        var detailCache = wx.getStorageSync('moredetail')
        var pageIndexCache = wx.getStorageSync('pageIndexCache')
        _this.setData({
          detail: detailCache,
          pageIndex: pageIndexCache
        })
      }
    }
  },
  onUnload:function(){
    console.log("页面关闭")
    //页面隐藏时存入缓存
    var _this=this
    _this.saveDetail("moredetail",_this.data.detail)
    _this.saveDetail("pageIndexCache", _this.data.pageIndex)
    
  },
  //时间格式转换
  changeTime: function (e) {
    var datetime = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate() + ' ' + e.getHours() + ':' + e.getMinutes() + ':' + e.getSeconds();
    return datetime;
  },
  showSelect: function () {
    if (this.data.showselect == false) {
      this.setData({
        showselect: true,
        scrolly: false
      })
    }
    else {
      this.setData({
        showselect: false,
        scrolly: true,
        backgroundcolor: [{ "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }, { "background": "", "issel": false, "color": "" }]
      })
    }
  },
  //下拉底部加载
  downGetMore: function () {
    var _this = this;
    if (_this.data.hasmore == true) {
      var page = _this.data.pageIndex + 1
      _this.setData({
        tip: "玩命加载中..",
        pageIndex: page
      })
      app.getCardDetail(function (e) {
        if (e.length <= 0) {
          _this.setData({
            hasmore: false
          })
          return;
        }
        var i = 0;
        var pushDetail = _this.data.detail
        for (i = 0; i < e.length; i++) {
          e[i].time = _this.changeTime(new Date(e[i].time.time));
          pushDetail.push(e[i])
        }
        _this.setData({
          detail: pushDetail,
          tip: '上拉加载更多'
        })
      }, page, app._user.openid);
    }
  },
  //筛选样式切换
  isselect: function (e) {
    var num = e.currentTarget.dataset.num;
    console.log(num);
    console.log(this.data.backgroundcolor[num].issel);
    if (this.data.backgroundcolor[num].issel == true) {
      this.data.backgroundcolor[num].background = "#d3d3d3";
      this.data.backgroundcolor[num].color = "";
      this.data.backgroundcolor[num].issel = false;
      this.setData({
        backgroundcolor: this.data.backgroundcolor
      })
    }
    else {
      this.data.backgroundcolor[num].background = "#2d6dff";
      this.data.backgroundcolor[num].color = "#fff";
      this.data.backgroundcolor[num].issel = true;
      this.setData({
        backgroundcolor: this.data.backgroundcolor
      })
    }
  },
  //明细数据缓存,避免多次访问服务器
  saveDetail:function(key,detail){
    wx.setStorageSync(key, detail);
  }
})