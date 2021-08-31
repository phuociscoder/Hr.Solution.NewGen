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
   public interface ISystemRoleServices
    {
        Task<List<SystemRoleResponse>> GetAll(SystemRoleRequest request);
        Task<SystemRoleResponse> GetById(Guid id);
        Task<SystemRoleResponse> Create(CreateSystemRoleRequest request);
        Task<SystemRoleResponse> Update(UpdateSystemRoleRequest request);
        Task<SystemRoleUserReponse> AddUser(SystemRoleAddUserRequest request);
        Task<SearchPagedResults<SystemRoleUserReponse>> GetUsers(string roleId, string freeText);
        Task<int> RemoveUser(Guid userRoleId);
        Task<List<SystemRoleGetFunctionsReponse>> GetFunctions();
        Task<List<SystemRolePermissionResponse>> GetRolePermissions(Guid roleId);
        Task<int> UpdatePermission(IEnumerable<SystemRoleUpdatePermissionRequest> request);

    }
}
