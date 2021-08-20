using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
   public class DataRoleGetListResponse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int AccessMode { get; set; }
        public string Description { get; set; }
        public int Level { get; set; }
        public string LevelCode { get; set; }
        public int ParentId { get; set; }
        public string ParentCode { get; set; }
        public bool Lock { get; set; }
        public int RoleCount { get; set; }
    }

    public class Sys_DataDomain {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int AccessMode { get; set; }
        public string Description { get; set; }
        public int Level { get; set; }
        public string LevelCode { get; set; }
        public int ParentId { get; set; }
        public string ParentCode { get; set; }
        public bool Lock { get; set; }
        public int RoleCount { get; set; }
    }

    public class DataDomain_SysRoleResponse { 
        public int Id { get; set; }
        public int DataDomainId { get; set; }
        public string DataDomainCode { get; set; }
        public Guid RoleId { get; set; }
        public string RoleCode { get; set; }
        public string RoleName { get; set; }
        public string RoleSubName { get; set; }
        public bool Lock { get; set; }
    }

    public class DataDomain_DepartmentResponse { 
        public int DepartmentId { get; set; }
    }
       
}
