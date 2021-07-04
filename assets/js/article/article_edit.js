$(function() {

    var layer = layui.layer;
    var form = layui.form;

    // 工具栏的配置项
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike', 'image'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'] // remove formatting button
    ]
    initArtCate();


    function initArticleInfo() {
        // 处理 URL 路径中的查询参数
        const urlParams = new URLSearchParams(location.href.split('?')[1])
        const id = urlParams.get('id')
        $.ajax({
            url: '/my/article/' + id,
            method: 'GET',
            success: function(res) {
                form.val("article-edit", res.data);
                initEditor(res.data.content);
                initCropper('http://api-breakingnews-web.itheima.net' + res.data.cover_img)
            }
        })
    }

    function initEditor(content) {
        $('#editor').html(content)
            // 创建富文本编辑器
        var quill = new Quill('#editor', {
            // 指定主题
            theme: 'snow',
            // 指定模块
            modules: {
                toolbar: toolbarOptions
            }
        })
        $('.my-editor select').css('display', 'none') //???

    }





    function initCropper(src) {

        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options);

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', src) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    }


    /*     // 初始化富文本编辑器
        initEditor(); */

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
                $('[name="cate_id"]').html(tplstr);
                form.render('select');
                //调用初始化文章信息
                initArticleInfo()

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

    $('.layui-icon-left').on('click', function() {
        history.go(-1)
    });
    //加载内容

})