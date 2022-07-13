import urls from '../../url'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        phone: '',// 手机号
        password: '' //密码
    },
    // 获取表单数据
    getformdata(event) {
        let input = event.currentTarget.id
        this.setData({
            [input]: event.detail.value
        })
    },
    // 登录
    login() {
        let url = urls.url
        let {phone, password} = this.data
        // 手机号为空验证
        if (!phone) {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'error'
            })
            return
        }
        // 手机号格式验证
        let phone_re = /^1[3-9]\d{9}$/
        if (!phone_re.test(phone)) {
            wx.showToast({
                title: '手机号输入错误',
                icon: 'error'
            })
            return;
        }
        if (!password) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'error'
            })
            return;
        }
        wx.request({
            url: url + '/login/cellphone',
            data: {
                phone,
                password
            },
            success: (event) => {
                let data = event.data
                if (data.code === 400) {
                    wx.showToast({
                        title: '用户名不存在！',
                        icon: 'error'
                    })
                } else if (data.code === 502) {
                    wx.showToast({
                        title: '帐号或密码错误',
                        icon: 'error'
                    })
                } else if (data.code === 200) {
                    wx.showToast({
                        title: '登录成功',
                    })
                    wx.setStorageSync(
                        "userinfo", JSON.stringify(data.profile),
                    )
                    wx.setStorageSync(
                        "cookie", JSON.stringify(data.cookie)
                    )
                    wx.switchTab({
                        url: '/pages/user/user'
                    })
                } else {
                    wx.showToast({
                        title: '请稍后再试',
                        icon: 'error'
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
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