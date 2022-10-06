$(function() {
  getUserInfo()

  // 获取用户基本信息
  function getUserInfo() {
    $.ajax({
      type:'GET',
      url:'/my/userinfo',
      // headers:请求头配置对象
      // headers:{
      //   Authorization:localStorage.getItem('token') || ''
      // },
      success:function(res) {
        if(res.code !== 0) return layui.layer.msg('获取用户信息失败！')
        renderAvatar(res.data)
      }
      // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
      // complete:function(res) {
      //   console.log(res)
      //   if(res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
      //     localStorage.removeItem('token')
      //     location.href = '/login.html'
      //   }
      // }
    })
  }

  // 渲染用户的头像
  function renderAvatar(user) {
    // 获取用户名称
    const name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 按照需求渲染用户头像
    if(user.user_pic !== null) {
      $('.layui-nav-img').attr('src',user.user_pic).show()
      $('.text-avatar').hide()
    }
    else {
      $('.layui-nav-img').hide()
      const first = name[0].toUpperCase()
      $('.text-avatar').html(first).show()
    }
  }


  const layer = layui.layer
  $('#btnLogout').on('click',function() {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, 
    function(index) {
      // 清空本地存储中的token
      localStorage.removeItem('token')
      // 重新跳转到登录页面
      location.href = '/login.html'
      // 关闭confirm询问框
      layer.close(index)
    })
  })
})


