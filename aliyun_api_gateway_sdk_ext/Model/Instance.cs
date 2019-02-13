using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace aliyun_api_gateway_sdk_ext.Model
{
    /// <summary>
    /// Instance 的摘要说明
    /// </summary>
    public class Instance
    {
        public int ID { get; set; }//租户表主键
        public string ac_id { get; set; }//访问唯一标识
        public string tenantid { get; set; }//租户阿里云唯一ID
        public string appid { get; set; }//租户当前应用ID
        public string apptype { get; set; }//租户当前应用类别
        public DateTime create_time { get; set; }//租户创建时间
        public DateTime end_time { get; set; }//租户到期时间
        public int status { get; set; }//租户当前状态
        public string GUID { get; set; }//备用GUID


    }
}