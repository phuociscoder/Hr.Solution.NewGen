using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
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
    public class EmployeeTypeController : ControllerBase
    {
        private readonly IEmployeeTypeServices employeeTypeServices;

        public EmployeeTypeController(IEmployeeTypeServices employeeTypeServices)
        {
            this.employeeTypeServices = employeeTypeServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetList([FromQuery] string freeText)
        {
            var results = await employeeTypeServices.GetList(freeText);
            return Ok(results);
        }

        [HttpGet, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> GetById(int id)
        {
            var result = await employeeTypeServices.GetById(id);
            return Ok(result);
        }

        [HttpPut, Route("updateEmp")]
        [Authorize]
        public async Task<ActionResult> UpdateEmp ([FromBody] EmployeeTypeUpdateEmpRequest request)
        {
            var modifiedName = User.FindFirst(ClaimTypes.Name).Value;
            request.ModifiedBy = modifiedName;
            var result = await employeeTypeServices.UpdateEmp(request);
            return Ok(result);
        }
        [HttpPost, Route("addEmp")]
        [Authorize]
        public async Task<ActionResult> AddEmp([FromBody] EmployeeTypeAddEmpRequest request)
        {
            var createdName = User.FindFirst(ClaimTypes.Name).Value;
            request.CreatedBy = createdName;
            var result = await employeeTypeServices.AddEmp(request);
            return Created(string.Empty,result);
        }

        [HttpDelete, Route("delete/{id}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await employeeTypeServices.Delete(id);
            return Ok(result);
        }
    }
}
