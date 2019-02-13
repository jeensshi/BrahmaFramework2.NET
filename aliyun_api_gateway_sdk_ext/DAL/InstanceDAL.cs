using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using aliyun_api_gateway_sdk_ext.Model;
using aliyun_api_gateway_sdk_ext.Utils;

namespace aliyun_api_gateway_sdk_ext.DAL
{
    /// <summary>
    /// InstanceDAL 的摘要说明
    /// </summary>
    public class InstanceDAL
    {
        public List<String> create(Instance instance)//租户新建，核心业务在数据库端，用存储过程加事务写的
        {
            DataTable table = SQLHelper.ExecuteDataTable(@"exec [dbo].[ST_Pro_CreateInstance] @acid,@tenantid,@appid,@apptype,@end_time",
                    new SqlParameter("@acid", SQLHelper.ToDbValue(instance.ac_id)), new SqlParameter("@tenantid", SQLHelper.ToDbValue(instance.tenantid)),
                    new SqlParameter("@appid", SQLHelper.ToDbValue(instance.appid)), new SqlParameter("@apptype", SQLHelper.ToDbValue(instance.apptype)),
                     new SqlParameter("@end_time", SQLHelper.ToDbValue(instance.end_time)));//防注入
            List<String> list = new List<string>();
            if (table.Rows.Count <= 0)
            {
                list.Add("error");
                return list;
            }
            else
            {
                list.Add((string)SQLHelper.FromDbValue(table.Rows[0]["success"]));//list的第一个永远表示执行的结果
                if ((string)SQLHelper.FromDbValue(table.Rows[0]["success"]) == "success")
                {
                    foreach (DataRow row in table.Rows)
                    {
                        list.Add((string)SQLHelper.FromDbValue(row["GUID"]));
                    }
                }
                return list;
            }


        }
        public string delete(Instance instance)//租户销毁
        {
            DataTable table = SQLHelper.ExecuteDataTable(@"exec [dbo].[ST_Pro_DeleteInstance] @GUID,@tenantid,@appid",
                    new SqlParameter("@GUID", SQLHelper.ToDbValue(instance.GUID)), new SqlParameter("@tenantid", SQLHelper.ToDbValue(instance.tenantid)),
                    new SqlParameter("@appid", SQLHelper.ToDbValue(instance.appid)));
            if (table.Rows.Count <= 0)
            { return "alert"; }
            else
            {
                return (string)SQLHelper.FromDbValue(table.Rows[0]["success"]);
            }


        }
        public string getUrl(Instance instance)//免密登录接口
        {
            DataTable table = SQLHelper.ExecuteDataTable(@"exec [dbo].[ST_Pro_GetSSOUrl] @GUID,@tenantid,@appid",
                    new SqlParameter("@GUID", SQLHelper.ToDbValue(instance.GUID)), new SqlParameter("@tenantid", SQLHelper.ToDbValue(instance.tenantid)),
                    new SqlParameter("@appid", SQLHelper.ToDbValue(instance.appid)));
            if (table.Rows.Count <= 0)
            { return "error"; }
            else
            {
                return (string)SQLHelper.FromDbValue(table.Rows[0]["success"]);
            }
        }
    }
}