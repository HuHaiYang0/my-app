import PubSub from 'pubsub-js'
import moment from 'moment'

import urls from '../../url'

let url = urls.url
var appInstance = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isplay: false,  // 是否播放
        Music_id: '',    //音乐id
        Music_obj: {},   //音乐对象
        Music_url: '',   //音乐播放地址
        current_duration: '00:00',  //当前时长
        total_duration: '00:00',    //总时长
        currentwidth: '0', // 实时时长的样式宽度
    },
    // 切换播放暂停状态
    toggleplay() {
        if (!appInstance.isglobalplay) {
            this.player.coverImgUrl = this.data.Music_obj.al.picUrl
            this.player.src = this.data.Music_url
            this.player.title = this.data.Music_obj.name
        } else {
            this.player.pause()
        }
    },
    // 切换上一个、下一个歌曲
    togglesong(external) {
        let type = external.currentTarget.id
        // 发布状态给recommendation
        PubSub.publish('togglesong', type)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let Music_id = options.Music
        // 获取歌曲详情
        this.getDetails(Music_id)
        // 获取歌曲播放地址
        this.getaddress(Music_id)
        this.setData({
            Music_id,
        })
        // 获取播放器实例
        this.player = wx.getBackgroundAudioManager()
        if (appInstance.isglobalplay && appInstance.globalid === this.data.Music_id) {
            this.setData({
                isplay: true
            })
        } else {
            this.setData({
                isplay: false
            })
        }
        this.player.onTimeUpdate(() => {
            let current_duration = moment(this.player.currentTime * 1000).format('mm:ss')   // 实时长度
            // 总时长/总样式宽度 = 实时时长/时长样式宽度
            let currentwidth = this.player.currentTime / this.player.duration * 500
            this.setData({
                current_duration,
                currentwidth
            })
        })
        // 订阅recommendation传来的id值
        PubSub.subscribe('sendindex', (msg, id) => {
            console.log(id)
            // 暂停当前歌曲
            this.player.stop()
            // 获取切换后的歌曲详情
            this.getDetails(id)
            // 获取切换后歌曲播放地址
            this.getaddress(id)
            appInstance.globalid = id
        })
    },
    // 获取歌曲详情
    getDetails(Music_id) {
        // 获取歌曲详情
        wx.request({
            url: url + '/song/detail',
            data: {
                'ids': Music_id
            },
            success: (value) => {
                let Music_obj = value.data.songs[0]
                this.setData({
                    Music_obj
                })
                // 初始化音乐时长
                this.setData({
                    total_duration: moment(this.data.Music_obj.dt).format('mm:ss')
                })
            },
            complete: () => {
                // 动态设置导航栏标题
                wx.setNavigationBarTitle({
                    title: this.data.Music_obj.name
                })
            }
        })
    },
    // 获取歌曲播放地址
    getaddress(Music_id) {
        // 获取音乐播放地址
        wx.request({
            url: url + '/song/url',
            data: {
                id: Music_id
            },
            success: (value) => {
                this.setData({
                    Music_url: value.data.data[0].url
                })
                // 自动播放获取到的音乐
                this.player.coverImgUrl = this.data.Music_obj.al.picUrl
                this.player.src = value.data.data[0].url
                this.player.title = this.data.Music_obj.name
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.player.onPlay(() => {
            this.setData({
                isplay: true
            })
            appInstance.isglobalplay = true
            appInstance.globalid = this.data.Music_id
        })
        this.player.onPause(() => {
            this.setData({
                isplay: false
            })
            appInstance.isglobalplay = false
        })
        this.player.onEnded(() => {
            // 发布状态给recommendation
            PubSub.publish('togglesong', 'next')

            // 修改实时时长和样式宽度
            this.setData({
                current_duration: '00:00',  //当前时长
                currentwidth: '0', // 实时时长的样式宽度
            })
        })
        this.player.onStop(() => {
            this.setData({
                isplay: false
            })
            appInstance.isglobalplay = false
            appInstance.globalid = ''
        })
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