using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class EmployeeResponse
    {
        public string EmployeeCode { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string DepartmentName { get; set; }
        public string Gender { get; set; }
        public string JobWName { get; set; }
        public string JobPosName { get; set; }
        public DateTime JoinDate { get; set; }
        public string Birthday { get; set; }
        public string PhotoID { get; set; }
        public int TotalRow { get; set; }
    }

    public class EmployeeManagersResponse { 
        public int Id { get; set; }
        public string Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string DepartmentCode { get; set; }
        public string Image { get; set; }
        public string Email { get; set; }
    }
}
