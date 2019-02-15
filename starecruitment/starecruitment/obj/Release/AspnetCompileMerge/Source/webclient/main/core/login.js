require(['../../js/require.config'], function() {
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
  ], function($, Vue) {

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
      var layer=layui.layer;
      var form=layui.form;
      var element=layui.element;
      if (top.location != self.location) {
        top.location = "login.htm";
      }

      $('#login').click(function() { //登录函数
        var username = $('#username').val();
        var password = $('#password').val();
        CACHEPOOL.insertkey("keyword", "PageAuth");
        CACHEPOOL.insertkey("command", "signin");
        CACHEPOOL.insertkey("accountid", username);
        CACHEPOOL.insertkey("password", password);
        var cell_pa = CACHEPOOL.nocachecommand();
        CACHEPOOL.insertkey("keyword", "System");
        CACHEPOOL.insertkey("command", "getversion");
        var cell_version = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus && cell_pa.data.Result.result) {
            localStorage.accountid = username;
            localStorage.password = password;
            location.href = cell_pa.data.Result.jump;
            localStorage.PageUrl = 'landingpage.htm';
          localStorage.sysversion = cell_version.data.Result.sysversion;
          } else {
            layer.alert('账号密码不正确，请重新输入');
          }
        });
      });
      $(document).on('keydown', function(e) {
        if (e.keyCode == 13) {
          $('#login').click();
        }
      });
    });
});
