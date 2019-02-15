
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
        'layui/lay/modules/layer',
        'layui/lay/modules/form',
        'layui/lay/modules/element',
        'layui/lay/modules/upload'
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
        var upload = layui.upload;
        var uploadInst = upload.render({
            elem: '#selectfile' //绑定元素
            , url: '/calop/Uploader.ashx' //上传接口
            , accept: 'file'
            , multiple: true
            , auto: false
            , bindAction: '#upload'
            , data: {
                data: '[{ "keyword": "System", "command": "uploadsome", "cellid": "0bbe3229-eeb6-42a7-866e-8558aa6f6665" }]'

            }
            , done: function (res) {
                //上传完毕回调
                layer.alert('done');
            }
            , error: function () {
                //请求异常回调
                layer.alert('fail');
            }
        });
        $('#test').click(function () {
            //    var fileObj = $('#select')[0].files; // js 获取文件对象
            //    var data = new FormData();
            //    data.append('data', '[{ "keyword": "System", "command": "uploadsome", "cellid": "0bbe3229-eeb6-42a7-866e-8558aa6f6665" }]');
            //    for (var i = 0; i < fileObj.length; i++) {
            //        data.append('file', fileObj[i]);
            //    }

            //    $.ajax({
            //        type: "POST",
            //        cache: false,
            //        processData: false, // 告诉jQuery不要去处理发送的数据  
            //        contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
            //        dataType: "binary",
            //        responseType: "arraybuffer",
            //        url: '/calop/Uploader.ashx',
            //        data: data,
            //        async: false,
            //        success: function (msg, status, xhr) {
            //        },
            //        beforeSend: function (xhr) {
            //            xhr.setRequestHeader("Brahma_Socket", "Scoket124");
            //        },
            //        error: function (msg) { // 失败
            //            //alert(msg);

            //        }
            //    });

            CACHEPOOL.insertkey("keyword", "System");
            CACHEPOOL.insertkey("command", "upload");
            var fileObj = $('#select')[0].files; // js 获取文件对象
            for (var i = 0; i < fileObj.length; i++) {
                CACHEPOOL.insertkey("FILESID", fileObj[i]);
            }
            var cell_upload = CACHEPOOL.nocachecommand();
            CACHEPOOL.calculate(function () {
                if (CACHEPOOL.currentstatus && cell_upload.data.Result.result) {
                    cell_upload.data.Result.result;
                }
            });
        });

    });
});
