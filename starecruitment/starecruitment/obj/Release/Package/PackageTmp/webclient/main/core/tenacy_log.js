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
    layui.use(['layer', 'form', 'element', 'laypage', 'table', 'laydate'], function() {
      //数据初始化_______________________________________
      var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      var laypage = layui.laypage;
      var table = layui.table;
      var laydate = layui.laydate;
      localStorage.URL = 'tenacy_log.htm';
      page = 1;
      num = 16;
      status = 'ALL';
      UserID = -1;
      start_Time = '1970-01-01';
      var myDate = new Date();
      end_Time = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate() + 1);

      //初始化函数
      setPage();

      //页面逻辑_______________________________________
      //重置按钮点击
      $("#btn_reset").click(function() {
        UserID = -1;
        $("#search").val("");
        $("#timeRange").val("");
        start_Time = '1970-01-01';
        var myDate = new Date();
        end_Time = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate() + 1);
        setPage();
      });

      //搜索按钮点击
      $("#btn_search").click(function() {
        var strID = $("#search").val();
        if (strID.length > 0) {
          if (isNumber(strID)) {
            UserID = parseInt(strID);
          } else {
            layer.msg("请输入纯数字");
          }
        }
        setPage();
      });
      //日期控件渲染
      laydate.render({
        elem: '#timeRange',
        //或 range: '~' 来自定义分割字符
        range: '~',
        change: function(value, date, endDate) {
          value = value.replace(/\s+/g, ""); //去空格
          start_Time = value.split("~")[0];
          end_Time = value.split("~")[1];
        }
      });
      //监听设备分组状态的选择
      form.on('select', function(data) {
        status = data.value; //被点击的radio的value值
        setPage();
      });

      //函数库_______________________________________
      //判定一个数是不是纯数字
      function isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
          return true;
        } else {
          return false;
        }
      }
      //填充table的函数
      function set() {
        table.render({
          elem: '#log_list',
          title: '行为记录表',
          toolbar: '#barTool',
          limit:num,
          defaultToolbar: ['filter', 'print', 'exports'],
          cols: [
            [{
              type: 'checkbox',
              fixed: 'left'
            }, {
              field: 'ID',
              title: 'ID',
              width: 70,
              fixed: 'left',
              unresize: true,
              sort: true
            }, {
              field: 'ten_ID',
              title: '租户id',
              width: 150,
              sort: true
            }, {
              field: 'time',
              title: '应用id',
              width: 150,
              sort: true
            }, {
              field: 'con_type',
              title: '行为类型',
              width: 150,
              sort: true
            }, {
              field: 'mark',
              title: '备注信息',
              edit: 'text'
            }, {
              field: 'b_Mark',
              title: '租户备注信息'
            }, {
              field: 'type',
              title: '类型',
              width: 80
            }]
          ],
          data: Logs.rows,
          page: false
        });
      }

      //当数字发生变化的时候，首先要调用的函数
      function setPage() {
        var index = layer.load(1);
        CACHEPOOL.insertkey("keyword", "Tenacy_Log");
        CACHEPOOL.insertkey("command", "getTenacyLog");
        CACHEPOOL.insertkey("page", page);
        CACHEPOOL.insertkey("page_no", 20);
        CACHEPOOL.insertkey("status", status);
        CACHEPOOL.insertkey("ID", UserID);
        CACHEPOOL.insertkey("start_time", start_Time);
        CACHEPOOL.insertkey("end_time", end_Time);
        var cell_page = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            Logs = new DataTable(cell_page.data);
            if (Logs.rows.length > 0) {
              laypage.render({
                elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
                limit: num,
                groups: 30,
                layout: ['prev', 'page', 'next', 'count', 'skip'],
                count: Logs.rows[0].count, //数据总数，从服务端得到,
                jump: function(obj, first) {
                  if (!first) {
                    page = obj.curr;
                    setTenacyLog();
                  }
                }
              });
            } else {
              laypage.render({
                elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
                limit: num,
                count: 0, //数据总数，从服务端得到,
                jump: function(obj, first) {
                  if (!first) {
                    page = obj.curr;
                    setTenacyLog();
                  }
                }
              });
            }
            set(); //既然拿到了，先去渲染一下
            layer.close(index);
          }
        });
      }
      //点击页码后出发的分页获取
      function setTenacyLog() {
        var index = layer.load(1);
        CACHEPOOL.insertkey("keyword", "Tenacy_Log");
        CACHEPOOL.insertkey("command", "getTenacyLog");
        CACHEPOOL.insertkey("page", page);
        CACHEPOOL.insertkey("page_no", 20);
        CACHEPOOL.insertkey("status", status);
        CACHEPOOL.insertkey("ID", UserID);
        CACHEPOOL.insertkey("start_time", start_Time);
        CACHEPOOL.insertkey("end_time", end_Time);
        var cell_page = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            Logs = new DataTable(cell_page.data);
            set(); //既然拿到了，先去渲染一下
            layer.close(index);
          }
        });
      }


    });

  });
});
