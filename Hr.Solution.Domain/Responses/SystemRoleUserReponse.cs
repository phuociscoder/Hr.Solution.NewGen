using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class SystemRoleUserReponse
    {
        public Guid Id { get; set; }
        public string RoleId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserCode { get; set; }
        public string Avatar { get; set; }
    }
}
