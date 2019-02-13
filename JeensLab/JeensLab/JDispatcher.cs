using System;
using System.Web;
using System.IO;
using System.Collections;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using System.Xml;
using System.Reflection;

namespace JeensLab
{
    public class JDispatcher 
    {
        protected JArray BeforeProcess=new JArray();
        protected JArray AfterProcess = new JArray();
        protected JPool jpool;

        protected void Initialize(HttpContext context)
        {
            jpool = new JPool();
            jpool.SetResource(context);
        }
        public void ProcessRequest(HttpContext context)
        {

            ////context.Session["JResource"] = jpool;
            context.Response.ContentType = "application/json";
            //context.Response.AddHeader("Access-Control-Allow-Origin", "*");
            if (BeforeProcess.Count > 0)
                jpool.InsertParameterBefore(BeforeProcess);
            if(AfterProcess.Count > 0)
                jpool.InsertParameterAfter(AfterProcess);
            if(jpool.Dothings())return;
            //JToken responseobj = jpool.Dothings();
            //byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(responseobj.ToString());
            //context.Response.OutputStream.Write(byteArray, 0, byteArray.Length);
        }


        public bool IsReusable
        {
            get
            {
                return true;
            }
        }

    }
}