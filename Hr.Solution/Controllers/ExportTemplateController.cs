using Hr.Solution.Core.Services.Impl;
using Hr.Solution.Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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
    }
}
