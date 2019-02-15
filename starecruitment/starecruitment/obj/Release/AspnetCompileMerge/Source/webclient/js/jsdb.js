// JavaScript Document
//2015.5.8
//Jeens 2017/5/17
//JSDB 2.1

function clone(obj) {
    var o;
    switch (typeof obj) {
        case 'undefined': break;
        case 'string': o = obj + ''; break;
        case 'number': o = obj - 0; break;
        case 'boolean': o = obj; break;
        case 'object':
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj; break;
    }
    return o;
}

var is = function (obj, type) {
    return (type === "Null" && obj === null) ||
    (type === "Undefined" && obj === void 0) ||
    (type === "Number" && isFinite(obj)) ||
    Object.prototype.toString.call(obj).slice(8, -1) === type;
}
//数据表类
function DataTable() {
    this.name;
    this.rows = new Array();
    this.struct;
    this.primarykey;
    if (arguments.length == 1 && typeof (arguments) == "object") {
        var struct = clone(arguments[0].Struct);
        if (typeof (struct) == "string") struct = JSON.parse(struct);
        for (var i in struct) {
            this.name = i;
            this.struct = struct[i];
        }
        this.setDataSource(arguments[0].DataSet);
    }
}

DataTable.prototype = {
    setDataSource: function () {
        if (arguments.length == 1 && typeof (arguments) == "object") {
            var data = clone(arguments[0]);
            if (this.struct == undefined) { return; }
            if (typeof (data) == "string") data = JSON.parse(data);
            for (var i=0;i< data.length;i++) {
                var row = new Object();
                //数据结构
                for (var j=0;j<this.struct.length;j++)
                    row[this.struct[j]] = data[i][this.struct[j]];
                //
                this.rows.push(row);
            }
        } else { return; }
    },
    create:function(tablename,columns,primarykey){
        this.name="T_"+tablename;
        this.struct=columns;
        if(arguments.length>2)
        this.primarykey=primarykey;
    },
    insert:function(rows){
        var thisrows=clone(rows);
        for (var i=0;i< thisrows.length;i++) {
            var row = new Object();
            //数据结构
            for (var j=0;j<this.struct.length;j++)
                if(this.struct[j]==this.primarykey)
                    row[this.struct[j]] = guid();
                else
                    row[this.struct[j]] = thisrows[i][this.struct[j]];
            //
            this.rows.push(row);
        }
    },
    setPrimary:function(primarykey){
        this.primarykey=primarykey;
    }
}





function SqlAdapter() {

}

SqlAdapter.prototype = {
    CrossJoin: function () {
        var result = new Array();
        var para = new Array();
        var parabegin;
        for (parabegin = 0; parabegin < arguments.length; parabegin++)
            if (typeof (arguments[parabegin]) == "object") {
                result = this.Combine(result, arguments[parabegin]);
            } else {
                break;
            }
        return result;
    },
    InnerJoin: function () {
        var result = new Array();
        var para = new Array();

        //外连接		
        var parabegin;
        for (parabegin = 0; parabegin < arguments.length; parabegin++)
            if (typeof (arguments[parabegin]) != "object") break;

        //格式化条件参数
        if (parabegin < arguments.length) {
            var array = arguments[parabegin].split(",");
            for (var i=0;i<array.length;i++) {
                var temparray = array[i].split("=");
                for (var j in temparray) {
                    var items = temparray[j].split(".");
                    var item = new Object;
                    item.table = items[0];
                    item.field = items[1];
                    temparray[j] = item;
                }
                para.push(temparray);
            }
        }

        for (var i = 0; i < parabegin; i++) {
            //优化执行效率，可以取消此处clone函数
            if (is(arguments[i], 'Array')) {
                result = clone(arguments[i]);
            } else {
                result = this.Combine(result, clone(arguments[i]));
            }


            if (para.length > 0 && result.length > 0) {
                for (var j = (para.length - 1) ; (j + 1) > 0; j--) {
                    if (result[0].hasOwnProperty(para[j][0].table) && result[0].hasOwnProperty(para[j][1].table)) {
                        //遍历删除不满足的行。
                        for (var k = (result.length - 1) ; (k + 1) > 0; k--)
                            if (result[k][para[j][0].table][para[j][0].field] != result[k][para[j][1].table][para[j][1].field]) {
                                result.splice(k, 1);
                            }
                        para.splice(j, 1);
                    }

                }
            }
        }

        return result;
    },
    RelateObject: function () {
        //多表间连接条件关系为or
        //两表间连接条件关系为and
        var result = new Object();
        var para = new Array();

        //外连接		
        var parabegin;
        for (parabegin = 0; parabegin < arguments.length; parabegin++)
            if (typeof (arguments[parabegin]) != "object") break;

        //格式化条件参数
        if (parabegin < arguments.length) {
            var array = arguments[parabegin].split(",");
            for (var i=0;i<array.length;i++) {
                var temparray = array[i].split("=");
                for (var j=0;j<temparray.length;j++) {
                    var items = temparray[j].split(".");
                    var item = new Object;
                    item.table = items[0];
                    item.field = items[1].split("|");
                    temparray[j] = item;
                }
                para.push(temparray);
            }
        }

        for (var i = 0; i < parabegin; i++) {
            result = this.CombineObject(result, clone(arguments[i]));
        }

        //按照参数规则组合
        if (para.length > 0) {
            for (j=0;j< para.length;j++) {
                if (result.hasOwnProperty(para[j][0].table) && result.hasOwnProperty(para[j][1].table)) {

                    for (k in result[para[j][0].table].rows) {
                        for (l in result[para[j][1].table].rows) {
                            var pss = 1;
                            for (m in para[j][0].field) {
                                if (result[para[j][0].table].rows[k][para[j][0].field[m]] != result[para[j][1].table].rows[l][para[j][1].field[m]]) {
                                    pss = 0;
                                }
                            }
                            if (pss == 1) {
                                if (!result[para[j][0].table].rows[k].hasOwnProperty(para[j][1].table)) {
                                    result[para[j][0].table].rows[k][para[j][1].table] = clone(result[para[j][1].table]);
                                    //优化
                                    result[para[j][0].table].rows[k][para[j][1].table].rows = new Array();
                                }

                                result[para[j][0].table].rows[k][para[j][1].table].rows.push(result[para[j][1].table].rows[l]);
                            }

                        }
                    }
                }
            }
        }
        //按照参数条件删选

        /*
            if (para.length > 0 && result.length > 0) {
                for (var j = (para.length - 1) ; (j + 1) > 0; j--) {
                    if (result[0].hasOwnProperty(para[j][0].table) && result[0].hasOwnProperty(para[j][1].table)) {
                        //遍历删除不满足的行。
                        for (var k = (result.length - 1) ; (k + 1) > 0; k--)
                            if (result[k][para[j][0].table][para[j][0].field] != result[k][para[j][1].table][para[j][1].field]) {
                                result.splice(k, 1);
                            }
                        para.splice(j, 1);
                    }

                }
            }
        */

        return result;
    },
    CombineObject: function () {
        var rows = clone(arguments[0]);
        var dt = clone(arguments[1]);
        var result = new Object();
        result = rows;
        result[dt.name] = dt;
        return result;
    },
    Combine: function () {
        var rows = clone(arguments[0]);
        var dt = clone(arguments[1]);
        var result = new Array();
        if (rows.length == 0) {
            for (var i in dt.rows) {
                var row = new Object();
                row[dt.name] = clone(dt.rows[i]);
                result.push(row);
            }
        }
        else {
            for (var i in dt.rows) {
                for (var j in rows) {
                    var row = new Object();
                    for (var k in rows[j]) {
                        row[k] = clone(rows[j][k])
                    }
                    row[dt.name] = clone(dt.rows[i]);
                    result.push(row);
                }

            }
        }
        return result;
    },

    CrossTable: function () {
        //set arguments
        var table_content = clone(arguments[0]);
        var accordings = clone(arguments[1]);
        // format:    'row.in:T_table1.name>T_table1.id,column.out:T_table2.name>T_table2.id,statstics.in:T_talbe3.value'
        var rowacc = new Object();
        var columnacc = new Object();
        var statsticsacc = new Object();
        //set process and set main arguments
        var tmpall = accordings.split(",");
        var oacc = 0;
        for (var i = 0; i < tmpall.length; i++) {
            var tmp = tmpall[i].split(":");
            var accord = tmp[0].split(".");
            var accname = accord[0];
            var accstyle = accord[1];
            switch (accname) {
                case 'row':
                    rowacc.accstyle = accstyle;
                    var viewindex = tmp[1].split(">");
                    var views = viewindex[0].split(".");
                    var indexes = viewindex[1].split(".");
                    rowacc.view = new Object();
                    rowacc.view.tablename = views[0];
                    rowacc.view.tablecolumn = views[1];
                    rowacc.index = new Object();
                    rowacc.index.tablename = indexes[0];
                    rowacc.index.tablecolumn = indexes[1];
                    if (accstyle == 'out') {
                        rowacc.rowobject = clone(arguments[oacc + 2]);
                        oacc++;
                    }
                    break;
                case 'column':
                    columnacc.accstyle = accstyle;
                    var viewindex = tmp[1].split(">");
                    var views = viewindex[0].split(".");
                    var indexes = viewindex[1].split(".");
                    columnacc.view = new Object();
                    columnacc.view.tablename = views[0];
                    columnacc.view.tablecolumn = views[1];
                    columnacc.index = new Object();
                    columnacc.index.tablename = indexes[0];
                    columnacc.index.tablecolumn = indexes[1];
                    if (accstyle != 'in') {
                        columnacc.rowobject = clone(arguments[oacc + 2]);
                        oacc++;
                    }
                    break;
                case 'statistics':
                    statsticsacc.accstyle = accstyle;
                    var values = tmp[1].split(".");
                    statsticsacc.svalue = new Object();
                    statsticsacc.svalue.tablename = values[0];
                    statsticsacc.svalue.tablecolumn = values[1];
                    /*
                    var viewindex = tmp[1].split(">");
                    var views = viewindex[0].split(".");
                    var indexes = viewindex[1].split(".");
                    statsticsacc.view = new Object;
                    statsticsacc.view.tablename = views[0];
                    statsticsacc.view.tablecolumn = views[1];
                    statsticsacc.index = new Object;
                    statsticsacc.index.tablename = indexes[0];
                    statsticsacc.index.tableid = indexes[1];
                    if(accstyle=='out')
                    {
                        rowacc.rowobject = clone(arguments[occ+2]);
                        occ++;
                    }
                    */
                    break;
                default:
                    break;
            }
        }



        var result = new Object();
        result.grid = new Array();
        var opgrid = new Object();
        var columns = new Array();
        var returnresult = new Object();
        for (var i in table_content) {
            if (typeof (opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]]) != "object") {
                opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]] = new Object();
                opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]]._id = table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn];
                opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]]._name = table_content[i][rowacc.view.tablename][rowacc.view.tablecolumn];
            }
            if (opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]][table_content[i][columnacc.index.tablename][columnacc.index.tablecolumn]] == undefined) {
                opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]][table_content[i][columnacc.index.tablename][columnacc.index.tablecolumn]] = table_content[i];
            }
            if (typeof (statsticsacc.accstyle) != "undefined") {
                if (opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]][table_content[i][columnacc.index.tablename][columnacc.index.tablecolumn]]._max == undefined) opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]][table_content[i][columnacc.index.tablename][columnacc.index.tablecolumn]]._max = 0;
                opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]][table_content[i][columnacc.index.tablename][columnacc.index.tablecolumn]]._max = Math.max(opgrid[table_content[i][rowacc.index.tablename][rowacc.index.tablecolumn]][table_content[i][columnacc.index.tablename][columnacc.index.tablecolumn]]._max, table_content[i][statsticsacc.svalue.tablename][statsticsacc.svalue.tablecolumn]);
            }
            var item = new Object();
            item._id = table_content[i][columnacc.index.tablename][columnacc.index.tablecolumn];
            item._name = table_content[i][columnacc.view.tablename][columnacc.view.tablecolumn];
            columns.push(item);
        }

        if (columnacc.accstyle == 'out') {
            for (var i = 0; i < columnacc.rowobject._columns.length; i++) {
                //columnacc.rowobject
                var item = clone(columnacc.rowobject._columns[i]);
                columns.push(item);
            }
        }

        if (columnacc.accstyle == 'outtable') {
            for (var i = 0; i < columnacc.rowobject.length; i++) {
                //columnacc.rowobject
                var item = new Object();
                item._id = columnacc.rowobject[i][columnacc.index.tablename][columnacc.index.tablecolumn];
                item._name = columnacc.rowobject[i][columnacc.view.tablename][columnacc.view.tablecolumn];
                columns.push(item);
            }
        }

        if (rowacc.accstyle == 'out') {
            for (var i = 0; i < rowacc.rowobject.length; i++) {
                //columnacc.rowobject
                var tpcreate = 1;
                for (j in opgrid) {

                    if (typeof (opgrid[j]) == "object") {
                        if (opgrid[j]._id == rowacc.rowobject[i][rowacc.index.tablename][rowacc.index.tablecolumn]) {
                            tpcreate = 0;
                        }
                    }

                }
                if (tpcreate == 1) {
                    opgrid[rowacc.rowobject[i][rowacc.index.tablename][rowacc.index.tablecolumn]] = new Object();
                    opgrid[rowacc.rowobject[i][rowacc.index.tablename][rowacc.index.tablecolumn]]._id = rowacc.rowobject[i][rowacc.index.tablename][rowacc.index.tablecolumn];
                    opgrid[rowacc.rowobject[i][rowacc.index.tablename][rowacc.index.tablecolumn]]._name = rowacc.rowobject[i][rowacc.view.tablename][rowacc.view.tablecolumn];
                }
            }
        }


        columns.sort(function (a, b) {
            return a._id > b._id ? 1 : -1;
        });

        for (var i = columns.length - 1; i > 0; i--) {
            if (columns[i]._id == columns[i - 1]._id) columns.splice(i, 1);
        }

        for (var i in opgrid) {
            var items = new Object();
            for (var j in columns)
                if (typeof (opgrid[i][columns[j]._id]) != "object") {
                    items[columns[j]._id] = undefined;
                }
                else {
                    items[columns[j]._id] = opgrid[i][columns[j]._id];
                }
            items._id = opgrid[i]._id;
            items._name = opgrid[i]._name;
            result.grid.push(items);
        }

        result._columns = columns;

        return result;
    },
    Table2Inner: function (datatable) {
        var arrays = new Array();
        arrays = this.Combine(arrays, datatable);
        return arrays;
    }
        ,
    GetFromJoin: function () {
        var rs = clone(arguments[0]);
        var para = arguments[1].split("=");
        var value = arguments[2];
        var opt = null;
        if (arguments.length > 3) opt = arguments[3];
        var p = para[0].split(".");
        var result = new Array();
        var item = new Object();
        item.table = p[0];
        item.field = p[1];


        switch (opt) {
            case null:
            case '=':
                for (var i in rs) {
                    if (rs[i][item.table][item.field] == value) result.push(rs[i]);

                }
                break;
            case '>':
                for (var i in rs) {
                    if (rs[i][item.table][item.field] > value) result.push(rs[i]);

                }
                break;
            case '<':
                for (var i in rs) {
                    if (rs[i][item.table][item.field] < value) result.push(rs[i]);

                }
                break;
            case '>=':
                for (var i in rs) {
                    if (rs[i][item.table][item.field] >= value) result.push(rs[i]);

                }
                break;
            case '<=':
                for (var i in rs) {
                    if (rs[i][item.table][item.field] <= value) result.push(rs[i]);

                }
                break;
            default:
                break;
        }
        return result;
    }
}