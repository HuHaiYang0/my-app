import urls from '../../url'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner_list: [], //封面列表
    recommend_list: [], //推荐歌曲列表
    Leaderboard_list: [], // 排行榜列表
  },
  // 推荐到每日推荐页面
  torecommend() {
    wx.redirectTo({
      url: "/index/pages/recommendation/recommendation"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = urls.url
    // 获取封面信息
    wx.request({
      url: url + '/banner',
      data: {
        type: 1
      },
      success: (valse) => {
        this.setData({
          banner_list: valse.data.banners
        })
      },
      fail: (err) => {
        console.log('轮播图请求失败', err)
      }
    })
    // 获取推荐歌曲信息
    wx.request({
      url: url + '/personalized',
      data: {
        limit: 10
      },
      success: (valse) => {
        this.setData({
          recommend_list: valse.data.result
        })
      },
      fail: (err) => {
        console.log('推荐歌曲请求失败', err)
      }
    })
    var Leaderboard = [] // 存放排行榜数据的列表
    var Leaderboard_data = {} //存放排行榜数据的对象
    // 获取排行榜歌曲信息
    for (let i = 1; i < 6; i++) {
      new Promise((resolved, rejected) => {
        // 获取排行榜id
        wx.request({
          url: url + '/toplist',
          success: (data) => {
            let id = data.data.list[i].id
            resolved(id)
          },
        })
      }).then(value => {
        // 根据id获取歌曲信息
        wx.request({
          url: url + '/playlist/detail',
          data: {
            id: value
          },
          success: (data) => {
            Leaderboard_data = {
              name: data.data.playlist.name,
              data: data.data.playlist.tracks.slice(0, 3)
            }
          },
          fail: (err) => {
            console.log('排行榜请求失败', err)
          },
          complete: () => {
            Leaderboard.splice(i, 0, Leaderboard_data)
            this.setData({
              Leaderboard_list: Leaderboard
            })
          },
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})