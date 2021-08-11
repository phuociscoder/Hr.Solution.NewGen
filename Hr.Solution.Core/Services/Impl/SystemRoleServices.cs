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
    public class SystemRoleServices : ISystemRoleServices
    {
        private readonly IRepository repository;

        public SystemRoleServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<SystemRoleResponse> Create(CreateSystemRoleRequest request)
        {
            var newSystemRole = await repository.ExecuteScalarAsync<SystemRoleResponse>(ProcedureConstants.SP_SYSTEM_ROLE_INSERT, request);
            return newSystemRole;
        }

        public async Task<List<SystemRoleResponse>> GetAll(SystemRoleRequest request)
        {
            var systemRoles = await repository.QueryAsync<SystemRoleResponse>(ProcedureConstants.SP_SYSTEM_ROLE_GET_ALL, request);
            return systemRoles.Data.OrderByDescending(x => x.CreatedOn).ToList();
        }
    }
}
