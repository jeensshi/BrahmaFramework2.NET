using System;
using System.Web;
using starecruitment.App_Code;
using System.IO;
using System.Collections;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using System.Xml;
using System.Reflection;
using JeensLab;
namespace starecruitment.calop
{
    /// <summary>
    /// GetDataList 的摘要说明
    /// 基于JsonRequest2.0 Jquery版
    /// </summary>
    public class DealData : JDispatcher, IHttpHandler, IRequiresSessionState
    {
        /***************************************************************/
        public void ProcessRequest(HttpContext context)
        {


            /*******权限控制****************************************************
            JArray p = new JArray();
            dynamic jo = new JObject();
            jo.keyword = "Authentication";
            jo.command = "authen";
            jo.funcid = context.Request.UrlReferrer.Segments[context.Request.UrlReferrer.Segments.Length-1].ToString();
            p.Add(jo);
            BeforeProcess = p;
            
            /*******************************************************************/
            Initialize(context);
            if(Authen(context))
            base.ProcessRequest(context);
        }
        /***************************************************************/

        private bool Authen(HttpContext context)
        {

            JArray paralist = jpool.GetParaList();
            foreach (JToken parameters in paralist)
            {
                try
                {
                    string keyword = "";
                    keyword = parameters["keyword"].ToString();
                    string command = parameters["command"].ToString();


                    JResource jr = new JResource();
                    jr.SetResource(context, parameters);
                    XmlNode xn = jr.GetMapping(keyword, command);
                    string fncode = "*";
                    bool funcauth = false;
                    if (xn.Attributes["fncode"] != null)
                        fncode = xn.Attributes["fncode"].Value;
                    if (jr.GetConfig("FUNCAUTH") != null)
                        funcauth = Convert.ToBoolean(jr.GetConfig("FUNCAUTH"));
                    if (fncode == "*"|| funcauth == false)
                    {
                        ;
                    }
                    else
                    {
                        if (jr.GetSession("accountid") == null)
                        {
                            jr.ClearSession();
                            //if (jr.GetConfig("NOSESSION") != null) context.Response.Redirect("/webclient/html/" + jr.GetConfig("NOSESSION"));

                            dynamic responseobj = new JObject();
                            dynamic obj = new JObject();
                            obj.Result = new JObject();
                            obj.Result.result = false;
                            obj.Result.text = "Not Logged On";
                            obj.Result.errorcode="0x000001";

                            responseobj = obj;
                            byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(responseobj.ToString());
                            context.Response.ContentType = "application/json";
                            //context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                            context.Response.OutputStream.Write(byteArray, 0, byteArray.Length);
                            return false;
                        }
                        else
                        {
                            if (jr.VerifyVcode())
                            {
                                JResource authenjr = new JResource();
                                dynamic authenparameters = new JObject();
                                authenparameters.keyword = "PageAuth";
                                authenparameters.command = "authen";
                                authenparameters.fncode = fncode;
                                authenjr.SetResource(context,authenparameters);
                                dynamic authenrespond = authenjr.Dothing();
                                if (authenrespond.Result.result == true)
                                {                                

                                }
                                else
                                {
                                    dynamic responseobj = new JObject();
                                    dynamic obj = new JObject();
                                    obj.Result = new JObject();
                                    obj.Result.result = false;
                                    obj.Result.text = "Permission Denied";
                                    obj.Result.errorcode = "0x000002";
                                    responseobj = obj;
                                    byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(responseobj.ToString());
                                    context.Response.ContentType = "application/json";
                                    //context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                                    context.Response.OutputStream.Write(byteArray, 0, byteArray.Length);
                                    return false;
                                }
                            }
                            else
                            {
                                jr.ClearSession();
                                //if (jr.GetConfig("NOSESSION") != null) context.Response.Redirect("/webclient/html/" + jr.GetConfig("NOSESSION"));
                                dynamic responseobj = new JObject();
                                dynamic obj = new JObject();
                                obj.Result = new JObject();
                                obj.Result.result = false;
                                obj.Result.text = "Access Volation";
                                obj.Result.errorcode = "0x000003";
                                if (Convert.ToBoolean(jr.GetConfig("DEBUG")))
                                {
                                    obj.Result["VCODE"] = jr.GetSession("VCODE").ToString();
                                    obj.Result["REMOTE_ADDR"] = jr.GetContext().Request.ServerVariables["REMOTE_ADDR"] == null ? "" : jr.GetContext().Request.ServerVariables["REMOTE_ADDR"];
                                    obj.Result["HTTP_VIA"] = jr.GetContext().Request.ServerVariables["HTTP_VIA"] == null ? "" : jr.GetContext().Request.ServerVariables["HTTP_VIA"];
                                    obj.Result["HTTP_X_FORWARDED_FOR"] = jr.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null ? "" : jr.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                                    obj.Result["HTTP_CLIENT_IP"] = jr.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"] == null ? "" : jr.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"];
                                    obj.Result["UserHostAddress"] = jr.GetContext().Request.UserHostAddress == null ? "" : jr.GetContext().Request.UserHostAddress;
                                }
                                responseobj = obj;
                                byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(responseobj.ToString());
                                context.Response.ContentType = "application/json";
                                //context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                                context.Response.OutputStream.Write(byteArray, 0, byteArray.Length);
                                return false;
                            }
                        }
                    }


                }
                catch (Exception) { }
            }
            return true;
        }
    }
}