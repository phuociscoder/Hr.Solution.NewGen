using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
   public class UserResponse
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Code { get; set; }
        public string Avatar { get; set; }
        public bool IsActive { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsLock { get; set; }
        public int LockAfter { get; set; }
        public bool IsNeverLock { get; set; }
        public bool IsDomain { get; set; }
        public DateTime? ValidDate { get; set; }
        public string SystemRoles { get; set; }
        public string DataDomains { get; set; }
    }

    public class UserSysRoleResponse { 
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string SubName { get; set; }
        public bool IsAdmin { get; set; }
    }

    public class UserFunctionPermissionResponse { 
        public string FunctionId { get; set; }
        public string FunctionType { get; set; }
        public string ParentId { get; set; }
        public bool Add { get; set; }
        public bool Edit { get; set; }
        public bool View { get; set; }
        public bool Delete { get; set; }
        public bool Import { get; set; }
        public bool Export { get; set; }
        public int Level { get; set; }
    }
}
