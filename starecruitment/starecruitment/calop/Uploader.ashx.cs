using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace starecruitment.calop
{
    /// <summary>
    /// Uploader 的摘要说明
    /// </summary>
    public class Uploader : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            //string cmd = context.Request["cmd"];
            //switch (cmd)
            //{
            //    case "uploadsomefiles":
            //        {
                        UploadSomeFiles(context);
                       // break;
                //    }
          //  }
        }
        private void UploadSomeFiles(HttpContext context)
        {
            string path = "";
            string name = "";
            //StreamReader reader = new StreamReader(context.Request.Form["data"]);
            string littleone = HttpUtility.UrlDecode(context.Request.Form["data"]);
            try
            {
                int count = context.Request.Files.Count;
                for (int i = 0; i < count; i++)
                {
                    int contentLength = context.Request.Files[i].ContentLength;//文件的大小
                    string contentType = context.Request.Files[i].ContentType;//文件的类型
                    string localPath = context.Request.Files[i].FileName;//文件的本地路径
                    string extension = Path.GetExtension(localPath).ToLower();//文件的后缀
                    string oldName = Path.GetFileName(localPath);
                    string newName = DateTime.Now.ToString("yyyyMMddHHmm_") + oldName.Replace(" ", "_").Replace("&", "_");
                    string filePath = GetPathForSaveFolder();
                    string fileSavePath = HttpContext.Current.Server.MapPath(filePath);
                    fileSavePath = fileSavePath + newName;
                    context.Request.Files[i].SaveAs(fileSavePath);
                    path = filePath + newName;
                    name = oldName;
                }
            }
            catch (Exception ex)
            {
                context.Response.Write("{\"isSuccess\":\"false\",\"url\":\"上传失败\"}");
            }
            finally
            {
                context.Response.Write("{\"isSuccess\":\"true\",\"url\":\"" + path + "\",\"name\":\"" + name + "\"}");
            }
        }
        private string GetPathForSaveFolder()
        {
            string path = GetAppPath() + "UploadFile/items/" + DateTime.Now.ToString("yyyy-MM") + "/";
            string fileSavePath = HttpContext.Current.Server.MapPath(path);
            if (!Directory.Exists(fileSavePath))
            {
                Directory.CreateDirectory(fileSavePath);
            }
            return path;
        }
        private string GetAppPath()
        {
            string applicationPath = HttpContext.Current.Request.ApplicationPath;
            if (!applicationPath.EndsWith("/"))
            {
                applicationPath = applicationPath + "/";
            }
            return applicationPath;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}