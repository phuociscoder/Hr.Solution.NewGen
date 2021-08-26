﻿using Hr.Solution.Data.Responses;
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
    }
}