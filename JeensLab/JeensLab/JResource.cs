using Newtonsoft.Json.Linq;
using System.Web.Configuration;
using System.Web;
using System.Xml;
using System.IO;
using System.Reflection;
using System;
using System.Security.Cryptography;
using System.Text;

namespace JeensLab
{
    public class JResource
    {
        private HttpContext context;
        private JToken parameters;
        public bool SetResource(HttpContext context, JToken parameters)
        {
            this.context = context;
            this.parameters = parameters;
            return true;
        }
        public bool SetContext(HttpContext context)
        {
            this.context = context;
            return true;
        }
        public bool SetParameters(JToken parameters)
        {
            this.parameters = parameters;
            return true;
        }
        public bool SetParameter(string name,string value)
        {
            this.parameters[name] = value;
            return true;
        }
        public object GetParameter(string name)
        {
            object result;
            try {
                result = this.parameters[name];
            }
            catch (Exception)
            {
                result = null;
            }
            return result;
        }
        public XmlNode GetMappingList()
        { 
            return (XmlNode)context.Application["mapping.config"];
        }

        public XmlNode GetMapping(string keyword,string command)
        {
            return ((XmlNode)context.Application["mapping.config"]).SelectSingleNode("//sql-mapping[@command='" + command + "' and @table='" + keyword + "']");
        }
        public XmlNode GetUrlMapping(string url)
        {
            return ((XmlNode)context.Application["mapping.config"]).SelectSingleNode("//url-mapping[@url='" + url + "']");
        }
        public HttpContext GetContext()
        {
            return context;
        }
        public bool Reload()
        {
            string sURL = (string)context.Application["sUrl"];
            try { 
            using (FileStream fs = new FileStream(sURL, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(fs);
                doc.RemoveChild(doc.ChildNodes[0]);
                XmlNode xn = doc.ChildNodes[0];
                context.Application["mapping.config"] = xn;
                doc.RemoveChild(xn);
                //Application["Session"] = new System.Collections.ArrayList();
            }
            }catch(Exception e)
            {
                return false;
            }
            return true;
        }
        public bool SetSession(string name,object value)
        {
            context.Session.Add(name, value);
            return true;
        }
        public bool RemoveSession(string name)
        {
            context.Session.Remove(name);
            return true;
        }
        public bool ClearSession()
        {
            context.Session.Abandon();
            context.Response.Cookies.Add(new HttpCookie(((SessionStateSection)(WebConfigurationManager.GetSection("system.web/sessionState"))).CookieName, "Good Bye.") { HttpOnly = true });
            return true;
        }
        public object GetSession(string name)
        {
            if (context.Session == null)
                return null;
            else
            return context.Session[name];
        }
        public string GetAppSettings(string name)
        {
            return WebConfigurationManager.AppSettings[name];
        }
        public string GetConnectionString(string name)
        {
            return WebConfigurationManager.ConnectionStrings[name].ConnectionString;
        }
        public string GetConfig(string name)
        {
            XmlNode xn = ((XmlNode)context.Application["mapping.config"]).SelectSingleNode("//common/parameter[@name='" + name + "']");

            return xn.Attributes["value"].Value;
        }
        public JToken Dothing()
        {
            //string sURL = context.Server.MapPath("../dll/JeensLab.dll");
            Assembly asm = Assembly.Load(GetConfig("JAssembly"));
            Type type = asm.GetType(GetConfig("JAdpater"));
            object jadpater = asm.CreateInstance(GetConfig("JAdpater"));
            PropertyInfo JRESOURCE = type.GetProperty("JRESOURCE");
            JRESOURCE.SetValue(jadpater, this, null);
            //SetResource.Invoke(jadpater, new object[] { jresource });
            MethodInfo DealData = type.GetMethod("DealData");
            JToken rtresult = (JToken)DealData.Invoke(jadpater, null);
            return rtresult;

        }
        public string EncryptWithMD5(string source)
        {
            byte[] sor = Encoding.UTF8.GetBytes(source);
            MD5 md5 = MD5.Create();
            byte[] result = md5.ComputeHash(sor);
            StringBuilder strbul = new StringBuilder(40);
            for (int i = 0; i < result.Length; i++)
            {
                strbul.Append(result[i].ToString("x2"));//加密结果"x2"结果为32位,"x3"结果为48位,"x4"结果为64位

            }
            return strbul.ToString();
        }
        public bool SetVcode()
        {
            string vcode = GetVcode();
            SetSession("VCODE",vcode);
            return true;
        }
        public bool VerifyVcode()
        {
            if (GetSession("VCODE") == null) return false;
            string sessionvcode = GetSession("VCODE").ToString();
            string vcode = GetVcode();
            if (vcode == sessionvcode)
                return true;
            else
                return false;
        }
        public string GetVcode()
        {
            string vcode = "";
            vcode= EncryptWithMD5(context.Request.ServerVariables["REMOTE_ADDR"] == null ? "" : context.Request.ServerVariables["REMOTE_ADDR"]);
            vcode += EncryptWithMD5(context.Request.ServerVariables["HTTP_VIA"] == null ? "" : context.Request.ServerVariables["HTTP_VIA"]);
            vcode += EncryptWithMD5(context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null ? "" : context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"]);
            vcode += EncryptWithMD5(context.Request.ServerVariables["HTTP_CLIENT_IP"] == null ? "" : context.Request.ServerVariables["HTTP_CLIENT_IP"]);
            vcode += EncryptWithMD5(context.Request.UserHostAddress == null ? "" : context.Request.UserHostAddress);
            return vcode;
        }
    }
}