using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
   public class NationResponse
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int Ordinal { get; set; }
        public string ParentId { get; set; }
        public string Note { get; set; }
        public bool Lock { get; set; }
    }
}
