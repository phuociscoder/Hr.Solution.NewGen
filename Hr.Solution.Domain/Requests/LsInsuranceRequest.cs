using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
    public class LsInsuranceInsertRequest
    {
        public string SICode { get; set; }
        public string SIName { get; set; }
        public string SIName2 { get; set; }
        public int Ordinal { get; set; }
        public int InsType { get; set; }
        public bool Lock { get; set; }
        public string Note { get; set; }
        public string DepartmentCode { get; set; }
        public float RateEmp { get; set; }
        public float RateCo { get; set; }
        public bool IsDefault { get; set; }
        public string BUCodes { get; set; }
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public DateTime EffectDate { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal BasicSalary1 { get; set; }
        public decimal BasicSalary2 { get; set; }
        public decimal BasicSalary3 { get; set; }
        public decimal BasicSalary4 { get; set; }
        public string CreatedBy { get; set; }
    }

    public class LsInsuranceUpdateRequest
    {
        public int Id { get; set; }
        public string SIName { get; set; }
        public string SIName2 { get; set; }
        public int Ordinal { get; set; }
        public int InsType { get; set; }
        public bool Lock { get; set; }
        public string Note { get; set; }
        public string DepartmentCode { get; set; }
        public float RateEmp { get; set; }
        public float RateCo { get; set; }
        public bool IsDefault { get; set; }
        public string BUCodes { get; set; }
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public DateTime EffectDate { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal BasicSalary1 { get; set; }
        public decimal BasicSalary2 { get; set; }
        public decimal BasicSalary3 { get; set; }
        public decimal BasicSalary4 { get; set; }
        public string ModifiedBy { get; set; }
    }
}
