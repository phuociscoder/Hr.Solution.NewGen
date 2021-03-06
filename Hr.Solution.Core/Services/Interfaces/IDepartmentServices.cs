using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Interfaces
{
   public interface IDepartmentServices
    {
        Task<List<DepartmentGetByFreeTextResponse>> GetByFreeText(string freeText);
        Task<DepartmentResponse> GetById(int id);
        Task<int> Create(DepartmentCreateRequest request);
        Task<DepartmentResponse> CheckExisting(string departmentCode);
        Task<string> Delete(int id);
        Task<int> Update(DepartmentUpdateRequest request);
        Task<List<int>> GetDepartmentIdsByRoles(Guid UserId);
    }
}
