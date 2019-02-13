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
    layui.use(['layer', 'form', 'element', 'laypage', 'table'], function() {
      //数据初始化_______________________________________
      var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      var laypage = layui.laypage;
      var table = layui.table;
      localStorage.URL = 'db_list.htm';
      page = 1;
      num = 20;
      status = -1;

      //初始化函数
      setPage();

      //页面逻辑_______________________________________
      //监听租户状态的选择
      form.on('select', function(data) {
        status = data.value; //被点击的radio的value值
        setPage();
      });

      //监听修改
      table.on('edit(d_list)', function(obj) {
        var value = obj.value; //得到修改后的值
        var data = obj.data; //得到所在行所有键值
        var field = obj.field; //得到字段
        updateDataBase(data.ID, field,value);
        //layer.msg('[ID: ' + data.ID + '] ' + field + ' 字段更改为：' + value);
      });

      //头工具栏事件
      table.on('toolbar(d_list)', function(obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
          case 'add': //增加
            addDataBase();
            break;
          case 'del': //删除
            var data = checkStatus.data;
            if (data.length > 0) {
              layer.confirm('确定要删除一共' + data.length + '个数据库', function(index) {
                deleteDataBase(data, index);
              });
            } else {
              layer.msg("没有选中任何行");
            }
            break;
        };
      });

      //函数库_______________________________________

      //增加一条数据库配置信息
      function addDataBase() {
        var index=layer.load(1);
        CACHEPOOL.insertkey("keyword", "DataBase");
        CACHEPOOL.insertkey("command", "insertDataBase");
        CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            layer.close(index);
            setPage();
            //layer.msg("备注成功");
          }
        });
      }
      //根据ID更改状态
      function updateDataBase(ID,fileId, value) {
        var index=layer.load(1);
        CACHEPOOL.insertkey("keyword", "DataBase");
        CACHEPOOL.insertkey("command", "updateDataBase");
        CACHEPOOL.insertkey("fileId", fileId);
        CACHEPOOL.insertkey("value", value);
        CACHEPOOL.insertkey("ID", ID);
        CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            layer.close(index);
            //layer.msg("备注成功");
          }
        });
      }

      //根据id硬删除租户信息
      function deleteDataBase(data, index) {
        for (var i = 0; i < data.length; i++) {
          CACHEPOOL.insertkey("keyword", "DataBase");
          CACHEPOOL.insertkey("command", "deleteDataBase");
          CACHEPOOL.insertkey("ID", data[i].ID);
          CACHEPOOL.nocachecommand();
        }
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            layer.close(index);
            layer.msg('已成功删除');
            setPage();
          }
        });
      }

      //填充table的函数
      function set() {
        table.render({
          elem: '#db_list',
          title: '数据库数据表',
          toolbar: '#barTool',
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
              field: 'host',
              title: '地址',
              width: 150,
              edit: 'text',
              sort: true
            }, {
              field: 'dbName',
              title: '数据库名',
              width: 150,
              edit: 'text',
              sort: true
            },{
              field: 'Mark',
              title: '备注信息',
              edit: 'text'
            },{
              field: 'status',
              title: '状态',
              width: 80
            }]
          ],
          data: DataBases.rows,
          page: false
        });
      }

      //当数字发生变化的时候，首先要调用的函数
      function setPage() {
        var index = layer.load(1);
        CACHEPOOL.insertkey("keyword", "DataBase");
        CACHEPOOL.insertkey("command", "getDataBaseList");
        CACHEPOOL.insertkey("page", page);
        CACHEPOOL.insertkey("page_no", 20);
        CACHEPOOL.insertkey("status", status);
        var cell_page = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            DataBases = new DataTable(cell_page.data);
            if (DataBases.rows.length > 0) {
              laypage.render({
                elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
                limit: 20,
                groups: 30,
                layout: ['prev', 'page', 'next', 'count', 'skip'],
                count: DataBases.rows[0].count, //数据总数，从服务端得到,
                jump: function(obj, first) {
                  if (!first) {
                    page = obj.curr;
                    setDataBaseList();
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
                    setDataBaseList();
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
      function setDataBaseList() {
        var index = layer.load(1);
        CACHEPOOL.insertkey("keyword", "DataBase");
        CACHEPOOL.insertkey("command", "getDataBaseList");
        CACHEPOOL.insertkey("page", page);
        CACHEPOOL.insertkey("page_no", 20);
        CACHEPOOL.insertkey("status", status);
        var cell_page = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            DataBases = new DataTable(cell_page.data);
            set(); //既然拿到了，先去渲染一下
            layer.close(index);
          }
        });
      }


    });

  });
});
