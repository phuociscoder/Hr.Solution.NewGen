using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Impl
{
    public class EmployeeServices : IEmployeeServices
    {
        private readonly IRepository repository;

        public EmployeeServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<List<EmployeeResponse>> Employees_GetData(bool Active, string strDeptCode, string strValueSearch, ParramsRequest Request)
        {
            var response = await repository.QueryAsync<EmployeeResponse>(ProcedureConstants.spEmployees_spGetAll,
                            new {
                                UserID = Request.UserID,
                                FunctionID = Request.FunctionID,
                                Lang = Request.Lang,
                                strDeptCode = strDeptCode,
                                Active = Active,
                                PageIndex = Request.PageIndex,
                                PageSize = Request.PageSize,
                                KeySearch = strValueSearch,
                                totalRow = 0
                            });
            return response.Data;
        }

        public async Task<List<EmployeeManagersResponse>> Employee_GetManagers()
        {
            var response = await repository.QueryAsync<EmployeeManagersResponse>(ProcedureConstants.SP_EMPLOYEE_GET_MANAGERS, null);
            return response.Data;
        }

    }
}
