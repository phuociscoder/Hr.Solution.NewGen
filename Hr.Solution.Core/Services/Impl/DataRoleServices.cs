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
    public class DataRoleServices : IDataRoleServices
    {
        private readonly IRepository repository;

        public DataRoleServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Sys_DataDomain> Add(DataRoleAddRequest request)
        {
            return await repository.ExecuteScalarAsync<Sys_DataDomain>(ProcedureConstants.SP_DATA_ROLE_ADD, request);
        }

        public async Task<DataDomain_SysRoleResponse> AddSysRole(int domainId, DataRoleAddSysRoleRequest request)
        {
            return await repository.ExecuteScalarAsync<DataDomain_SysRoleResponse>(ProcedureConstants.SP_DATA_ROLE_ADD_SYS_ROLE, new {domainId= domainId, roleId =request.RoleId, createdBy= request.CreatedBy });
        }

        public async Task<string> Delete(int id)
        {
            var response = await repository.ExecuteScalarAsync(ProcedureConstants.SP_DATA_ROLE_DELETE, new { id = id });
            return (string)response;
        }

        public async Task<List<DataDomain_DepartmentResponse>> GetDomainDepartments(int domainId)
        {
            var response = await repository.QueryAsync<DataDomain_DepartmentResponse>(ProcedureConstants.SP_DATA_ROLE_GET_DEPARTMENTS, new { domainId = domainId });
            return response.Data;
        }

        public async Task<List<DataDomain_SysRoleResponse>> GetDomainSysRoles(int domainId, string freeText)
        {
            var response = await repository.QueryAsync<DataDomain_SysRoleResponse>(ProcedureConstants.SP_DATA_ROLE_GET_SYS_ROLES, new { domainId = domainId, freeText = freeText });
            return response.Data;
        }

        public async Task<List<DataRoleGetListResponse>> GetList(string freeText)
        {
            var response = await repository.QueryAsync<DataRoleGetListResponse>(ProcedureConstants.SP_DATA_ROLE_GETS, new { freeText = freeText });
            return response.Data;
        }

        public async Task<int> RemoveSysRole(int id)
        {
            var response = await repository.ExecuteAsync<Sys_DataDomain>(ProcedureConstants.SP_DATA_ROLE_REMOVE_SYS_ROLE, new { id = id });
            return response;
        }

        public async Task<Sys_DataDomain> Update(DataRoleUpdateRequest request)
        {
            return await repository.ExecuteScalarAsync<Sys_DataDomain>(ProcedureConstants.SP_DATA_ROLE_UPDATE, request);
        }

        public async Task<int> UpdateDomainDepartments(int domainId, DataRoleUpdateDepartmentsRequest request)
        {
            var removeDepartments = await repository.ExecuteAsync<DataDomain_DepartmentResponse>(ProcedureConstants.SP_DATA_ROLE_REMOVE_DEPARTMENTS, new { domainId = domainId });
            foreach (var id in request.DepartmentIds)
            {
                await repository.ExecuteAsync<DataDomain_DepartmentResponse>(ProcedureConstants.SP_DATA_ROLE_UPDATE_DEPARMENT, new { domainId = domainId, departmentId = id });
            }

            return 1;
        }
    }
}
