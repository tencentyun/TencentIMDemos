import wepy from '@wepy/core'
import CONST from '@/common/const'

const host = CONST.HOST

const Model = {
  /**
   * @param {string user_id} 对方id，希望获取userinfo对应的id
   * @param {string id} 自身id，用以确认关注关系
   * @return {promise} 
   */
  async getUserInfo({ user_id, id }) {
    return wepy.wx.request({
      url: `${host}/getUserInfo`,
      method: 'POST',
      data: {
        user_id,
        id
      }
    }).then(res => {
      if (res.statusCode === 200 && res.data.code === 200) return res.data.data
      else throw new Error('接口调用失败')
    })
  },
  /**
   * @param {string user_id} 
   * @return {promise} 
   */
  async getGiftListByUser({ user_id }) {
    return wepy.wx.request({
      url: `${host}/getGiftListByUser`,
      method: 'POST',
      data: {
        user_id
      }
    }).then(res => {
      if (res.statusCode === 200 && res.data.code === 200) return res.data.data
      else throw new Error('接口调用失败')
    })
  },
  /**
   * @param {string user_id} 
   * @return {promise} 
   */
  async getOnlineUser({ tls }) {
    return tls.getGroupMemberList()
    .then(res => {
      if (res.code === 0) return res.data.memberList
      else throw new Error('接口调用失败')
    })
  },
  /**
   * @param {string from_id} 点赞者id
   * @param {string to_id} 被点赞者id
   * @return {promise} 
   */
  async like({ from_id, to_id }) {
    return wepy.wx.request({
      url: `${host}/like`,
      method: 'POST',
      data: {
        from_id,
        to_id
      }
    }).then(res => {
      if (res.statusCode === 200 && res.data.code === 200) return res.data.data
      else throw new Error('接口调用失败')
    })
  },
  /**
   * @param {string from_id} 关注者id
   * @param {string to_id} 被关注者id
   * @return {promise} 
   */
  follow({ from_id, to_id }) {
    return wepy.wx.request({
      url: `${host}/follow`,
      method: 'POST',
      data: {
        from_id,
        to_id
      }
    }).then(res => {
      if (res.statusCode === 200 && res.data.code === 200) return res.data.data
      else throw new Error('接口调用失败')
    })
  },
  /**
   * @param {string from_id} 关注者id
   * @param {string to_id} 被关注者id
   * @return {promise} 
   */
  unFollow({ from_id, to_id }) {
    return wepy.wx.request({
      url: `${host}/unFollow`,
      method: 'POST',
      data: {
        from_id,
        to_id
      }
    }).then(res => {
      if (res.statusCode === 200 && res.data.code === 200) return res.data.data
      else throw new Error('接口调用失败')
    })
  },
  /**
   * @param {string from_id} 送礼者id
   * @param {string to_id} 被送礼者id
   * @param {string gift_id} 礼物id
   * @return {promise} 
   */
  sendGift({ from_id, to_id, gift_id }) {
    return wepy.wx.request({
      url: `${host}/sendGift`,
      method: 'POST',
      data: {
        from_id,
        to_id,
        gift_id
      }
    }).then(res => {
      if (res.statusCode === 200 && res.data.code === 200) return res.data.data
      else throw new Error('接口调用失败')
    })
  }
}

export default Model
