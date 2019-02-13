using aliyun_api_gateway_sdk.Constant;
using aliyun_api_gateway_sdk.Util;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace aliyun_api_gateway_sdk_ext.Sign
{
    /// <summary>
    /// getIOT 的摘要说明
    /// </summary>
    public class getIOT
    {
        private const String appKey = "25449808";
        private const String appSecret = "e0cb440ab0ff871db283bda8ecf7829e";
        private const String host = "http://api.link.aliyun.com";
        public string GetAll(string path, string bobyContent)
        {
            Dictionary<String, String> headers = new Dictionary<string, string>();
            Dictionary<String, String> querys = new Dictionary<string, string>();
            Dictionary<String, String> bodys = new Dictionary<string, string>();
            List<String> signHeader = new List<String>();
            headers.Add(HttpHeader.HTTP_HEADER_CONTENT_TYPE, ContentType.CONTENT_TYPE_JSON);
            headers.Add(HttpHeader.HTTP_HEADER_ACCEPT, ContentType.CONTENT_TYPE_JSON);
            headers.Add(HttpHeader.HTTP_HEADER_CONTENT_MD5, MessageDigestUtil.Base64AndMD5(Encoding.UTF8.GetBytes(bobyContent)));
            bodys.Add("", bobyContent);
            signHeader.Add(SystemHeader.X_CA_TIMESTAMP);
            using (HttpWebResponse response = HttpUtil.HttpPost(host, path, appKey, appSecret, 30000, headers, querys, bodys, signHeader))
            {
                Stream st = response.GetResponseStream();
                StreamReader reader = new StreamReader(st, Encoding.GetEncoding("utf-8"));
                String json = reader.ReadToEnd();
                return json;
            }
        }
    }
}