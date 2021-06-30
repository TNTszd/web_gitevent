$(function() {
    var layer = layui.layer;
    getUserInfo();
    //退出功能
    $('#exit').on('click', function() {
        layer.confirm('是否确认退出', function(index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });
    })
});
//获取用户信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function(res) {
            if (res.status !== 0) {
                //获取失败--》就显示获取失败？
                console.log(res.message);
                return layer.msg('获取数据失败');
            }
            renderAvatar(res.data);
        },

    })
};
//渲染页面
function renderAvatar(data) {
    // console.log(data);
    //获取用户名称
    var name = data.nickname || data.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (data.user_pic !== null) {
        $('.layui-nav-img').attr('src', data.user_pic).show();
        $('.text-avatar').hide();
    }
    $('.layui-nav-img').hide();
    var first = data.username[0].toUpperCase();
    $('.text-avatar').html(first).show();
}