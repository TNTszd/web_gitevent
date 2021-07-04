$(function() {
    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    initArtCate();
    //获取文章类别
    function initArtCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var tplstr = template('tpl-select', res);
                $('select').html(tplstr);
                form.render();
            }
        })
    }

    //更换图片
    $('#edit-img').on('click', function() {
        $('#file-input').click();
    });
    //监听图片更改事件，将所选图片放入剪裁区
    $('#file-input').on('change', function(e) {
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //发布
    var status_pub = '已发布';
    $('#draft').on('click', function() {
        status_pub = '草稿';
    })

    $('#art-pub').submit(function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        /*     fd.forEach(function(v, k) {
                console.log(v, k);
            }) */

        fd.append('state', status_pub);
        //将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                artPub(fd);

            });


    })

    function artPub(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            contentType: false,
            processData: false,
            data: fd,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg(res.message);
                location.href = '/article/article_list.html';
                // 让文章列表被高亮展示
                window.parent.activeArtlist();
            }
        })
    }


})