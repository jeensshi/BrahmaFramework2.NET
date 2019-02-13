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
    //Author@wanghui
    // layui.use(['layer', 'form', 'element', 'laypage', 'table', 'upload'], function() {
    //数据初始化_______________________________________
    var layer = layui.layer;
    var form = layui.form;
    var element = layui.element;
    var laypage = layui.laypage;
    var table = layui.table;
    var upload = layui.upload;

    var datenow = new Date();
    var tyear = datenow.getFullYear();
    var tmonth = datenow.getMonth() + 1;
    var tDate = datenow.getDate();
    var thour = datenow.getHours();
    var tmin = datenow.getMinutes();
    var tsec = datenow.getSeconds();
    //调用加零函数，避免出现类似2018-7-9这样的情况
    datenow = tyear + "-" + plusZero(tmonth) + "-" + plusZero(tDate) + " " + plusZero(thour) + ":" + plusZero(tmin) + ":" + plusZero(tsec);
    var status = 0;
    var strID = 'a';
    localStorage.URL = 'App_applyManage.htm';
    page = 1;
    var page_size = 5;
    //初始化页面
    setPage();

    //页面逻辑_______________________________________
    //头工具栏事件
    table.on('toolbar(App_apply_list)', function(obj) {
      $(location).attr('href', 'guide.htm');
    });

    //监听行工具事件
    table.on('tool(App_apply_list)', function(obj) {
      var data = obj.data;
      //console.log(obj)
      //判断操作的类型
      if (obj.event === 'detail') { //查看详细
        var data = obj.data;
        //显示遮蔽罩
        layer.open({
          type: 1,
          area: ['500px', '660px'],
          shadeClose: true, //点击遮罩关闭
          anim: 2,
          content: $("#App_apply_info")
        });
        //渲染数据
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

      } else if (obj.event === 'edit') { //处理申请，即上传apk文件
        //点击处理更新状态为处理中
        CACHEPOOL.insertkey("keyword", "App_apply_u_status");
        CACHEPOOL.insertkey("command", "updateAppApplyList_status");
        CACHEPOOL.insertkey("status", 1);
        CACHEPOOL.insertkey("ID", data.tenUid);
        CACHEPOOL.insertkey("dealtime", datenow);
        var cell_appstatus = CACHEPOOL.nocachecommand();
        CACHEPOOL.calculate(function() {
          if (CACHEPOOL.currentstatus) {
            console.log(cell_appstatus);
          }
        });
        //弹出文件上传窗口
        layer.open({
          type: 1,
          area: ['500px', '660px'],
          shadeClose: true, //点击遮罩关闭
          anim: 2,
          content: $("#App_apply_upload")
        });

        //多文件上传
        var demoListView = $('#demoList'),
          uploadListIns = upload.render({
            elem: '#testList',
            url: '../../../calop/fileUpload.ashx',
            accept: 'file',
            data: {
              appName: data.gsName, //把公司名称传给接口，用来加到保存文件的名称中
              logoimg: "" //保留字段，可以用来给接口传数据
            },
            multiple: true,
            auto: false,
            bindAction: '#testListAction',
            choose: function(obj) {
              var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
              //读取本地文件
              obj.preview(function(index, file, result) {
                var tr = $(['<tr id="upload-' + index + '">', '<td>' + file.name + '</td>', '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>', '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>', '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>', '</td>', '</tr>'].join(''));
                //obj.resetFile(index, file, data.appName+file.name); //重命名文件名，layui 2.3.0 开始新增
                //单个重传
                tr.find('.demo-reload').on('click', function() {
                  obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function() {
                  delete files[index]; //删除对应的文件
                  tr.remove();
                  uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView.append(tr);
              });
            },
            done: function(res, index, upload) {
              //  console.log(res.code);
              //  console.log(res.src);
              var type = res.src.split('/')[3].split('.')[0];
              var saveurl = res.src;
              var dotime = res.dotime;
              switch (type) {
                case data.gsName + "居民端":
                  type = "re";
                  break;
                case data.gsName + "维修端":
                  type = "se";
                  break;
                default:
                  type = "no";
                  break;
              }
              //console.log(type);
              if (res.code == 0) { //上传成功
                CACHEPOOL.insertkey("keyword", "App_apply_u");
                CACHEPOOL.insertkey("command", "updateAppApplyList");
                CACHEPOOL.insertkey("saveurl", saveurl);
                CACHEPOOL.insertkey("appId", data.tenUid);
                CACHEPOOL.insertkey("type", type);
                CACHEPOOL.insertkey("finishtime", dotime);
                CACHEPOOL.insertkey("status", 2);
                var cell_app = CACHEPOOL.nocachecommand();
                CACHEPOOL.calculate(function() {
                  if (CACHEPOOL.currentstatus) {
                    var tr = demoListView.find('tr#upload-' + index),
                      tds = tr.children();
                    tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                    tds.eq(3).html(''); //清空操作
                  }
                });
                return delete this.files[index]; //删除文件队列已经上传成功的文件
              }
              this.error(index, upload);
            },
            error: function(index, upload) { //上传失败
              var tr = demoListView.find('tr#upload-' + index),
                tds = tr.children();
              tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
              tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
            }
          });

        form.render();
      }
    });


    //函数库_______________________________________
    //补零函数，给日期小于十的，补零
    function plusZero(str) {
      return str < 10 ? '0' + str : str;
    }

    //填充table的函数
    function set() {
      table.render({
        elem: '#App_apply_list',
        title: 'APP申请列表',
        toolbar: '#toolbarDemo',
        cellMinWidth: 80, //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        defaultToolbar: ['filter', 'print', 'exports'],
        cols: [
          [
            // {
            //   field: 'tenUid',
            //   title: '租户id',
            //   sort: true
            // },
            {
              field: 'appName',
              title: 'app名称',
              sort: true
            },
            {
              field: 'gsName',
              title: '公司名称',
              sort: true
            },
            // {
            //   field: 'logo',
            //   title: '图标',
            //   sort: true
            //
            // },
            {
              field: 'contacts',
              title: '联系人',
              sort: true
            },
            {
              field: 'tel',
              title: '电话',
              sort: false
            },
            {
              field: 'applytime',
              title: '申请时间',
              sort: true
            },
            // {
            //   field: 'dealtime',
            //   title: '处理时间',
            //   sort: true
            // },
            // {
            //   field: 'finishtime',
            //   title: '完成时间',
            //   sort: true
            // },
            {
              field: 'Fstatus',
              title: '状态',
              sort: false
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
      // CACHEPOOL.insertkey("command", "getAppApplyList");
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
      // CACHEPOOL.insertkey("command", "getAppApplyList");
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
  // });
});
