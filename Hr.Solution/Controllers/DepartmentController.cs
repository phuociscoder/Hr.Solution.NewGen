using Hr.Solution.Core.Services.Interfaces;
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
        public DepartmentController(IDepartmentServices departmentServices)
        {
            this.departmentServices = departmentServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetByFreeText([FromQuery] string freeText)
        {
            var result = await departmentServices.GetByFreeText(freeText);
            return Ok(result);
        }
    }
}
