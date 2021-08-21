using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class SystemRolePermissionResponse
    {
        public Guid? RoleId { get; set; }
        public string FunctionId { get; set; }
        public bool View { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool Import { get; set; }
        public bool Export { get; set; }
        public bool Delete { get; set; }
    }
}
