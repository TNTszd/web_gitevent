$(function() {
    var form = layui.form;
    var layer = layui.layer;
    getUserInfo();

    //获取用户基本资料
    function getUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                //为表单赋值
                form.val('filter', res.data);
            }
        })
    }
    //表单验证
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称要低于6个字符'
            }
        }
    });
    //表单重置
    $('#reset').on('click', function(e) {
        e.preventDefault();
        getUserInfo();
    });
    //更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败');
                }
                // layer.msg('修改用户信息成功')
                window.parent.getUserInfo();
            }
        })
    })
})