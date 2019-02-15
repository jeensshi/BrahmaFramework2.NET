// JavaScript Document333
//1.addClass:为指定的dom元素添加样式
//2.removeClass:删除指定dom元素的样式
//3.toggleClass:如果存在(不存在)，就删除(添加)一个样式
//4.hasClass:判断样式是否存在
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
function toggleClass(obj, cls) {
    if (hasClass(obj, cls)) {
        removeClass(obj, cls);
    } else {
        addClass(obj, cls);
    }
}
function isNumber(value) {         //验证是否为数字
    var patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}
function isvalidval(val){
    if(val=='null'||val==''||val==undefined||val==null)return false;
    return true;
}
function getweek(timeint) {
    var result = '';
    switch (timeint) {
        case 0:
            result = '星期天';
            break;
        case 1:
            result = '星期一';
            break;
        case 2:
            result = '星期二';
            break;
        case 3:
            result = '星期三';
            break;
        case 4:
            result = '星期四';
            break;
        case 5:
            result = '星期五';
            break;
        case 6:
            result = '星期六';
            break;
        default: ;
    }
    return result;
}

function getmonth(timeint) {
    timeint = timeint + '';
    timeint = timeint.substr(4, 2);
    switch (timeint) {
        case '01':
            timeint = 'Jan';
            break;
        case '02':
            timeint = 'Feb';
            break;
        case '03':
            timeint = 'Mar';
            break;
        case '04':
            timeint = 'Apr';
            break;
        case '05':
            timeint = 'May';
            break;
        case '06':
            timeint = 'Jun';
            break;
        case '07':
            timeint = 'Jul';
            break;
        case '08':
            timeint = 'Aug';
            break;
        case '09':
            timeint = 'Sep';
            break;
        case '10':
            timeint = 'Oct';
            break;
        case '11':
            timeint = 'Nov';
            break;
        case '12':
            timeint = 'Dec';
            break;
        default: ;
    }
    return timeint;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function getQueryUrl(url, name) {
    var reg = new RegExp("(/?|&)" + name + "=([^&]*)(&|$)", "i");
    var r = reg.exec(url);
    if (r != null) return unescape(r[2]); return null;
}

function datetostr(myDate) {
    var YYYY = Number(myDate.year) + 1900;
    var MM = Number(myDate.month) + 1;
    var DD = myDate.date;
    return YYYY + "年" + MM + "月" + DD + "日";
}

function formatDate(date) {
    function dFormat(i) {
        return i < 10 ? "0" + i.toString() : i;
    }
    var str = date;
    var d = str.split('T')[0].split('-');
    var res = d[0] + '年' + d[1] + '月' + d[2] + '日'
    //var d = eval('new ' + str.substr(1, str.length - 2));
    //var res = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
    return res;
}

function getCurentDateStr() {
    var now = new Date();
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
    var clock = year + "-";
    if (month < 10) clock += "0";
    clock += month + "-";
    if (day < 10) clock += "0";
    clock += day;
    return clock;
}
///////////////////e.g. 2018-6-20
function formatDatefromMs(date) {
    var d, result;
    if (typeof (date) == 'string') {
        d = new Date(date.replace('T', ' '));
        result = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    } else
        result = '';
    return result;
}
///////////////////e.g. 今天 18:15
function formatTimeromMs(date) {
    var d, result;
    if (typeof (date) == 'string') {
        d = new Date(date.replace('T', ' '));
        result = '今天 ' + d.getHours() + ':' + (d.getMinutes() + 1);
    }
    else
        result = '';
    return result;
}
///////////////////e.g. 2018-6-20 18:15
function formatDatetimefromMs(date) { 
    var d, result;
    if (typeof (date) == 'string') {
        d = new Date(date.replace('T', ' '));
        if (d.toDateString() === new Date().toDateString())
            result = '今天 ' + d.getHours() + ':' + (d.getMinutes() + 1);
        else
            result = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()+' '+ d.getHours() + ':' + (d.getMinutes() + 1);
    }
    else
        result = '';
    return result;
}
///////////////////e.g. 18:15
function formatTimefromMs(date) {
    var d;
    if (typeof (date) == 'string')
        d = new Date(date.replace('T', ' '));
    return d.getHours() + ':' + (d.getMinutes() + 1);
}

///////////////////e.g. 2018-6-20 or 今天 18:15
function formatviewdatetime(date) {
    var d;
    if (typeof (date) == 'string')
        d = new Date(date.replace('T', ' '));
    if (d.toDateString() === new Date().toDateString()) return formatTimeromMs(date);
    else
        return formatDatefromMs(date);
}
function formatScore(score) {
    score = parseInt(score);
    switch (score) {
        case 1:
            return "优秀";
            break;
        case 2:
            return "良好";
            break;
        case 3:
            return "合格";
            break;
        case 4:
            return "不合格";
            break;
        default:
            break;
    }
}

function geturlfile() {
    var filename = location.href;
    filename = filename.substr(filename.lastIndexOf('/') + 1);
    return filename;
}
function stringToDex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(10);
        else
            val += "," + str.charCodeAt(i).toString(10);
    }
    return val;
}

function dexToString(str) {
    var val = "";
    var arr = str.split(",");
    for (var i = 0; i < arr.length; i++) {
        val += String.fromCharCode(parseInt(arr[i]));
    }
    return val;
}

function formatSex(gender) {
    var result = '';
    switch (gender) {
        case 0:
            result = '女';
            break;
        case 1:
            result = '男';
            break;
        case 2:
            result = '人妖';
            break;
        default:
            result = '未知';
            break;
    }
    return result;
}


function utf8bytes2string(uInt8Array) {
    function formatbitint(bitint) {
        switch (bitint) {
            case 1:
                break;
            default:
                bitint += 1;
                break;
        }
        return bitint;
    }
    function getunicodepart(value, fbi) {
        var formatcode = 255;
        var occupybit;
        return (value & (formatcode >> fbi));
    }
    function getstringlength(value) {
        var i = 1;
        var p = i;
        while (judgestate(value, i)) {
            p = i;
            i++;
            if (i > 8) break;
        }
        return p;
    }
    function judgestate(value, which) {
        return ((value & (1 << (8 - which))) >> (8 - which) == 1);
    }

    var tmplength = -1;
    var tmpunicode = 0;
    var tmpstring = "";
    var tmpcount = 0;
    for (var i = 0; i < uInt8Array.length; i++) {
        tmpbyte = uInt8Array[i];
        if (tmplength == -1) {
            tmplength = getstringlength(tmpbyte);
            fbi = formatbitint(tmplength);
            tmpunicode = (tmpunicode << fbi) + getunicodepart(tmpbyte, fbi);
            //tmpunicode=((tmpunicode<<6)+uInt8Array[i]);
        } else {
            tmpunicode = (tmpunicode << 6) + getunicodepart(tmpbyte, 2);
            //tmpunicode=((tmpunicode<<6)+uInt8Array[i]);
        }
        tmpcount++;
        if (tmpcount >= tmplength) {
            tmpcount = 0;
            tmplength = -1;
            tmpstring += String.fromCharCode(tmpunicode);
            tmpunicode = 0;
        }
    }
    return tmpstring;
}


//保留小数
function decimalfix() {
    var result;
    if (arguments.length > 0) {
        number = arguments[0];
        try {
            result = Number(number);
        } catch (e) {
            return null;
        }
    }
    else
        return null;
    if (arguments.length > 1) {
        fix = arguments[1];
        result = number.toFixed(fix);
    }
    return result;
}

//按关键字查询得到单个对象
function findbyID(table, idobj, value) {
    for (var i = 0; i < table.rows.length; i++) {
        if (table.rows[i][idobj] === value) {
            return table.rows[i];
        }
    }
    return null;
}
function findbyIDnotype(table, idobj, value) {
    for (var i = 0; i < table.rows.length; i++) {
        if (table.rows[i][idobj] == value) {
            return table.rows[i];
        }
    }
    return null;
}
function findlistbyID(table, idobj, value) {
    var list = [];
    for (var i = 0; i < table.rows.length; i++) {
        if (table.rows[i][idobj] === value) {
            list.push(table.rows[i]);
        }
    }
    return list;
}

function insertorupdate(fromtable, totable, obj) {   //tablea to tableb,obj is keywords like {a:'',b:''}
    ctj:
    for (var j = 0; j < fromtable.rows.length; j++) {
        cti:
        for (var i = 0; i < totable.rows.length; i++) {
            for (var k = 0; k < obj.length; k++) {
                if (fromtable.rows[j][obj[k]] != totable.rows[i][obj[k]]) {
                    continue cti;
                }
            }
            //obj属性相同，则update，update后继续下一次j
            totable.rows[i] = clone(fromtable.rows[j]);
            continue ctj;
        }
        //未找到相应的内容，insert
        totable.rows.push(clone(fromtable.rows[j]));
    }
    return totable;
}

function difftable(oldtable, newtable, obj) {
    var result = {
        insert: [],
        update: [],
        delete: []
    };
    var tablea = clone(oldtable);
    var tableb = clone(newtable);
    ctj:
    for (var i = tableb.rows.length - 1; i >= 0; i--) {
        cti:
        for (var j = tablea.rows.length - 1; j >= 0; j--) {
            for (var k = 0; k < obj.length; k++) {
                if (tablea.rows[j][obj[k]] != tableb.rows[i][obj[k]]) {
                    continue cti;
                }
            }
            //obj属性相同，判断内容是否相同，相同则直接删除，不同则写入update,然后全部删除
            if (!isequal(tableb.rows[i], tablea.rows[j])) {
                result.update.push(clone(tableb.rows[i]));
            }
            tableb.rows.splice(i, 1);
            tablea.rows.splice(j, 1);
            continue ctj;
        }
        //未找到相应的内容，insert
        result.insert.push(clone(tableb.rows[i]));
        tableb.rows.splice(i, 1);
    }

    function isequal(rowa, rowb) {
        for (var k in rowa) {
            if (rowa[k] != rowb[k]) {
                return false;
            }
        }
        return true;
    }
    result.delete = clone(tablea.rows);
    return result;
}


function delrows(table, obj) {
    objj:
    for (var i = table.rows.length - 1; i >= 0; i--) {
        for (var k in obj)
            if (table.rows[i][k] != obj[k]) {
                continue objj;
            }
        table.rows.splice(i, 1);
    }
    return table;
}

function uniquetable(table, field) {
    var rows = [], condition = {};
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < field.length; j++) {
            condition[field[j]] = table.rows[i][field[j]];
        }
        var tmprows = arrayfindbyObj(rows, condition);
        if (tmprows.length == 0) rows.push(clone(table.rows[i]));
    }
    return rows;
}
function uniquearrays(arrays, field) {
    var rows = [], condition = {};
    for (var i = 0; i < arrays.length; i++) {
        for (var j = 0; j < field.length; j++) {
            condition[field[j]] = arrays[i][field[j]];
        }
        var tmprows = arrayfindbyObj(rows, condition);
        if (tmprows.length == 0) rows.push(clone(arrays[i]));
    }
    return rows;
}
function findbyObj(table, obj) {
    var arrays = [];
    objj:
    for (var i = 0; i < table.rows.length; i++) {
        for (var k in obj)
            if (table.rows[i][k] != obj[k]) {
                continue objj;
            }
        arrays.push(table.rows[i]);
    }
    return arrays;
}


function arrayfindbyObj(array, obj) {
    var arrays = [];
    objj:
    for (var i = 0; i < array.length; i++) {
        for (var k in obj)
            if (array[i][k] != obj[k]) {
                continue objj;
            }
        arrays.push(array[i]);
    }
    return arrays;
}
function listfindbyID(list, idobj, value) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][idobj] === value) {
            return list[i];
        }
    }
    return null;
}
function jforeach(arraylist, eachdo) {
    for (var i = 0; i < arraylist.length; i++) {
        var item = arraylist[i];
        item.$jid = i + 1;
        eachdo(item);
    }
}

//设定电表最大度数
function readvalueminus(current, last) {
    var MAXVAL = 1000000000000000;
    var val;
    if (current < last)
        val = MAXVAL - last + current;
    else
        val = current - last;
    return val;
}

function JOption(config) {
    this.config = {};
    this.config.all = typeof (config.all && true) == 'undefined' ? true : config.all;
    this.config.id = config.id;
    this.config.field = config.field;
    if (typeof (config.id) == 'undefined') return;
    var html = '';
    if (this.config.all == true) {
        html = html + '<option value="$all" selected>全部</option>';
        $('#' + config.id).html(html);
    }
    this.value = $('#' + config.id).val();
    $('#' + config.id).on('change', function () {
        this.value = $('#' + config.id).val();
    });
}

JOption.prototype = {
    insert: function (item) {
        html = '<option value="' + item.value + '">' + item.name + '</option>';
        $('#' + this.config.id).append(html);
    }
}

function jformat(type, obj) {
    var result = obj.toString();
    switch (type) {
        case 'hour':
        case 'minute':
        case 'second':
        case 'month':
        case 'day':
            if (result.length < 2)
                return '0' + result;
            break;
        default:
            break;
    }
    return result;
}


function getweatherpic(type) {
    var src2 = "";
    var path = '../images/';
    switch (type) {
        case "多云":
            src2 = path + "cloud.png";
            break;
        case "小雨":
            src2 = path + "small_rain.png";
            break;
        case "小到中雨":
            src2 = path + "stom_rain.png";
            break;
        case "阴":
            src2 = path + "overcast.png";
            break;
        case "晴":
            src2 = path + "fine.png";
            break;
        case "阵雨":
            src2 = path + "quick_rain.png";
            break;
        case "雷阵雨":
            src2 = path + "lquick_rain.png";
            break;
        case "大雨":
        case "中到大雨":
            src2 = path + "big_rain.png";
            break;
        case "暴雨":
        case "大暴雨":
        case "特大暴雨":
        case "大到暴雨":
        case "暴雨到大暴雨":
        case "大暴雨到特大暴雨":
            src2 = path + "mbig_rain.png";
            break;
        case "中雨":
            src2 = path + "mid_rain.png";
            break;
        case "雷阵雨伴有冰雹":
            src2 = path + "quick_rain_ice.png";
            break;
        case "雨夹雪":
            src2 = path + "rain_snow.png";
            break;
        case "阵雪":
            src2 = path + "quick_snow.png";
            break;
        case "雾":
            src2 = path + "fog.png";
            break;
        case "沙尘暴":
        case "浮尘":
        case "扬沙":
        case "强沙尘暴":
        case "雾霾":
            src2 = path + "sand.png";
            break;
        case "冻雨":
            src2 = path + "ice_rain.png";
            break;
        case "无天气类型":
            src2 = path + "unknown.png";
            break;
        default:
            ;
    }
    return src2;

}
function iframe_gettheme() {
    var themename = window.parent.__property.season;
    switch (themename) {
        case 0:
            $('body').attr('class', '');
            $('body').attr('class', '_spring');
            break;
        case 1:
            $('body').attr('class', '');
            $('body').attr('class', '_summer');
            break;
        case 2:
            $('body').attr('class', '');
            $('body').attr('class', '_autumn');
            break;
        case 3:
            $('body').attr('class', '');
            $('body').attr('class', '_winter');
            break;
        default:
    }
}
function arrayhasproperty(array, propertyname, value) {
    var hasresult = false;
    jforeach(dataset, function (item) {
        if (item[propertyname] === value) hasresult = true;
    });
    return hasresult;
}
function hasproperty(obj, property) {
    if (typeof (obj[property]) != 'undefined') return true;
    return false;
}
function formatrender(obj) {
    if (typeof (obj) != 'undefined') return obj.toString();
    return '';
}
function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
}
function formatobj() {
    var obj = arguments[0], dft = '';
    if (arguments.length > 1) dft = arguments[1];
    if (obj == undefined) return dft;
    if (obj == null) return dft;

}
function isContains(keyword, string) {
    return new RegExp(keyword).test(string);
}

function beginloading() {
    $('#loading').fadeIn(1000);
}
function firstloading() {
    $('.loading').fadeIn(1000);
}
function endloading() {
    $('#loading').fadeOut(2000);
}

function copyToClipboard(maintext) {
    if (window.clipboardData) {
        window.clipboardData.setData("Text", maintext);
    } else if (window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            alert("该浏览器不支持一键复制！n请手工复制文本框链接地址～");
        }

        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) return;
        trans.addDataFlavor('text/unicode');
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = maintext;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) return false;
        clip.setData(trans, null, clipid.kGlobalClipboard);
    }
    alert("以下内容已经复制到剪贴板nn" + maintext);
}


function string2time(str) {
    var date = new Date(str);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

function formattext(str) {
    if (str && str != 'nul' & str != 'null') {
        return str;
    }
    return '';
}

