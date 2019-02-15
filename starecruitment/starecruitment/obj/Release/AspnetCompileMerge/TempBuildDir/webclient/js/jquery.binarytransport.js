/**
 *
 * jquery.binarytransport.js
 *
 * @description. jQuery ajax transport for making binary data type requests.
 * @version 1.0
 * @author Henry Algus <henryalgus@gmail.com>
 *
*/

(function($, undefined) {
    "use strict";

    // use this transport for "binary" data type
    $.ajaxTransport("+binary", function(options, originalOptions, jqXHR) {
        // check for conditions and support for blob / arraybuffer response type
        if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
            return {
                // create new XMLHttpRequest
                send: function(headers, callback) {
                    // setup all variables
                    var xhr = new XMLHttpRequest(),
                        url = options.url,
                        type = options.type,
                        async = options.async || true,
                        // blob or arraybuffer. Default is blob
                        dataType = options.responseType || "blob",
                        data = options.data || null,
                        username = options.username || null,
                        password = options.password || null;
                    xhr.addEventListener('load', function() {
                        var data = {};
                        data[options.dataType] = xhr.response;
                        // make callback and send data
                        callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                    });
                    xhr.addEventListener('progress',download_progress_handler);
                    
                    xhr.addEventListener("error", download_error);
                    xhr.open(type, url, async, username, password);

                    // setup custom headers
                    for (var i in headers) {
                        xhr.setRequestHeader(i, headers[i]);
                    }

                    xhr.responseType = dataType;
                    xhr.send(data);
                    //$('#progress .progress-bar').css('width',0);
                    //$('#progress').modal({keyboard: false,show:true});
                    
                },
                abort: function() {}
            };
        }
    });
})(window.jQuery);
function download_error(XMLHttpRequest, textStatus, errorThrown){
    if(textStatus == null){console.log('网络连接故障');}
    if(textStatus == 'timeout'){console.log('访问服务器超时');}
}
function download_progress_handler (e) {
    if (e.lengthComputable) {
        var percentComplete = e.loaded / e.total*100;
        // ...
        $('#progress .progress-bar').css('width',percentComplete+'%');
        //console.log(e.loaded+"/"+e.total);
        //console.log(percentComplete);
        //if(percentComplete==100){$('#progress').modal('hide');}
    } else {
	    //不能计算进度
    }
} 