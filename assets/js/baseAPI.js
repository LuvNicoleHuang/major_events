// 每次调用get、post或ajax的时候会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function(options) {
  options.url = 'http://big-event-vue-api-t.itheima.net'+options.url

  if(options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization:localStorage.getItem('token') || ''
    }
  }

  options.complete = function(res) {
    if(res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }
})