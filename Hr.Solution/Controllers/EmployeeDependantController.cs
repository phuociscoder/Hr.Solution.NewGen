using Hr.Solution.Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class EmployeeDependantController : ControllerBase
    {
        private readonly IEmployeeDependantServices employeeDependantServiecs;

        public EmployeeDependantController(IEmployeeDependantServices employeeDependantServiecs)
        {
            this.employeeDependantServiecs = employeeDependantServiecs;
        }

        [HttpGet, Route("id/{id}")]
        [Authorize]
        public async Task<ActionResult> GetList (int EmpId)
        {
            var response = await employeeDependantServiecs.GetList(EmpId);
            return Ok(response);
        }
    }
}
