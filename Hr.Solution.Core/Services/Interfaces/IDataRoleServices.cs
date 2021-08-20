using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Interfaces
{
   public interface IDataRoleServices
    {
        Task<List<DataRoleGetListResponse>> GetList(string freeText);
        Task<Sys_DataDomain> Add(DataRoleAddRequest request);
        Task<Sys_DataDomain> Update(DataRoleUpdateRequest request);
        Task<List<DataDomain_SysRoleResponse>> GetDomainSysRoles(int domainId, string freeText);
        Task<int> RemoveSysRole(int id);
        Task<DataDomain_SysRoleResponse> AddSysRole(int domainId, DataRoleAddSysRoleRequest request);
        Task<List<DataDomain_DepartmentResponse>> GetDomainDepartments(int domainId);
        Task<int> UpdateDomainDepartments(int domainId, DataRoleUpdateDepartmentsRequest request);
    }
}
