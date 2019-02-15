using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Xml;
using System;
using JeensLab;
using System.Net.Mail;
using System.Net;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Diagnostics;
using NPOI.HSSF.UserModel;
using NPOI.HPSF;
using NPOI.SS.UserModel;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using aliyun_api_gateway_sdk_ext.Sign;
using System.Web.Configuration;
//2017.3.2
namespace BrahmaFramework.App_Code
{
    public class JDAO : JAdapter
    {
        private Dictionary<String, int> map;
        /// <summary>
        /// 解析SQL语法
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public string Grammar(string sql)
        {
            string result = sql;
            MatchEvaluator myEvaluator3 = new MatchEvaluator(JudgeEmpty);
            result = Regex.Replace(sql, @"[\{][\$]([\S][^\}]+)[\}]", myEvaluator3);
            result = result.Replace("&lt;", "<");
            result = result.Replace("&gt;", ">");
            result = result.Replace("&quot;", "\"");
            result = result.Replace("&apos;", "'");
            result = result.Replace("&amp;", "&");
            map = new Dictionary<String, int>();
            MatchEvaluator myEvaluator = new MatchEvaluator(JudgeCondition);
            result = Regex.Replace(result, @"[\{][#]([\S]*)[#]([\S][^\}]+)[\}]", myEvaluator);
            MatchEvaluator myEvaluator2 = new MatchEvaluator(JudgeGroup);
            result = Regex.Replace(result, @"[\{][#]([\S]*)[#]([\S][^\}]+)[\}]", myEvaluator2);
            return result;

        }

        /// <summary>
        /// /将所有未替换的参数设置为空
        /// </summary>
        /// <param name="match"></param>
        /// <returns></returns>
        private string JudgeEmpty(Match match)
        {
            string result = "";
            string matchs = match.Value;
            string tr = matchs.Substring(2, matchs.Length - 3);
            switch (tr)
            {
                case "prefix":
                case "suffix":
                    break;
                default:
                    if (JRESOURCE.GetParameter(tr) != null)
                        result = JRESOURCE.GetParameter(tr).ToString();
                    else
                        result = "";
                    break;
            }
            return result;
        }
        private string JudgeCondition(Match match)
        {
            string result = "";
            string matchs = match.Value;
            string[] paras = matchs.Split('#');
            if (!paras[1].Equals(""))
            {
                if (JRESOURCE.GetParameter(paras[1]) == null)
                    result = "";
                else
                {
                    int tempint;
                    if (map.TryGetValue(paras[2], out tempint))
                    {
                        if (tempint > 0)
                        {
                            result = paras[paras.Length - 1];
                            result = paras[3] + result.Substring(0, result.Length - 1);
                            map[paras[2]] = tempint + 1;
                        }
                    }
                    else
                    {
                        result = paras[paras.Length - 1];
                        result = result.Substring(0, result.Length - 1);
                        map[paras[2]] = 1;
                    }
                }

            }
            else
            {
                result = matchs;
            }
            return result;
        }
        private string JudgeGroup(Match match)
        {
            string result = "";
            string matchs = match.Value;
            string[] paras = matchs.Split('#');

            int tempint;
            if (map.TryGetValue(paras[2], out tempint))
            {
                if (tempint > 0)
                {
                    result = paras[3];
                }
                else
                {
                    result = "";
                }
            }
            else
            {
                result = "";
            }

            return result;
        }
        /// <summary>
        /// 使用传参的变量
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public string ParameterReplace(string sql)
        {

            MatchEvaluator myEvaluator = new MatchEvaluator(JudgeParameter);
            string result = Regex.Replace(sql, @"[\{][\$]([\S][^\}]+)[\}]", myEvaluator);
            result = result.Replace("&lt;", "<");
            result = result.Replace("&gt;", ">");
            result = result.Replace("&quot;", "\"");
            result = result.Replace("&apos;", "'");
            result = result.Replace("&amp;", "&");
            return result;
        }
        private string JudgeParameter(Match match)
        {
            string result = "";
            string matchs = match.Value;
            string tr = matchs.Substring(2, matchs.Length - 3);
            switch (tr)
            {
                case "prefix":
                case "suffix":
                    break;
                default:
                    if (JRESOURCE.GetParameter(tr) != null)
                        result = JRESOURCE.GetParameter(tr).ToString();
                    else
                        result = matchs;
                    break;
            }
            return result;
        }
        /// <summary>
        /// 使用session中的变量
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public string SessionReplace(string sql)
        {
            MatchEvaluator myEvaluator = new MatchEvaluator(JudgeSession);
            string result = Regex.Replace(sql, @"[\{][\$]([\S][^\}]+)[\}]", myEvaluator);
            result = result.Replace("&lt;", "<");
            result = result.Replace("&gt;", ">");
            result = result.Replace("&quot;", "\"");
            result = result.Replace("&apos;", "'");
            result = result.Replace("&amp;", "&");
            return result;
        }
        private string JudgeSession(Match match)
        {
            string result = "";
            string matchs = match.Value;
            string tr = matchs.Substring(2, matchs.Length - 3);
            //tr = tr.Substring(2, tr.Length - 3);
            switch (tr)
            {
                case "prefix":
                case "suffix":
                    break;
                default:
                    if (JRESOURCE.GetSession(tr) != null)
                        result = JRESOURCE.GetSession(tr).ToString();
                    else
                        result = matchs;
                    break;
            }
            return result;
        }


        public JToken GetData()
        {
            dynamic obj = new JObject();
            string Sql = "";
            string dbstring = JRESOURCE.GetConnectionString(JRESOURCE.GetConfig("DEFAULTDATABASE"));
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                string table = "T_" + keyword;
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                Sql = sqlmapping.Attributes["sql"].Value;
                if (sqlmapping.Attributes["database"] != null)
                {
                    dbstring = sqlmapping.Attributes["database"].Value;
                    dbstring = JRESOURCE.GetConnectionString(dbstring);

                }
                Sql = ParameterReplace(Sql);
                Sql = Grammar(Sql);
                // 执行SQL语句
                DataSet ds = new DataSet();
                SqlConnection sqlCon = new SqlConnection();
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DBPARA")))
                    dbstring = ParameterReplace(dbstring);
                dbstring = SessionReplace(dbstring);
                sqlCon.ConnectionString = dbstring;
                SqlDataAdapter adapter = new SqlDataAdapter(Sql, sqlCon.ConnectionString);
                obj.Result = new JObject();
                adapter.Fill(ds);
                string json = JsonConvert.SerializeObject(ds.Tables[0], Newtonsoft.Json.Formatting.Indented);
                obj.Result.result = true;
                obj.DataSet = JArray.Parse(json);
                obj.Struct = new JObject();
                obj.Struct[table] = new JArray();
                foreach (DataColumn dc in ds.Tables[0].Columns)
                {
                    obj.Struct[table].Add(dc.ColumnName);
                }
            }
            catch (Exception e)
            {
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {
                obj.Result.sql = Sql;
                obj.Result.connectionstring = dbstring;
            }
            return obj;
        }
        private JToken GetCDBData()
        {
            dynamic obj = new JObject();
            string Sql = "";
            string dbstring = JRESOURCE.GetConnectionString(JRESOURCE.GetConfig("DEFAULTDATABASE"));
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                string table = "T_" + keyword;
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                Sql = sqlmapping.Attributes["cdbsql"].Value;
                if (sqlmapping.Attributes["cdbdatabase"] != null)
                {
                    dbstring = sqlmapping.Attributes["cdbdatabase"].Value;
                    dbstring = JRESOURCE.GetConnectionString(dbstring);
                }
                Sql = ParameterReplace(Sql);
                Sql = Grammar(Sql);
                // 执行SQL语句
                DataSet ds = new DataSet();
                SqlConnection sqlCon = new SqlConnection();
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DBPARA")) == true)
                    dbstring = ParameterReplace(dbstring);
                dbstring = SessionReplace(dbstring);
                sqlCon.ConnectionString = dbstring;
                SqlDataAdapter adapter = new SqlDataAdapter(Sql, sqlCon.ConnectionString);
                obj.Result = new JObject();
                adapter.Fill(ds);
                string json = JsonConvert.SerializeObject(ds.Tables[0], Newtonsoft.Json.Formatting.Indented);
                obj.Result.result = true;
                obj.DataSet = JArray.Parse(json);
                obj.Struct = new JObject();
                obj.Struct[table] = new JArray();
                foreach (DataColumn dc in ds.Tables[0].Columns)
                {
                    obj.Struct[table].Add(dc.ColumnName);
                }
            }
            catch (Exception e)
            {
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {
                obj.Result.cdbsql = Sql;
                obj.Result.cdbconnectionstring = dbstring;
            }
            return obj;
        }
        public JToken InsertData()
        {
            dynamic obj = new JObject();
            string Sql = "";
            string dbstring = JRESOURCE.GetConnectionString(JRESOURCE.GetConfig("DEFAULTDATABASE"));
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                string table = "T_" + keyword;
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                Sql = sqlmapping.Attributes["sql"].Value;
                if (sqlmapping.Attributes["database"] != null)
                {
                    dbstring = sqlmapping.Attributes["database"].Value;
                    dbstring = JRESOURCE.GetConnectionString(dbstring);
                }
                Sql = ParameterReplace(Sql);
                Sql = Grammar(Sql);
                // 执行SQL语句
                DataSet ds = new DataSet();
                SqlConnection sqlCon = new SqlConnection();
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DBPARA")))
                    dbstring = ParameterReplace(dbstring);
                dbstring = SessionReplace(dbstring);
                sqlCon.ConnectionString = dbstring;
                SqlDataAdapter adapter = new SqlDataAdapter(Sql, sqlCon.ConnectionString);
                adapter.Fill(ds);
                string json = JsonConvert.SerializeObject(ds.Tables[0], Newtonsoft.Json.Formatting.Indented);

                obj.Result = new JObject();
                obj.Result.result = true;
                obj.DataSet = JArray.Parse(json);
                obj.Struct = new JObject();
                obj.Struct[table] = new JArray();
                foreach (DataColumn dc in ds.Tables[0].Columns)
                {
                    obj.Struct[table].Add(dc.ColumnName);
                }
            }
            catch (Exception e)
            {

                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {
                obj.Result.sql = Sql;
                obj.Result.connectionstring = dbstring;
            }
            return obj;
        }
        public JToken UpdateData()
        {
            dynamic obj = new JObject();
            string Sql = "";
            string dbstring = JRESOURCE.GetConnectionString(JRESOURCE.GetConfig("DEFAULTDATABASE"));
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                Sql = sqlmapping.Attributes["sql"].Value;
                if (sqlmapping.Attributes["database"] != null)
                {
                    dbstring = sqlmapping.Attributes["database"].Value;
                    dbstring = JRESOURCE.GetConnectionString(dbstring);
                }
                Sql = ParameterReplace(Sql);
                Sql = Grammar(Sql);
                // 执行SQL语句
                SqlConnection sqlCon = new SqlConnection();
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DBPARA")))
                    dbstring = ParameterReplace(dbstring);
                dbstring = SessionReplace(dbstring);
                sqlCon.ConnectionString = dbstring;
                SqlCommand sqlcmd = new SqlCommand(Sql, sqlCon);
                sqlcmd.Connection.Open();
                sqlcmd.ExecuteNonQuery();

                obj.Result = new JObject();
                //需要增加结果判断，是否是true****************************************************
                obj.Result.result = true;
            }
            catch (Exception e)
            {

                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {
                obj.Result.sql = Sql;
                obj.Result.connectionstring = dbstring;
            }
            return obj;
        }
        public JToken DeleteData()
        {
            dynamic obj = new JObject();
            string Sql = "";
            string dbstring = JRESOURCE.GetConnectionString(JRESOURCE.GetConfig("DEFAULTDATABASE"));
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                Sql = sqlmapping.Attributes["sql"].Value;
                if (sqlmapping.Attributes["database"] != null)
                {
                    dbstring = sqlmapping.Attributes["database"].Value;
                    dbstring = JRESOURCE.GetConnectionString(dbstring);
                }
                Sql = ParameterReplace(Sql);
                Sql = Grammar(Sql);
                // 执行SQL语句
                SqlConnection sqlCon = new SqlConnection();
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DBPARA")))
                    dbstring = ParameterReplace(dbstring);
                dbstring = SessionReplace(dbstring);
                sqlCon.ConnectionString = dbstring;
                SqlCommand sqlcmd = new SqlCommand(Sql, sqlCon);
                sqlcmd.Connection.Open();
                sqlcmd.ExecuteNonQuery();

                obj.Result = new JObject();
                //需要增加结果判断，是否是true****************************************************
                obj.Result.result = true;
            }
            catch (Exception e)
            {
                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {
                obj.Result.sql = Sql;
                obj.Result.connectionstring = dbstring;
            }
            return obj;
        }
        public JToken SignIn()
        {
            //将租户信息及对应数据库连接写入session
            dynamic obj = new JObject();
            obj.Result = new JObject();
            //有当前数据库，则设置当前数据，没有则不设置

            dynamic cdbresult = GetCDBData();
            if (Convert.ToBoolean(cdbresult.Result.result))
            {
                if (cdbresult.DataSet.Count > 0)
                {
                    JRESOURCE.SetSession(JRESOURCE.GetConfig("CURRENTDATABASE"), cdbresult.DataSet[0][JRESOURCE.GetConfig("CURRENTDATABASE")].Value);
                }
                else
                {
                    obj.Result.message = "未能获取CURRENTDATABASE，由于没有数据";
                    obj.Result = cdbresult.Result;
                    if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
                    {
                        obj.Result.sql = cdbresult.Result.cdbsql;
                        obj.Result.connectionstring = cdbresult.Result.cdbconnectionstring;
                        obj.Result.cdbname = JRESOURCE.GetConfig("CURRENTDATABASE");
                    }
                    return obj;
                }
            }
            else
            {
                obj.Result.message = "未能获取CURRENTDATABASE，由于访问失败";
                obj.Result = cdbresult.Result;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
                {
                    obj.Result.sql = cdbresult.Result.cdbsql;
                    obj.Result.connectionstring = cdbresult.Result.cdbconnectionstring;
                    obj.Result.cdbname = JRESOURCE.GetConfig("CURRENTDATABASE");
                }
                return obj;
            }
            
            //JRESOURCE.SetSession("CURRENT_DATABASE","wbxdb");
            //取得用户权限
            dynamic result = null;
            //string accountid = JRESOURCE.GetParameter("accountid").ToString();
            if (JRESOURCE.GetConfig("OPENAM") != null && Convert.ToBoolean(JRESOURCE.GetConfig("OPENAM")))
            {
                //openam远程获取登录信息
                //成功，将accountid写入session
                //失败，返回失败信息
                JRESOURCE.SetParameter("keyword", "PageAuth");
                JRESOURCE.SetParameter("command", "openamlogin");
                result = OpenAMLogin();
                if (Convert.ToBoolean(result.Result.result))
                {
                    //判断数据库中是否有对应accountid
                    //有，直接登录，获取权限信息
                    //没有，创建账号，赋默认角色，执行SQL存储过程

                    //dynamic uidvalidpara = new JObject();
                    //uidvalidpara.keyword = "PageAuth";
                    //uidvalidpara.command = "openamuidvalid";
                    JRESOURCE.SetParameter("keyword", "PageAuth");
                    JRESOURCE.SetParameter("command", "openamuidvalid");
                    result = GetData();
                    if (Convert.ToBoolean(result.Result.result) && result.DataSet.Count > 0)
                    {
                        JRESOURCE.SetParameter("keyword", "PageAuth");
                        JRESOURCE.SetParameter("command", "signin");
                        result = GetData();
                        if (Convert.ToBoolean(result.Result.result))
                        {
                            if (result.DataSet.Count > 0)
                            {
                                obj.Result.result = true;
                                obj.Result.message = "登录成功";
                                obj.Result.jump = JRESOURCE.GetConfig("LANDINGPAGE");
                                List<string> newList = new List<string>();
                                for (int i = 0; i < result.DataSet.Count; i++)
                                {
                                    newList.Add(result.DataSet[i]["fncode"].Value);
                                    if (i == 0)
                                    {

                                        JRESOURCE.SetSession("accountid", result.DataSet[i]["accountid"].Value);
                                        foreach (dynamic datafield in result.DataSet[i])
                                        {
                                            if (datafield.Name != "fncode")
                                                obj.Result[datafield.Name] = result.DataSet[i][datafield.Name].Value;
                                        }
                                    }
                                }
                                JRESOURCE.SetSession("fncodelist", newList);
                                JRESOURCE.SetVcode();
                                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                                {
                                    try
                                    {
                                        obj.Result["REMOTE_ADDR"] = JRESOURCE.GetContext().Request.ServerVariables["REMOTE_ADDR"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["REMOTE_ADDR"];
                                        obj.Result["HTTP_VIA"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_VIA"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_VIA"];
                                        obj.Result["HTTP_X_FORWARDED_FOR"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                                        obj.Result["HTTP_CLIENT_IP"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"];
                                        obj.Result["UserHostAddress"] = JRESOURCE.GetContext().Request.UserHostAddress == null ? "" : JRESOURCE.GetContext().Request.UserHostAddress;
                                        obj.Result["VCODE"] = JRESOURCE.GetVcode();
                                    }
                                    catch (Exception e)
                                    {

                                    }
                                }
                            }
                            else
                            {
                                obj.Result.result = false;
                                obj.Result.message = "无权限";
                            }

                        }
                        else
                        {
                            obj = result;
                        }
                    }
                    else
                    {
                        JRESOURCE.SetParameter("keyword", "PageAuth");
                        JRESOURCE.SetParameter("command", "inituser");
                        result = GetData();
                        if (Convert.ToBoolean(result.Result.result) && result.DataSet.Count > 0)
                        {

                            JRESOURCE.SetParameter("keyword", "PageAuth");
                            JRESOURCE.SetParameter("command", "signin");
                            result = GetData();
                            if (Convert.ToBoolean(result.Result.result))
                            {
                                if (result.DataSet.Count > 0)
                                {
                                    obj.Result.result = true;
                                    obj.Result.message = "登录成功";
                                    obj.Result.jump = JRESOURCE.GetConfig("LANDINGPAGE");
                                    List<string> newList = new List<string>();
                                    for (int i = 0; i < result.DataSet.Count; i++)
                                    {
                                        newList.Add(result.DataSet[i]["fncode"].Value);
                                        if (i == 0)
                                        {

                                            JRESOURCE.SetSession("accountid", result.DataSet[i]["accountid"].Value);
                                            foreach (dynamic datafield in result.DataSet[i])
                                            {
                                                if (datafield.Name != "fncode")
                                                    obj.Result[datafield.Name] = result.DataSet[i][datafield.Name].Value;
                                            }
                                        }
                                    }
                                    JRESOURCE.SetSession("fncodelist", newList);
                                    JRESOURCE.SetVcode();
                                    if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                                    {
                                        try
                                        {
                                            obj.Result["REMOTE_ADDR"] = JRESOURCE.GetContext().Request.ServerVariables["REMOTE_ADDR"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["REMOTE_ADDR"];
                                            obj.Result["HTTP_VIA"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_VIA"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_VIA"];
                                            obj.Result["HTTP_X_FORWARDED_FOR"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                                            obj.Result["HTTP_CLIENT_IP"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"];
                                            obj.Result["UserHostAddress"] = JRESOURCE.GetContext().Request.UserHostAddress == null ? "" : JRESOURCE.GetContext().Request.UserHostAddress;
                                            obj.Result["VCODE"] = JRESOURCE.GetVcode();
                                        }
                                        catch (Exception e)
                                        {

                                        }
                                    }
                                }
                                else
                                {
                                    obj.Result.result = false;
                                    obj.Result.message = "无权限";
                                }

                            }
                            else
                            {
                                obj = result;
                            }
                        }
                        else
                        {
                            JRESOURCE.SetParameter("keyword", "PageAuth");
                            JRESOURCE.SetParameter("command", "openamlogout");
                            result = OpenAMLogout();
                            obj.Result = result;
                            obj.Result.result = false;
                            obj.Result.message = "登录失败";
                        }
                    }
                }
                else
                {
                    obj.Result.result = false;
                    obj.Result.message = "登录失败";
                }

            }
            else
            {
                result = GetData();
                if (Convert.ToBoolean(result.Result.result))
                {
                    if (result.DataSet.Count > 0)
                    {
                        obj.Result.result = true;
                        obj.Result.message = "登录成功";
                        obj.Result.jump = JRESOURCE.GetConfig("LANDINGPAGE");
                        List<string> newList = new List<string>();
                        for (int i = 0; i < result.DataSet.Count; i++)
                        {
                            newList.Add(result.DataSet[i]["fncode"].Value);
                            if (i == 0)
                            {

                                JRESOURCE.SetSession("accountid", result.DataSet[i]["accountid"].Value);
                                foreach (dynamic datafield in result.DataSet[i])
                                {
                                    if (datafield.Name != "fncode")
                                        obj.Result[datafield.Name] = result.DataSet[i][datafield.Name].Value;
                                }
                            }
                        }
                        JRESOURCE.SetSession("fncodelist", newList);
                        JRESOURCE.SetVcode();
                        if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                        {
                            try
                            {
                                obj.Result["REMOTE_ADDR"] = JRESOURCE.GetContext().Request.ServerVariables["REMOTE_ADDR"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["REMOTE_ADDR"];
                                obj.Result["HTTP_VIA"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_VIA"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_VIA"];
                                obj.Result["HTTP_X_FORWARDED_FOR"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                                obj.Result["HTTP_CLIENT_IP"] = JRESOURCE.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"] == null ? "" : JRESOURCE.GetContext().Request.ServerVariables["HTTP_CLIENT_IP"];
                                obj.Result["UserHostAddress"] = JRESOURCE.GetContext().Request.UserHostAddress == null ? "" : JRESOURCE.GetContext().Request.UserHostAddress;
                                obj.Result["VCODE"] = JRESOURCE.GetVcode();
                            }
                            catch (Exception e)
                            {

                            }
                        }
                    }
                    else
                    {
                        obj.Result.result = false;
                        obj.Result.message = "登录失败";
                    }

                }
                else
                {
                    obj = result;
                }
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {

                obj.Result.cdbsql = cdbresult.Result.cdbsql;
                obj.Result.cdbconnectionstring = cdbresult.Result.cdbconnectionstring;
                obj.Result.sql = result.Result.sql;
                obj.Result.connectionstring = result.Result.connectionstring;
                obj.Result.cdbname = JRESOURCE.GetConfig("CURRENTDATABASE");
                obj.Result.cdbvalue = cdbresult.DataSet[0][JRESOURCE.GetConfig("CURRENTDATABASE")].Value;
            }
            return obj;
        }
        public JToken TokenSignIn()
        {
            dynamic obj = new JObject();
            obj.Result = new JObject();
            dynamic result = GetData();
            if (Convert.ToBoolean(result.Result.result))
            {
                if (result.DataSet.Count > 0)
                {
                    obj.Result.result = true;
                    obj.Result.message = "登录成功";
                    obj.Result.jump = JRESOURCE.GetConfig("LANDINGPAGE");
                    JRESOURCE.SetSession("accountid", JRESOURCE.GetParameter("accountid").ToString());
                    List<string> newList = new List<string>();
                    for (int i = 0; i < result.DataSet.Count; i++)
                    {
                        newList.Add(result.DataSet[i]["fncode"].Value);
                        obj.Result.userid = result.DataSet[i]["userid"].Value;
                    }
                    JRESOURCE.SetSession("fncodelist", newList);
                }
                else
                {
                    obj.Result.result = false;
                    obj.Result.message = "登录失败";
                }

            }
            else
            {
                obj = result;
            }
            return obj;
        }

        public JToken SignOut()
        {
            JRESOURCE.ClearSession();
            dynamic obj = new JObject();
            obj.Result = new JObject();
            if (JRESOURCE.GetConfig("OPENAM") != null && Convert.ToBoolean(JRESOURCE.GetConfig("OPENAM")))
            {
                JRESOURCE.SetParameter("keyword", "PageAuth");
                JRESOURCE.SetParameter("command", "openamlogout");
                obj.Result = OpenAMLogout();
            }

            //需要增加结果判断，是否是true****************************************************
            obj.Result.result = true;
            return obj;
        }
        public JToken Authen()
        {

            string fncode = JRESOURCE.GetParameter("fncode").ToString();
            List<string> newList = (List<string>)JRESOURCE.GetSession("fncodelist");
            dynamic obj = new JObject();
            obj.Result = new JObject();
            for (int i = 0; i < newList.Count; i++)
            {
                if (newList[i].ToString() == fncode)
                {
                    obj.Result.result = true;
                    return obj;
                }
            }
            obj.Result.result = false;
            /*
            string funcid = JRESOURCE.GetParameter("fncode").ToString();
            string corppage = JRESOURCE.GetAppSettings("corppage");
            string loginpage = JRESOURCE.GetAppSettings("loginpage");
            dynamic obj = new JObject();
            obj.Result = new JObject();
            if (JRESOURCE.GetSession("userid") == null)
            {
                obj.Result.result = false;
                obj.Result.jump = loginpage;
            }
            else
            {
                string userid = JRESOURCE.GetSession("userid").ToString();
                string password = JRESOURCE.GetSession("password").ToString();
                //开始验证
                if (GetFlow("getflow"))
                {
                    obj.Result.result = true;
                    obj.Result.userid = userid;
                }
                else
                {
                    obj.Result.result = false;
                    obj.Result.jump = loginpage;
                }
            }
            */
            return obj;
        }
        public JToken SendMail()
        {
            dynamic obj = new JObject();
            try
            {
                SmtpClient client = new SmtpClient(JRESOURCE.GetAppSettings("smtpserver"));
                string UserName = JRESOURCE.GetAppSettings("smtpemail");
                string Password = JRESOURCE.GetAppSettings("smtppassword");
                client.Credentials = new System.Net.NetworkCredential(UserName, Password);
                MailAddress from = new MailAddress(UserName);
                MailAddress to = new MailAddress(JRESOURCE.GetParameter("receiver").ToString());
                MailMessage message = new MailMessage(from, to);
                message.Body = JRESOURCE.GetParameter("body").ToString();
                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.Subject = JRESOURCE.GetParameter("subject").ToString();
                message.SubjectEncoding = System.Text.Encoding.UTF8;
                client.Send(message);
                obj.Result = new JObject();
                obj.Result.result = true;
            }
            catch (Exception e)
            {
                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            return obj;
        }

        //public JToken GetExcel()
        //{
        //    dynamic obj = new JObject();
        //    string Sql = "";
        //    try
        //    {
        //        string keyword = JRESOURCE.GetParameter("keyword").ToString();
        //        string command = JRESOURCE.GetParameter("command").ToString();
        //        string table = "T_" + keyword;
        //        XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
        //        Sql = sqlmapping.Attributes["sql"].Value;
        //        Sql = ParameterReplace(Sql);
        //        Sql = Grammar(Sql);
        //        // 执行SQL语句
        //        DataSet ds = new DataSet();
        //        SqlConnection sqlCon = new SqlConnection();
        //        sqlCon.ConnectionString = JRESOURCE.GetConnectionString("controlServer");
        //        SqlDataAdapter adapter = new SqlDataAdapter(Sql, sqlCon.ConnectionString);
        //        adapter.Fill(ds);
        //        string json = JsonConvert.SerializeObject(ds.Tables[0], Newtonsoft.Json.Formatting.Indented);
        //        obj.Result = new JObject();
        //        obj.Result.result = true;
        //        obj.DataSet = JArray.Parse(json);
        //        obj.Struct = new JObject();
        //        obj.Struct[table] = new JArray();
        //        foreach (DataColumn dc in ds.Tables[0].Columns)
        //        {
        //            obj.Struct[table].Add(dc.ColumnName);
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        obj.Result = new JObject();
        //        obj.Result.result = false;
        //        if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
        //            obj.Result.message = e.Message;
        //        else
        //            obj.Result.message = "异常数据导致错误";
        //    }
        //    if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
        //        obj.Result.sql = Sql;
        //    return obj;
        //}

        public JIO GetExcel()
        {
            JIO obj = new JIO();
            string Sql = "";
            string filename = "";
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                string table = "T_" + keyword;
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                filename = sqlmapping.Attributes["filename"].Value;
                Sql = sqlmapping.Attributes["sql"].Value;
                Sql = ParameterReplace(Sql);
                Sql = Grammar(Sql);
                DataSet ds = new DataSet();
                SqlConnection sqlCon = new SqlConnection();
                sqlCon.ConnectionString = JRESOURCE.GetConnectionString("controlServer");
                SqlDataAdapter adapter = new SqlDataAdapter(Sql, sqlCon.ConnectionString);
                adapter.Fill(ds);
                DataTable dataTable = ds.Tables[0];
                HSSFWorkbook hssfworkbook = new HSSFWorkbook();
                DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
                dsi.Company = "Jeens Create";
                hssfworkbook.DocumentSummaryInformation = dsi;
                SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
                si.Subject = "海上文化";
                hssfworkbook.SummaryInformation = si;
                ISheet sheet1 = hssfworkbook.CreateSheet("数据报告");
                ICellStyle cellStyle2 = hssfworkbook.CreateCellStyle();
                IDataFormat format = hssfworkbook.CreateDataFormat();
                cellStyle2.DataFormat = format.GetFormat("¥#,##0");
                IRow row = sheet1.CreateRow(0);
                int j = 0;
                foreach (DataColumn dc in dataTable.Columns)
                {
                    row.CreateCell(j).SetCellValue(dc.ColumnName);
                    j++;
                }
                int i = 1;
                foreach (DataRow dr in dataTable.Rows)
                {
                    j = 0;
                    row = sheet1.CreateRow(i);
                    foreach (DataColumn dc in dataTable.Columns)
                    {
                        ICell ic = row.CreateCell(j);
                        ic.SetCellValue(dr[dc].ToString());
                        j++;
                    }
                    i++;
                }
                MemoryStream ms = new MemoryStream();
                hssfworkbook.Write(ms);
                JIO returnio = new JIO();
                returnio.Out = ms;
                returnio.filename = filename + ".xls";
                return returnio;
            }
            catch (Exception e)
            {

            }
            return null;
        }


        public JToken GetHtml()
        {
            dynamic obj = new JObject();
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                string http = sqlmapping.Attributes["http"].Value;
                string encoding = sqlmapping.Attributes["encoding"].Value == null ? "utf-8" : sqlmapping.Attributes["encoding"].Value;
                string contenttype = sqlmapping.Attributes["contenttype"].Value == null ? "text/plain" : sqlmapping.Attributes["contenttype"].Value;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(http);
                request.Headers.Add("Accept-Encoding", "gzip,deflate");
                request.AutomaticDecompression = DecompressionMethods.GZip;
                request.Method = "GET";
                request.ContentType = contenttype + "; charset=" + encoding;
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream resStream = response.GetResponseStream();
                Encoding enc = System.Text.Encoding.GetEncoding(encoding);
                //System.Diagnostics.Debug.WriteLine(response.ContentEncoding);
                //System.Diagnostics.Debug.WriteLine(response.CharacterSet);
                StreamReader reader = new StreamReader(resStream, enc);

                string resulthtml = reader.ReadToEnd();

                obj.Result = new JObject();
                obj.Result.result = true;
                obj.Html = resulthtml;
            }
            catch (Exception e)
            {
                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            return obj;
        }
        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {

            return true;

        }
        public JToken OpenAMLogin()
        {
            dynamic obj = new JObject();
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                string http = sqlmapping.Attributes["http"].Value;
                http = SessionReplace(http);
                string encoding = sqlmapping.Attributes["encoding"].Value == null ? "utf-8" : sqlmapping.Attributes["encoding"].Value;
                string contenttype = sqlmapping.Attributes["contenttype"].Value == null ? "text/plain" : sqlmapping.Attributes["contenttype"].Value;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(http);
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                //处理HttpWebRequest访问https有安全证书的问题（ 请求被中止: 未能创建 SSL/TLS 安全通道。）
                //ServicePointManager.ServerCertificateValidationCallback += (s, cert, chain, sslPolicyErrors) => true;
                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                //ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(CheckValidationResult);
                request.ContentType = contenttype + "; charset=" + encoding;
                request.Method = "POST";
                request.Headers.Add("X-OpenAM-Username", JRESOURCE.GetParameter("accountid").ToString());
                request.Headers.Add("X-OpenAM-Password", JRESOURCE.GetParameter("password").ToString());
                request.Headers.Add("Accept-API-Version", "resource=2.0, protocol=1.0");
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream resStream = response.GetResponseStream();
                Encoding enc = System.Text.Encoding.GetEncoding("utf-8");
                //System.Diagnostics.Debug.WriteLine(response.ContentEncoding);
                //System.Diagnostics.Debug.WriteLine(response.CharacterSet);
                StreamReader reader = new StreamReader(resStream, enc);

                string resulthtml = reader.ReadToEnd();
                dynamic openam = JToken.Parse(resulthtml);
                obj.Result = new JObject();
                if (openam.tokenId != null)
                {
                    JRESOURCE.SetSession("openam_tokenid", openam.tokenId);
                    obj.Result.openam_tokenid = openam.tokenId;
                    obj.Result.result = true;
                }
                else
                {
                    obj.Result.result = false;
                }
                obj.Html = resulthtml;
            }
            catch (Exception e)
            {
                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            return obj;
        }

        public JToken OpenAMTokenAuthen()
        {
            dynamic obj = new JObject();
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                string http = sqlmapping.Attributes["http"].Value;
                http = SessionReplace(http);
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(http);
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                string encoding = sqlmapping.Attributes["encoding"].Value == null ? "utf-8" : sqlmapping.Attributes["encoding"].Value;
                string contenttype = sqlmapping.Attributes["contenttype"].Value == null ? "text/plain" : sqlmapping.Attributes["contenttype"].Value;
                request.ContentType = contenttype + "; charset=" + encoding;
                request.Method = "POST";
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream resStream = response.GetResponseStream();
                Encoding enc = System.Text.Encoding.GetEncoding("utf-8");
                StreamReader reader = new StreamReader(resStream, enc);

                string resulthtml = reader.ReadToEnd();
                dynamic openam = JToken.Parse(resulthtml);
                obj.Result = new JObject();
                if (openam.valid == true)
                {
                    obj.Result.uid = openam.uid;
                    obj.Result.result = true;
                }
                else
                {
                    obj.Result.result = false;
                }

                obj.Html = resulthtml;
            }
            catch (Exception e)
            {
                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            return obj;
        }
        public JToken OpenAMLogout()
        {
            dynamic obj = new JObject();
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                string http = sqlmapping.Attributes["http"].Value;
                http = SessionReplace(http);
                string encoding = sqlmapping.Attributes["encoding"].Value == null ? "utf-8" : sqlmapping.Attributes["encoding"].Value;
                string contenttype = sqlmapping.Attributes["contenttype"].Value == null ? "text/plain" : sqlmapping.Attributes["contenttype"].Value;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(http);
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                request.ContentType = contenttype + "; charset=" + encoding;
                request.Method = "POST";
                request.Headers.Add("iplanetDirectoryPro", JRESOURCE.GetSession("openam_tokenid").ToString());
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream resStream = response.GetResponseStream();
                Encoding enc = System.Text.Encoding.GetEncoding("utf-8");
                StreamReader reader = new StreamReader(resStream, enc);
                string resulthtml = reader.ReadToEnd();
                dynamic openam = JToken.Parse(resulthtml);

                obj.Result = new JObject();
                if (openam.result == "Successfully logged out")
                {
                    obj.Result.result = true;
                    JRESOURCE.RemoveSession("openam_tokenid");
                }
                else
                {
                    obj.Result.result = false;
                }
                obj.Html = resulthtml;
            }
            catch (Exception e)
            {
                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            return obj;
        }
        public JToken RunCmd()
        {
            dynamic obj = new JObject();
            string username = "", password = "";
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                string cmd = sqlmapping.Attributes["cmd"].Value;
                if (sqlmapping.Attributes["username"] != null)
                {
                    username = sqlmapping.Attributes["username"].Value;
                    if (sqlmapping.Attributes["password"] != null) password = sqlmapping.Attributes["password"].Value;
                }

                Process p = new Process();
                p.StartInfo.FileName = "cmd.exe";
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardInput = true;
                p.StartInfo.RedirectStandardOutput = true;
                p.StartInfo.RedirectStandardError = true;
                p.StartInfo.CreateNoWindow = true;
                if (sqlmapping.Attributes["username"] != null)
                {
                    p.StartInfo.UserName = username;
                    p.StartInfo.Password = new NetworkCredential("", password).SecurePassword;
                }
                string returnmessage = null;

                p.Start();
                p.StandardInput.WriteLine(cmd);
                p.StandardInput.WriteLine("exit");
                returnmessage = p.StandardOutput.ReadToEnd();
                p.WaitForExit();
                p.Close();

                obj.Result = new JObject();
                //需要增加结果判断，是否是true****************************************************
                obj.Result.result = true;
                obj.message = returnmessage;
            }
            catch (Exception e)
            {

                obj.Result = new JObject();
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            return obj;
        }
        public JToken GetIOTData()
        {
            dynamic obj = new JObject();
            string iotpath = "";
            string iotbody = "";
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                string table = "T_" + keyword;
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                iotpath = sqlmapping.Attributes["iotpath"].Value;
                iotpath = ParameterReplace(iotpath);
                iotbody = sqlmapping.Attributes["iotbody"].Value;
                iotbody = ParameterReplace(iotbody);
                obj.Result = new JObject();
                obj.Result.result = true;
                string iotreturn = (new getIOT()).GetAll(iotpath, iotbody);
                obj.Result.body = JToken.Parse(iotreturn);
            }
            catch (Exception e)
            {
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {
                obj.Result.iotpath = iotpath;
                obj.Result.iotbody = JToken.Parse(iotbody);
            }
            return obj;
        }

        public JToken GetConfig()
        {
            dynamic obj = new JObject();
            obj.Result = new JObject();
            string name = "";
            string config = "";
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                XmlNode sqlmapping = JRESOURCE.GetMapping(keyword, command);
                name = sqlmapping.Attributes["name"].Value;
                name = ParameterReplace(name);
                config = sqlmapping.Attributes["config"].Value;
                config = ParameterReplace(config);
                obj.Result[name]=JRESOURCE.GetConfig(config);
                obj.Result.result = true;
            }
            catch (Exception e)
            {
                obj.Result.result = false;
                if (Convert.ToBoolean(JRESOURCE.GetConfig("DEBUG")))
                    obj.Result.message = e.Message;
                else
                    obj.Result.message = "异常数据导致错误";
            }
            return obj;
        }

        public JToken ReloadConfig()
        {
            dynamic obj = new JObject();
            obj.Result = new JObject();
            obj.Result.result = JRESOURCE.Reload();
            return obj;
        }

        public JToken SetCurrentDB()
        {
            //将租户信息及对应数据库连接写入session
            dynamic obj = new JObject();
            obj.Result = new JObject();
            //有当前数据库，则设置当前数据，没有则不设置

            dynamic result = GetData();
            if (Convert.ToBoolean(result.Result.result))
            {
                if (result.DataSet.Count > 0)
                {
                    JRESOURCE.SetSession(JRESOURCE.GetConfig("CURRENTDATABASE"), result.DataSet[0][JRESOURCE.GetConfig("CURRENTDATABASE")].Value);
                    if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
                    {
                        obj.Result.cdbvalue = result.DataSet[0][JRESOURCE.GetConfig("CURRENTDATABASE")].Value;
                    }
                }
                else
                {
                    
                    obj.Result.message = "未能获取CURRENTDATABASE，由于没有数据";
                    obj.Result = result.Result;
                }
            }
            else
            {
                obj.Result.message = "未能获取CURRENTDATABASE，由于访问失败";
                obj.Result = result.Result;
            }
            if (Convert.ToBoolean(JRESOURCE.GetConfig("SHOWSQL")))
            {
                obj.Result.sql = result.Result.sql;
                obj.Result.connectionstring = result.Result.connectionstring;
                obj.Result.cdbname = JRESOURCE.GetConfig("CURRENTDATABASE");
            }
            return obj;
        }

        public JToken Upload()
        {
            dynamic obj = new JObject();
            obj.Result = new JObject();
            obj.DataSet = new JArray();
            obj.Struct = new JObject();
            string path = "";
            string name = "";
            try
            {
                string keyword = JRESOURCE.GetParameter("keyword").ToString();
                string command = JRESOURCE.GetParameter("command").ToString();
                string table = "T_" + keyword;
                obj.Struct[table] = JArray.Parse("[\"name\",\"url\"]");
                string[] filesid = JRESOURCE.GetParameter("FILESID").ToString().Split(',');
                for (int j = 0; j < filesid.Length; j++)
                {
                    int i = int.Parse(filesid[j]);
                    int contentLength = JRESOURCE.GetContext().Request.Files[i].ContentLength;//文件的大小
                    string contentType = JRESOURCE.GetContext().Request.Files[i].ContentType;//文件的类型
                    string localPath = JRESOURCE.GetContext().Request.Files[i].FileName;//文件的本地路径
                    string extension = Path.GetExtension(localPath).ToLower();//文件的后缀
                    string oldName = Path.GetFileName(localPath);
                    string newName = Guid.NewGuid().ToString("N")+extension;
                    string filePath = GetPathForSaveFolder();
                    string fileSavePath = JRESOURCE.GetContext().Server.MapPath(filePath);
                    fileSavePath = fileSavePath + newName;
                    JRESOURCE.GetContext().Request.Files[i].SaveAs(fileSavePath);
                    path = filePath + newName;
                    name = oldName;
                    obj.DataSet.Add(JToken.Parse("{\"name\":\""+name+"\",\"url\":\""+path+"\"}"));
                }
                obj.Result.result = true;
                obj.Result.message = "上传成功";
            }
            catch (Exception e)
            {
                obj.Result.result = false;
                obj.Result.message = "上传失败";
            }
            return obj;
        }
        private string GetPathForSaveFolder()
        {
            string path = GetAppPath() + JRESOURCE.GetConfig("UPLOADURL") + DateTime.Now.ToString("yyyy-MM") + "/";
            string fileSavePath = JRESOURCE.GetContext().Server.MapPath(path);
            if (!Directory.Exists(fileSavePath))
            {
                Directory.CreateDirectory(fileSavePath);
            }
            return path;
        }
        private string GetAppPath()
        {
            string applicationPath = JRESOURCE.GetContext().Request.ApplicationPath;
            if (!applicationPath.EndsWith("/"))
            {
                applicationPath = applicationPath + "/";
            }
            return applicationPath;
        }

    }
}