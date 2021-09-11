using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Interfaces
{
    public interface IEmployeeTypeServices
    {
        Task<List<EmployeeTypeGetListResponse>> GetList(string freeText);
        Task<EmployeeTypeGetByIdResponse> GetById(int id);
        Task<EmployeeTypeAddEmpResponse> AddEmp(EmployeeTypeAddEmpRequest request);

        Task<EmployeeTypeUpdateEmpResponse> UpdateEmp(EmployeeTypeUpdateEmpRequest request);
        Task<string> Delete(int id);

    }
}
