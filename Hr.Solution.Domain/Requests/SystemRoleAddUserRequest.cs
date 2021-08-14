using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
   public class SystemRoleAddUserRequest
    {
        public string UserID { get; set; }
        public string RoleID { get; set; }
        public string CreatedBy { get; set; }
    }
}
