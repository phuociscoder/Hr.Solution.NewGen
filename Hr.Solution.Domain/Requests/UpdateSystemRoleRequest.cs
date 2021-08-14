using System;

namespace Hr.Solution.Data.Requests
{
    public class UpdateSystemRoleRequest
    {
        public Guid RecID { get; set; }
        public string RoleName { get; set; }
        public string RoleSubName { get; set; }
        public string Description { get; set; }
        public bool Lock { get; set; }
        public bool IsAdmin { get; set; }
        public string ModifiedBy { get; set; }
    }
}
