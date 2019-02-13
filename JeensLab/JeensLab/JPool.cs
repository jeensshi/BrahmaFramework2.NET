using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Web;
using System.Xml;
using System.IO;
using System;
using System.Reflection;
using System.Text;

namespace JeensLab
{
    public class JPool
    {
        private HttpContext context;
        private JArray paralist;
        public bool SetResource(HttpContext context)
        {
            string littleone="";
            StreamReader reader;
            try { 
                switch (context.Request.Headers["Brahma_Socket"])
                {
                    case "Socket124":
                        reader = new StreamReader(context.Request.InputStream);
                        littleone = HttpUtility.UrlDecode(reader.ReadToEnd());
                        break;
                    case "Socket124+":
                        littleone = HttpUtility.UrlDecode(context.Request.Form["data"]);
                        break;
                    default:
                        reader = new StreamReader(context.Request.InputStream);
                        littleone = HttpUtility.UrlDecode(reader.ReadToEnd());
                        break;
                }
            }catch(Exception e)
            {
                //兼容老接口
                reader = new StreamReader(context.Request.InputStream);
                littleone = HttpUtility.UrlDecode(reader.ReadToEnd());
            }
            try
            {
                paralist = JArray.Parse(littleone);
            }
            catch
            {
                paralist = new JArray();
            }
            this.context = context;
            return true;
        }
        public string TransferEncoding(Encoding srcEncoding, Encoding dstEncoding, string srcStr)
        {
            byte[] srcBytes = srcEncoding.GetBytes(srcStr);
            byte[] bytes = Encoding.Convert(srcEncoding, dstEncoding, srcBytes);
            return dstEncoding.GetString(bytes);
        }
        public bool Dothings()
        {
            dynamic responseobj = new JObject();
            foreach (JToken parameters in paralist)
            {
                try
                {
                    Object rtresult = Dothing(parameters);
                    if (parameters["datatype"] != null && parameters["datatype"].ToString() == "File")
                    {


                        HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + TransferEncoding(Encoding.Default, Encoding.GetEncoding("GB2312"), ((JIO)rtresult).filename));
                        HttpContext.Current.Response.Charset = "UTF-8";
                        HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
                        HttpContext.Current.Response.ContentType = "application/octet-stream";
                        context.Response.OutputStream.Write(((MemoryStream)(((JIO)rtresult).Out)).GetBuffer(), 0, (int)((MemoryStream)(((JIO)rtresult).Out)).Position);
                        return true;
                    }
                    else
                    {
                        string keyword = "";
                        if (parameters["cellid"] != null)
                            keyword = parameters["cellid"].ToString();
                        else
                            keyword = parameters["keyword"].ToString();
                        responseobj[keyword] = (JToken)rtresult;

                    }

                }
                catch (Exception) { }
            }
            byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(responseobj.ToString());
            context.Response.OutputStream.Write(byteArray, 0, byteArray.Length);
            return true;
        }
        private Object Dothing(JToken parameters)
        {
            JResource jresource = new JResource();
            jresource.SetResource(context, parameters);
            //string sURL = context.Server.MapPath("../dll/JeensLab.dll");
            Assembly asm = Assembly.Load(jresource.GetConfig("JAssembly"));
            Type type = asm.GetType(jresource.GetConfig("JAdpater"));
            object jadpater = asm.CreateInstance(jresource.GetConfig("JAdpater"));
            PropertyInfo JRESOURCE = type.GetProperty("JRESOURCE");
            JRESOURCE.SetValue(jadpater, jresource, null);
            //SetResource.Invoke(jadpater, new object[] { jresource });
            MethodInfo DealData = type.GetMethod("DealData");
            Object rtresult = DealData.Invoke(jadpater, null);
            return rtresult;

        }

        public JArray GetParaList()
        {
            return paralist;
        }
        public XmlNode GetMappingList()
        {
            return (XmlNode)context.Application["mapping.config"];
        }

        public HttpContext GetContext()
        {
            return context;
        }
        public bool SetSession(string name, object value)
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
            return true;
        }
        public object GetSession(string name)
        {
            return context.Session[name];
        }
        public string GetAppSettings(string name)
        {
            return ConfigurationManager.AppSettings[name];
        }
        public string GetConnectionString(string name)
        {
            return ConfigurationManager.ConnectionStrings[name].ConnectionString;
        }
        public string GetConfig(string name)
        {
            XmlNode xn = ((XmlNode)context.Application["mapping.config"]).SelectSingleNode("//common/parameter[@name='" + name + "']");

            return xn.Attributes["value"].Value;
        }
        public bool InsertParameterBefore(JArray array)
        {
            foreach (JToken parameters in paralist)
            {
                array.AddFirst(parameters);
            }
            paralist = array;
            return true;
        }
        public bool InsertParameterAfter(JArray array)
        {
            foreach (JToken parameters in array)
            {
                paralist.AddFirst(parameters);
            }
            return true;
        }
        public bool Reload()
        {
            string sURL = (string)context.Application["sUrl"];
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
            return true;
        }
    }
}