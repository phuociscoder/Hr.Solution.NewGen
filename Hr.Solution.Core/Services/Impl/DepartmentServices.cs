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
    public class DepartmentServices : IDepartmentServices
    {
        private readonly IRepository repository;

        public DepartmentServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<int> Create(DepartmentCreateRequest request)
        {
            var response = await repository.ExecuteAsync<DepartmentResponse>(ProcedureConstants.SP_DEPARTMENT_CREATE, request);
            return response;
        }

        public async Task<List<DepartmentGetByFreeTextResponse>> GetByFreeText(string freeText)
        {
            var response = await repository.QueryAsync<DepartmentGetByFreeTextResponse>(ProcedureConstants.SP_DEPARTMENT_GETALL, new { freeText = freeText });
            return response.Data;
        }

        public async Task<DepartmentResponse> GetById(int id)
        {
            var response = await repository.ExecuteScalarAsync<DepartmentResponse>(ProcedureConstants.SP_DEPARTMENT_GET_BY_ID, new { id = id });
            return response;
        }
    }
}
