using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.IO;
using NPOI.HSSF.UserModel;
using NPOI.HPSF;
using NPOI.SS.UserModel;

namespace JeensLab
{
    public class JExcel
    {
        public static MemoryStream GetExcelStream(string sql, string filename)
        {
            DataSet dataset = new DataSet();
            SqlConnection sqlCon = new SqlConnection();
            sqlCon.ConnectionString = ConfigurationManager.ConnectionStrings["controlServer"].ConnectionString;
            SqlDataAdapter adapter = new SqlDataAdapter(sql, sqlCon.ConnectionString);
            adapter.Fill(dataset);
            DataTable dataTable = dataset.Tables[0];
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
            return ms;
        }

        public static bool ExceltoResponse(string sql, HttpContext context, string filename)
        {
            MemoryStream ms = JExcel.GetExcelStream(sql, filename);
            HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + filename + ".xls");
            HttpContext.Current.Response.Charset = "UTF-8";
            HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.Default;
            HttpContext.Current.Response.ContentType = "application/octet-stream";
            context.Response.OutputStream.Write(ms.GetBuffer(), 0, (int)ms.Position);
            return true;
        }
    }
}
