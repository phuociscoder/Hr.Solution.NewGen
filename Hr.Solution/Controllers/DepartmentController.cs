using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentServices departmentServices;
        private readonly IMediaServices mediaServices;
        public DepartmentController(IDepartmentServices departmentServices, IMediaServices mediaServices)
        {
            this.departmentServices = departmentServices;
            this.mediaServices = mediaServices;
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
