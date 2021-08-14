﻿using Hr.Solution.Core.Constants;
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

        public async Task<List<UserResponse>> SearchUsers(UserRequest request)
        {
            var result = await repository.QueryAsync<UserResponse>(ProcedureConstants.SP_USER_GET, request);
            return result.Data;
        }
    }
}
