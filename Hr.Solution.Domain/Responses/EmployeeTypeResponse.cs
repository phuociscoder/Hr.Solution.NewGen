using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class EmployeeTypeGetListResponse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public float PercentageSalary { get; set; }
        public float PercentageSoftSalary { get; set; }
        public bool IsActive { get; set; }
        public int Type { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

    }

    public class EmployeeTypeGetByIdResponse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public float PercentageSalary { get; set; }
        public float PercentageSoftSalary { get; set; }
        public bool IsActive { get; set; }
        public int Type { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }

    public class EmployeeTypeAddEmpResponse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public float PercentageSalary { get; set; }
        public float PercentageSoftSalary { get; set; }
        public bool IsActive { get; set; }
        public int Type { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class EmployeeTypeUpdateEmpResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public int Ordinal { get; set; }
        public string Note { get; set; }
        public float PercentageSalary { get; set; }
        public float PercentageSoftSalary { get; set; }
        public bool IsActive { get; set; }
        public int Type { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
