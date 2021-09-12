using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
    public class AllowanceGradeInsertRequest
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public bool IsActive { get; set; }
        public int Type { get; set; }
        public int ParentId { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public bool IsAllowanceMonth { get; set; }
        public bool IsAddSalary { get; set; }
        public bool isSocialInsurance { get; set; }
        public bool isHealthInsurance { get; set; }
        public bool isUnemploymentInsurance { get; set; }
        public string CreatedBy { get; set; }

    }

    public class AllowanceGradeUpdateRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public bool IsActive { get; set; }
        public int Type { get; set; }
        public int ParentId { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public bool IsAllowanceMonth { get; set; }
        public bool IsAddSalary { get; set; }
        public bool isSocialInsurance { get; set; }
        public bool isHealthInsurance { get; set; }
        public bool isUnemploymentInsurance { get; set; }
        public string ModifiedBy { get; set; }
    }
}
