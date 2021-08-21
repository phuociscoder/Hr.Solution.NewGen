using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
   public class AddCategoryItemRequest
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public string FunctionId { get; set; }
        public bool IsActive { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
    }

    public class UpdateCategoryItemRequest
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public bool IsActive { get; set; }
        public string FunctionId { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class DeleteCategoryItemRequest
    { 
        public int Id { get; set; }
        public string DeletedBy { get; set; }
    }
}
