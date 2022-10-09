$(function() {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage


  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    let dt = new Date(date)
    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())
    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
  let q = {
    pagenum:1, // 页码值，默认请求第一页的数据
    pagesize:3, // 每页显示几条数据，默认每页显示2条
    cate_id:'', // 文章分类的id
    state:'' // 文章的发布状态
  }

  initTable()
  initCate()

  // 获取文章列表数据
  function initTable() {
    $.ajax({
      type:'GET',
      url:`/my/article/list?pagenum=${q.pagenum}&pagesize=${q.pagesize}&cate_id=${q.cate_id}&state=${q.state}`,
      success:function(res) {
        if(res.code !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面数据
        const htmlStr = template('tpl-table',res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      type:'GET',
      url:'/my/cate/list',
      success:function(res) {
        if(res.code !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        const htmlStr = template('tpl-cate',res)
        $('[name=cate_id]').html(htmlStr)
        // 通过layui重新渲染表单区域的UI结构
        form.render()
      }
    })
  }
 
  // 为筛选表单绑定submit事件
  $('#form-search').on('submit',function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    const cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()
    // 为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据筛选条件重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      // 分页发生切换的时候，触发jump回调
      jump:function(obj) {
        // 把最新页码值赋值到q这个查询参数对象中
        q.pagenum = obj.curr
        q.pagesize = obj.limit
      }
    })
  }




})