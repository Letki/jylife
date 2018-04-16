Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchBtn:true
  },
  changeBlock:function(e){
    var flag=e.target.id;
    if(flag=="get"){
      this.setData({
        switchBtn:true
      })
    }
    else{
      this.setData({
        switchBtn: false
      })
    }
  },
  toannounce:function(){
    wx.navigateTo({
      url: '../announce/announce',
    })
  }
})