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
    /// DeviceDAL 的摘要说明
    /// </summary>
    public class DeviceDAL
    {
        public List<String> bind(Device device)//设备的绑定
        {


            DataTable table = SQLHelper.ExecuteDataTable(@"exec [dbo].[ST_Pro_BindDevice] @tenantid,@appid,@productkey,@devicename",
                    new SqlParameter("@tenantid", SQLHelper.ToDbValue(device.tenantid)), new SqlParameter("@appid", SQLHelper.ToDbValue(device.appid)),
                     new SqlParameter("@productkey", SQLHelper.ToDbValue(device.productKey)),
                     new SqlParameter("@devicename", SQLHelper.ToDbValue(device.deviceName)));

            List<String> list = new List<string>();
            if (table.Rows.Count <= 0)
            {
                list.Add("error");
                return list;
            }
            else
            {
                if ((string)table.Rows[0]["success1"] == "成功" && (string)table.Rows[0]["success2"] == "成功")
                    list.Add("success");
                else
                    list.Add("failure");

                return list;
            }

        }

        public List<String> delete(Device device)//设备解绑
        {

            DataTable table = SQLHelper.ExecuteDataTable(@"exec [dbo].[ST_Pro_DeleteDevice] @tenantid,@appid,@productkey,@devicename",
                    new SqlParameter("@tenantid", SQLHelper.ToDbValue(device.tenantid)), new SqlParameter("@appid", SQLHelper.ToDbValue(device.appid)),
                     new SqlParameter("@productkey", SQLHelper.ToDbValue(device.productKey)),
                     new SqlParameter("@devicename", SQLHelper.ToDbValue(device.deviceName)));

            List<String> list = new List<string>();
            if (table.Rows.Count <= 0)
            {
                list.Add("error");
                return list;
            }
            else
            {
                if ((string)table.Rows[0]["success1"] == "成功" && (string)table.Rows[0]["success2"] == "成功")
                    list.Add("success");
                else
                    list.Add("failure");

                return list;
            }


        }
    }
}