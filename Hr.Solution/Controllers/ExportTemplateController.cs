using ClosedXML.Excel;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.ImportModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExportTemplateController : ControllerBase
    {
        private readonly IExportTemplate exportTemplateServices;

        public ExportTemplateController(IExportTemplate exportTemplateServices)
        {
            this.exportTemplateServices = exportTemplateServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> ExportTemplateByTableName([FromQuery] string tableName)
        {
            var result = await exportTemplateServices.ExportTemplateByTableName(tableName);
            return Ok(result);
        }

        [HttpPost, Route("ExportTemplateByConfig")]
        // [Authorize]
        [AllowAnonymous]
        public async Task<ActionResult> ExportTemplateByConfig(object config)
        {
            JObject dataObjectJson = JObject.Parse(config.ToString());
            ExportToExcelTemplate(dataObjectJson);
            return Ok();
        }
        private void ExportToExcelTemplate(JObject json)
        {
            using (var workbook = new XLWorkbook())
            {
                string tabeName = (string)json["tableName"];
                JArray columns = (JArray)json["columns"];
                var worksheet = workbook.Worksheets.Add(tabeName);
                int Row1 = 1;
                int Row2 = 2;
                int Colunm = 1;
                foreach (JToken col in columns.Children())
                {
                    worksheet.Cell(Row1, Colunm).Value = col.SelectToken("columnName").ToString();
                    worksheet.Cell(Row2, Colunm).Value = col.SelectToken("displayName").ToString();
                    Colunm++;
                }
                worksheet.Rows("1").Hide();
                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                Response.Clear();
                var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.Headers.Add("content-disposition", "attachment;filename=" + tabeName + ".xlsx");
                Response.ContentType = contentType;
                Response.Body.WriteAsync(content);
                Response.Body.Flush();
            }
        }


    }
}