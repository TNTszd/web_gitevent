$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    };

    //定义美化时间格式的过滤器
    template.defaults.imports.dateFormat = function(data) {
        const dt = new Date(data);

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable();
    //请求文章列表数据并使用模板引擎渲染列表结构
    function initTable() {
        console.log(q);
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            success: function(res) {
                var tplstr = template('tpl-table', res);
                $('tbody').html(tplstr);
                renderPage(res.total);

                // console.log($('.btn-delete').length);
            }
        })
    }



    initCate();
    //发起请求获取并渲染文章分类的下拉选择框
    function initCate() {
        $.ajax({

            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var tplstr = template('tpl-cate', res);

                $('#select-cate').html(tplstr);
                form.render('select', 'form-cate');
            }
        })
    }
    //实现筛选的功能
    $('#cate-submit').submit(function(e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    });

    //分页
    function renderPage(total) {
        layui.use('laypage', function() {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize, //每页显示条数
                curr: q.pagenum,
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5, 10],
                jump: function(obj, first) {
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    if (!first) {
                        initTable();
                    }

                }
            });
        });
    }
    //删除文章
    $('tbody').on('click', '#delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            var length = $('.btn-delete').length;
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    if (length === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    layer.msg(res.message)
                    initTable();
                }
            })
            layer.close(index);
        });

    })

    //查看文章  API没有┭┮﹏┭┮
    $('tbody').on('click', '#art-num', function() {
        // console.log($(this).attr('data-id'));
        var id = $(this).attr('data-id');

        $.ajax({
            url: '/my/article/' + id,
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return console.log(res);
                }
                var tplstr = template('tpl-article', res.data)

                layer.open({
                    title: '预览文章',
                    type: 1,
                    area: ['80%', '80%'],
                    content: tplstr //这里content是一个普通的String
                });
            }
        })
    })

    //编辑文章
    $('tbody').on('click', '#art-edit', function() {
        var id = $(this).attr('data-id');
        location.href = '/article/article_edit.html?id=' + id;
    })
})