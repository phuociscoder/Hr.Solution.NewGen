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

        public async Task<DepartmentResponse> CheckExisting(string departmentCode)
        {
            var response = await repository.SingleOrDefault<DepartmentResponse>(ProcedureConstants.SP_DEPARTMENT_CHECKEXISTING, new { departmentCode = departmentCode });
            return response;
        }

        public async Task<int> Create(DepartmentCreateRequest request)
        {
            var response = await repository.ExecuteAsync<DepartmentResponse>(ProcedureConstants.SP_DEPARTMENT_CREATE, request);
            return response;
        }

        public async Task<string> Delete(int id)
        {
            var response = await repository.ExecuteScalarAsync(ProcedureConstants.SP_DEPARTMENT_DELETE, new { id = id });
            return (string)response;
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

        public async Task<List<int>> GetDepartmentIdsByRoles(Guid UserId)
        {
            var result = await repository.QueryAsync<DepartmentResponse>(ProcedureConstants.SP_DEPARTMENT_GET_BY_USER_ROLES, new { userId = UserId });
            return result.Data.Select(t => t.ID).ToList();
        }

        public async Task<int> Update(DepartmentUpdateRequest request)
        {
            var response = await repository.ExecuteAsync<DepartmentResponse>(ProcedureConstants.SP_DEPARTMENT_UPDATE, request);
            return response;
        }

    }
}
