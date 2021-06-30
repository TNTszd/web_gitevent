$(function() {
    var form = layui.form;
    var layer = layui.layer;
    //表单验证
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        newpwd: function(value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码不能和旧密码一样'
            }
        },
        repwd: function(value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '新旧密码不一样'
            }
        }
    });
    //发起修改密码请求
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                $('.layui-form')[0].reset();
            }
        })
    })
})