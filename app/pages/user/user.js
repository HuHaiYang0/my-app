import urls from '../../url'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        startY: 0,  // 表示手指点击开始的Y坐标
        FinishY: 0,  // 表示手指移开屏幕的Y坐标
        SpreadY: 0,  //表示手指在Y轴上的移动距离
        translateY: 'translateY:0', // 偏移量
        transition: '',    //过度量
        userinfo: {},    // 用户信息
        playlist: [],    //最近播放列表
    },
    // 手指点击回调
    fingerclick(event) {
        this.setData({
            startY: event.touches[0].clientY,
            transition: ''
        })
    },
    // 手指移动回调
    fingermove(event) {
        let FinishY = event.touches[0].clientY
        let SpreadY = this.data.FinishY - this.data.startY
        let translateY = 'translateY(' + this.data.SpreadY.toString() + 'rpx)'
        if (SpreadY < 0) {
            SpreadY = 0
        }
        if (SpreadY > 80) {
            SpreadY = 80
        }
        this.setData({
            FinishY,
            SpreadY,
            translateY
        })
    },
    // 手指移开回调
    fingerFinish() {
        this.setData({
            translateY: 0,
            transition: 'all 0.5s'
        })
    },
    // 跳转到登录页面
    tologin() {
        wx.reLaunch({
            url: '/pages/login/login'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let url = urls.url
        let userinfo = wx.getStorageSync('userinfo')
        if (userinfo) {
            // 获取用户数据
            this.setData({
                'userinfo': JSON.parse(userinfo)
            })
            // 获取最近播放
            wx.request({
                url: url + '/record/recent/song',
                success: (data) => {
                    this.setData({
                        'playlist': data.data.data.list
                    })
                }
            })
        }
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
    onShareAppMessage() {

    }
})