﻿
requirejs.config({
    baseUrl: '../../',
    paths: {	//相对baseUrl的路径
        'html5': 'js/html5shiv.min',
        'jquery': 'js/jquery-1.12.4.min',
        'vue': 'js/vue.min',
        'fusioncharts': 'js/fusioncharts/js/fusioncharts',
        'fusioncharts.theme.fint': 'js/fusioncharts/js/themes/fusioncharts.theme.fint',
        'jquery.binarytransport': 'js/jquery.binarytransport',
        'jquery.hotkeys': 'js/jquery.hotkeys',
        'jsdb': 'js/jsdb',
        'jsonrequest': 'js/jsonrequest',
        'jsgraph': 'js/jsgraph',
        'jeens.config': 'js/jeens.config',
        'opclass': 'js/opclass',
        'cachepool': 'js/cachepool',
        'jquery.marquee': 'js/jquery.marquee.min',
        'video': 'js/videojs/video.min',
        'video.ie8': 'js/videojs/ie8/videojs-ie8.min',
        'app': 'js/app',
        'responsiveslides': 'js/responsiveslides.min',
        'jquery.cookie': 'js/jquery.cookie',
        'datatables.net': 'js/jquery.datatables/jquery.dataTables.min',
        'jquery.dataTables.editor': 'js/jquery.datatables/dataTables.editor.min.1.5.5',
        'jquery.dataTables.buttons': 'js/jquery.datatables/dataTables.buttons.min',
        'jquery.dataTables.select': 'js/jquery.datatables/dataTables.select.min',
        'jquery.dataTables.rowrecorder': 'js/jquery.datatables/dataTables.rowReorder.min',
        'jquery.superslide': 'js/jquery.SuperSlide.2.1.1',
        'pagination': 'js/pagination',
        'turn': 'js/turnjs/turn.min',
        'zoom': 'js/turnjs/zoom',
        'pdf': 'js/pdfjs/pdf',
        'pdf.worker': 'js/pdfjs/pdf.worker',
        'jquery.columnizer': 'js/columnizer/jquery.columnizer',
        'state-machine': 'js/state-machine.min',
        'jquery.easyui': 'js/jquery-easyui-1.5.3/jquery.easyui.min',
        'jquery.easyui.lang.zhCN': 'js/jquery-easyui-1.5.3/locale/easyui-lang-zh_CN',
        'pixi': 'js/pixi',
        'pixi.tools': 'js/pixi.tools',
        'pixi.cfgtools': 'js/pixi.cfgtools',
        'pixi.extrafilters': 'js/pixi-extra-filters.min',
        'lokijs': 'lokijs.min',
        'jquery.jstree': 'js/jstree/jstree.min',
        'jquery-ui/ui/widget': 'js/jquery-file-upload/js/vendor/jquery.ui.widget',
        'jquery.iframe-transport': 'js/jquery-file-upload/js/jquery.iframe-transport',
        'jquery.fileupload': 'js/jquery-file-upload/js/jquery.fileupload',
        'clipboard': 'js/clipboard.min',
        'miniui': 'js/miniui',
        'echarts': 'js/echarts',
        'signalr': 'js/jquery.signalR-2.2.2.min',
        'signalr.hubs': '../signalr/hubs?t=1',
        'snap': 'js/snap.svg-min',
        'mousewheel': 'js/jquery.mousewheel',
        'd3': 'js/d3.v3.min',
        'dark': 'js/dark',
        'FileSaver': 'js/FileSaver',
        'css':'js/css.min'
    },
    packages: [
        {
            name: 'zrender',
            location: 'js/zrender',
            main: 'zrender'
        },
        {
            name: 'layui',
            location: 'js/layui',
            main: 'layui'
        }
    ],
    map: {
        '*': {
            'css': 'css' // or whatever the path to require-css is
        }
    },
    shim: {
        'jquery.binarytransport': {
            deps: ['jquery']
        },
        'jquery.hotkeys': {
            deps: ['jquery']
        },
        'fusioncharts.theme.fint': {
            deps: ['fusioncharts']
        },
        'jquery.marquee': {
            deps: ['jquery']
        },
        'video': {
            deps: ['video.ie8']
        },
        'cachepool': {
            deps: ['opclass']
        },
        'responsiveslides': {
            deps: ['jquery']
        },
        'jquery.cookie': {
            deps: ['jquery']
        },
        'dataTables.net': {
            deps: ['jquery']
        },
        'jquery.dataTables.buttons': {
            deps: ['datatables.net']
        },
        'jquery.dataTables.select': {
            deps: ['datatables.net']
        },
        'jquery.dataTables.editor': {
            deps: ['datatables.net']
        },
        'jquery.dataTables.rowrecorder': {
            deps: ['datatables.net']
        },
        'app': {
            deps: ['jquery', 'jquery.superslide']
        },
        'jquery.superslide': {
            deps: ['jquery']
        },
        'pagination': {
            deps: ['jquery']
        },
        'turn': {
            deps: ['jquery']
        },
        'zoom': {
            deps: ['turn']
        },
        'pdf': {
            deps: ['jquery']
        },
        'pdf.worker': {
            deps: ['pdf']
        },
        'jquery.columnizer': {
            deps: ['jquery']
        },
        'jquery.easyui': {
            deps: ['jquery']
        },
        'jquery.easyui.lang.zhCN': {
            deps: ['jquery.easyui']
        },
        'pixi.tools': {
            deps: ['pixi']
        },
        'pixi.cfgtools': {
            deps: ['pixi', 'pixi.extrafilters']
        },
        'pixi.extrafilters': {
            deps: ['pixi']
        },
        'jquery.jstree': {
            deps: ['jquery']
        },
        'jquery-ui/ui/widget': {
            deps: ['jquery']
        },
        'jquery.iframe-transport': {
            deps: ['jquery-ui/ui/widget']
        },
        'jquery.fileupload': {
            deps: ['jquery-ui/ui/widget', 'jquery.iframe-transport']
        },
        'miniui': {
            deps: ['jquery']
        },
        'layui-mz': {
            deps: ['layui']
        },
        'signalr': {
            deps: ['jquery']
        },
        'signalr.hubs': {
            deps: ['signalr']
        },
        'layui/lay/modules/carousel': {
            deps: ['layui']
        },
        'layui/lay/modules/code': {
            deps: ['layui']
        },
        'layui/lay/modules/colorpicker': {
            deps: ['layui']
        },
        'layui/lay/modules/element': {
            deps: ['layui']
        },
        'layui/lay/modules/flow': {
            deps: ['layui']
        },
        'layui/lay/modules/form': {
            deps: ['layui']
        },
        'layui/lay/modules/jquery': {
            deps: ['layui']
        },
        'layui/lay/modules/laydate': {
            deps: ['layui']
        },
        'layui/lay/modules/layedit': {
            deps: ['layui']
        },
        'layui/lay/modules/layer': {
            deps: ['layui']
        },
        'layui/lay/modules/laypage': {
            deps: ['layui']
        },
        'layui/lay/modules/laytpl': {
            deps: ['layui']
        },
        'layui/lay/modules/mobile': {
            deps: ['layui']
        },
        'layui/lay/modules/rate': {
            deps: ['layui']
        },
        'layui/lay/modules/slider': {
            deps: ['layui']
        },
        'layui/lay/modules/table': {
            deps: ['layui']
        },
        'layui/lay/modules/tree': {
            deps: ['layui']
        },
        'layui/lay/modules/upload': {
            deps: ['layui','layui/lay/modules/form']
        },
        'layui/lay/modules/util': {
            deps: ['layui']
        }
    }
});
