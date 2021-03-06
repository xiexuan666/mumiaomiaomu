const app = getApp();
const http = app.globalData.http;
const baseUrl = app.globalData.baseUrl;
const getInformation = app.globalData.getInformation;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpxqzt: 1,
    cactiv: 1,
    strategy: [],
    // 总数据显示
    strategyTotal: null,
    json: null,
    video: null
  },
  category: function () {
    wx.navigateTo({
      url: '/pages/me/guanli/newly/newly',
    })
  },

  //案例头部选择
  anlitopxuanz: function (e) {
    console.log(e, 9999)
    var ind = app.hdindex(e, 'ind')
    var id = app.hdindex(e, 'idc')
    var cpzt = app.hdindex(e, 'cpzt')
    var anlishuj = this.data.anlishuj
    var anlixuanz = this.data.anlixuanz
    if (cpzt) {
      anlixuanz[ind] = null;
      anlishuj[ind].xuanz = ''
    } else {
      anlixuanz[ind] = id
      anlishuj[ind].xuanz = id
    }
    if (this.arrlength(anlixuanz) == 0) {
      // 清除案例选中
      this.antoucclear()
      return false
    }
    // var anlimyData=this.data.anlimyData
    var anliskubs = this.data.anliskubs

    var fanhui = toubu0({}, anlishuj, anliskubs, anlixuanz)
    this.setData({
      anlishuj: fanhui.keys,
      anlixuanz: anlixuanz,
      anlizfcid: fanhui.idzfc,
    })

    if (fanhui.idzfc == '') {
      this.antoucclear(1)
      wx.showToast({ title: '没有相关结果', icon: 'none', duration: 700 })
      return false
    }
    //查询案例出内容
    this.chaxchuanlinr(fanhui.idzfc, 1)
  },

  // 查询出案例 id字符串 页数 1  
  // num 1第一次添加 2
  chaxchuanlinr(idzfc, page, num) {
    if (!page) { var page = 1 }
    console.log(idzfc, "产品id字符串")
    var anlifuhejiegs = this.data.anlifuhejieg
    var annrshuzs = []
    if (num == 2) {
      annrshuzs = this.data.annrshuz
    }
    if (num == 1) {
      anlifuhejiegs = 0
    }

    if (annrshuzs.length >= anlifuhejiegs && annrshuzs.length != 0) {
      return false
    }
    var tha = this
    var url = baseUrl + "case/casePage"
    var dat = {
      page,
      findCaseById: idzfc
    }

    http.promisServer(url, dat).then(resc => {
      var annrshuz = annrshuzs.concat(resc.data.CaseList)
      var anlifuhejieg = resc.data.casessCount
      console.log(resc.data, '查出来的案例')
      tha.setData({ annrshuz, anlipage: page, anlifuhejieg, anlizfcid: idzfc })
    })
  },

  canpiqieh: function (e) {
    var ind = app.hdindex(e, 'ind')
    console.log(ind)
    var cactiv = this.data.cactiv;
    if (ind == cactiv) {
      return false
    }
    if (ind == 1) {

      cactiv = 1
      wx.setNavigationBarTitle({ title: '装修攻略' })
    }
    if (ind == 2) {
      this.chaxchuanlinr('', 1, 1)
      cactiv = 2
      wx.setNavigationBarTitle({ title: '热点视频' })
    }
    console.log(cactiv)
    this.setData({ cactiv: cactiv })
  },
  //  跳转到专修攻略
  fitment: function () {
    wx.navigateTo({
      url: '/pages/hotspot/strategy/strategy',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求视频接口
    let url = 'activity/hot/getAllVideo';
    // 请求视频数量
    getInformation.getVideo(url).then(res => {
      console.log(res);
      this.setData({
        video: res.data
      })
    })

  },
  /**
   * 点赞事件--实时更新页面上的点赞数
   * 获取下标，获取视频id
   * 调用getInfoemation封装好的接口进行点赞操作
   * 根据res.flag值对判断值和页面数组进行更改
   */
  addgreat: function (e) {
    var that = this;
    var index = app.hdindex(e, 'index');
    let url = 'activity/hot/greatVideo';
    let videoid = that.data.video[index].videoId;
    getInformation.addgreat(url, undefined, videoid).then(res => {
      if (res.flag) {
        let great = that.data.video[index].great + 1;
        that.setData({
          ['video[' + index + '].dianzhan']: res.flag,
          ['video[' + index + '].great']: great,
        })
      } else {
        let great = that.data.video[index].great - 1;
        that.setData({
          ['video[' + index + '].dianzhan']: res.flag,
          ['video[' + index + '].great']: great,
        })
      }
    })
  },

  /**
   * 跳转事件--使用自己封装的方法进行跳转
   * 
   */
  Jumpvideo: function (e) {
    var that = this;
    var index = app.hdindex(e, 'index');
    console.log(index);
    // wx.showToast({
    //   title: '视频还没准备好哦',
    //   icon: 'none',
    //   duration: 2000
    // })
    console.log('跳转到viedo页面', index, that.data.video[index]);
    let value = that.data.video[index];
    let url = 'video/video';
    getInformation.Jump(url, value);
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
@@ -26,7 +196,30 @@ Page({
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;
    console.log(wx.getStorageSync('gerxinx').id);
    getInformation.getstrategy(undefined, wx.getStorageSync('gerxinx').id).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        let data = /\d{4}-\d{1,2}-\d{1,2}/g.exec(res.data[i].update_time);
        res.data[i].update_time = data;
        if (res.data[i].type == 1) {
          res.data[i].name = '如何选砖';
        } else if (res.data[i].type == 2) {
          res.data[i].name = '如何装修';
        } else if (res.data[i].type == 3) {
          res.data[i].name = '爆款推荐';
        } else if (res.data[i].type == 4) {
          res.data[i].name = '新品上市';
        }
        // 转化成json数据用以页面跳转
        let json = JSON.stringify(res.data);
        that.setData({
          strategy: res.data,
          strategyTotal: res.data.length,
          json: json
        })
      }
    });
  },


})