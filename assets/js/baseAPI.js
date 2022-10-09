// 每次调用get、post或ajax的时候会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function(options) {
  // 将key=value形式的数据，转成json格式的字符串
  const formatToJson = (source) => {
    let target = {}
    source.split('&').forEach((el) => {
      let kv = el.split('=')
      // 需要对value进行解码操作
      target[kv[0]] = decodeURIComponent(kv[1])
    })
    return JSON.stringify(target)
  }

  // 统一设置基准地址c
  options.url = 'http://big-event-vue-api-t.itheima.net'+options.url

  // 统一设置请求头 Content-Type 值
  options.contentType = 'application/json;charset=utf-8'

  // 统一设置请求的参数 - post 请求
  options.data = options.data && formatToJson(options.data)

  // indexOf：检索字符串中是否包含某个字符。字符的位置在开始计为'0'，如果未找到任何字符，则返回'-1'
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