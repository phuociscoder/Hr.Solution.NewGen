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
   public class UserServices: IUserServices
    {
        private readonly IRepository repository;
        public UserServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<int> Delete(string id)
        {
            var result = await repository.ExecuteAsync<UserResponse>(ProcedureConstants.SP_USER_DELETE, new { userId = id });
            return result;
        }

        public async Task<List<UserFunctionPermissionResponse>> GetUserFunctionsPermissions(string userId)
        {
            var response = await repository.QueryAsync<UserFunctionPermissionResponse>(ProcedureConstants.SP_USER_GET_SYS_FUNC_PERMISSIONS, new { userId = userId });
            var permissions = response.Data;
            var levels = permissions.OrderByDescending(x => x.Level).Select(x => x.Level).Distinct().ToList();
            var results = new List<UserFunctionPermissionResponse>();
            foreach (var level in levels)
            {
                var functions = permissions.Where(x => x.Level == level).ToList();
                if (level == levels[0])
                {
                    results.AddRange(functions);
                }
                else
                {
                    functions.ForEach(func => {
                       func.View = results.Any(x => x.ParentId == func.FunctionId && x.View == true);
                        results.Add(func);
                    });
                }
            }

            return results;
        }

        public async Task<List<UserSysRoleResponse>> GetUserSystemRoles(string userId)
        {
            var results = await repository.QueryAsync<UserSysRoleResponse>(ProcedureConstants.SP_USER_GET_SYS_ROLES, new { userId = userId });
            return results.Data;
        }

        public async Task<List<UserResponse>> SearchUsers(UserRequest request)
        {
            var result = await repository.QueryAsync<UserResponse>(ProcedureConstants.SP_USER_GET_LIST, request);
            return result.Data;
        }
    }
}
