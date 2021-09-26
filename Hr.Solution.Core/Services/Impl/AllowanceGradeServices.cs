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
    public class AllowanceGradeServices : IAllowanceGradeServices
    {
        private readonly IRepository repository;

        public AllowanceGradeServices(IRepository repository)
        {
            this.repository = repository;
        }
        public async Task<int> Delete(int id)
        {
            return await repository.ExecuteAsync(ProcedureConstants.SP_ALLOWANCEGRADE_GET_DELETE, new { id = id});
        }

        public async Task<AllowanceGradeGetByIdResponse> GetById(int id)
        {
            return await repository.ExecuteScalarAsync<AllowanceGradeGetByIdResponse>(ProcedureConstants.SP_ALLOWANCEGRADE_GET_BY_ID, new { id = id});
        }

        public async Task<List<AllowanceGradeGetListResponse>> GetList(string freeText)
        {
            var responses = await repository.QueryAsync<AllowanceGradeGetListResponse>(ProcedureConstants.SP_ALLOWANCEGRADE_GET_LIST, new { freeText = freeText });
            return responses.Data;
        }

        public async Task<AllowanceGradeInsertResponse> Insert(AllowanceGradeInsertRequest request)
        {
            return await repository.ExecuteScalarAsync<AllowanceGradeInsertResponse>(ProcedureConstants.SP_ALLOWANCEGRADE_GET_INSERT, request);
        }

        public async Task<AllowanceGradeUpdateResponse> Update(AllowanceGradeUpdateRequest request)
        {
            return await repository.ExecuteScalarAsync<AllowanceGradeUpdateResponse>(ProcedureConstants.SP_ALLOWANCEGRADE_GET_UPDATE, request);
        }
    }
}
