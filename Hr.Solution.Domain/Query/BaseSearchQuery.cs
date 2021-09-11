using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Domain.Query
{
   public class BaseSearchQuery
    {
        public int PageIndex { get; set; } = 1;

        public int PageSize { get; set; } = 20;
    }
}
