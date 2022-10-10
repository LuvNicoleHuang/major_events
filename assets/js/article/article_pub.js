$(function() {
  const form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      type:'GET',
      url: 'http://big-event-vue-api-t.itheima.net/my/cate/list',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      processData: false,
      contentType: false,
      success:function(res) {
        if(res.code !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        const htmlStr = template('tpl-cate',res)
        $('[name=cate_id]').html(htmlStr)
        // 通过layui重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  // 初始化图片裁剪器
  const $image = $('#image')
  // 裁剪选项
  const options = {
    aspectRatio:400/280,
    preview:'.img-preview'
  }
  // 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面的按钮绑定点击事件处理函数
  $('#btnChooseImage').on('click',function() {
    $('#coverFile').click()
  })

  // 监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change',function(e) {
    // 获取到文件的列表数组
    const files = e.target.files
    console.log(files)
    // 判断用户是否选择了文件
    if(files.length === 0) {
      return
    }
    // 根据文件创建对应的URL地址
    const newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src',newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  let art_state = '已发布'
  // 为存草稿按钮绑定点击事件处理函数
  $('#btnSave2').on('click',function() {
    art_state = '草稿'
  })

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit',function(e) {
    e.preventDefault()
    // 基于form表单快速创建一个FormData对象
    const fd = new FormData($(this)[0])
    // 将文章发布状态存到fd中
    fd.append('state',art_state)
    // 将封面裁剪过后的图片输出为一个文件对象
    $image
      .cropper('getCroppedCanvas',{
        width:400,
        height:280
      })
      .toBlob(function(blob) {
        // 将文件对象存储到fd中
        fd.append('cover_img',blob)

        $.ajax({
          method: 'POST',
          url: 'http://big-event-vue-api-t.itheima.net/my/article/add',
          data: fd,
          headers: {
            Authorization: localStorage.getItem('token')
          },
          // 固定的写法
          processData: false,
          contentType: false,
          success(res) {
            if (res.code !== 0) return layer.msg('发布文章失败了')
            layer.msg('发布文章成功了')
            location.href = '/article/article_list.html'
          }
        })
      })
  })
}) 