using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Domain.Responses
{
   public class SearchPagedResults<T> where T: class
    {
        public List<T> Data { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool HasMore { get; set; }
        public int TotalItem { get; set; }
    }
}
