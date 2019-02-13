// JsonRequest 2.0 based on Jquery
// application/json
(function () {
    function JsonRequest() {
        this.url;
        this.condition = new Array();
        this.returnobject = new Object();
        this.row = new Object();
        this.files = new Array();
        this.AfterProcess = function() {};
        this.xhr;
    }
    JsonRequest.prototype = {
        GetReturnObject: function() {
            return JSON.parse(this.GetReturnUTF8());
        },
        GetReturnUTF8: function() {
            return utf8bytes2string(new Uint8Array(this.returnobject));
        },
        attachfiles: function () {
            this.files = arguments[0];
        },
        insertkey: function() {
            key = arguments[0];
            value = arguments[1];
            var confirm;
            if (typeof(arguments[2]) != 'undefined')
                confirm = arguments[2];
            else
                confirm = false;
            if (typeof (value) == 'string')
                this.row[key] = value;
            else
            {
                if (this.files.length==0)
                    this.row[key] = this.files.length;
                else
                    this.row[key] += ','+this.files.length;
                this.files.push(value);
            }
            if (confirm == true) this.confirminsert();
            // if (this.condition[key] == undefined) this.condition[key] = new
            // Array();
            // this.condition[key].push(value);
        },
        confirminsert: function() {
            this.condition.push(this.row);
            this.row = new Object();
        },
        /*
            xhrFields: {
            onprogress: download_progress_handler
        },
        xhr:function() {
            var xhr = $.ajaxSettings.xhr();
            xhr.addEventListener('progress',download_progress_handler,false);
            return xhr;
        },*/
        GetReturnValue: function() {
            this.returnobject = new Object();
            this.url = arguments[0];
            $.ajax({
                type: "POST",
                cache: false,
                url: this.url,
                data: JSON.stringify(this.condition),
                async: false,
                success: function(msg) {
                    JSONREQUEST.condition = new Array();
                    JSONREQUEST.returnobject = msg;
                    JSONREQUEST.AfterProcess();
                },
                error: function(msg) { // 失败
                    JSONREQUEST.condition = new Array();
                    alert('获取数据失败');
                    history.back();
                    return null;
                }
            });
            return this.returnobject;
        },
        GetData: function(){
            this.returnobject = new Object();
            this.url = arguments[0];
            var thisarguments = arguments;
            var thiscondition = this.condition;
            top.window.beginloading();
            if (this.files.length > 0) {
                var data = new FormData();
                data.append('data', JSON.stringify(this.condition));
                for (var i = 0; i < this.files.length; i++) {
                    data.append('file', this.files[i]);
                }
                $.ajax({
                    type: "POST",
                    cache: false,
                    url: this.url,
                    data: data,
                    dataType: "binary",
                    responseType: "arraybuffer",
                    processData: false, // 告诉jQuery不要去处理发送的数据  
                    contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
                    async: false,
                    success: function (msg, status, xhr) {
                        JSONREQUEST.condition = new Array();
                        JSONREQUEST.files = new Array();
                        JSONREQUEST.returnobject = msg;
                        JSONREQUEST.xhr = xhr;
                        JSONREQUEST.AfterProcess();
                        if (thisarguments.length > 1)
                            for (var i = 1; i < thisarguments.length; i++) {
                                if (typeof (thisarguments[i]) == "function") thisarguments[i]();
                            }

                        top.window.endloading();
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Brahma_Socket", "Socket124+");
                    },
                    error: function (msg) { // 失败
                        //alert(msg);
                        var html = '';
                        html = (JSON.stringify(thiscondition));
                        html = (JSON.stringify(msg));
                        $(body).html(html);
                        JSONREQUEST.condition = new Array();
                        alert('获取数据失败');
                        history.back();
                        top.window.endloading();
                        return null;
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    cache: false,
                    url: this.url,
                    data: JSON.stringify(this.condition),
                    dataType: "binary",
                    responseType: "arraybuffer",
                    processData: false, // 告诉jQuery不要去处理发送的数据  
                    contentType: false, // 告诉jQuery不要去设置Content-Type请求头  
                    async: false,
                    success: function (msg, status, xhr) {
                        JSONREQUEST.condition = new Array();
                        JSONREQUEST.files = new Array();
                        JSONREQUEST.returnobject = msg;
                        JSONREQUEST.xhr = xhr;
                        JSONREQUEST.AfterProcess();
                        if (thisarguments.length > 1)
                            for (var i = 1; i < thisarguments.length; i++) {
                                if (typeof (thisarguments[i]) == "function") thisarguments[i]();
                            }

                        top.window.endloading();
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Brahma_Socket", "Socket124");
                    },
                    error: function (msg) { // 失败
                        //alert(msg);
                        var html = '';
                        html = (JSON.stringify(thiscondition));
                        html = (JSON.stringify(msg));
                        $(body).html(html);
                        JSONREQUEST.condition = new Array();
                        alert('获取数据失败');
                        history.back();
                        top.window.endloading();
                        return null;
                    }
                });
            }
        },
        GetDatanoimg: function(){
            this.returnobject = new Object();
            this.url = arguments[0];
            var thisarguments = arguments;
            var thiscondition = this.condition;
            $.ajax({
                type: "POST",
                cache: false,
                url: this.url,
                data: JSON.stringify(this.condition),
                dataType: "binary",
                responseType: "arraybuffer",
                async: false,
                success: function(msg, status, xhr) {
                    JSONREQUEST.condition = new Array();
                    JSONREQUEST.returnobject = msg;
                    JSONREQUEST.xhr = xhr;
                    JSONREQUEST.AfterProcess();
                    if (thisarguments.length > 1)
                        for (var i = 1; i < thisarguments.length; i++) {
                            if (typeof(thisarguments[i]) == "function") thisarguments[i]();
                        }
                        
                },
                error: function(msg) { // 失败
                    //alert(msg);
                    var html='';
                    html=(JSON.stringify(thiscondition));
                    html=(JSON.stringify(msg));
                    $(body).html(html);
                    JSONREQUEST.condition = new Array();
                    alert('获取数据失败');
                    history.back();
                    return null;
                }
            });
        },
        GetFile: function() {
            this.url = arguments[0];
            this.GetData(
                this.url,
                function() {
                    var msg = JSONREQUEST.returnobject;
                    var data = new Blob([msg], {
                        type: "application/octet-stream"
                    });
                    saveAs(data, decodeURI(JSONREQUEST.xhr.getResponseHeader('Content-disposition').split('=')[1]));
                    // var downloadUrl = window.URL.createObjectURL(data);
                    // var anchor = document.createElement("a");
                    // anchor.href = downloadUrl;
                    // anchor.download = decodeURI(JSONREQUEST.xhr.getResponseHeader('Content-disposition').split('=')[1]);
                    // anchor.click();
                    // window.URL.revokeObjectURL(data);
                    JSONREQUEST.AfterProcess();
                }
            );
        },
        /*
    GetFile: function () {
        this.returnobject = new Object();
        this.url = arguments[0];
        $.ajax({
            type: "POST",
            cache: false,
            url: this.url,
            data: JSON.stringify(this.condition),
            dataType: "binary",
            responseType:'arraybuffer',
            async: true,
            success: function (msg,status,xhr) {
                JSONREQUEST.condition = new Array();
                JSONREQUEST.returnobject = msg;
                JSONREQUEST.xhr = xhr;
    			var data = new Blob([msg],{type:"application/octet-stream"});
    			var downloadUrl = window.URL.createObjectURL(data);
    			var anchor = document.createElement("a");
    			anchor.href = downloadUrl;
    			anchor.download = decodeURI(JSONREQUEST.xhr.getResponseHeader('Content-disposition').split('=')[1]);
    			anchor.click();
				window.URL.revokeObjectURL(data);
                JSONREQUEST.AfterProcess();
            },
            error: function (msg) { // 失败
                JSONREQUEST.condition = new Array();
                alert('获取数据失败');
                history.back();
                return null;
            }
        });
    },*/
        ToBlob: function() {
            var table = arguments[0];
            resp = table.DataSet;
            var x = new Uint8Array(resp.length);
            for (var i = 0; i < resp.length; i++) {
                x[i] = resp[i];
            }
            var data = new Blob([x], {
                type: "application/octet-stream"
            });
            return data;
        },
        DownloadBlob: function() {
            filename = arguments[1];
            var data = arguments[0];
            var downloadUrl = window.URL.createObjectURL(data);
            var anchor = document.createElement("a");
            anchor.href = downloadUrl;
            anchor.download = filename;
            anchor.click();
            window.URL.revokeObjectURL(data);
        }
    }
    window.JSONREQUEST = new JsonRequest();
})();