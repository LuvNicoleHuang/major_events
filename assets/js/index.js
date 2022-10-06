$(function() {
  getUserInfo()





})

function getUserInfo() {
  $.ajax({
    type:'GET',
    url:'/my/userinfo',
    // headers:请求头配置对象
    headers:{
      Authorization:localStorage.getItem('token') || ''
    },
    success:function(res) {
      if(res.code !== 0) return layui.layer.msg('获取用户信息失败！')
      renderAvatar(res.data)
    }
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

