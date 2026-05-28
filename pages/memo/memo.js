Page({
  data: {
    memos: [],
    showModal: false,
    editingId: null,
    formData: {
      title: '',
      content: ''
    }
  },

  onLoad() {
    this.loadMemos()
  },

  noop() {},

  loadMemos() {
    try {
      const data = wx.getStorageSync('memos')
      if (data) {
        this.setData({
          memos: JSON.parse(data)
        })
      }
    } catch (e) {
      console.error('读取备忘录数据失败', e)
    }
  },

  saveMemos() {
    try {
      wx.setStorageSync('memos', JSON.stringify(this.data.memos))
    } catch (e) {
      console.error('保存备忘录数据失败', e)
    }
  },

  addMemo() {
    this.setData({
      showModal: true,
      editingId: null,
      formData: {
        title: '',
        content: ''
      }
    })
  },

  editMemo(e) {
    const id = e.currentTarget.dataset.id
    const memo = this.data.memos.find(item => item.id === id)
    if (memo) {
      this.setData({
        showModal: true,
        editingId: id,
        formData: {
          title: memo.title || '',
          content: memo.content || ''
        }
      })
    }
  },

  deleteMemo(e) {
    const id = e.currentTarget.dataset.id
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条备忘录吗？',
      success: (res) => {
        if (res.confirm) {
          const memos = this.data.memos.filter(item => item.id !== id)
          this.setData({ memos })
          this.saveMemos()
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  closeModal() {
    this.setData({
      showModal: false,
      editingId: null,
      formData: {
        title: '',
        content: ''
      }
    })
  },

  onTitleInput(e) {
    this.setData({
      'formData.title': e.detail.value
    })
  },

  onContentInput(e) {
    this.setData({
      'formData.content': e.detail.value
    })
  },

  saveMemo() {
    const { title, content } = this.data.formData
    
    if (!title && !content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    if (this.data.editingId) {
      const memos = this.data.memos.map(item => {
        if (item.id === this.data.editingId) {
          return {
            ...item,
            title,
            content,
            updateTime: this.formatTime(new Date())
          }
        }
        return item
      })
      this.setData({ memos })
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
    } else {
      const newMemo = {
        id: Date.now().toString(),
        title,
        content,
        createTime: this.formatTime(new Date()),
        updateTime: this.formatTime(new Date())
      }
      const memos = [newMemo, ...this.data.memos]
      this.setData({ memos })
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      })
    }

    this.saveMemos()
    this.closeModal()
  },

  formatTime(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
})