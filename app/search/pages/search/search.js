import urls from '../../../url'

let url = urls.url
let send = true    //标识是否发送
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholder: '',  //搜索的默认关键字
        hotsearch: [],  //热搜榜列表
        searchkeywords: '',  //输入的搜索关键字
        searchlist: [],  //搜索结果列表
        searchRecordlist: [],    //搜索历史记录
    },
    // 获取搜索关键字的回调
    searchkeywords(event) {
        this.setData({
            searchkeywords: event.detail.value
        })
        // 如果输入值为空，则清空搜索列表并结束该回调
        if (!this.data.searchkeywords) {
            this.setData({
                searchlist: []
            })
            return
        }
        // 发送获取搜索结果请求
        if (send) {
            send = false
            setTimeout(() => {
                let searchkeywords = this.data.searchkeywords
                wx.request({
                    url: url + '/search',
                    data: {
                        keywords: searchkeywords,
                        limit: 10
                    },
                    success: (data) => {
                        if (data.data.code === 200) {
                            let searchRecordlist = this.data.searchRecordlist
                            // 循环判断搜索历史记录列表中是否有输入的关键字，如果有，则先删除
                            for (let i = 0; i < searchRecordlist.length; i++) {
                                if (searchRecordlist[i] === searchkeywords) {
                                    searchRecordlist.splice(i, 1)
                                }
                            }
                            searchRecordlist.unshift(searchkeywords)    // 添加关键字到列表中
                            this.setData({
                                searchlist: data.data.result.songs,
                                searchRecordlist   //保存到搜索记录中
                            })
                            // 如果搜索关键字有值，则保存
                            if (searchkeywords) {
                                wx.setStorageSync('searchRecordlist', searchRecordlist)  //保存到本地
                            }

                        } else {
                            wx.showToast({
                                title: data.data.msg,
                                icon: 'none'
                            })
                        }

                    },
                })
                send = true
            }, 300)
        }
    },
    // 删除输入的搜索关键字
    deletesearchkeywords() {
        this.setData({
            searchkeywords: '',
        })
    },
    // 清空历史记录
    cleanlist() {
        wx.showModal({
            content: '是否清空历史记录',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        searchRecordlist: []
                    })
                    wx.setStorageSync('searchRecordlist', [])
                }
            },
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取搜索关键字
        wx.request({
            url: url + '/search/default',
            success: (external) => {
                this.setData({
                    placeholder: external.data.data.realkeyword
                })
            },
        })
        // 获取热搜榜列表
        wx.request({
            url: url + '/search/hot/detail',
            success: (external) => {
                this.setData({
                    hotsearch: external.data.data
                })
            },
        })
        // 在本地中获取搜索历史记录
        this.setData({
            searchRecordlist: wx.getStorageSync('searchRecordlist')
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