import PubSub from 'pubsub-js'

import urls from '../../../url'

let url = urls.url
Page({

    /**
     * 页面的初始数据
     */
    data: {
        month: '',   //月份
        day: '',    //日期
        recommendlist: [],  // 每日推荐歌曲列表
        index: '',   // 当前点击的歌曲索引
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            month: new Date().getMonth() + 1,
            day: new Date().getDate()
        })
        this.getrecommendlist(url)
        // 订阅MusicDetails传来的状态值，计算索引值
        PubSub.subscribe('togglesong', (msg, type) => {
            let index = this.data.index
            // 根据点击的状态获取索引值
            if (type === 'next') {  // 下一个
                index += 1
            } else { //上一个
                index -= 1
            }
            if (index >= this.data.recommendlist.length) {
                index = this.data.recommendlist.length - 1
            }
            if (index <= 0) {
                index = 0
            }
            // 修改索引值
            this.setData({
                index
            })
            // 根据索引值获取相对于的id值
            let id = this.data.recommendlist[index].id
            // 发送计算后的索引值给MusicDetails
            PubSub.publish('sendindex', id)
        })
    },
    // 获取每日推荐音乐列表
    getrecommendlist(url) {
        wx.request({
            url: url + '/recommend/songs',
            header: {
                'cookie': wx.getStorageSync('cookie')
            },
            success: (value) => {
                let recommend = value.data.data.dailySongs
                let recommendlist = []
                for (let i = 0; i < recommend.length; i++) {
                    let recommendobj = {
                        'id': recommend[i].id,
                        'title': recommend[i].name,
                        'cover': recommend[i].al.picUrl,
                        'name': recommend[i].ar[0].name
                    }
                    recommendlist.push(recommendobj)
                }
                this.setData({
                    recommendlist
                })
            }
        })
    },
    // 跳转到歌曲详情页面
    toMusicDetails(external) {
        let Music_id = external.currentTarget.dataset.obj.id
        // 获取当前点击的索引位置
        let index = external.currentTarget.dataset.index
        this.setData({
            index
        })
        wx.navigateTo({
            url: "/pages/MusicDetails/MusicDetails?Music=" + Music_id
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
    onShareAppMessage() {

    }
})