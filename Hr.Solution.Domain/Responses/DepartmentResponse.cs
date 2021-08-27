using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class DepartmentGetByFreeTextResponse
    {
        public int Id { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentName2 { get; set; }
        public int ParentId { get; set; }
        public string ParentCode { get; set; }
        public int Level { get; set; }
        public bool IsCompany { get; set; }
        public string Image { get; set; }
        public string RegionCode { get; set; }
    }

    public class DepartmentResponse
    {
        public int ID { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentName2 { get; set; }
        public int ParentID { get; set; }
        public string ParentCode { get; set; }
        public int Level { get; set; }
        public string LevelCode { get; set; }
        public string LevelCode2 { get; set; }
        public string DepartmentTel { get; set; }
        public string DepartmentFax { get; set; }
        public string DepartmentEmail { get; set; }
        public string DepartmentAddress { get; set; }
        public bool IsCompany { get; set; }
        public DateTime? EffectDate { get; set; }
        public string TaxCode { get; set; }
        public DateTime? LockDate { get; set; }
        public string LogoImage { get; set; }
        public int ManagerId { get; set; }
        public int Ordinal { get; set; }
        public bool Lock { get; set; }
        public string Note { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string RegionCode { get; set; }
        public string Active { get; set; }
        public bool IsDeleted { get; set; }
    }
}
