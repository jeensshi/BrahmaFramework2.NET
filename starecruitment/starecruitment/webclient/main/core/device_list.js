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
    //Author@csz
    layui.use(['layer', 'form', 'element', 'laypage', 'table'], function() {



      //数据初始化_______________________________________
      {
      var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      var laypage = layui.laypage;
      var table = layui.table;
      var status=-1;
      var strID='a';
      localStorage.URL = 'device_list.htm';
      page = 1;
      var page_size=5;
      //初始化页面
      setPage();

}


      //设备状态选择下拉框
      form.on('select', function(data) {
        status = data.value; //被点击的radio的value值
        console.log("status is "+status)
        page=1;
        setPage();
      });


      //搜索按钮事件
      $("#btn_search").click(function() {
         strID = $("#search").val();
        if (strID.length > 0) {
            setPage();
        }
        else{
          strID='a';
          setPage()
        }
      });


      //重置按钮事件
      $("#btn_reset").click(function() {
         strID ='a';
         status=-1;
         $("#search").val('');
         setPage();
      });


      //监听修改
      table.on('edit(d_list)', function(obj) {
        var value = obj.value; //得到修改后的值
        var data = obj.data; //得到所在行所有键值
        var field = obj.field; //得到字段
        updateMasterDataBase(data.id,data.tenancyid,data.appid,field,value);

      });


      //填充table的函数
      function set(){
        table.render({
          elem: '#device_list',
          title: '设备信息表',
          toolbar: '#barTool',
          defaultToolbar: ['filter', 'print', 'exports'],
          cols: [
            [
              {
                field: 'tenancyid',
                title: '租户id',
                width: 200,
                fixed: 'left',
                unresize: true,
                sort: true
              },
  {
               field: 'ten_devicename',
               title: '设备名',
               width: 200,
               fixed: 'left',
               unresize: true,
               sort: true
             }, {
              field: 'productKey',
              title: 'productKey',
              width: 200,
              edit:true,
              sort: true
            }, {
              field: 'ten_devicecode',
              title: 'deviceName',
              width: 200,
              edit:true,
              sort: true
            },
            {
              field: 'deviceSecret',
              title: 'deviceSecret',
              width: 200,
              edit:true,
              sort: true
            },
            {
              field: 'status',
              title: '设备状态',
              width: 130,
              sort: true
            }]
          ],
          data: Tenacys.rows,
          page: false
        });

      }


      //format状态显示
      function formatStatus(){
        for(var i=0;i<Tenacys.rows.length;i++)
        {
          if(Tenacys.rows[i].status==0)
          Tenacys.rows[i].status='未激活';
          else
            Tenacys.rows[i].status='在线';
        }
      }


      //列表的显示
      function setPage() {
        var index = layer.load(1);

        CACHEPOOL.insertkey("keyword", "device");
        CACHEPOOL.insertkey("command", "getDeviceList");
        CACHEPOOL.insertkey("page_size", page_size);
        CACHEPOOL.insertkey("page_index", page);
        CACHEPOOL.insertkey("status", status);
        CACHEPOOL.insertkey("strID", strID);

        var cell_page = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            console.log(cell_page)
            Tenacys = new DataTable(cell_page.data);
            formatStatus();

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



      //根据ID更改主数据库状态
      function updateMasterDataBase(ID,tenancyid,appid,fileId, value) {
        var index=layer.load(1);
        CACHEPOOL.insertkey("keyword", "DataBase1");
        CACHEPOOL.insertkey("command", "updateDataBase1");
        CACHEPOOL.insertkey("tenancyid", tenancyid);
        CACHEPOOL.insertkey("appid", appid);
        CACHEPOOL.insertkey("fileId", fileId);
        CACHEPOOL.insertkey("value", value);
        CACHEPOOL.insertkey("ID", ID);
          var cell_page=CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            console.log(cell_page);
            layer.close(index);
            //layer.msg("备注成功");
          }
        });
      }


      //分页获取
      function setTenacyList() {
        var index = layer.load(1);
        CACHEPOOL.insertkey("keyword", "device");
        CACHEPOOL.insertkey("command", "getDeviceList");

        CACHEPOOL.insertkey("page_size", page_size);
        CACHEPOOL.insertkey("page_index", page);
        CACHEPOOL.insertkey("status", status);
        CACHEPOOL.insertkey("strID", strID);

        var cell_page = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            Tenacys = new DataTable(cell_page.data);
            formatStatus();
            set(); //既然拿到了，先去渲染一下
            layer.close(index);
          }
        });
      }


    });

  });
});
