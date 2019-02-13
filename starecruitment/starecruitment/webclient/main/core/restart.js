require(['../../js/require.config'], function () {
    require([
        'jquery',
        'vue',
        'jquery.binarytransport',
        'jsdb',
        'jsonrequest',
        'jeens.config',
        'opclass',
        'cachepool',
        'html5',
        'responsiveslides',
        'layui',
        'layui/lay/modules/layer',
        'layui/lay/modules/form',
        'layui/lay/modules/element'
    ], function ($, Vue) {

        // CACHEPOOL.insertkey("keyword", "System");
        // CACHEPOOL.insertkey("command", "reload");
        // var cell_reload = CACHEPOOL.nocachecommand();
        // CACHEPOOL.insertkey("keyword", "Test");
        // CACHEPOOL.insertkey("command", "getdata");
        // var cell_test = CACHEPOOL.nocachecommand();
        // CACHEPOOL.calculate(function () {
        //   if (CACHEPOOL.currentstatus && cell_reload.data.Result.result) {
        //     cell_test.data.Result.result;
        //   }
        // });
        var layer = layui.layer;
        var form = layui.form;
        var element = layui.element;
        if (top.location != self.location) {
            top.location = "restart.htm";
        }

        CACHEPOOL.insertkey("keyword", "System");
        CACHEPOOL.insertkey("command", "gethjcache");
        var cell_hjcache = CACHEPOOL.nocachecommand();
        CACHEPOOL.insertkey("keyword", "System");
        CACHEPOOL.insertkey("command", "getversion");
        var cell_version = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function () {
            if (CACHEPOOL.currentstatus && cell_version.data.Result.result) {
                if (cell_hjcache.data.Result.hjcache === 'true')
                    localStorage.sysversion = cell_version.data.Result.sysversion;
                else
                    localStorage.removeItem('sysversion');
                $('#restart').click(function () {

                    CACHEPOOL.insertkey("keyword", "System");
                    CACHEPOOL.insertkey("command", "reload");
                    var cell_reload = CACHEPOOL.nocachecommand();
                    CACHEPOOL.calculate(function () {
                        if (CACHEPOOL.currentstatus && cell_reload.data.Result.result) {
                            layer.alert('重启配置成功');

                        } else {
                            layer.alert('重启配置失败');
                        }
                    });
                });
                //$(document).on('keydown', function (e) {
                //    if (e.keycode == 13) {
                //        $('#login').click();
                //    }
                //});
            } else {
                layer.alert('无法获取版本号');
            }
        });
    });
});
