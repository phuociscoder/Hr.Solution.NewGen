using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<ActionResult> GetAll([FromQuery] SystemRoleRequest request)
        {
            var result = await systemRoleServices.GetAll(request);
            return Ok(result);
        }

        [HttpGet, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> GetById(Guid id)
        {
            var result = await systemRoleServices.GetById(id);
            return Ok(result);
        }

        [HttpPost, Route("")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] CreateSystemRoleRequest request)
        {

            var result = await systemRoleServices.Create(request);
            return Created(string.Empty, result);
        }

        [HttpPut, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateSystemRoleRequest request)
        {
            request.RecID = id;
            var result = await systemRoleServices.Update(request);
            return Ok(result);
        }

        [HttpPost, Route("add-user")]
        [Authorize]
        public async Task<ActionResult> AddUser([FromBody] SystemRoleAddUserRequest request)
        {
            var result = await systemRoleServices.AddUser(request);
            return Created(string.Empty, result);
        }

        [HttpGet, Route("get-users/{roleId}")]
        [Authorize]
        public async Task<ActionResult> GetUsers(string roleId, [FromQuery]string FreeText)
        {
            var result = await systemRoleServices.GetUsers(roleId, FreeText);
            return Ok(result);
        }

        [HttpDelete, Route("delete-user/{userRoleId}")]
        [Authorize]
        public async Task<ActionResult> RemoveUser(Guid userRoleId)
        {
            var result = await systemRoleServices.RemoveUser(userRoleId);
            return Ok(result);
        }

        [HttpGet, Route("permissions/{roleId}")]
        [Authorize]
        public async Task<ActionResult> GetRolePermissions(Guid roleId)
        {
            var result = await systemRoleServices.GetRolePermissions(roleId);
            return Ok(result);
        }

        [HttpGet, Route("functions")]
        [Authorize]
        public async Task<ActionResult> GetFunctions()
        {
            var result = await systemRoleServices.GetFunctions();
            return Ok(result);
        }

        [HttpPost, Route("permissions/{roleId}")]
        [Authorize]
        public async Task<ActionResult> UpdatePermission(Guid roleId, [FromBody] IEnumerable<SystemRoleUpdatePermissionRequest> requests)
        {
            var result = await systemRoleServices.UpdatePermission(requests);
            return Ok(result);
        }

    }
}
