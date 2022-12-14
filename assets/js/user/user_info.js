$(function() {
  const form = layui.form
  const layer = layui.layer

  form.verify({
    nickname:function(value) {
      if(value.length>10) {
        return '昵称长度必须在1~10个字符之间'
      }
    }
  })

  initUserInfo()

  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      type:'GET',
      url:'/my/userinfo',
      success:function(res) {
        if(res.code !== 0) return layer.msg('获取用户信息失败！')
        // 调用form.val()快速为表单赋值
        form.val('formUserInfo',res.data)
      }
    })
  }

  // 重置表单的数据
  $('#btnReset').on('click',function(e) {
    e.preventDefault()
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit',function(e) {
   e.preventDefault()
    $.ajax({
      type:'PUT',
      url:'/my/userinfo',
      data:form.val('formUserInfo'),
      success:function(res) {
        if(res.code !== 0) return layer.msg('更新用户信息失败！')
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的信息
        window.parent.getUserInfo()
      }
    })
  })





})


