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
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeServices employeeServices;
        public EmployeeController(IEmployeeServices employeeServices)
        {
            this.employeeServices = employeeServices;
        }

        [HttpGet, Route("managers")]
        [Authorize]
        public async Task<ActionResult> GetManagers()
        {
            var result = await employeeServices.Employee_GetManagers();
            return Ok(result);
        }

        [HttpPost, Route("getByDepts")]
        [Authorize]
        public async Task<ActionResult> GetByDepts([FromBody]GetEmployeeByDeptsRequest request)
        {
            var results = await employeeServices.GetByDepts(request);
            return Ok(results);
        }

    }
}
