using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace aliyun_api_gateway_sdk_ext.Model
{ 
    /// <summary>
    /// Device 的摘要说明
    /// </summary>
    public class Device
    {

        public int ID { get; set; }//设备表主键
        public string tenantid { get; set; }//设备所属的租户ID
        public string appid { get; set; }//设备所属的租户当前应用ID   

        public string deviceName { get; set; }//设备的dn
        public string productKey { get; set; }//设备的pk
        public string deviceSecret { get; set; }//设备秘钥

        public int status { get; set; }//设备当前状态，0是未绑定，1是已绑定


    }
}