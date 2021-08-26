﻿using Hr.Solution.Core.Constants;
using Hr.Solution.Core.Services.Interfaces;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Impl
{
    public class DepartmentServices : IDepartmentServices
    {
        private readonly IRepository repository;

        public DepartmentServices(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<List<DepartmentGetByFreeTextResponse>> GetByFreeText(string freeText)
        {
            var response = await repository.QueryAsync<DepartmentGetByFreeTextResponse>(ProcedureConstants.SP_DEPARTMENT_GETALL, new { freeText = freeText });
            return response.Data;
        }
    }
}