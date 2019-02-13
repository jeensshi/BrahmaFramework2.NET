require(['../../js/require.config'], function() {
  require([
    'jquery',
    'vue',
    'pixi.tools',
    'pixi.cfgtools',
    'state-machine',
    'clipboard',
    'jquery.marquee',
    'jquery.binarytransport',
    'jquery.hotkeys',
    'jquery.jstree',
    'jsdb',
    'jsonrequest',
    'jeens.config',
    'opclass',
    'cachepool',
    'html5',
    'responsiveslides',
    'app',
    'jquery.superslide',
    'pagination',
    'jquery.easyui',
    'pixi',
    'jquery-ui/ui/widget',
    'jquery.iframe-transport',
    'jquery.fileupload',
    'layui'

  ], function($, Vue, pixitools, pixicfg, StateMachine, Clipboard) {
    //Author@week
    layui.use(['layer', 'form', 'element'], function() {
      var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      localStorage.isf = '1';
      set_id();
      $('#login').click(function() {//登出函数
        CACHEPOOL.insertkey("keyword", "PageAuth");
        CACHEPOOL.insertkey("command", "signout");
        var cell_pa = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (cell_pa.data.Result.result == true) {
            close("登出成功");
          } else {
            layer.msg("登出失败");
          }
        });
      });

      function close(msgstr) { //关闭函数
        layer.msg(msgstr, {
          time: 20000, //20s后自动关闭
          btnAlign: 'c',
          area: ['300px', '100px'],
          btn: ['确认'],
          yes: function(index, layero) {
            location.href = 'login.htm';
          }
        });
      }

      function set_id() {//登录信息设置
        CACHEPOOL.insertkey("accountid", localStorage.accountid);
        CACHEPOOL.insertkey("keyword", "Account_User");
        CACHEPOOL.insertkey("command", "getUserName");
        var cell = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            table = new DataTable(cell.data);
            localStorage.manusername = table.rows[0].name;
            $('.shezhi').html(localStorage.manusername);
            form.render();
          }

        });


      }

      function beginloading() {//开始加载
        loadingbox = layer.load(1, {
          shade: [0.2, '#000'] //0.1透明度的白色背景
        });
      }

      function endloading() {//结束加载
        layer.close(loadingbox);
      }




      set();

      $('.cebian').click(function() {//侧边栏统一打开函数
        localStorage.URL = $(this).attr("url");
        set();
      });
      $('.new_window').click(function() {//新窗口打开函数，直接跳转
        window.open($(this).attr("url"));
      });


      function set() {//set函数保存当前iframe里的路径值，保存下来，以供刷新的时候调用
        if (localStorage.URL) {
          $('.layui-this').removeClass("layui-this");
          //$('#' + localStorage.URLID).addClass("layui-this");//头部菜单的高亮切换
          $('#iframe_Content').attr("src", localStorage.URL);
        }
      }



    });

  });
});
