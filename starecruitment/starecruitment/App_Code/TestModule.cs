using System;
using System.Web;
using BrahmaFramework.App_Code;
using System.IO;
using System.Collections;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using System.Xml;
using System.Reflection;
using JeensLab;

namespace BrahmaFramework.App_Code
{
    public class TestModule : IHttpModule, IRequiresSessionState
    {
        public void Dispose() { }
        public void Init(HttpApplication context)
        {
            context.AcquireRequestState += new EventHandler(context_PreRequestHandlerExecute);


        }
        void context_PreRequestHandlerExecute(object sender, EventArgs e)
        {

            //需要在
            HttpApplication ha = (HttpApplication)sender;
            HttpContext context = ha.Context;
            IHttpModule module = ha.Modules["Session"];
            SessionStateModule statemodule = (SessionStateModule)module;
            bool hassession = (context.Session != null) ;
            string filename = 
                context.Request.Url.Segments[context.Request.Url.Segments.Length - 1].ToString();
            string extension = System.IO.Path.GetExtension(filename);
            switch (extension)
            {
                case ".htm":
                case ".html":
                    if (filename!="signin.htm")
                    { 
                    JResource jr = new JResource();
                    dynamic parameters = new JObject();
                    parameters.keyword = "Authentication";
                    parameters.command = "authen";
                    parameters.funcid = context.Request.Url.Segments[context.Request.Url.Segments.Length - 1].ToString();
                    jr.SetResource(context, parameters);
                    dynamic respond = jr.Dothing();
                    if (respond.Result.result == false)
                        context.Response.Redirect("/html/" + (string)respond.Result.jump);
                        return;
                        //ha.Context.Response.Redirect("/js/jeens.config.js");
                    }
                    //context.Response.WriteFile(context.Server.MapPath("/html/" + filename));
                    break;
                case ".ico":
                    context.Response.WriteFile(context.Server.MapPath("/images/" + filename));
                    break;
                default:
                    break;
            }
        
    }
    }
}