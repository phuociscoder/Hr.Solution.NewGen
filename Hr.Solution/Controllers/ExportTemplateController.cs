using ClosedXML.Excel;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Core.Utilities;
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
        [Authorize]
        public async Task<ActionResult> ExportTemplateByConfig(object config)
        {
            JObject dataObjectJson = JObject.Parse(config.ToString());
            var content = ExcelHelper.ExportToExcelTemplate(dataObjectJson);
            string tabeName = (string)dataObjectJson["tableName"];
            Response.Clear();
            var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.Headers.Add("content-disposition", "attachment;filename=" + tabeName + ".xlsx");
            Response.ContentType = contentType;
            await Response.Body.WriteAsync(content);
            Response.Body.Flush();
            return Ok();
        }
    }
}