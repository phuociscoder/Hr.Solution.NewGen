using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using Hr.Solution.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Interfaces
{
   public interface IEmployeeServices
    {
        Task<List<EmployeeResponse>> Employees_GetData(bool Active, string strDeptCode, string strValueSearch, ParramsRequest Request);
        Task<List<EmployeeManagersResponse>> Employee_GetManagers();
        Task<SearchPagedResults<EmployeeResponse>> GetByDepts(GetEmployeeByDeptsRequest request);
        Task<EmployeeCreateGeneralInfoResponse> EmployeeCreateGeneralInfo(EmpoyeeCreateGeneralInfoRequest request);
        Task<string> EmployeeCheckExisting(string EmployeeCode);
        Task<EmployeeGetByIdGeneralInfoResponse> EmployeeGetByIdGeneralInfo(int Id);
        Task<EmployeeUpdateGeneralInfoResponse> EmployeeUpdateGeneralInfo(EmployeeUpdateGeneralInfoRequest request);
        Task<EmployeesBasicSalaryGetByIdResponse> EmployeesBasicSalaryGetById(int Id);
        Task<EmployeesBasicSalaryUpdateResponse> EmployeesBasicSalaryUpdate(EmployeesBasicSalaryUpdateRequest request);
        Task<int> EmployeeAllowance_CUD(EmployeeAllowanceRequest request, string currentUser);
        Task<int> EmployeeDependants_CUD(EmployeeDependantsRequest request, string currentUser);
        Task<int> EmployeeContract_CUD(EmployeeContractRequest request, string currentUser);
    }
}
