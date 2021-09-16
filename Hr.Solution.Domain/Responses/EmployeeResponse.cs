using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Data.Responses
{
    public class EmployeeResponse
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int JobPositionId { get; set; }
        public string JobPositionName { get; set; }
        public DateTime? DoB { get; set; }
        public DateTime? JoinDate { get; set; }
        public bool IsMale { get; set; }
        public bool IsActive { get; set; }
        public string PhoneNumber { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string TaxID { get; set; }
        public string IDCardNo { get; set; }
        public DateTime? IDCardNoDate { get; set; }
        public string IDCardNoPlace { get; set; }
        public string Passport { get; set; }
        public DateTime? PassportDate { get; set; }
        public string PassportPlace { get; set; }
        public string Note { get; set; }
        public string Photo { get; set; }
        public int MaritalId { get; set; }
        public string MaritalName { get; set; }
        public bool IsManager { get; set; }


    }

    public class EmployeeManagersResponse
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string DepartmentCode { get; set; }
        public string Image { get; set; }
        public string Email { get; set; }
    }

    public class EmployeeCreateGeneralInfoResponse
    {
        public int Id { get; set; }
    }

    //public class EmployeeCheckExistingResponse
    //{
    //    public string EmployeeCode { get; set; }
    //}
}
