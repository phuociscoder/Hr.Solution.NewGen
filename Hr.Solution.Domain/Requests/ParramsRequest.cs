using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
   public class ParramsRequest
    {
        public string UserID { get; set; }
        public string FunctionID { get; set; }
        public string Lang { get; set; }
        public string TokenID { get; set; }
        public string Session { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
