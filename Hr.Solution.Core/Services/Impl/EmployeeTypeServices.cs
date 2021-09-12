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
    public class EmployeeTypeServices : IEmployeeTypeServices
    {
        private readonly IRepository repository;

        public EmployeeTypeServices(IRepository repository)
        {
            this.repository = repository;
        }
        public async Task<EmployeeTypeAddEmpResponse> AddEmp(EmployeeTypeAddEmpRequest request)
        {
           return await repository.ExecuteScalarAsync<EmployeeTypeAddEmpResponse>(ProcedureConstants.spEmployeeType_AddEmp, request);
        }

        public async Task<string> Delete(int id)
        {
            var response = await repository.ExecuteScalarAsync(ProcedureConstants.spEmployeeType_Delete, new{id=id});
            return (string)response;
        }

        public async Task<EmployeeTypeGetByIdResponse> GetById(int id)
        {
            return await repository.SingleOrDefault<EmployeeTypeGetByIdResponse>(ProcedureConstants.spEmployeeType_GetById, new { id=id });
        }

        public async Task<List<EmployeeTypeGetListResponse>> GetList(string freeText)
        {
            var results =  await repository.QueryAsync<EmployeeTypeGetListResponse>(ProcedureConstants.spEmployeeType_GetAll, new {freeText = freeText });
            return results.Data;
        }

        public async Task<EmployeeTypeUpdateEmpResponse> UpdateEmp(EmployeeTypeUpdateEmpRequest request)
        {
            return await repository.ExecuteScalarAsync<EmployeeTypeUpdateEmpResponse>(ProcedureConstants.spEmployeeType_Update, request);
        }
    }
}
