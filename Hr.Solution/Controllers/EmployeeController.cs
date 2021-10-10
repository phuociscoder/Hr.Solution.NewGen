using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Core.Utilities;
using Hr.Solution.Data.ImportModel;
using Hr.Solution.Data.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeServices employeeServices;
        private readonly IMediaServices mediaServices;

        public EmployeeController(IEmployeeServices employeeServices, IMediaServices mediaServices)
        {
            this.employeeServices = employeeServices;
            this.mediaServices = mediaServices;
        }

        [HttpGet, Route("managers")]
        [Authorize]
        public async Task<ActionResult> GetManagers()
        {
            var result = await employeeServices.Employee_GetManagers();
            return Ok(result);
        }

        [HttpPost, Route("getByDepts")]
        [Authorize]
        public async Task<ActionResult> GetByDepts([FromBody] GetEmployeeByDeptsRequest request)
        {
            var results = await employeeServices.GetByDepts(request);
            return Ok(results);
        }


        [HttpPost, Route("generalInfo")]
        [Authorize]
        public async Task<ActionResult> CreateGeneralInfo([FromBody] EmpoyeeCreateGeneralInfoRequest employeeRequest)
        {
            if (string.IsNullOrEmpty(employeeRequest.Code))
            {
                return Ok(new { status = "FAILED", message = "CODE_EMPTY" });
            }

            if (!string.IsNullOrEmpty(employeeRequest.Photo))
            {
                employeeRequest.Photo = mediaServices.ResizeImage(employeeRequest.Photo);
            }

            var checkExisting = await employeeServices.EmployeeCheckExisting(employeeRequest.Code);
            if (!string.IsNullOrEmpty(checkExisting))
            {
                return Ok(new { status = "FAILED", message = "CODE_EXISTING" });
            }

            var createdBy = User.FindFirst(ClaimTypes.Name).Value;
            employeeRequest.CreatedBy = createdBy;

            try
            {
                var result = await employeeServices.EmployeeCreateGeneralInfo(employeeRequest);
                return Ok(new { status = "SUCCESS", message = "", value = result.Id });
            }
            catch (Exception ex)
            {

                return Ok(new { status = "FAILED", message = "INSERT_FAILED" });
            }
        }

        //[HttpGet, Route("{id}")]
        //[Authorize]
        //public async Task<ActionResult> GetByIdGeneralInfo(int id)
        //{
        //    var result = await employeeServices.EmployeeGetByIdGeneralInfo(id);
        //    return Ok(result);
        //}

        [HttpPut, Route("")]
        [Authorize]
        public async Task<ActionResult> UpdateGeneralInfo([FromBody] EmployeeUpdateGeneralInfoRequest request)
        {
            var modifiedBy = User.FindFirst(ClaimTypes.Name).Value;
            request.ModifiedBy = modifiedBy;
            var result = await employeeServices.EmployeeUpdateGeneralInfo(request);
            return Ok(result);
        }

        [HttpPost, Route("basicSalaryInfo")]
        [Authorize]
        public async Task<ActionResult> UpdateBasicSalary([FromBody] EmployeesBasicSalaryUpdateRequest request)
        {
            var modifiedBy = User.FindFirst(ClaimTypes.Name).Value;
            request.ModifiedBy = modifiedBy;
            var result = await employeeServices.EmployeesBasicSalaryUpdate(request);
            return Ok(new { status = "SUCCESS", message = "", value = result });
        }

        [HttpGet, Route("basicSalaryInfo/{id}")]
        [Authorize]
        public async Task<ActionResult> GetByIdBasicSalary(int id)
        {
            var result = await employeeServices.EmployeesBasicSalaryGetById(id);
            return Ok(result);
        }

        [HttpPost, Route("allowances")]
        [Authorize]
        public async Task<ActionResult> EmployeeAllowancesUpdate([FromBody] EmployeeAllowanceRequest request)
        {
            var modifiedBy = User.FindFirst(ClaimTypes.Name).Value;
            var result = await employeeServices.EmployeeAllowance_CUD(request, modifiedBy);
            return Ok(new { status = "SUCCESS", message = "", value = result });
        }

        [HttpPost, Route("contracts")]
        [Authorize]
        public async Task<ActionResult> EmployeeContractUpdate([FromBody] EmployeeContractRequest request)
        {
            var currentUser = User.FindFirst(ClaimTypes.Name).Value;
            var result = await employeeServices.EmployeeContract_CUD(request, currentUser);
            return Ok(new { status = "SUCCESS", message = "", value = result });
        }

        [HttpPost, Route("dependants")]
        [Authorize]
        public async Task<ActionResult> EmployeeDependantUpdate([FromBody] EmployeeDependantsRequest request)
        {
            var currentUser = User.FindFirst(ClaimTypes.Name).Value;
            var result = await employeeServices.EmployeeDependants_CUD(request, currentUser);
            return Ok(new { status = "SUCCESS", message = "", value = result });
        }

        [HttpPost, Route("basicSalaryProcess")]
        [Authorize]
        public async Task<ActionResult> EmployeeBasicSalProcessUpdate([FromBody] EmployeeBasicSalaryProcessRequest request)
        {
            var currentUser = User.FindFirst(ClaimTypes.Name).Value;
            var result = await employeeServices.EmployeeBasicSalaryProcess_CUD(request, currentUser);
            return Ok(new { status = "SUCCESS", message = "", value = result });
        }

        [HttpPost, Route("insurances")]
        [Authorize]
        public async Task<ActionResult> EmployeeInsuranceUpdate([FromBody] EmployeeInsuranceRequest request)
        {
            var currentUser = User.FindFirst(ClaimTypes.Name).Value;
            var result = await employeeServices.EmployeeInsuranceUpdate(request, currentUser);
            return Ok(new { status = "SUCCESS", message = "", value = result });
            
        }

        [HttpGet, Route("{id}")]
        public async Task<ActionResult> GetEmployeeInformation(int id)
        {
            var result = await employeeServices.GetById(id);
            return Ok(result);
        }

        [HttpGet, Route("photo/{photoId}")]
        public async Task<ActionResult> GetEmployeePhoto(Guid photoId)
        {
            var result = await employeeServices.GetEmployeePhoto(photoId);
            return Ok(result);
        }

        [HttpPost, Route("ImportData")]
        [AllowAnonymous]
        public async Task<ActionResult> ImportEmployees(IFormFile request)
        {
            using (Stream xlsxStream = new MemoryStream())
            {
                // Read file upload
                using (var fileStream = request.OpenReadStream())
                    fileStream.CopyTo(xlsxStream);
                //get data from excel rows
                var importList = ExcelHelper.GetRecords<EmployeeModel>(xlsxStream);
                // call service to do import
               var errorList= await employeeServices.ImportEmployeeAuto(importList);
                return Ok("Ok");
            }
        }
    }
}
