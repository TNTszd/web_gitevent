$(function() {
    //登录和注册按需切换
    $('#link-reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link-login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    });

    //登录表单的验证
    //layui中获取Form对象
    var form = layui.form;
    form.verify({
        //用户名为字母或数字的组合，且长度小于10
        username: [/^[0-9A-Za-z]{1,10}$/, "用户名为字母或数字的组合，且长度小于10!"],
        //密码的长度为6-15个字符，且不能包含空格！
        pwd: [/^[\S]{6,15}$/, '密码的长度为6-15个字符，且不能包含空格'],
        repwd: function(val) {
            const pwd = $('.reg-box [name="password"]').val().trim();
            if (val !== pwd) {
                return '输入的两次密码不一致'
            }
            //如果校验通过不需做任何处理
        }
    });

    //发起注册用户的ajax请求
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        var data = { username: $('.reg-box [name="username"]').val(), password: $('.reg-box [name="password"]').val() }
        $.post('/api/reguser', data, function(res) {
            // console.log(res.status);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            $('#link-login').click();
            return layui.layer.msg('注册成功');
        })
    })

    //发起登录的ajax请求
    $('#form-login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // layui.layer.msg('登录成功');
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                location.href = '/index.html';

            }
        })
    })
})