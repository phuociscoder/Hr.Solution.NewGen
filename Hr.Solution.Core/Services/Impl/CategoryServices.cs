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
    public class CategoryServices : ICategoryServices
    {
        private readonly IRepository repository;
        public CategoryServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<CategoryKeyValueResponse> AddCategoryItem(AddCategoryItemRequest request)
        {
            var response = await repository.ExecuteScalarAsync<CategoryKeyValueResponse>(ProcedureConstants.SP_CATEGORY_ADD_ITEM, request);
            return response;
        }

        public async Task<LsInsuranceResponse> AddInsurance(LsInsuranceInsertRequest request)
        {
            var response = await repository.ExecuteScalarAsync<LsInsuranceResponse>(ProcedureConstants.SP_LSINSURACE_INSERT, request);
            return response;
        }

        public async Task<int> DeleteCategoryItem(DeleteCategoryItemRequest request)
        {
            var response = await repository.ExecuteAsync<CategoryKeyValueResponse>(ProcedureConstants.SP_CATEGORY_DELETE_ITEM, request);
            return response;
        }

        public async Task<int> DeleteInsurance(int id)
        {
            var response = await repository.ExecuteAsync(ProcedureConstants.SP_LSINSURANCE_DELETE, new { Id = id });
            return response;
        }

        public async Task<CategoryResponse> GetById(string id)
        {
            var response = await repository.ExecuteScalarAsync<CategoryResponse>(ProcedureConstants.SP_CATEGORY_GET_BY_ID, new { id = id });
            return response;
        }

        public async Task<List<CategoryKeyValueResponse>> GetCategoryItems(string id)
        {
            var response = await repository.QueryAsync<CategoryKeyValueResponse>(ProcedureConstants.SP_CATEGORY_GET_ITEMS, new { id = id });
            return response.Data;
        }

        public async Task<LsInsuranceResponse> GetInsuranceById(int id)
        {
            var response = await repository.ExecuteScalarAsync<LsInsuranceResponse>(ProcedureConstants.SP_LSINSURANCE_GET_BY_ID, new { id = id });
            return response;
        }

        public async Task<List<LsInsuranceResponse>> GetInsurances()
        {
            var response = await repository.QueryAsync<LsInsuranceResponse>(ProcedureConstants.SP_LSINSURANCE_GET_ALL, null);
            return response.Data;
        }

        public async Task<List<CategoryResponse>> GetList()
        {
            var response = await repository.QueryAsync<CategoryResponse>(ProcedureConstants.SP_CATEGORY_GET_LIST, null);
            return response.Data;
        }

        public async Task<List<NationResponse>> GetNations(string prefix, string parentCode)
        {
            var response = await repository.QueryAsync<NationResponse>(ProcedureConstants.SP_CATEGORY_NATION_GETALL, new { prefix = prefix, parentCode });
            return response.Data;
        }

        public async Task<CategoryKeyValueResponse> UpdateCategoryItem(UpdateCategoryItemRequest request)
        {
            var response = await repository.ExecuteScalarAsync<CategoryKeyValueResponse>(ProcedureConstants.SP_CATEGORY_UPDATE_ITEM, request);
            return response;
        }

        public async Task<LsInsuranceResponse> UpdateInsurance(LsInsuranceUpdateRequest request)
        {
            var response = await repository.ExecuteScalarAsync<LsInsuranceResponse>(ProcedureConstants.SP_LSINSURANCE_UPDATE, request);
            return response;
        }
    }
}
