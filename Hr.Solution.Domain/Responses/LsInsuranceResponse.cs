using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Hr.Solution.Data.Responses
{
    public class LsInsuranceResponse
    {
        public int Id { get; set; }
        public string SICode { get; set; }
        public string SIName { get; set; }
        public string SIName2 { get; set; }
        public int Ordinal { get; set; }
        public int InsType { get; set; }
        public bool Lock { get; set; }
        public string Note { get; set; }
        public int DepartmentId { get; set; }
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
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
