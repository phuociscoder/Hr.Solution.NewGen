using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataRoleController : ControllerBase
    {
        private readonly IDataRoleServices dataRoleServices;

        public DataRoleController(IDataRoleServices dataRoleServices)
        {
            this.dataRoleServices = dataRoleServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetLists([FromQuery] string freeText)
        {
            var results = await dataRoleServices.GetList(freeText);
            return Ok(results);
        }

        [HttpPost, Route("")]
        [Authorize]
        public async Task<ActionResult> Add([FromBody] DataRoleAddRequest request)
        {
            var result = await dataRoleServices.Add(request);
            return Created(string.Empty, result);
        }

        [HttpPut, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> Update(int id, [FromBody] DataRoleUpdateRequest request)
        {
            var result = await dataRoleServices.Update(request);
            return Ok(result);
        }

        [HttpGet, Route("sysrole/{domainId}")]
        [Authorize]
        public async Task<ActionResult> GetSysRoles(int domainId, [FromQuery] string freeText)
        {
            var results = await dataRoleServices.GetDomainSysRoles(domainId, freeText);
            return Ok(results);
        }

        [HttpDelete, Route("sysrole/{id}")]
        [Authorize]
        public async Task<ActionResult> RemoveSysRole(int id)
        {
            var result = await dataRoleServices.RemoveSysRole(id);
            return Ok(result);
        }

        [HttpPost, Route("sysrole/{domainId}")]
        [Authorize]
        public async Task<ActionResult> AddSysRole(int domainId, [FromBody] DataRoleAddSysRoleRequest request)
        {
            var result = await dataRoleServices.AddSysRole(domainId, request);
            return Created(string.Empty, result);
        }

        [HttpGet, Route("department/{domainId}")]
        [Authorize]
        public async Task<ActionResult> GetDepartments(int domainId)
        {
            var results = await dataRoleServices.GetDomainDepartments(domainId);
            return Ok(results);
        }

        [HttpPost, Route("department/{domainId}")]
        [Authorize]
        public async Task<ActionResult> UpdateDomainDepartments(int domainId, DataRoleUpdateDepartmentsRequest request)
        {
            var result = await dataRoleServices.UpdateDomainDepartments(domainId, request);
            return Created(string.Empty, result);
        }
    }
}
