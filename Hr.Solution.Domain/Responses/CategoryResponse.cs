using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
   public class CategoryResponse
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string ParentId { get; set; }
        public string Module { get; set; }
        public int Level { get; set; }
        public int Sorting { get; set; }
    }

    public class CategoryKeyValueResponse {
        public int Id { get; set; }
        public string FunctionId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

    }
}
