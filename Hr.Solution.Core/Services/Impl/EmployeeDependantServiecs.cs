using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Impl
{
    public class EmployeeDependantServiecs : IEmployeeDependantServices
    {
        private readonly IRepository repository;

        public EmployeeDependantServiecs(IRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<EmployeeDependantGetListResponse>> GetList(int EmployeeId)
        {
            var results = await repository.QueryAsync<EmployeeDependantGetListResponse>(ProcedureConstants.SP_EMPLOYEEDEPENDANT_GET_LIST, new {EmployeeId = EmployeeId});
            return results.Data;
        }
    }
}
