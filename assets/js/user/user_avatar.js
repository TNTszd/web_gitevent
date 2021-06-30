$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //更换图片
    $('#upload').on('click', function(e) {
        $('#file').click();
        //剪裁区域替换
        $('#file').on('change', function(e) {
            // console.log(e.target.files);
            //拿到用户选择的文件
            var file = e.target.files[0];
            //根据选择的文件创建一个对应的URL地址
            var newImgURL = URL.createObjectURL(file);
            // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域

        })
    });
    //上传头像
    $('#btnupload').on('click', function() {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2. 调用接口，把头像上传到服务器
        $.ajax({
            url: '/my/update/avatar',
            method: 'POST',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    });

})