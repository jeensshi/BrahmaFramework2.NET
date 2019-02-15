define(function() {
    //return an object to define the "my/shirt" module.

    function toolobject(resources,toolconfig){
            var newobject = new PIXI.Sprite(
                resources.toolbox.textures[toolconfig.textureid]
            );
            newobject._type='toolobject';
            return newobject;
    }
    function toolsconfig(cfg){
        this.offset=cfg.offset||{
            x:0,
            y:0
        };
        this.padding=cfg.padding||{
            top:0,
            left:0,
            right:0,
            bottom:0
        };
        this.tool=cfg.tool||{
            width:0,
            height:0
        };
        this.width=cfg.width||null;
        this.height=cfg.height||null;
        this.interactive = cfg.interactive||true;
        this.buttonMode = cfg.buttonMode||true;
        this.children = cfg.children||[];
    }
    toolsconfig.prototype={
        _type:'toolsconfig'
    }
    
    function toolbox(container,resources,cfg){
        var tc= new toolsconfig(cfg);
        var tmppos={
            x:tc.padding.left,
            y:tc.padding.top
        };
        if(tc._type==='toolsconfig'){
            var tools = tc.children;
            for(var i=0;i<tools.length;i++){
                var tool = toolobject(resources,tools[i]);
                tool.x=tmppos.x;
                tool.y=tmppos.y;
                tool.width=tc.tool.width;
                tool.height=tc.tool.height;
                tool.interactive = tc.interactive;
                tool.buttonMode =  tc.buttonMode;
                tool._t_gtype=tools[i];
                container.addChild(tool);

                tool.on('pointerover', function(ev){
                    var outlineFilter = new PIXI.filters.OutlineFilter(3, 0xfff49e);
                    this.filters = [outlineFilter];
                    var target = ev.target;
                    $('#tooltips').html(target._t_gtype.name);
                    $('#tooltips').css({ 'left': target.x + target.width, 'top': target.y+5 });
                    $('#tooltips').show();
                });
                tool.on('pointerout', function(){
                    this.filters = undefined;
                    $('#tooltips').hide();
                });
                tmppos.x+=tc.tool.width+tc.offset.x;
                if(tmppos.x>(tc.width-tc.padding.right-tc.tool.width))
                    tmppos.x=tc.padding.left,tmppos.y+=tc.tool.height+tc.offset.y;
            }
        }
    }
    function drawdash(x0,y0,x1,y1,linewidth){
        var dashed = new PIXI.Graphics();
            dashed.lineStyle(1, 0x59e3e8, 1);    // linewidth,color,alpha
            dashed.moveTo(0, 0);
            dashed.lineTo(linewidth,0);
            dashed.moveTo(linewidth*1.5,0);
            dashed.lineTo(linewidth*2.5,0);
        var dashedtexture = dashed.generateCanvasTexture(1,1);
        var linelength=Math.pow(Math.pow(x1-x0,2)  + Math.pow(y1-y0,2) , 0.5);
        var tilingSprite = new PIXI.extras.TilingSprite(
            dashedtexture, linelength, linewidth
        );
        tilingSprite.x=x0;
        tilingSprite.y=y0;
        tilingSprite.rotation = angle(x0,y0,x1,y1)*Math.PI/180;
        tilingSprite.pivot.set(linewidth/2, linewidth/2);
        tilingSprite._t_animation=function(delta){
            tilingSprite.tilePosition.x += 0.5*delta;
        };
        return tilingSprite;
        
        function angle(x0,y0,x1,y1){
            var diff_x = Math.abs(x1 - x0),
                diff_y = Math.abs(y1 - y0);
            var cita;
            
            if(x1>x0){
                if(y1>y0){
                    ///第一象限
                    cita= 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                }else
                {
                    if(y1<y0){  ///////第四象限
                        cita=-360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                    }else{  ////////////x1=x0  ，为0
                        cita=0;
                    }
                }
            }else
            {
                if(x1<x0){
                    if(y1>y0){
                        ////第二象限
                        cita=180-360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                    }else
                    {
                        if(y1<y0){   ////第三象限
                            cita=180+360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                        }else{  ////////////x1=x0 ,为180
                            cita=180;
                        }
                    } 
                }else{  ////////////x1=x0
                    
                    if(y1>y0){  ///为90
                        cita=90;
                    }else
                    {
                        if(y1<y0){  ///为-90
                            cita=-90;
                        }else{  ////////////x1=x0 ，同一个点，返回null
                            cita=0;
                        }
                    }
                }
            }
            
            
            return cita;
        }
    }
    
    function polyline(){
        var instance=new PIXI.Container();
        instance._t_points=[];
        instance._t_draw=function(points){
            this._t_points=points;
            instance.removeChildren();
            var linewidth=5;
            for(var i=1;i<points.length;i++){
                var tilingSprite = drawdash(points[i-1].x,points[i-1].y,points[i].x,points[i].y,linewidth);
                instance.addChild(tilingSprite);
            }
        };
        instance._t_animation=function(delta){
            for(var i=0;i<instance.children.length;i++){
                instance.children[i]._t_animation(delta);
            }
        };
        instance._type='polyline';
        return instance;
    }
    return {
        ToolBox:toolbox,
        DrawDash:drawdash,
        Polyline:polyline
    }
});