import urls from '../../url'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigationlist: [], //导航栏标签列表
    navid: '', // 当前导航位置的id
    videolist: [], // 视频列表
    videoid: '', //当前播放视频id
    videotimelist: [], //播放过的视频时间信息列表
    isrefresh: false, //刷新状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let url = urls.url
    // 获取导航栏
    this.getNavigation(url)
  },
  // 获取导航栏
  getNavigation(url) {
    wx.request({
      url: url + '/video/group/list',
      success: (external) => {
        this.setData({
          navigationlist: external.data.data.slice(0, 14),
          navid: external.data.data[0].id
        })
      },
      complete: () => {
        this.getvideo(url, this.data.navid)
      }
    })
  },
  // 获取导航栏下的视频
  getvideo(url, navid) {
    for (let i = 0; i < 8; i++) {
      new Promise((resolve, reject) => {
        wx.request({
          url: url + '/video/group',
          data: {
            id: navid
          },
          success: (external) => {
            let video_obj = {}
            video_obj['id'] = external.data.datas[i].data.vid
            video_obj['title'] = external.data.datas[i].data.description
            video_obj['cover'] = external.data.datas[i].data.creator.avatarUrl
            video_obj['name'] = external.data.datas[i].data.creator.nickname
            video_obj['coverUrl'] = external.data.datas[i].data.coverUrl
            resolve(video_obj)
          },
        })
      }).then(value => {
        wx.request({
          url: url + '/video/url',
          data: {
            id: value['id']
          },
          success: (external) => {
            value['url'] = external.data.urls['0'].url
          },
          complete: () => {
            // 获取视频点赞数评论数信息
            this.getvideoinffo(url, value)
          }
        })
      })
    }
  },
  // 获取视频点赞信息的回调
  getvideoinffo(url, video_obj) {
    let video_list = this.data.videolist
    wx.request({
      url: url + '/video/detail/info',
      data: {
        'vid': video_obj.id,
      },
      success: (value) => {
        video_obj['like'] = value.data.likedCount
        video_obj['islike'] = value.data.liked //是否喜欢
        video_obj['Comment'] = value.data.commentCount
        video_obj['share'] = value.data.shareCount
        video_list.push(video_obj)
        this.setData({
          videolist: video_list
        })
      },
      complete: () => {
        // 关闭加载框
        wx.hideLoading()
        this.setData({
          isrefresh: false
        })
      }
    })
  },
  // 切换导航栏
  togglenavigation(external) {
    this.setData({
      navid: external.currentTarget.id.slice(2) * 1,
      videolist: []
    })
    wx.showLoading({
      title: '加载中'
    })
    this.getvideo('http://127.0.0.1:3000', this.data.navid)
  },
  // 视频播放暂停回调
  startvideo(event) {
    // 存在切换图片后而视频在后台进行播放的问题
    let id = event.currentTarget.id //获取当前点击的id
    this.setData({
      videoid: id
    })
    let number //表示当前视频的播放时间
    // 循环遍历获取当前视频是否有播放时间记录
    for (let i = 0; i < this.data.videotimelist.length; i++) {
      if (this.data.videotimelist[i].id === id) {
        number = this.data.videotimelist[i].time
      }
    }
    let video = wx.createVideoContext(id)
    if (number) {
      setTimeout(() => {
        video.seek(number)
        video.play()
      }, 200)
    } else {
      video.play()
    }
  },
  // 视频播放变化时回调
  settime(event) {
    let timeobj = { //播放过的视频时间信息对象
      id: event.currentTarget.id,
      time: event.detail.currentTime
    }
    let isexist = false //表示当前所点击的视频是否有看过，如果看过，则表示true
    let timelist = this.data.videotimelist //播放过的视频时间信息列表
    // 如果为假，则表示当前没有播放过视频
    if (timelist == false) {
      timelist.push(timeobj)
      this.setData({
        'videotimelist': timelist
      })
    } else {
      // 否则，则循环判断是否存在，如果存在则改变状态为true
      for (let i = 0; i < timelist.length; i++) {
        // 编辑查找当前视频对象是否存在，如果存在则改变状态
        if (timeobj.id === timelist[i].id) {
          isexist = true
          timelist[i] = timeobj
          break
        }
      }
      if (isexist) {
        this.setData({
          'videotimelist': timelist
        })
      } else {
        timelist.push(timeobj)
        this.setData({
          'videotimelist': timelist
        })
      }
    }
  },
  // 视频播放结束回调
  endvideo(external) {
    let id = external.currentTarget.id
    let timelist = this.data.videotimelist
    for (let i = 0; i < timelist.length; i++) {
      if (timelist[i].id === id) {
        timelist.splice(0, i + 1)
        break
      }
    }
    this.setData({
      'videotimelist': timelist
    })
  },
  // 视频区域上拉刷新的回调
  refreshvideo() {
    this.setData({
      isrefresh: true
    })
    let url = urls.url
    this.getvideo(url, this.data.navid)
  },
  // 视频区域划到底部的回调
  getnewvideo() {
    console.log('页面底部')
  },
  // 跳转到搜索页面
  tosearch() {
    wx.navigateTo({
      url: "/search/pages/search/search"
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(external) {
    if (external.from === 'button') {
      let id = external.target.id.slice(6, )
      let videolist = this.data.videolist
      let videoobj = {}
      for (let i = 0; i < videolist.length; i++) {
        if (videolist[i].id === id) {
          videoobj = videolist[i]
          break
        }
      }
      return {
        title: videoobj.title || '用户”' + videoobj.name + '“发布的视频',
        path: '/pages/video/video',
        imageUrl: videoobj.coverUrl,
      }
    }
  }
})