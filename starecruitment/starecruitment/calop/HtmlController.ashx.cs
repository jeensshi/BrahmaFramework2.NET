
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using JeensLab;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System;
using System.Text;
using System.IO;
using NPOI.HSSF.UserModel;
using NPOI.HPSF;
using NPOI.POIFS.FileSystem;
using NPOI.SS.UserModel;

namespace starecruitment.calop
{
    /// <summary>
    /// GetDataList 的摘要说明
    /// 基于JsonRequest2.0 Jquery版
    /// </summary>
    public class HtmlController : JDispatcher, IHttpHandler, IRequiresSessionState
    {
        /***************************************************************/
        public void ProcessRequest(HttpContext context)
        {

            //string Sql = "select * from Post";
            //JExcel.ExceltoResponse(Sql, context,"数据报表");
            //return;
            //getexcel(Sql, context);

            /*******权限控制****************************************************/
            string filename =
                context.Request.Url.AbsolutePath.ToString();
            // context.Request.Url.Segments[context.Request.Url.Segments.Length - 1].ToString();
            //string loginpage = "test.htm";
            JResource jr = new JResource();
            jr.SetContext(context);
            string webroot = jr.GetConfig("WEBROOT");
            filename = filename.Substring(filename.IndexOf(webroot) + webroot.Length);

            string fncode = "";
            bool pageauth = false;
            if (jr.GetConfig("PAGEAUTH") != null)
                pageauth = Convert.ToBoolean(jr.GetConfig("PAGEAUTH"));
            if (pageauth == true)
            {
                if (jr.GetUrlMapping(filename) != null)
                {
                    fncode = jr.GetUrlMapping(filename).Attributes["fncode"].Value;
                    if (fncode == "*")
                    {
                        //jr.ClearSession();
                        context.Response.WriteFile(context.Server.MapPath(webroot + filename));
                        //context.Response.Redirect("/webclient/html/" + filename);
                    }
                    else
                    {
                        if (jr.GetConfig("OPENAM") != null && Convert.ToBoolean(jr.GetConfig("OPENAM")))
                        {
                            //openam验证开始////////////////////////////////////
                            dynamic openampara = new JObject();
                            openampara.keyword = "OpenAM";
                            openampara.command = "openamauthen";
                            jr.SetParameters(openampara);
                            dynamic openam = jr.Dothing();
                            if (openam.Result.result == true)
                            {
                                if (jr.GetSession("accountid") == null)
                                {
                                    jr.ClearSession();

                                    //登出openam
                                    dynamic logoutpara = new JObject();
                                    logoutpara.keyword = "OpenAM";
                                    logoutpara.command = "openamlogout";
                                    jr.SetParameters(logoutpara);
                                    dynamic openamlogout = jr.Dothing();
                                    ////////////
                                    if (jr.GetConfig("NOSESSION") != null) context.Response.Redirect(webroot + jr.GetConfig("NOSESSION"));
                                }
                                else
                                {
                                    if (jr.VerifyVcode())
                                    {
                                        dynamic parameters = new JObject();
                                        parameters.keyword = "PageAuth";
                                        parameters.command = "authen";
                                        parameters.fncode = fncode;
                                        jr.SetParameters(parameters);
                                        dynamic respond = jr.Dothing();
                                        if (respond.Result.result == true)
                                        {

                                            context.Response.WriteFile(context.Server.MapPath(webroot + filename));
                                            //return;
                                        }
                                        else
                                        {
                                            if (jr.GetConfig("NOAUTH") != null) context.Response.Redirect(webroot + jr.GetConfig("NOAUTH"));
                                        }
                                    }
                                    else
                                    {
                                        jr.ClearSession();
                                        //登出openam
                                        dynamic logoutpara = new JObject();
                                        logoutpara.keyword = "OpenAM";
                                        logoutpara.command = "openamlogout";
                                        jr.SetParameters(logoutpara);
                                        dynamic openamlogout = jr.Dothing();
                                        ////////////
                                        if (jr.GetConfig("ILLEGAL") != null) context.Response.Redirect(webroot + jr.GetConfig("ILLEGAL"));
                                    }
                                }
                            }
                            else
                            {
                                jr.ClearSession();
                                if (jr.GetConfig("NOSESSION") != null) context.Response.Redirect(webroot + jr.GetConfig("NOSESSION"));
                            }
                        }
                        else
                        {
                            if (jr.GetSession("accountid") == null)
                            {
                                jr.ClearSession();
                                if (jr.GetConfig("NOSESSION") != null) context.Response.Redirect(webroot + jr.GetConfig("NOSESSION"));
                            }
                            else
                            {
                                if (jr.VerifyVcode())
                                {
                                    dynamic parameters = new JObject();
                                    parameters.keyword = "PageAuth";
                                    parameters.command = "authen";
                                    parameters.fncode = fncode;
                                    jr.SetParameters(parameters);
                                    dynamic respond = jr.Dothing();
                                    if (respond.Result.result == true)
                                    {

                                        context.Response.WriteFile(context.Server.MapPath(webroot + filename));
                                        //return;
                                    }
                                    else
                                    {
                                        if (jr.GetConfig("NOAUTH") != null) context.Response.Redirect(webroot + jr.GetConfig("NOAUTH"));
                                    }
                                }
                                else
                                {
                                    jr.ClearSession();
                                    if (jr.GetConfig("ILLEGAL") != null) context.Response.Redirect(webroot + jr.GetConfig("ILLEGAL"));
                                }
                            }
                        }

                    }
                }
                else
                {
                    if (jr.GetConfig("ILLEGAL") != null) context.Response.Redirect(webroot + jr.GetConfig("ILLEGAL"));

                }
            }
            else
            {
                context.Response.WriteFile(context.Server.MapPath(webroot + filename));
            }
        }
    }
}