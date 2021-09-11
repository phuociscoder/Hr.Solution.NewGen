using Hr.Solution.Domain.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
   public class GetEmployeeByDeptsRequest : BaseSearchQuery
    {
        public IEnumerable<int> DepartmentIds { get; set; }
        public string FreeText { get; set; }
    }
}
