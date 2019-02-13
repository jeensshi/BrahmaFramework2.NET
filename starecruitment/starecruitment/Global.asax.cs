using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Xml;
using System.IO;
using starecruitment.App_Code;
using System.Configuration;
using System.Collections;
using Microsoft.AspNet.SignalR;
using System.Web.Routing;

namespace starecruitment
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            /****************************************************************************************************/
            string sURL = Server.MapPath(ConfigurationManager.AppSettings["mapping.config"]);
            Application["sUrl"] = sURL;
            using (FileStream fs = new FileStream(sURL, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(fs);
                doc.RemoveChild(doc.ChildNodes[0]);
                XmlNode xn = doc.ChildNodes[0];
                Application["mapping.config"] = xn;
                doc.RemoveChild(xn);
                //Application["Session"] = new System.Collections.ArrayList();
            }

        }

        protected void Session_Start(object sender, EventArgs e)
        {
             
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {
        
        }

        protected void Session_End(object sender, EventArgs e)
        {
            //Session.Abandon();
        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}