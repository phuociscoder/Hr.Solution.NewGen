using Dapper;
using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using Hr.Solution.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Impl
{
    public class SystemRoleServices : ISystemRoleServices
    {
        private readonly IRepository repository;

        public SystemRoleServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<SystemRoleUserReponse> AddUser(SystemRoleAddUserRequest request)
        {
            return await repository.ExecuteScalarAsync<SystemRoleUserReponse>(ProcedureConstants.SP_SYSTEM_ROLE_ADD_USER, request);
        }

        public async Task<SystemRoleResponse> Create(CreateSystemRoleRequest request)
        {
            return await repository.ExecuteScalarAsync<SystemRoleResponse>(ProcedureConstants.SP_SYSTEM_ROLE_INSERT, request);
        }

        public async Task<List<SystemRoleResponse>> GetAll(SystemRoleRequest request)
        {
            var systemRoles = await repository.QueryAsync<SystemRoleResponse>(ProcedureConstants.SP_SYSTEM_ROLE_GET_ALL, request);
            return systemRoles.Data.OrderByDescending(x => x.CreatedOn).ToList();
        }

        public async Task<SystemRoleResponse> GetById(Guid id)
        {
            return await repository.SingleOrDefault<SystemRoleResponse>(ProcedureConstants.SP_SYSTEM_ROLE_GET_BY_ID, id);
        }

        public async Task<List<SystemRoleGetFunctionsReponse>> GetFunctions()
        {
            var result = await repository.QueryAsync<SystemRoleGetFunctionsReponse>(ProcedureConstants.SP_SYSTEM_ROLE_GET_FUNCTIONS, null);
            return result.Data;
        }

        public async Task<List<SystemRolePermissionResponse>> GetRolePermissions(Guid roleId)
        {
            var result = await repository.QueryAsync<SystemRolePermissionResponse>(ProcedureConstants.SP_SYSTEM_ROLE_GET_ROLE_PERMISSIONS, new { roleId = roleId });
            return result.Data;
        }

        public async Task<SearchPagedResults<SystemRoleUserReponse>> GetUsers(string roleId, string freeText)
        {
            return await repository.QueryAsync<SystemRoleUserReponse>(ProcedureConstants.SP_SYSTEM_ROLE_GET_USERS, new { roleId = roleId, freeText = freeText });
        }

        public async Task<int> RemoveUser(Guid userRoleId)
        {
            return await repository.ExecuteAsync<SystemRoleUserReponse>(ProcedureConstants.SP_SYSTEM_ROLE_REMOVE_USER, new { userRoleId = userRoleId });
        }

        public async Task<SystemRoleResponse> Update(UpdateSystemRoleRequest request)
        {
            return await repository.ExecuteScalarAsync<SystemRoleResponse>(ProcedureConstants.SP_SYSTEM_ROLE_UPDATE, request);
        }

        public async Task<int> UpdatePermission(IEnumerable<SystemRoleUpdatePermissionRequest> request)
        {
            var roleId = request.First().RoleId;
            var tblParams = new DataTable();
            tblParams.Columns.Add("RoleID");
            tblParams.Columns.Add("FunctionID");
            tblParams.Columns.Add("View");
            tblParams.Columns.Add("Add");
            tblParams.Columns.Add("Edit");
            tblParams.Columns.Add("Delete");
            tblParams.Columns.Add("Import");
            tblParams.Columns.Add("Export");
            tblParams.Columns.Add("CreatedBy");

            foreach (var rolePermission in request)
            {
                tblParams.Rows.Add(rolePermission.RoleId, rolePermission.FunctionId, rolePermission.View, rolePermission.Add, rolePermission.Edit, rolePermission.Delete, rolePermission.Import, rolePermission.Export, rolePermission.CreatedBy);
            }


            return await repository.ExecuteAsync<SystemRolePermissionResponse>(ProcedureConstants.SP_SYSTEM_ROLE_UPDATE_PERMISSION, new {roleId =roleId, rolePermissions= tblParams.AsTableValuedParameter("TVP_SysRolePermission")}, false);
        }
    }
}
