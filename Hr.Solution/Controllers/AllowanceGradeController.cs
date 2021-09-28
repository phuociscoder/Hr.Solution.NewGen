using Hr.Solution.Core.Services.Impl;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class AllowanceGradeController : ControllerBase
    {
        private readonly IAllowanceGradeServices allowanceGradeServices;

        public AllowanceGradeController(IAllowanceGradeServices allowanceGradeServices)
        {
            this.allowanceGradeServices = allowanceGradeServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetList ([FromQuery] string freeText)
        {
           var results = await allowanceGradeServices.GetList(freeText);
            return Ok(results);
        }

        [HttpGet, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> GetById (int id)
        {
            var result = await allowanceGradeServices.GetById(id);
            return Ok(result);
        }

        [HttpPost, Route("")]
        [Authorize]
        public async Task<ActionResult> Insert ([FromBody] AllowanceGradeInsertRequest request)
        {
            
            var createdBy = User.FindFirst(ClaimTypes.Name).Value;
            request.CreatedBy = createdBy;
            var result = await allowanceGradeServices.Insert(request);
            return Created(string.Empty, result);
        }

        [HttpPut, Route("")]
        [Authorize]
        public async Task<ActionResult> Update ([FromBody] AllowanceGradeUpdateRequest request)
        {
            
            var modifiedBy = User.FindFirst(ClaimTypes.Name).Value;
            request.ModifiedBy = modifiedBy;
            var result = await allowanceGradeServices.Update(request);
            return Ok(result);
        }

        [HttpDelete, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> Delete (int id)
        {
            var result = await allowanceGradeServices.Delete(id);
            return Ok(result);
        }

    }
}
