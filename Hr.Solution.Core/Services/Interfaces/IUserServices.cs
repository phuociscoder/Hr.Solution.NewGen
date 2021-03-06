using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Interfaces
{
   public interface IUserServices
    {
        Task<List<UserResponse>> SearchUsers(UserRequest request);
        Task<int> Delete(string id);

        Task<List<UserSysRoleResponse>> GetUserSystemRoles(string userId);
        Task<List<UserFunctionPermissionResponse>> GetUserFunctionsPermissions(string userId);
    }
}
