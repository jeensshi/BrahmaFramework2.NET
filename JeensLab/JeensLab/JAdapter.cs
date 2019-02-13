using Newtonsoft.Json.Linq;
using System.Xml;
using System;
using System.Reflection;
using System.DirectoryServices;
namespace JeensLab
{
    public class JAdapter
    {
        private JResource jresource;
        public JResource JRESOURCE{
            get { return jresource; }
            internal set { jresource = value; }
        }
        public JAdapter() { }
        public Object DealData()
        {
            //case SQL的方法
            //case 普通的方法
            string keyword = jresource.GetParameter("keyword").ToString();
            string command = jresource.GetParameter("command").ToString();
            XmlNode sqlmapping = jresource.GetMapping(keyword, command);
            //根据method 反射对应方法
            string method = sqlmapping.Attributes["method"].Value;
            Type type= GetType();
            MethodInfo methodInfo = type.GetMethod(method);
            Object json = methodInfo.Invoke(this, null);
            DirectoryEntry et;
            return json;
        }

    }
}