$(function() {
  const layer = layui.layer
  const form = layui.form

  initArtCateList()
  // 获取文章分类列表
  function initArtCateList() {
    $.ajax({
      type:'GET',
      url:'/my/cate/list',
      success:function(res) {
        const htmlStr = template('tpl-table',res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  const indexAdd = null
  $('#btnAddCate').on('click',function() {
    indexAdd = layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['500px', '260px'],
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式为form-add表单绑定submit事件
  $('body').on('submit','#form-add',function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/cate/add',
      data: $(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg('添加分类失败')
        layer.msg('添加分类成功')
        initArtCateList()
        // 根据索引关闭弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理的形式为btn-edit按钮绑定点击事件
  let indexEdit = null
  $('body').on('click','.btn-edit',function() {
    indexEdit = layer.open({
      type: 1,
      title: '修改文章分类',
      area: ['500px', '260px'],
      content: $('#dialog-edit').html()
    })
    let id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      type:'GET',
      url:`/my/cate/info?id=${id}`,
      success:function(res) {
        form.val('form-edit',res.data)
      }
    })
  })

  // 通过代理形式为修改分类表单绑定submit事件
  $('body').on('submit','#form-edit',function(e) {
    e.preventDefault()
    $.ajax({
      type:'PUT',
      url:'/my/cate/info',
      data:$(this).serialize(),
      success:function(res) {
        if(res.code !== 0) return layer.msg('更新数据分类失败！')
        layer.msg('更新数据分类成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })
  
  // 通过代理形式为删除按钮绑定点击事件
  $('body').on('click','.btn-delete',function() {
    let id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?',{ icon:3, title:'提示'},
    function(index) {
      $.ajax({
        method: 'DELETE',
        url: `/my/cate/del?id=${id}`,
        success(res) {
          if (res.code !== 0) layer.msg('删除分类详情失败')
          layer.msg('删除分类详情成功')
          layer.clode(index)
          initArtCateList()
        }
      })
    })
  })
})