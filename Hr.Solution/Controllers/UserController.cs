using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServices userServices;
        public UserController(IUserServices userServices)
        {
            this.userServices = userServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetAll([FromQuery] UserRequest request)
        {
            var result = await userServices.SearchUsers(request);
            return Ok(result);
        }

        [HttpPut, Route("delete/{id}")]
        [Authorize]
        public async Task<ActionResult> Delete(string id)
        {
            var result = await userServices.Delete(id);
            return Ok(result);
        }
    }
}
