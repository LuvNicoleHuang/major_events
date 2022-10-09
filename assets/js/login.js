$(function() {
  // 点击“去注册”链接
  $('#gotoReg').on('click',function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击“去登录”链接
  $('#gotoLogin').on('click',function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  // 从layui中获取form对象
  const form = layui.form
  const layer = layui.layer
  // 自定义校验规则
  form.verify({
    pwd:[/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd:function(value) {
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 将kwy-value格式的数据转变成json格式的字符串
  const formatToJson = (source) => {
    let target = {}
    source.split('&').forEach((el) => {
      let kv = el.split('=')
      target[kv[0]] = kv[1]
    })
    return JSON.stringify(target)
  }

  // 监听注册表单的提交事件
  $('#form_reg').on('submit',function(e) {
    e.preventDefault()
    $.ajax({
      url:'/api/reg',
      type:'POST',
      data:$(this).serialize(),
      success: function(res) {
        if(res.code !== 0) { 
          return layer.msg(res.message)
        }
        layer.msg('注册成功,请登录!')
        $('#gotoLogin').click()
      }
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function(e) {
    e.preventDefault()
    $.ajax({
      url:'/api/login',
      type:'POST',
      // 快速获取表单中数据
      data: $(this).serialize(),
      success: function(res) {
        if (res.code !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        // 将登录成功得到的token字符串保存到本地存储中
        localStorage.setItem('token',res.token)
        location.href = '/index.html'
      }
    })
  })
})