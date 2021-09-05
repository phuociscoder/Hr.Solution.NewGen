using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Hr.Solution.Application.Authentication;
using System.Linq;
using Hr.Solution.Data.Query;
using Hr.Solution.Data.Responses;
using System.Collections.Generic;
using System;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentServices departmentServices;
        private readonly IMediaServices mediaServices;
        private readonly UserManager<ApplicationUser> userManager;
        public DepartmentController(IDepartmentServices departmentServices, IMediaServices mediaServices, UserManager<ApplicationUser> userManager)
        {
            this.departmentServices = departmentServices;
            this.mediaServices = mediaServices;
            this.userManager = userManager;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetByFreeText([FromQuery] string freeText)
        {
            var result = await departmentServices.GetByFreeText(freeText);
            return Ok(result);
        }

        [HttpGet, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> GetById(int id)
        {
            var result = await departmentServices.GetById(id);
            return Ok(result);
        }

        [HttpPost, Route("")]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] DepartmentCreateRequest request)
        {
            if (string.IsNullOrEmpty(request.LogoImage))
            {
                request.LogoImage = mediaServices.ResizeImage(request.LogoImage);
            }
            var result = await departmentServices.Create(request);
            return Created(string.Empty, result);
        }

        [HttpGet, Route("existing/{departmentCode}")]
        [Authorize]
        public async Task<ActionResult> CheckExisting(string departmentCode)
        {
            var result = await departmentServices.CheckExisting(departmentCode);
            var isExisting = false;
            if (result != null)
            {
                isExisting = true;
            }

            return Ok(isExisting);

        }

        [HttpGet, Route("userDepartments")]
        [Authorize]
        public async Task<ActionResult> GetDepartmentInRoles()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await userManager.FindByIdAsync(userId);
            if (user.IsAdmin)
            {
                var depts = await departmentServices.GetByFreeText(freeText: null);
                return Ok(depts.Select(x => x.Id));
            }
            var results = await departmentServices.GetDepartmentIdsByRoles(new Guid(userId));
            return Ok(results);
        }

        [HttpGet, Route("roles")]
        [Authorize]
        public async Task<ActionResult> GetByRoles([FromQuery] SearchDepartmentQuery query)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await userManager.FindByIdAsync(userId);
            var allDepts = await departmentServices.GetByFreeText(freeText: null);
            if (user.IsAdmin || query.FullLoad)
            {
                return Ok(allDepts);
            }
            List<DepartmentGetByFreeTextResponse> results = new List<DepartmentGetByFreeTextResponse>();
            var deptIdsInRoles = await departmentServices.GetDepartmentIdsByRoles(new System.Guid(userId));
            var departments = allDepts.Where(x => deptIdsInRoles.Contains(x.Id)).OrderByDescending(x => x.Level).ToList();
            results.AddRange(departments);
                foreach (var dept in departments)
                {
                    RetriveParent(dept, allDepts, results);
                }
            return Ok(results);


        }

        private void RetriveParent(DepartmentGetByFreeTextResponse dept, List<DepartmentGetByFreeTextResponse> allDepts, List<DepartmentGetByFreeTextResponse> results)
        {
            var parent = allDepts.FirstOrDefault(x => x.Id == dept.ParentId);
            if (parent != null && !results.Any(x => x.Id == parent.Id))
            {
                results.Add(parent);
                RetriveParent(parent, allDepts, results);
            }
        }

        [HttpDelete, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await departmentServices.Delete(id);
            return Ok(result);
        }

        [HttpPut, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> Update(int id, [FromBody] DepartmentUpdateRequest request)
        {
            request.Id = id;

            if (!string.IsNullOrEmpty(request.LogoImage))
            {
                request.LogoImage = mediaServices.ResizeImage(request.LogoImage);
            }
            var result = await departmentServices.Update(request);
            return Ok(result);
        }

    }
}
