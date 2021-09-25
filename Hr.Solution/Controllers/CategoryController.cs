using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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

        [HttpPut, Route("item/delete/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteCategoryItem(int id, [FromBody] DeleteCategoryItemRequest request)
        {
            request.Id = id;
            var result = await categoryServices.DeleteCategoryItem(request);
            return Ok(result);
        }

        [HttpGet, Route("nations/{prefix}")]
        [Authorize]
        public async Task<ActionResult> GetNations(string prefix, [FromQuery]string parentCode)
        {
            var results = await categoryServices.GetNations(prefix, parentCode);
            return Ok(results);
        }

        [HttpGet, Route("insurance/{id}")]
        [Authorize]
        public async Task<ActionResult> GetInsuranceById(int id)
        {
            var result = await categoryServices.GetInsuranceById(id);
            return Ok(result);
        }

        [HttpPut, Route("insurance-update")]
        [Authorize]
        public async Task<ActionResult> UpdateInsurance([FromBody]LsInsuranceUpdateRequest request)
        {
            var modifiedBy = User.FindFirst(ClaimTypes.Name).Value;
            request.ModifiedBy = modifiedBy;
            var result = await categoryServices.UpdateInsurance(request);
            return Ok(result);
        }

        [HttpPost,Route("insurance-insert")]
        [Authorize]
        public async Task<ActionResult> AddInsurance([FromBody] LsInsuranceInsertRequest request)
        {
            var createdBy = User.FindFirst(ClaimTypes.Name).Value;
            request.CreatedBy = createdBy;
            var result = await categoryServices.AddInsurance(request);
            return Created(string.Empty, result);
        }

        [HttpDelete,Route("insurance-delete/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteInsurance(int id)
        {
            var result = await categoryServices.DeleteInsurance(id);
            return Ok(result);
        }
    }
}
