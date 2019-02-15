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
    'layui',
    'layui/lay/modules/layer',
    'layui/lay/modules/form',
    'layui/lay/modules/element',
    'layui/lay/modules/laypage',
    'layui/lay/modules/table',
    'layui/lay/modules/upload'
  ], function($, Vue, pixitools, pixicfg, StateMachine, Clipboard) {
    //Author@wh
    //layui.use(['layer', 'form', 'element', 'laypage', 'table'], function() {



    //数据初始化_______________________________________

    var layer = layui.layer;
    var form = layui.form;
    var element = layui.element;
    var laypage = layui.laypage;
    var table = layui.table;
    var status = -1;
    var strID = 'a';
    localStorage.URL = 'App_applyHistory.htm';
    page = 1;
    var page_size = 5;
    //初始化页面
    setPage();

    //监听行工具事件
    table.on('tool(App_apply_history)', function(obj) {
      var data = obj.data;

      //console.log(obj)
      //显示详细
      if (obj.event === 'detail') {
        var data = obj.data;
        //显示遮蔽罩
        layer.open({
          type: 1,
          area: ['500px', '660px'],
          shadeClose: true, //点击遮罩关闭
          anim: 2,
          content: $("#App_apply_info")
        });
        //渲染详细信息
        $("#tenUid").html(data.tenUid);
        $("#appName").html(data.appName);
        $("#gsName").html(data.gsName);
        $("#logo").html('<div><img style="height:40px;width:40px;" src="https://www.st-saas.com/RecorderDoc/' + data.logo + '"/></div>');
        $("#contacts").html(data.contacts);
        $("#tel").html(data.tel);
        $("#applytime").html(data.applytime);
        $("#dealtime").html(data.dealtime);
        $("#finishtime").html(data.finishtime);
        $("#Fstatus").html(data.Fstatus);
        $("#reurl").html(data.resident_url);
        $("#seurl").html(data.service_url);

        form.render();
      } else if (obj.event === 'edit') {
        CACHEPOOL.insertkey("keyword", "App_apply_u_status");
        CACHEPOOL.insertkey("command", "updateAppApplyList_status");
        CACHEPOOL.insertkey("status", 1);
        CACHEPOOL.insertkey("ID", data.tenUid);
        var cell_app = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            console.log(cell_app);
          }
        });
        form.render();
      }
    });

    //函数库_______________________________________
    //填充table的函数
    function set() {
      table.render({
        elem: '#App_apply_history',
        title: 'APP申请历史记录表',
        toolbar: '#barTool',
        cellMinWidth: 80, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        defaultToolbar: ['filter', 'print', 'exports'],
        cols: [
          [{
              field: 'tenUid',
              title: '租户id',
              sort: true
            },
            {
              field: 'appName',
              title: 'app名称',
              sort: true
            }, {
              field: 'gsName',
              title: '公司名称',
              sort: true
            }, {
              field: 'logo',
              title: '图标',
              sort: true,
              templet: '<div><img style="height:40px;width:40px;" src="https://www.st-saas.com/RecorderDoc/{{d.logo}}" /></div>'
            },
            {
              field: 'contacts',
              title: '联系人',
              sort: true
            },
            {
              field: 'tel',
              title: '电话',
              sort: true
            },
            {
              field: 'applytime',
              title: '申请时间',
              sort: true
            },
            {
              field: 'dealtime',
              title: '处理时间',
              sort: true
            },
            {
              field: 'finishtime',
              title: '完成时间',
              sort: true
            },
            {
              field: 'Fstatus',
              title: '状态',
              sort: true
            },
            {
              fixed: 'right',
              title: '操作',
              toolbar: '#barDemo',
            }
          ]
        ],
        data: Tenacys.rows,
        page: false
      });

    }
    //列表的显示
    function setPage() {
      var index = layer.load(1);
      // CACHEPOOL.insertkey("keyword", "App_apply");
      // CACHEPOOL.insertkey("command", "getAppApplyHistory");
      CACHEPOOL.insertkey("keyword", "App_apply");
      CACHEPOOL.insertkey("command", "getApplyList");
      CACHEPOOL.insertkey("page", page);
      CACHEPOOL.insertkey("page_no", 20);
      CACHEPOOL.insertkey("status", status);
      var cell_page = CACHEPOOL.nocachecommand();
      CACHEPOOL.calculate(function() {
        if (CACHEPOOL.currentstatus) {
          console.log(cell_page)
          Tenacys = new DataTable(cell_page.data);
          if (Tenacys.rows.length > 0) {
            console.log(Tenacys.rows[0].count);
            laypage.render({
              elem: 'page',
              limit: page_size,
              groups: 30,
              layout: ['prev', 'page', 'next', 'count', 'skip'],
              count: Tenacys.rows[0].count, //数据总数，从服务端得到,
              jump: function(obj, first) {
                if (!first) {
                  page = obj.curr;
                  setTenacyList();
                }
              }
            });
          } else {
            laypage.render({
              elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
              limit: 20,
              count: 0, //数据总数，从服务端得到,
              jump: function(obj, first) {
                if (!first) {
                  page = obj.curr;
                  setTenacyList();
                }
              }
            });
          }
          set(); //既然拿到了，先去渲染一下
          layer.close(index);
        }
      });
    }
    //分页获取
    function setTenacyList() {
      var index = layer.load(1);
      // CACHEPOOL.insertkey("keyword", "App_apply");
      // CACHEPOOL.insertkey("command", "getAppApplyHistory");
      CACHEPOOL.insertkey("keyword", "App_apply");
      CACHEPOOL.insertkey("command", "getApplyList");
      CACHEPOOL.insertkey("page", page);
      CACHEPOOL.insertkey("page_no", 20);
      CACHEPOOL.insertkey("status", status);
      var cell_page = CACHEPOOL.nocachecommand();
      CACHEPOOL.calculate(function() {
        if (CACHEPOOL.currentstatus) {
          Tenacys = new DataTable(cell_page.data);
          set(); //既然拿到了，先去渲染一下
          layer.close(index);
        }
      });
    }
  });
  //});
});
