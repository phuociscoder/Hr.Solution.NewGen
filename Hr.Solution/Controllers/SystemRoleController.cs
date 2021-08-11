using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemRoleController : ControllerBase
    {
        private readonly ISystemRoleServices systemRoleServices;

        public SystemRoleController(ISystemRoleServices systemRoleServices)
        {
            this.systemRoleServices = systemRoleServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetAll([FromQuery]SystemRoleRequest request)
        {
            var result = await systemRoleServices.GetAll(request);
            return Ok(result);
        }

        [HttpPost, Route("")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] CreateSystemRoleRequest request)
        {
            try
            {
                var result = await systemRoleServices.Create(request);
                return Created(string.Empty, result);
            }
            catch (Exception ex)
            {
                var a = ex;
            }
            return null;
        }

    }
}
