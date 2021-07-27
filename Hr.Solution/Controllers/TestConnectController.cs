using Dapper;
using Hr.Solution.Core;
using Hr.Solution.Domain.Requests;
using Hr.Solution.Domain.Responses;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
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
            
            var result = await _repo.QueryAsync<LsNationResponse>("GetLSNationList", null).ConfigureAwait(false);
            return Ok(result);
        }
    }
}
