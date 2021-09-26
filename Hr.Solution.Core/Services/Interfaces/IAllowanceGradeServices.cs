using Hr.Solution.Data.Requests;
using Hr.Solution.Data.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Services.Interfaces
{
    public interface IAllowanceGradeServices
    {
        Task<List<AllowanceGradeGetListResponse>> GetList(string freeText);
        Task<AllowanceGradeGetByIdResponse> GetById(int id);
        Task<AllowanceGradeInsertResponse> Insert(AllowanceGradeInsertRequest request);
        Task<AllowanceGradeUpdateResponse> Update(AllowanceGradeUpdateRequest request);
        Task<int> Delete(int id);
    }
}
