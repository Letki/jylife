var wxCharts = require('../../utils/wxcharts-min.js');
const app = getApp();
var lineChart = null;//折线图图表变量
var pieChart = null;//饼图图表变量
var costData = [0,0,0,0,0,0,0,0,0,0];
var binding=false;
var detail_10=app.detail_10;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    balance:"0.00",
    lasttime:"",
    CardId:"",
    CardUserName:"",
    CardStatus:"",
    switchBtn:true,
    skczicon: "/pages/images/skcz-false.png",
    gsjgicon: "/pages/images/gsjg-false.png",
    xykczicon: "/pages/images/xykcz-false.png",
    charDisplay:"block",
    tapDetail: { time: '', transaction: '', cost: '', address: '', balance:''},
    costData1: costData,
    binding: binding,
  },
  onLoad:function(){
    var _this=this
    
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    }
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: [1,2,3,4,5,6,7,8,9,10],
      animation: true,
      background: '#f1f1f1',
      series: [{
        name: '最近十笔交易',
        data: costData,
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '消费金额 (元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth-30,
      height: 250,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  onShow:function(){
    var _this=this;
      if (typeof app._user.binding == "undefined"){//判断是否刚开始进首页,区分绑定之后跳转回来的情况
        console.log("第一次登录");
        //获取用户信息
        //正在获取绑定数据
        app.getUser(function (unionId) {
          //获取饭卡用户信息
          app.getUserDetail(function(Userdetail){
            //取出卡信息
            _this.setData({
              balance: Userdetail.money,
              CardId: Userdetail.username,
              CardUserName: Userdetail.name,
              CardStatus: Userdetail.state,
            })
            //存进全局变量_user.users中
            app._user.users.balance = Userdetail.money;//余额
            app._user.users.CardId = Userdetail.username;//学号
            app._user.users.CardUserName = Userdetail.name;//持卡人
            app._user.users.CardStatus = Userdetail.state;//卡状态
            app._user.users.classroom = Userdetail.username.substring(0, 7);//班级
            app.getCardDetail(function (e) {
              detail_10 = e;
              var detailData = e;
              var i = 0;
              var pri = new Array();
              //设置最后更新时间
              _this.setData({
                lasttime: _this.changeTime(new Date(detailData[0].time.time)),
              })
              //取出消费额
              for (i = 0; i < 10; i++) {
                pri[i] = 0 - detailData[i].price;//转成正数
              }
              costData = pri;
              var series = [{
                name: '最近十笔消费',
                data: pri,
              }];
              lineChart.updateData({
                series: series
              });
            }, "1", unionId);
            //设置是否绑定属性值
            _this.setData({
              binding: app._user.binding,
              skczicon: "/pages/images/skcz.png",
              gsjgicon: "/pages/images/jcbd.png",
              xykczicon: "/pages/images/xykcz.png",
            })
          },unionId);
        })
      }
      else{
        if (app._user.binding == false) {//跳转到绑定页面,没有绑定就返回
        _this.setData({
          binding: app._user.binding,
        })
          console.log("跳转到绑定页面,没有绑定就返回");
          return
        }
        else{
          _this.setData({
            skczicon: "/pages/images/skcz.png",
            gsjgicon: "/pages/images/jcbd.png",
            xykczicon: "/pages/images/xykcz.png",
            binding: app._user.binding,
          })
          if(detail_10.length>0){
            //取出卡信息
            _this.setData({
              balance: app._user.users.balance,
              CardId: app._user.users.CardId,
              CardUserName: app._user.users.CardUserName,
              CardStatus: app._user.users.CardStatus,
              lasttime: _this.changeTime(new Date(detail_10[0].time.time)),
            })
            var i = 0;
            var pri = new Array();
            //取出消费额
            for (i = 0; i < 10; i++) {
              pri[i] = 0 - detail_10[i].price;//转成正数
            }
            costData = pri;
            var series = [{
              name: '最近十笔消费',
              data: pri,
            }];
            lineChart.updateData({
              series: series
            });
          }else{
              //没有数据就去取
            app.getUserDetail(function (Userdetail) {
              //取出卡信息
              _this.setData({
                balance: Userdetail.money,
                CardId: Userdetail.username,
                CardUserName: Userdetail.name,
                CardStatus: Userdetail.state,
              })
              //存进全局变量_user.users中
              app._user.users.balance = Userdetail.money;//余额
              app._user.users.CardId = Userdetail.username;//学号
              app._user.users.CardUserName = Userdetail.name;//持卡人
              app._user.users.CardStatus = Userdetail.state;//卡状态
              app._user.users.classroom = Userdetail.username.substring(0, 7);//班级
              app.getCardDetail(function (e) {
                detail_10 = e;
                var detailData = e;
                var i = 0;
                var pri = new Array();
                //设置最后更新时间
                _this.setData({
                  lasttime: _this.changeTime(new Date(detailData[0].time.time)),
                })
                //取出消费额
                for (i = 0; i < 10; i++) {
                  pri[i] = 0 - detailData[i].price;//转成正数
                }
                costData = pri;
                var series = [{
                  name: '最近十笔消费',
                  data: pri,
                }];
                lineChart.updateData({
                  series: series
                });
              }, "1", app._user.openid);
              //设置是否绑定属性值
              _this.setData({
                binding: app._user.binding,
                skczicon: "/pages/images/skcz.png",
                gsjgicon: "/pages/images/jcbd.png",
                xykczicon: "/pages/images/xykcz.png",
              })
            }, app._user.openid);
          }
        }
      }
    
  },
  //数据格式化
  detailDatasort:function(detailData){
    detail_10 = detailData;
    //取出卡信息
    _this.setData({
      balance: detailData[0].money,
      CardId: detailData[0].username,
      CardUserName: detailData[0].name,
      CardStatus: detailData[0].status,
      lasttime: _this.changeTime(new Date(detail_10[0].time.time)),
    })
    var i = 0;
    var pri = new Array();
    //取出消费额
    for (i = 0; i < 10; i++) {
      pri[i] = 0 - detail.data.Info[i].price;//转成正数
    }
    costData = pri;
    var series = [{
      name: '最近十笔消费',
      data: pri,
    }];
    lineChart.updateData({
      series: series
    });
  },
  //缓存数据版本
  dataVersion:function(){
    var date=new Date();
    wx.setStorage({
      key: "dataVersion",
      data: date.getHours()
    })
  },
  //消费明细缓存
  detailSave:function(){
    wx.setStorage({
      key: "detail_10",
      data: detail_10
    })
  },
  //取出十条消费明细缓存
  detailGet:function(){
    try {
      var value = wx.getStorageSync('detail_10')
      if (value) {
        detail_10=value;
      }
    } catch (e) {
      console.log("获取缓存失败");
    }
  },
  //消费明细和分析的切换
  changeBlock:function(e){
    var flag = e.target.id;
    if(flag=="detail"){
      this.linechangeOption(flag)
      this.setData({
        switchBtn:true,
        charDisplay:"block",
      })
    }
    else{
      this.linechangeOption(flag)
      this.newpie()
      this.setData({
        switchBtn: false,
        charDisplay:"none"
      })
    }
  },
  //查看更多明细跳转
  moreDetail:function(){
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  tobinding: function () { 
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //水控和校园卡充值弹窗
  toskcz:function(){
    wx.showModal({
      title: 'Sorry',
      content: '此服务暂时还未开通,抱歉!',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
  },
  toxykcz:function(){
    wx.showModal({
      title: 'Sorry',
      content: '此服务暂时还未开通,抱歉!',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
  },
  //跳转挂失页面
  togsjg:function(){
    wx.navigateTo({
      url: '../gsjg/gsjg',
    })
  },
  //点击查看明细详情
  touchHandler: function (e) {
    var costIndex=lineChart.getCurrentDataIndex(e);
    console.log(this.changeTime(new Date(detail_10[costIndex].time.time)));
    this.setData({
      'tapDetail.time': this.changeTime(new Date(detail_10[costIndex].time.time)),
      'tapDetail.transaction': detail_10[costIndex].type,
      'tapDetail.cost': 0-detail_10[costIndex].price,
      'tapDetail.address': detail_10[costIndex].place,
      'tapDetail.balance': detail_10[costIndex].money,
    });
    lineChart.showToolTip(e, {
      format: function (item, category) {
        if (item.name=='月消费')
          return '2017-0' + category
        return '第'+category + '笔交易'
      }
    });
  },
  //时间格式转换
  changeTime:function(e){
   var datetime = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate() + ' ' + e.getHours() + ':' + e.getMinutes() + ':' + e.getSeconds();
   return datetime;
  },
  //饼图
  newpie:function(){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

      pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '北饭一二楼',
        data: 15,
      }, {
        name: '北饭三楼',
        data: 35,
      }, {
        name: '南苑四楼饭堂',
        data: 78,
      }, {
        name: '南苑面包房',
        data: 63,
      }],
      width: windowWidth-30,
      height: 300,
      dataLabel: true,
    });
  },
  //切换时折线图切换成月
  linechangeOption:function(e){
    console.log(e)
    if (e =='detail'){
      lineChart.updateData({
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        series: [{
                name: '最近十笔交易',
                data: costData,
        }],
    })
   }
    else{
      var series = [{
        name: '月消费',
        data: [156.78, 228.3, 118.5, 231, 378],
      }];
      lineChart.updateData({
        categories: [1, 2, 3, 4, 5],
        series: series
      });
    }
  }
})
