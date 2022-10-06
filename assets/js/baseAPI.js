// 每次调用get、post或ajax的时候会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function(options) {
  options.url = 'http://big-event-vue-api-t.itheima.net'+options.url
})