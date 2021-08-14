using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
   public class SystemRoleGetFunctionsReponse
    {
        public string FunctionId { get; set; }
        public string FunctionType { get; set; }
        public string FunctionName { get; set; }
        public string ParentId { get; set; }
        public string Module { get; set; }
        public int Level { get; set; }
        public int Sorting { get; set; }
    }
}
