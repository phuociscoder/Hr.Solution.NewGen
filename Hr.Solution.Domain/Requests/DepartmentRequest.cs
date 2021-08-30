using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
   public class DepartmentCreateRequest
    {
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentName2 { get; set; }
        public int? ParentId { get; set; }
        public string DepartmentTel { get; set; }
        public string DepartmentFax { get; set; }
        public string DepartmentEmail { get; set; }
        public string DepartmentAddress { get; set; }
        public bool IsCompany { get; set; }
        public string TaxCode { get; set; }
        public string LogoImage { get; set; }
        public int? ManagerId { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
        public bool Active { get; set; }
    }

    public class DepartmentUpdateRequest
    {
        public int Id { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentName2 { get; set; }
        public int? ParentId { get; set; }
        public string DepartmentTel { get; set; }
        public string DepartmentFax { get; set; }
        public string DepartmentEmail { get; set; }
        public string DepartmentAddress { get; set; }
        public bool? IsCompany { get; set; }
        public string TaxCode { get; set; }
        public string LogoImage { get; set; }
        public int? ManagerId { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Active { get; set; }
    }
}
