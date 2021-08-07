using Hr.Solution.Core;
using Hr.Solution.Domain.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Hr.Solution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestConnectController : ControllerBase
    {
        private readonly IDbContext _dbContext;
        private readonly IRepository _repo;
        public TestConnectController(IDbContext dbContext, IRepository repo) {
            _dbContext = dbContext;
            _repo = repo;
        }

        [HttpGet, Route("")]
        public async Task<ActionResult> GetAll()
        {
            string result = "Authorized here , LOL";
            return Ok(result);
        }
    }
}
