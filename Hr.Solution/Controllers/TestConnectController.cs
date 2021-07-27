using Dapper;
using Hr.Solution.Core;
using Hr.Solution.Domain.Responses;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Hr.Solution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestConnectController : ControllerBase
    {
        private readonly IDbContext _dbContext;
        public TestConnectController(IDbContext dbContext) {
            _dbContext = dbContext;
        }

        [HttpGet, Route("")]
        public ActionResult GetAll()
        {
            using (var connection = _dbContext.GetDBConnection())
            {
                var result = connection.Query<LsNationResponse>("SELECT * FROM LsNation").ToList();
                return Ok(result);
            }
        }
    }
}
