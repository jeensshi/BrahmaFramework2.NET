(function() {
    function CacheCell() {
        this.cellid = guid();
        this.parents = new Array();
        this.children = new Array();
        this.valid = false;
        this.cache = true;
        this.files = new Array();
        this.updatedata = function() {
            for (var i in this.parameters) {
                if (typeof(this.parameters[i]) == "undefined") {
                    alert('no data');
                    return
                };
                JSONREQUEST.insertkey(i, this.parameters[i]);
            }
            JSONREQUEST.insertkey('cellid', this.cellid);
            JSONREQUEST.confirminsert();
        };
        this.updatetime;
        this.parameters;
        this.data;
        this.interval = CACHEINTERVAL;

    }
    CacheCell.prototype = {
		setInterval:function(){
			//unit: second
			if(arguments.length>0)
				try{
					var p=Number(arguments[0]);
					this.interval = p;
				}catch(e){
					console.log('set cachecell interval error!');
				}
		},
        validate: function() {
            if (this.validateDate() == false)
                this.valid = false;
            //如果参与过update，del，insert的操作，则valid=false
            this.validateChildren();
            this.validateParents();
        },
        validateSon: function() {
            children = arguments[0];
            for (child in children)
                if (child.valid == false) {
                    this.valid = false;
                    return;
                }
        },
        validateChildren: function() {
            invalidchildren = this.scanvalidChildren(this, false);
            if (invalidchildren.length > 0) {
                this.valid = false;
            }
        },
        validateParents: function() {
            invalidparents = this.scanParents(this, true);
            for (var i in invalidparents) {
                invalidparents[i].valid = false;
            }
        },
        //递归局部变量必须用var关键字声明，不能省略var关键字，不然会引起变量赋值混乱
        scanvalidChildren: function() {
            var me = arguments[0];
            var valid = arguments[1];
            var children = me.getChildren();
            var result = new Array();
            if (valid == false) {
                if (children.length > 0) {
                    for (var i in children) {
                        var childresult = this.scanvalidChildren(children[i], valid);
                        if (childresult.length > 0) {
                            for (var j in childresult)
                                result.push(childresult[j]);
                            me.valid = valid;
                        }
                    }
                }
                if (me.valid == valid && me != this) result.push(me);
            } else {
                if (children.length > 0) {
                    for (var i in children) {
                        var childresult = this.scanvalidChildren(children[i], valid);
                        for (var j in childresult)
                            result.push(childresult[j]);
                    }
                }
                if (me.valid == valid && me != this) result.push(me);
            }
            return result;
        },
        scanParents: function() {
            var me = arguments[0];
            var parents = me.getParents();
            var result = new Array();
            if (me != this) result.push(me);
            if (parents.length > 0) {
                for (var i in parents) {
                    var parentresult = this.scanParents(parents[i]);
                    for (var j in parentresult)
                        result.push(parentresult[j]);
                }
            }
            return result;
        },
        validateDate: function() {
            oldtime = this.updatetime;
            now = new Date().getTime();
            if ((now - oldtime) > this.interval * 1000) return false;
            else
                return true;
        },
        calculate: function() {
            if (this.valid == false) {
                this.updatedata();
                this.updatetime = new Date().getTime();
                if (this.cache == true) this.valid = true;
            }
        },
        getParents: function() {
            return this.parents;
        },
        getChildren: function() {
            return this.children;
        },
        delParentRelation: function() {
            if (arguments.length < 1) return;
            parent = arguments[0];

            return true;
        },
        delChildRelation: function() {
            if (arguments.length < 1) return;
            parent = arguments[0];

            return true;
        },
        addParentRelation: function() {
            if (arguments.length < 1) return false;
            parent = arguments[0];
            this.parents.push(parent);
            return true;
        },
        addChildRelation: function() {
            if (arguments.length < 1) return false;
            child = arguments[0];
            this.children.push(child);
            return true;
        },
        relateParent: function() {
            if (arguments.length < 1) return;
            parent = arguments[0];
            parent.addChildRelation(this);
            this.addParentRelation(parent);
            return true;
        },
        relateChild: function() {
            if (arguments.length < 1) return;
            child = arguments[0];
            child.addParentRelation(this);
            this.addChildRelation(child);
            return true;
        },
        copyValue: function() {
            var obj = arguments[0];
            this.cellid = obj.cellid;
            //this.parents = new Array();
            //this.children = new Array();
            this.valid = obj.valid;
            this.updatetime = obj.updatetime;
            this.parameters = obj.parameters;
            this.data = obj.data;
        }
    }


    function CachePool() {
        this.pool = new Array();
        this.tempparameters = new Object();
        this.temppool = new Array();
        this.files = new Array();
        this.updatedata = function() {};
        this.needserialize = false;
        this.url = '';
        this.currentstatus = true;
    }

    CachePool.prototype = {
        relyon: function() {
            keyword = arguments[0];
            for (var i in this.pool) {
                if (this.pool[i].parameters['keyword'] == keyword) this.pool[i].valid = false;
            }
            return true;
        },
        insertkey: function() {
            var key = arguments[0];
            var value = arguments[1];
            if (typeof (value) == 'string')
                this.tempparameters[key] = value;
            else {
                if (this.files.length == 0)
                    this.tempparameters[key] = this.files.length;
                else
                    this.tempparameters[key] += ',' + this.files.length;
                this.files.push(value);
            }
        },
        compare: function() {
            var newcell = arguments[0];
            for (var i in this.pool)
                if (this.equalcache(this.pool[i].parameters, newcell.parameters)) {
                    return this.pool[i];
                }
            this.pool.push(newcell);
            return newcell;
        },
        comparenocache: function() {
            var newcell = arguments[0];
            for (var i in this.pool)
                if (this.equalcache(this.pool[i].parameters, newcell.parameters)) {
                    newcell = this.pool[i];
                    localStorage.removeItem(this.pool[i].cellid);
                    this.pool.splice(i, 1);
                    this.needserialize = true;
                    this.temppool.push(newcell);
                    newcell.cache = false;
                    return newcell;
                }
            this.temppool.push(newcell);
            newcell.cache = false;
            return newcell;
        },
        cachecommand: function() {
            var newcell = new CacheCell();
            newcell.parameters = this.tempparameters;
            this.tempparameters = new Object();
            newcell = this.compare(newcell);
            newcell.validate();
            return newcell;
        },
        nocachecommand: function() {
            var newcell = new CacheCell();
            newcell.parameters = this.tempparameters;
            this.tempparameters = new Object();
            newcell = this.comparenocache(newcell);
            //newcell.validate();

            return newcell;
        },
        calculate: function() {
            //1.验证所有需求数据的节点是否需要更新数据
            var thisarguments = arguments;
            var thisobject = this;
            for (var i = 0; i < this.temppool.length; i++) {
                var newcell = this.temppool[i];
                //this.tempparameters = new Object();
                newcell.calculate();

            }
            for (var i = 0; i < this.pool.length; i++) {
                var newcell = this.pool[i];
                //this.tempparameters = new Object();
                newcell.calculate();

            }
            JSONREQUEST.attachfiles(this.files);
            //从请求数据集中获得相应数据

            if (JSONREQUEST.condition.length > 0) {
                JSONREQUEST.GetData(_url
                    ,
                    function() {
                        var cellrequestresult = JSONREQUEST.GetReturnObject();
                        /////////auth part
                        if (cellrequestresult.Result && cellrequestresult.Result.result == false) {


                            for (var i = 0; i < thisobject.pool.length; i++) {
                                var clid = thisobject.pool[i].cellid;
                                if (typeof (cellrequestresult[clid]) != "undefined") thisobject.pool[i].data = null;
                            }
                            for (var i = 0; i < thisobject.temppool.length; i++) {
                                var clid = thisobject.temppool[i].cellid;
                                if (typeof (cellrequestresult[clid]) != "undefined") thisobject.temppool[i].data = null;
                            }
                            thisobject.currentstatus = false;
                        }else{
                            /////////
                            for (var i = 0; i < thisobject.pool.length; i++) {
                                var clid = thisobject.pool[i].cellid;
                                if (typeof(cellrequestresult[clid]) != "undefined") thisobject.pool[i].data = cellrequestresult[clid];
                            }
                            for (var i = 0; i < thisobject.temppool.length; i++) {
                                var clid = thisobject.temppool[i].cellid;
                                if (typeof(cellrequestresult[clid]) != "undefined") thisobject.temppool[i].data = cellrequestresult[clid];
                            }

                            thisobject.currentstatus = true;
                        }
                        thisobject.needserialize = true;
                        if (thisobject.needserialize == true) {
                            thisobject.serialize();
                            thisobject.needserialize = false;
                        }
                        thisobject.temppool = new Array();
                        for (var i = 0; i < thisarguments.length; i++) {
                            if (typeof(thisarguments[i]) == "function") thisarguments[i]();
                        }
                    }
                );
            } else {
                thisobject.currentstatus = true;
                for (var i = 0; i < thisarguments.length; i++) {
                    if (typeof(thisarguments[i]) == "function") thisarguments[i]();
                }
            }
            this.files = new Array();
            
        },
        
        calculatenoimg: function() {
            //1.验证所有需求数据的节点是否需要更新数据
            var thisarguments = arguments;
            var thisobject = this;
            for (var i = 0; i < this.temppool.length; i++) {
                var newcell = this.temppool[i];
                //this.tempparameters = new Object();
                newcell.calculate();

            }
            for (var i = 0; i < this.pool.length; i++) {
                var newcell = this.pool[i];
                //this.tempparameters = new Object();
                newcell.calculate();

            }
            //从请求数据集中获得相应数据

            if (JSONREQUEST.condition.length > 0) {
                JSONREQUEST.GetDatanoimg(_url
                    ,
                    function() {
                        var cellrequestresult = JSONREQUEST.GetReturnObject();
                        /////////auth part
                        if (cellrequestresult.Result && cellrequestresult.Result.result == false) {


                            for (var i = 0; i < thisobject.pool.length; i++) {
                                var clid = thisobject.pool[i].cellid;
                                if (typeof (cellrequestresult[clid]) != "undefined") thisobject.pool[i].data = null;
                            }
                            for (var i = 0; i < thisobject.temppool.length; i++) {
                                var clid = thisobject.temppool[i].cellid;
                                if (typeof (cellrequestresult[clid]) != "undefined") thisobject.temppool[i].data = null;
                            }
                            thisobject.currentstatus = false;
                        }else{
                            /////////
                            for (var i = 0; i < thisobject.pool.length; i++) {
                                var clid = thisobject.pool[i].cellid;
                                if (typeof(cellrequestresult[clid]) != "undefined") thisobject.pool[i].data = cellrequestresult[clid];
                            }
                            for (var i = 0; i < thisobject.temppool.length; i++) {
                                var clid = thisobject.temppool[i].cellid;
                                if (typeof(cellrequestresult[clid]) != "undefined") thisobject.temppool[i].data = cellrequestresult[clid];
                            }

                            thisobject.currentstatus = true;
                        }
                        thisobject.needserialize = true;
                        if (thisobject.needserialize == true) {
                            thisobject.serialize();
                            thisobject.needserialize = false;
                        }
                        thisobject.temppool = new Array();
                        for (var i = 0; i < thisarguments.length; i++) {
                            if (typeof(thisarguments[i]) == "function") thisarguments[i]();
                        }
                    }
                );
            } else {
                thisobject.currentstatus = true;
                for (var i = 0; i < thisarguments.length; i++) {
                    if (typeof(thisarguments[i]) == "function") thisarguments[i]();
                }
            }
            
            this.files = new Array();
            
        },
        equalcache: function(objA, objB) {
            var c = clone(objA);
            var d = clone(objB);
            if (typeof(c) == "undefined") return false;
            for (var i in d) {
                if (typeof(c[i]) == "undefined" || c[i] != d[i]) return false;

            }
            for (var j in c) {
                if (typeof(d[j]) == "undefined" || c[j] != d[j]) return false;
            }
            return true;
        },

        serialize: function() {
            var p = new Array();
            for (var i = 0; i < this.pool.length; i++) {
                localStorage[this.pool[i].cellid] = JSON.stringify(this.pool[i]);
                p.push(this.pool[i].cellid);
            }
            localStorage.jcachepool = JSON.stringify(p);
        },
        deserialize: function() {
            var lscp = localStorage.jcachepool;
            if (typeof(lscp) != "undefined" && lscp != "") {
                lscp = JSON.parse(localStorage.jcachepool);
                for (var i = 0; i < lscp.length; i++) {
                    if (lscp[i] == null) continue;
                    var tempcc = new CacheCell();
                    var obj = JSON.parse(localStorage[lscp[i]]);
                    tempcc.copyValue(obj);
                    this.pool.push(tempcc);
                }
            }
        },
        clear: function() {
            localStorage.jcachepool = "";
        }
    }
    var CACHEINTERVAL = 5;
    var CACHEPOOL;
    window.CACHEPOOL = CACHEPOOL = new CachePool();
    CACHEPOOL.deserialize();
    //window.CACHEPOOL.url=CACHEPOOL.url="http://localhost:8080/zjdproject/calop/DealData.ashx";
})();