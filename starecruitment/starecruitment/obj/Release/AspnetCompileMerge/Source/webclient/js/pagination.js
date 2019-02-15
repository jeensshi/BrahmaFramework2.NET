function DHTMLpagenation(content) {
    // client static html file pagenation
    this.content=content;
    this.contentLength=content.length;
    this.pageSizeCount;
    this.perpageLength=100; //default perpage byte length.
    this.currentPage=1;
    //this.regularExp=/.+[\?\&]{1}page=(\d+)/;
    this.regularExp=/\d+/;
    this.divDisplayContent;
    this.contentStyle=null;
    this.strDisplayContent="";
    this.divDisplayPagenation;
    this.strDisplayPagenation="";

    arguments.length==2?perpageLength=arguments[1]:'';
    try {
        divExecuteTime=document.createElement("DIV");
        document.body.appendChild(divExecuteTime);
    }
    catch(e)
    {
    }
    if(document.getElementById("divContent"))
    {
        divDisplayContent=document.getElementById("divContent");
    }
    else
    {
        try
        {
            divDisplayContent=document.createElement("DIV");
            divDisplayContent.id="divContent";
            document.body.appendChild(divDisplayContent);
        }
        catch(e)
        {
            return false;
        }
    }
    if(document.getElementById("divPagenation"))
    {
        divDisplayPagenation=document.getElementById("divPagenation");
    }
    else
    {
        try
        {
            divDisplayPagenation=document.createElement("DIV");
            divDisplayPagenation.id="divPagenation";
            document.body.appendChild(divDisplayPagenation);
        }
        catch(e)
        {
            return false;
        }
    }
    DHTMLpagenation.initialize();
    return this;

};
DHTMLpagenation.initialize=function()
{
    divDisplayContent.className=contentStyle!=null?contentStyle:"divContent";
    if(contentLength<=perpageLength)
    {
        strDisplayContent=content;
        divDisplayContent.innerHTML=strDisplayContent;
        return null;
    }
    pageSizeCount=Math.ceil((contentLength/perpageLength));
    DHTMLpagenation.goto(currentPage);
    DHTMLpagenation.displayContent();
};
DHTMLpagenation.displayPage=function()
{
    strDisplayPagenation="";
    if(currentPage&&currentPage!=1)
        strDisplayPagenation+='<a href="javascript:void(0)" onclick="DHTMLpagenation.previous()">上一页</a>&nbsp;&nbsp;';
    else
        strDisplayPagenation+="上一页&nbsp;&nbsp;";
    for(var i=1;i<=pageSizeCount;i++)
    {
        if(i!=currentPage)
            strDisplayPagenation+='<a href="javascript:void(0)" onclick="DHTMLpagenation.goto('+i+');">'+i+'</a>&nbsp;&nbsp;';
        else
            strDisplayPagenation+=i+"&nbsp;&nbsp;";
    }
    if(currentPage&&currentPage!=pageSizeCount)
        strDisplayPagenation+='<a href="javascript:void(0)" onclick="DHTMLpagenation.next()">下一页</a>&nbsp;&nbsp;';
    else
        strDisplayPagenation+="下一页&nbsp;&nbsp;";
    //strDisplayPagenation+="共 " + pageSizeCount + " 页，每页" + perpageLength + " 字符，调整字符数：<input type='text' value='"+perpageLength+"' id='ctlPerpageLength'><input type='button' value='确定' onclick='DHTMLpagenation.change(document.getElementById(\"ctlPerpageLength\").value);'>";
    divDisplayPagenation.innerHTML=strDisplayPagenation;
};
DHTMLpagenation.previous=function()
{
    DHTMLpagenation.goto(currentPage-1);
};
DHTMLpagenation.next=function()
{
    DHTMLpagenation.goto(currentPage+1);
};
DHTMLpagenation.goto=function(iCurrentPage)
{
    startime=new Date();
    if(regularExp.test(iCurrentPage))
    {
        currentPage=iCurrentPage;
        strDisplayContent=content.substr((currentPage-1)*perpageLength,perpageLength);
    }
    else
    {
        alert("page parameter error!");
    }
    DHTMLpagenation.displayPage();
    DHTMLpagenation.displayContent();
};
DHTMLpagenation.displayContent=function()
{
    divDisplayContent.innerHTML=strDisplayContent;
};
DHTMLpagenation.change=function(iPerpageLength)
{
    if(regularExp.test(iPerpageLength))
    {
        DHTMLpagenation.perpageLength=iPerpageLength;
        DHTMLpagenation.currentPage=1;
        DHTMLpagenation.initialize();
    }
    else
    {
        alert("请输入数字");
    }
};
// method
// DHTMLpagenation(strContent,perpageLength)
if(document.getElementById('Content'))
DHTMLpagenation(document.getElementById('Content').innerHTML,800);
//-->