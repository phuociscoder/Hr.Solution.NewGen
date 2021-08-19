using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
   public class DataRoleAddRequest
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public bool Lock { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
    }

    public class DataRoleUpdateRequest
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public bool Lock { get; set; }
        public bool Active { get; set; }
        public string Description { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class DataRoleAddSysRoleRequest
    { 
        public Guid RoleId { get; set; }
        public string CreatedBy { get; set; }
    }
}
