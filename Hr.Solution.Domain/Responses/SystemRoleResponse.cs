using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class SystemRoleResponse : AuditResponse
    {
        public Guid RecID { get; set; }
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleSubName { get; set; }
        public string Description { get; set; }
        public bool Lock { get; set; }
        public bool IsSystem { get; set; }
        public bool IsAdmin { get; set; }
        public string Note { get; set; }
        public bool IsEmpGroup { get; set; }
    }
}
