using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class AllowanceGradeGetListResponse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string  Name { get; set; }
        public string  Name2 { get; set; }
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
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class AllowanceGradeGetByIdResponse
    {
        public int Id { get; set; }
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
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

    }

    public class AllowanceGradeInsertResponse
    {
        public int Id { get; set; }
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
        public DateTime CreatedOn { get; set; }

    }

    public class AllowanceGradeUpdateResponse
    {
        public int Id { get; set; }
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
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
