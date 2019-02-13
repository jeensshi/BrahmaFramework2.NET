using aliyun_api_gateway_sdk.Util;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace aliyun_api_gateway_sdk_ext.Sign
{
    public class isSign
    {
        private const String appKey = "25449808";
        private const String appSecret = "e0cb440ab0ff871db283bda8ecf7829e";

        public static bool Sign(System.Web.HttpContext context)
        {

            Dictionary<String, String> headers = new Dictionary<string, string>();
            Dictionary<String, String> querys = new Dictionary<string, string>();
            Dictionary<String, String> bodys = new Dictionary<string, string>();
            List<String> signHeader = new List<String>();
            string returnstr = "false";
            string signH = context.Request.Headers["X-Ca-Signature-Headers"];
            string path = context.Request.Path;
            string method = context.Request.HttpMethod;
            string host = context.Request.Headers["Host"];
            string Signature = context.Request.Headers["X-Ca-Signature"];
            HttpRequest request = context.Request;
            Stream stream = request.InputStream;
            string json = string.Empty;
            string responseJson = string.Empty;
            if (stream.Length != 0)
            {
                StreamReader streamReader = new StreamReader(stream);
                json = streamReader.ReadToEnd();
            }
            //bodys.Add("", HttpUtility.UrlDecode(json));
            foreach (string key in request.Form)
            {
                bodys.Add(key, request.Form[key]);
            }
            //headers.Add(HttpHeader.HTTP_HEADER_CONTENT_TYPE, context.Request.Headers[HttpHeader.HTTP_HEADER_CONTENT_TYPE]);
            ////设定Accept，根据服务器端接受的值来设置
            //headers.Add(HttpHeader.HTTP_HEADER_ACCEPT, context.Request.Headers[HttpHeader.HTTP_HEADER_ACCEPT]);
            ////注意：如果有非Form形式数据(body中只有value，没有key)；如果body中是key/value形式数据，不要指定此行
            //headers.Add(HttpHeader.HTTP_HEADER_CONTENT_MD5, context.Request.Headers[HttpHeader.HTTP_HEADER_CONTENT_MD5]);
            //signHeader.Add(SystemHeader.X_CA_TIMESTAMP);
            foreach (String key in context.Request.Headers)
            {
                if (key != "X-Ca-Signature-Headers" && key != "X-Natapp-Ip" && key != "X-Real-Ip" && key != "Host" && key != "Connection" && key != "Content-Length" && key != "X-Ca-Signature")
                {
                    headers.Add(key, context.Request.Headers[key]);
                }
                //signHeader.Add(key);
            }
            if (signH != null)
            {
                foreach (String key in signH.Split(','))
                {

                    //headers.Add(key,context.Request.Headers[key]);
                    signHeader.Add(key);

                }
            }
            foreach (String key in context.Request.QueryString)
            {

                querys.Add(key, context.Request.QueryString[key]);

            }


            string Signature_now = SignUtil.Sign(path, method, appSecret, headers, querys, bodys, signHeader);
            if (Signature_now == Signature)
            {
                return true;
            }
            return false;
        }
    }
}