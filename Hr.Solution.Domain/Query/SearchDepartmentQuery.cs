using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Query
{
   public class SearchDepartmentQuery
    {
        public string FreeText { get; set; }
        public bool FullLoad { get; set; }
    }
}
