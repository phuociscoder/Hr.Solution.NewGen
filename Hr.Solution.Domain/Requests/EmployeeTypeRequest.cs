using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Requests
{
    public class EmployeeTypeAddEmpRequest
    {
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
    }

    public class EmployeeTypeUpdateEmpRequest
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
    }
}
