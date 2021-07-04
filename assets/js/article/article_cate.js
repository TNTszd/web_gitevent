$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtcatelist();

    //获取数据渲染文章类别表格
    function initArtcatelist() {
        //获取数据
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //渲染表格
                var tplstr = template('tpl-table', res)
                $('tbody').html(tplstr);
            }
        })
    }
    var index;
    //添加类别
    $('#addCate').on('click', function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#addcate-content').html() //这里content是一个普通的String
        });
    });
    //添加文章分类
    $('body').on('submit', '#addcate-form', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $('#addcate-form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                initArtcatelist();
                layer.close(index);
            }
        })
    });
    //编辑文章分类
    var index2
    $('tbody').on('click', '#edit', function() {
        index2 = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#edit-content').html() //这里content是一个普通的String
        });
        //根据 Id 获取文章分类数据
        var id = $(this).attr('data-id');
        $.ajax({

            url: '/my/article/cates/' + id,
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('edit-filter', res.data);
            }
        });
    });
    //根据 Id 更新文章分类数据
    $('body').on('click', '#edit-submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $('#edit-form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtcatelist();
                layer.close(index2);
            }
        })
    });
    //删除文章分类
    // 根据 Id 删除文章分类
    $('tbody').on('click', '#delete', function() {
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/deletecate/' + id,
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                initArtcatelist();
            }
        })
    })
})