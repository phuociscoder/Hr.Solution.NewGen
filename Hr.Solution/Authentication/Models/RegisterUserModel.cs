using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Authentication.Models
{
    public class RegisterUserModel
    {
        public string FullName { get; set; }
        public string Code { get; set; }
        public bool IsFirstLogin { get; set; }
        public int LockAfter { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsNeverLock { get; set; }
        public bool IsDomain { get; set; }
        public DateTime? ValidDate { get; set; }
        public string Avatar { get; set; }
        public bool IsActive { get; set; }
        public bool IsLock { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
