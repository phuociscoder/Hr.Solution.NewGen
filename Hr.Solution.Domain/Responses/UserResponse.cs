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
        public bool IsLock { get; set; }
        public int LockAfter { get; set; }
        public bool IsNeverLock { get; set; }
        public bool IsDomain { get; set; }
        public DateTime? ValidDate { get; set; }
    }
}
