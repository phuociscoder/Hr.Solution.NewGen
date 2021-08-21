﻿using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Interfaces
{
   public interface ICategoryServices
    {
        Task<List<CategoryResponse>> GetList();
        Task<CategoryResponse> GetById(string id);
        Task<List<CategoryKeyValueResponse>> GetCategoryItems(string id);
        Task<CategoryKeyValueResponse> AddCategoryItem(AddCategoryItemRequest request);
        Task<CategoryKeyValueResponse> UpdateCategoryItem(UpdateCategoryItemRequest request);
        Task<int> DeleteCategoryItem(DeleteCategoryItemRequest request);
    }
}
