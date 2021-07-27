using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Domain.Responses
{
   public class LsNationResponse
    {
        public Guid ID { get; }
        public string NationCode { get; }
        public string NationName { get; }
        public string NationName2 { get; }
        public int Ordinal { get; }
        public string Note { get; }
    }
}
