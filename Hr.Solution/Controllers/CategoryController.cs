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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryServices categoryServices;
        public CategoryController(ICategoryServices categoryServices)
        {
            this.categoryServices = categoryServices;
        }

        [HttpGet, Route("")]
        [Authorize]
        public async Task<ActionResult> GetList()
        {
            var results = await categoryServices.GetList();
            return Ok(results);
        }

        [HttpGet, Route("{id}")]
        [Authorize]
        public async Task<ActionResult> GetById(string id)
        {
            var result = await categoryServices.GetById(id);
            return Ok(result);
        }

        [HttpGet, Route("item/{id}")]
        [Authorize]
        public async Task<ActionResult> GetCategoryItems(string id)
        {
            var results = await categoryServices.GetCategoryItems(id);
            return Ok(results);
        }

        [HttpPost, Route("item")]
        [Authorize]
        public async Task<ActionResult> AddCategoryItem([FromBody] AddCategoryItemRequest request)
        {
            var result = await categoryServices.AddCategoryItem(request);
            return Created(string.Empty, result);
        }

        [HttpPut, Route("item/{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateCategoryItem(int id, [FromBody] UpdateCategoryItemRequest request)
        {
            request.Id = id;
            var result = await categoryServices.UpdateCategoryItem(request);
            return Ok(result);
        }

        [HttpDelete, Route("item/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteCategoryItem(int id, [FromBody] string deletedBy)
        {
            var result = await categoryServices.DeleteCategoryItem(new DeleteCategoryItemRequest { Id = id, DeletedBy = deletedBy });
            return Ok(result);
        }
    }
}
