using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace aliyun_api_gateway_sdk_ext.Utils
{
    /// <summary>
    /// SQLHelper 的摘要说明
    /// </summary>
    public class SQLHelper
    {
        public static readonly string connstr =
                 WebConfigurationManager.ConnectionStrings["controlServer"].ConnectionString;  //连接字符串

        public static int ExecuteNonQuery(string sql,    //带参数的无返回数据查询（插入，删除，更新）
            params SqlParameter[] parameters)
        {
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = sql;
                    cmd.Parameters.AddRange(parameters);
                    return cmd.ExecuteNonQuery();  //上次调试了半天忘写了这一句，虽然这是个无返回数据的查询，还是要写返回语句返回一个int值的
                }
            }
        }

        public static object ExecuteScalar(string sql,   //带参数的查询（选择查询），返回单条数据
            params SqlParameter[] parameters)
        {
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = sql;
                    cmd.Parameters.AddRange(parameters);
                    return cmd.ExecuteScalar();
                }
            }
        }

        public static DataTable ExecuteDataTable(string sql,   //返回一个表
            params SqlParameter[] parameters)
        {
            using (SqlConnection conn = new SqlConnection(connstr))
            {
                conn.Open();
                using (SqlCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandText = sql;
                    cmd.Parameters.AddRange(parameters);

                    DataSet dataset = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(dataset);
                    return dataset.Tables[0];
                }
            }
        }

        public static object FromDbValue(object value)    //把数据库里的NULL转为程序里的NULL
        {
            if (value == DBNull.Value)
            {
                return null;
            }
            else
            {
                return value;
            }
        }

        public static object ToDbValue(object value)  //把程序里的NULL转为数据库里的NULL
        {
            if (value == null)
            {
                return DBNull.Value;
            }
            else
            {
                return value;
            }
        }
    }
}